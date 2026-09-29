import { expect, test, type Page } from "@playwright/test";

async function mockAuth(page: Page) {
  const user = { id: "00000000-0000-4000-8000-000000000001", aud: "authenticated", role: "authenticated", email: "demo@example.test", phone: "", app_metadata: { provider: "email", providers: ["email"] }, user_metadata: { name: "Alex", full_name: "Alex Example", phone: "" }, created_at: "2026-09-13T00:00:00Z" };
  const expires = Math.floor(Date.now() / 1000) + 3600;
  const encode = (value: unknown) => Buffer.from(JSON.stringify(value)).toString("base64url");
  const token = `${encode({ alg: "HS256", typ: "JWT" })}.${encode({ sub: user.id, aud: "authenticated", role: "authenticated", exp: expires })}.test-signature`;
  await page.route("**/auth/v1/**", async route => {
    const url = new URL(route.request().url());
    if (url.pathname.endsWith("/logout")) return route.fulfill({ status: 204 });
    if (url.pathname.endsWith("/signup")) return route.fulfill({ json: { user, session: null } });
    if (url.pathname.endsWith("/token")) return route.fulfill({ json: { access_token: token, refresh_token: "demo-refresh-token", expires_in: 3600, expires_at: expires, token_type: "bearer", user } });
    if (route.request().method() === "PUT") Object.assign(user.user_metadata, route.request().postDataJSON()?.data);
    return route.fulfill({ json: user });
  });
}

async function login(page: Page) {
  await page.goto("/auth/login");
  await page.getByLabel("Email address", { exact: true }).fill("demo@example.test");
  await page.getByLabel("Password", { exact: true }).fill("Demo-password-123!");
  await page.getByRole("button", { name: "Login", exact: true }).click();
  await expect(page.getByRole("heading", { name: "My profile", exact: true })).toBeVisible();
}

for (const width of [320, 1440]) for (const theme of ["light", "dark"] as const) {
  test(`${width}px ${theme}: navigation, cards, cart and layout`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ colorScheme: theme });
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await mockAuth(page);
    for (const path of ["/", "/products", "/products/1", "/cart", "/about-demo", "/auth/login"]) {
      await page.goto(path);
      await expect(page.locator("html")).toHaveClass(new RegExp(theme));
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    }
    await page.goto("/products/1");
    await page.getByRole("button", { name: "Add to cart", exact: true }).click();
    await page.getByRole("button", { name: /Open shopping cart/ }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath("cart.png") });
    await page.getByRole("dialog").getByRole("button", { name: "Close shopping cart" }).click();
    await expect(page.getByRole("dialog")).not.toBeVisible();
    expect(errors).toEqual([]);
  });
}

test("registration shows confirmation instructions", async ({ page }) => {
  await mockAuth(page);
  await page.goto("/auth/sign-up");
  await page.getByLabel("Name", { exact: true }).fill("Alex Example");
  await page.getByLabel("Email address", { exact: true }).fill("demo@example.test");
  await page.getByLabel("Password", { exact: true }).fill("Demo-password-123!");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Register", exact: true }).click();
  await expect(page.getByText("Check your email to confirm", { exact: true })).toBeVisible();
});

test("account, address modal, wishlist, order and logout", async ({ page }) => {
  await mockAuth(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await login(page);
  await page.getByLabel("Phone number", { exact: true }).fill("123456789");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByText("Your profile has been saved.")).toBeVisible();
  await page.getByRole("navigation", { name: "Account navigation" }).getByRole("link", { name: "Addresses" }).click();
  await page.getByRole("button", { name: "Add new address" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog.getByLabel("Full name").fill("Alex Example");
  await dialog.getByLabel("Phone number").fill("123456789");
  await dialog.getByLabel("Street address").fill("1 Demo Street");
  await dialog.getByLabel("City", { exact: true }).fill("London");
  await dialog.getByLabel("Postal code").fill("SW1A 1AA");
  await dialog.getByLabel("Country").fill("United Kingdom");
  await dialog.getByRole("button", { name: "Save address" }).click();
  await expect(dialog).not.toBeVisible();
  await page.goto("/products/1");
  await page.getByRole("button", { name: /Save .* to wishlist/ }).click();
  await page.goto("/wishlist");
  await expect(page.getByRole("button", { name: /Remove .* from wishlist/ })).toBeVisible();
  await page.getByRole("button", { name: /Remove .* from wishlist/ }).click();
  await expect(page.getByText("Keep your favorites close")).toBeVisible();
  await page.goto("/products/1");
  await page.getByRole("button", { name: "Try demo checkout" }).click();
  await expect(page.getByRole("heading", { name: "Delivery address", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Place demo order" }).click();
  await expect(page.getByRole("heading", { name: "Order details", exact: true })).toBeVisible();
  await expect(page.getByText("1 Demo Street", { exact: false })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: "Order details", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Sign out", exact: true }).click();
  await expect(page).toHaveURL(/\/auth\/login$/);
});
