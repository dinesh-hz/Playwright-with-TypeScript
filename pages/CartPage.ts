import { Page, Locator, expect } from "@playwright/test";

export class CartPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly cartItemNames: Locator;
  readonly cartItemPrices: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator(".title");
    this.cartItems = page.locator(".cart_item");
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.cartItemNames = page.locator(".inventory_item_name");
    this.cartItemPrices = page.locator(".inventory_item_price");
  }

  async verifyOnCartPage() {
    await expect(this.page).toHaveURL(/.*cart.html/);
    await expect(this.pageTitle).toHaveText("Your Cart");
  }

  async getCartItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  async getCartItemNames(): Promise<string[]> {
    return await this.cartItemNames.allTextContents();
  }

  async getCartItemPrices(): Promise<number[]> {
    const prices = await this.cartItemPrices.allTextContents();
    return prices.map((p) => parseFloat(p.replace("$", "")));
  }

  async removeItemByName(productName: string) {
    const item = this.page.locator(".cart_item", { hasText: productName });
    await item.locator("button").click();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
    await expect(this.page).toHaveURL(/.*checkout-step-one.html/);
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
    await expect(this.page).toHaveURL(/.*inventory.html/);
  }

  async verifyCartContainsProduct(productName: string) {
    const names = await this.getCartItemNames();
    expect(names).toContain(productName);
  }
}
