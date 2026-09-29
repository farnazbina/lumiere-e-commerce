export type CartLine = {
  productId: number;
  quantity: number;
};

export const INITIAL_CART: CartLine[] = [
  { productId: 1, quantity: 1 },
  { productId: 4, quantity: 1 },
  { productId: 2, quantity: 1 },
];

export const CHECKOUT_ADDRESSES = [
  { id: 1, name: "Alexa Williams", address: "6391 Elgin St, Celina, Delaware 10299", phone: "(239) 555-0108", home: true },
  { id: 2, name: "Alexa Williams", address: "1901 Thornridge Cir, Shiloh, Hawaii 81063", phone: "(603) 555-0123" },
  { id: 3, name: "Alexa Williams", address: "2118 Thornridge Cir, Syracuse, Connecticut 35624", phone: "(629) 555-0129" },
  { id: 4, name: "Wade Warren", address: "3891 Ranchview Dr, Richardson, California 62639", phone: "(270) 555-0117" },
];

export const CHECKOUT_TOTALS = {
  subtotal: 649,
  taxes: 45.43,
  deliveryFee: 0,
};
