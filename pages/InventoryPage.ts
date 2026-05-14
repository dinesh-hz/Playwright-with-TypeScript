import { Page, Locator, expect } from "@playwright/test";

export class InventoryPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly inventoryItems: Locator;
  readonly cartBadge: Locator;
  readonly cartIcon: Locator;
  readonly sortDropdown: Locator;
  readonly burgerMenu: Locator;
  readonly logoutLink: Locator;
  readonly resetAppLink: Locator;
  readonly itemPrices: Locator;
  readonly itemNames: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator(".title");
    this.inventoryItems = page.locator(".inventory_item");
    this.cartBadge = page.locator(".shopping_cart_badge");
    this.cartIcon = page.locator(".shopping_cart_link");
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.burgerMenu = page.locator("#react-burger-menu-btn");
    this.logoutLink = page.locator("#logout_sidebar_link");
    this.resetAppLink = page.locator("#reset_sidebar_link");
    this.itemPrices = page.locator(".inventory_item_price");
    this.itemNames = page.locator(".inventory_item_name");
  }

  async verifyOnInventoryPage() {
    await expect(this.page).toHaveURL(/.*inventory.html/);
    await expect(this.pageTitle).toHaveText("Products");
  }

  async getItemCount(): Promise<number> {
    return await this.inventoryItems.count();
  }

  async addItemToCartByName(productName: string) {
    const item = this.page.locator(".inventory_item", {
      hasText: productName,
    });
    const addBtn = item.locator("button");
    await addBtn.click();
  }

  async removeItemFromCartByName(productName: string) {
    const item = this.page.locator(".inventory_item", {
      hasText: productName,
    });
    const removeBtn = item.locator("button");
    await removeBtn.click();
  }

  async getCartCount(): Promise<number> {
    const badge = this.cartBadge;
    const isVisible = await badge.isVisible();
    if (!isVisible) return 0;
    const text = await badge.textContent();
    return parseInt(text ?? "0", 10);
  }

  async sortProducts(value: string) {
    await this.sortDropdown.selectOption(value);
  }

  async getAllItemNames(): Promise<string[]> {
    return await this.itemNames.allTextContents();
  }

  async getAllItemPrices(): Promise<number[]> {
    const priceTexts = await this.itemPrices.allTextContents();
    return priceTexts.map((p) => parseFloat(p.replace("$", "")));
  }

  async clickOnProduct(productName: string) {
    await this.page.locator(".inventory_item_name", { hasText: productName }).click();
  }

  async logout() {
    await this.burgerMenu.click();
    await this.logoutLink.waitFor({ state: "visible" });
    await this.logoutLink.click();
    await expect(this.page).toHaveURL("/");
  }

  async resetAppState() {
    await this.burgerMenu.click();
    await this.resetAppLink.waitFor({ state: "visible" });
    await this.resetAppLink.click();
  }

  async navigateToCart() {
    await this.cartIcon.click();
    await expect(this.page).toHaveURL(/.*cart.html/);
  }

  async getAddButtonTextForProduct(productName: string): Promise<string> {
    const item = this.page.locator(".inventory_item", { hasText: productName });
    return (await item.locator("button").textContent()) ?? "";
  }
}
