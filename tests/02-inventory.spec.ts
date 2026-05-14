import { test, expect } from "@playwright/test";
import { InventoryPage } from "../pages/InventoryPage";
import { loginAsStandardUser } from "../utils/helpers";
import { loadJsonTestData } from "../utils/dataLoader";

const data = loadJsonTestData();

test.describe("Inventory & Navigation Tests", () => {
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    await loginAsStandardUser(page);
    inventoryPage = new InventoryPage(page);
  });

  // ─────────────────────────────────────────────
  // TEST 08: All 6 products display on inventory page
  // ─────────────────────────────────────────────
  test("TC08 @smoke - All 6 products are displayed", async () => {
    await inventoryPage.verifyOnInventoryPage();
    const count = await inventoryPage.getItemCount();
    expect(count).toBe(6);
  });

  // ─────────────────────────────────────────────
  // TEST 09: Sort products by Name A-Z
  // ─────────────────────────────────────────────
  test("TC09 @regression - Sort products by Name A-Z", async () => {
    await inventoryPage.sortProducts("az");
    const names = await inventoryPage.getAllItemNames();
    for (let i = 0; i < names.length - 1; i++) {
      expect(names[i].toLowerCase() <= names[i + 1].toLowerCase()).toBeTruthy();
    }
  });

  // ─────────────────────────────────────────────
  // TEST 10: Sort products by Name Z-A
  // ─────────────────────────────────────────────
  test("TC10 @regression - Sort products by Name Z-A", async () => {
    await inventoryPage.sortProducts("za");
    const names = await inventoryPage.getAllItemNames();
    for (let i = 0; i < names.length - 1; i++) {
      expect(names[i].toLowerCase() >= names[i + 1].toLowerCase()).toBeTruthy();
    }
  });

  // ─────────────────────────────────────────────
  // TEST 11: Sort products by Price Low to High
  // ─────────────────────────────────────────────
  test("TC11 @regression - Sort products by Price Low to High", async () => {
    await inventoryPage.sortProducts("lohi");
    const prices = await inventoryPage.getAllItemPrices();
    for (let i = 0; i < prices.length - 1; i++) {
      expect(prices[i]).toBeLessThanOrEqual(prices[i + 1]);
    }
  });

  // ─────────────────────────────────────────────
  // TEST 12: Sort products by Price High to Low
  // ─────────────────────────────────────────────
  test("TC12 @regression - Sort products by Price High to Low", async () => {
    await inventoryPage.sortProducts("hilo");
    const prices = await inventoryPage.getAllItemPrices();
    for (let i = 0; i < prices.length - 1; i++) {
      expect(prices[i]).toBeGreaterThanOrEqual(prices[i + 1]);
    }
  });

  // ─────────────────────────────────────────────
  // TEST 13: Navigate to product detail page
  // ─────────────────────────────────────────────
  test("TC13 @smoke - Navigate to product detail page", async ({ page }) => {
    const product = data.products[0];
    await inventoryPage.clickOnProduct(product.name);
    await expect(page).toHaveURL(/.*inventory-item.html/);
    await expect(page.locator(".inventory_details_name")).toHaveText(product.name);
  });

  // ─────────────────────────────────────────────
  // TEST 14: Hamburger menu logout
  // ─────────────────────────────────────────────
  test("TC14 @smoke - Logout via hamburger menu", async ({ page }) => {
    await inventoryPage.logout();
    await expect(page).toHaveURL("/");
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });

  // ─────────────────────────────────────────────
  // TEST 15: Direct URL access without login is redirected
  // ─────────────────────────────────────────────
  test("TC15 @negative - Accessing inventory without login redirects to login", async ({ page }) => {
    // Fresh page, not logged in
    await page.goto("/inventory.html");
    await expect(page).toHaveURL("/");
  });
});
