import assert from "node:assert/strict";
import test from "node:test";
import { accountStorageKey, createDemoOrder, emptyAccount, readAccount } from "../lib/account-data.ts";

const address = { id: "address-1", name: "Alex Example", phone: "123456789", street: "1 Main Street", city: "London", postalCode: "SW1A 1AA", country: "United Kingdom" };
const item = { id: 1, name: "Ring", image: "/images/products/twist-ring.png", price: 189, quantity: 2, category: "Rings", color: "Gold", material: "18k gold", description: "A ring" };

test("each signed-in account loads only its own saved data", () => {
  const saved = new Map([[accountStorageKey("alice"), JSON.stringify({ ...emptyAccount(), wishlist: [1, 2] })]]);
  const storage = { getItem: key => saved.get(key) ?? null };
  assert.deepEqual(readAccount(storage, "alice").wishlist, [1, 2]);
  assert.deepEqual(readAccount(storage, "bob"), emptyAccount());
});

test("order snapshots survive cart and address edits and round tax to cents", () => {
  const cart = [{ ...item }];
  const delivery = { ...address };
  const order = createDemoOrder(cart, delivery, "order-1", "2026-09-13T12:00:00Z");
  cart[0].quantity = 9;
  delivery.street = "Changed address";
  assert.equal(order.items[0].quantity, 2);
  assert.equal(order.address.street, "1 Main Street");
  assert.equal(order.subtotal, 378);
  assert.equal(order.taxes, 26.46);
  assert.equal(order.total, 404.46);
});

test("empty or invalid carts cannot produce an order", () => {
  assert.throws(() => createDemoOrder([], address, "1", "2026-09-13"));
  assert.throws(() => createDemoOrder([{ ...item, quantity: -1 }], address, "1", "2026-09-13"));
  assert.throws(() => createDemoOrder([{ ...item, price: NaN }], address, "1", "2026-09-13"));
});

test("saved orders reload and stale default addresses are repaired", () => {
  const order = createDemoOrder([item], address, "order-1", "2026-09-13T12:00:00Z");
  const data = { addresses: [address], orders: [order], wishlist: [1, 1], selectedAddress: "deleted-address" };
  const loaded = readAccount({ getItem: () => JSON.stringify(data) }, "alice");
  assert.deepEqual(loaded.orders, [order]);
  assert.equal(loaded.selectedAddress, address.id);
  assert.deepEqual(loaded.wishlist, [1]);
});

test("malformed browser data is rejected before rendering", () => {
  for (const raw of ["{", "null", JSON.stringify({ ...emptyAccount(), orders: [{}] }), JSON.stringify({ ...emptyAccount(), wishlist: ["1"] })]) {
    assert.throws(() => readAccount({ getItem: () => raw }, "alice"));
  }
});
