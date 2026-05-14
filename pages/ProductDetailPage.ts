import { Page, Locator, expect } from "@playwright/test";

export class ProductDetailPage {
  readonly page: Page;
  readonly productName: Locator;
  readonly productDescription: Locator;
  readonly productPrice: Locator;
  readonly addToCartButton: Locator;
  readonly removeButton: Locator;
  readonly backButton: Locator;
  readonly productImage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productName = page.locator(".inventory_details_name");
    this.productDescription = page.locator(".inventory_details_desc");
    this.productPrice = page.locator(".inventory_details_price");
    this.addToCartButton = page.locator('[data-test^="add-to-cart"]');
    this.removeButton = page.locator('[data-test^="remove"]');
    this.backButton = page.locator('[data-test="back-to-products"]');
    this.productImage = page.locator(".inventory_details_img");
  }

  async verifyOnDetailPage() {
    await expect(this.page).toHaveURL(/.*inventory-item.html/);
  }

  async getProductName(): Promise<string> {
    return (await this.productName.textContent()) ?? "";
  }

  async getProductPrice(): Promise<string> {
    return (await this.productPrice.textContent()) ?? "";
  }

  async addToCart() {
    await this.addToCartButton.click();
    await expect(this.removeButton).toBeVisible();
  }

  async removeFromCart() {
    await this.removeButton.click();
    await expect(this.addToCartButton).toBeVisible();
  }

  async goBack() {
    await this.backButton.click();
    await expect(this.page).toHaveURL(/.*inventory.html/);
  }

  async verifyProductDetails(name: string, price: string) {
    await expect(this.productName).toHaveText(name);
    await expect(this.productPrice).toHaveText(price);
  }
}
