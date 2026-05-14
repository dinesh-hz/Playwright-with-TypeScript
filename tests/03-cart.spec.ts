import { test, expect } from "@playwright/test";
import { InventoryPage } from "../pages/InventoryPage";
import { CartPage } from "../pages/CartPage";
import { loginAsStandardUser } from "../utils/helpers";
import { loadJsonTestData } from "../utils/dataLoader";

const data = loadJsonTestData();

test.describe("Cart Tests", () => {
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    await loginAsStandardUser(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
  });

  // ─────────────────────────────────────────────
  // TEST 16: Add single item to cart
  // ─────────────────────────────────────────────
  test("TC16 @smoke - Add single item to cart updates badge", async () => {
    const product = data.products[0];
    await inventoryPage.addItemToCartByName(product.name);
    const count = await inventoryPage.getCartCount();
    expect(count).toBe(1);
  });

  // ─────────────────────────────────────────────
  // TEST 17: Add multiple items to cart
  // ─────────────────────────────────────────────
  test("TC17 @regression - Add multiple items updates cart count", async () => {
    await inventoryPage.addItemToCartByName(data.products[0].name);
    await inventoryPage.addItemToCartByName(data.products[1].name);
    await inventoryPage.addItemToCartByName(data.products[2].name);
    const count = await inventoryPage.getCartCount();
    expect(count).toBe(3);
  });

  // ─────────────────────────────────────────────
  // TEST 18: Remove item from inventory page
  // ─────────────────────────────────────────────
  test("TC18 @regression - Remove item from inventory page", async () => {
    const product = data.products[0];
    await inventoryPage.addItemToCartByName(product.name);
    expect(await inventoryPage.getCartCount()).toBe(1);
    await inventoryPage.removeItemFromCartByName(product.name);
    expect(await inventoryPage.getCartCount()).toBe(0);
  });

  // ─────────────────────────────────────────────
  // TEST 19: Cart page shows correct item names
  // ─────────────────────────────────────────────
  test("TC19 @regression - Cart shows correct added items", async () => {
    const product1 = data.products[0];
    const product2 = data.products[1];
    await inventoryPage.addItemToCartByName(product1.name);
    await inventoryPage.addItemToCartByName(product2.name);
    await inventoryPage.navigateToCart();
    await cartPage.verifyOnCartPage();
    await cartPage.verifyCartContainsProduct(product1.name);
    await cartPage.verifyCartContainsProduct(product2.name);
  });

  // ─────────────────────────────────────────────
  // TEST 20: Remove item from cart page
  // ─────────────────────────────────────────────
  test("TC20 @regression - Remove item directly from cart page", async () => {
    const product = data.products[0];
    await inventoryPage.addItemToCartByName(product.name);
    await inventoryPage.navigateToCart();
    await cartPage.verifyOnCartPage();
    const initialCount = await cartPage.getCartItemCount();
    expect(initialCount).toBe(1);
    await cartPage.removeItemByName(product.name);
    const afterCount = await cartPage.getCartItemCount();
    expect(afterCount).toBe(0);
  });

  // ─────────────────────────────────────────────
  // TEST 21: Empty cart - no badge shown
  // ─────────────────────────────────────────────
  test("TC21 @regression - Empty cart shows no badge", async () => {
    const count = await inventoryPage.getCartCount();
    expect(count).toBe(0);
  });

  // ─────────────────────────────────────────────
  // TEST 22: Continue shopping from cart
  // ─────────────────────────────────────────────
  test("TC22 @smoke - Continue shopping from cart returns to inventory", async () => {
    await inventoryPage.navigateToCart();
    await cartPage.continueShopping();
  });

  // ─────────────────────────────────────────────
  // TEST 23: Button text changes after add/remove
  // ─────────────────────────────────────────────
  test("TC23 @regression - Add to cart button changes to Remove after click", async () => {
    const product = data.products[0];
    let btnText = await inventoryPage.getAddButtonTextForProduct(product.name);
    expect(btnText.toLowerCase()).toContain("add to cart");
    await inventoryPage.addItemToCartByName(product.name);
    btnText = await inventoryPage.getAddButtonTextForProduct(product.name);
    expect(btnText.toLowerCase()).toContain("remove");
  });
});
