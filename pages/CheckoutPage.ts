import { Page, Locator, expect } from "@playwright/test";

export class CheckoutPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly zipCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;
  // Step 2
  readonly finishButton: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly itemList: Locator;
  // Confirmation
  readonly confirmationHeader: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.zipCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.subtotalLabel = page.locator(".summary_subtotal_label");
    this.taxLabel = page.locator(".summary_tax_label");
    this.totalLabel = page.locator(".summary_total_label");
    this.itemList = page.locator(".cart_item");
    this.confirmationHeader = page.locator(".complete-header");
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

  async verifyOnCheckoutStep1() {
    await expect(this.page).toHaveURL(/.*checkout-step-one.html/);
  }

  async verifyOnCheckoutStep2() {
    await expect(this.page).toHaveURL(/.*checkout-step-two.html/);
  }

  async verifyOnConfirmation() {
    await expect(this.page).toHaveURL(/.*checkout-complete.html/);
  }

  async fillCheckoutInfo(
    firstName: string,
    lastName: string,
    zipCode: string
  ) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.zipCodeInput.fill(zipCode);
  }

  async clickContinue() {
    await this.continueButton.click();
  }

  async submitCheckoutInfo(firstName: string, lastName: string, zipCode: string) {
    await this.fillCheckoutInfo(firstName, lastName, zipCode);
    await this.clickContinue();
  }

  async verifyErrorMessage(expectedError: string) {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(expectedError);
  }

  async getSubtotal(): Promise<number> {
    const text = await this.subtotalLabel.textContent();
    return parseFloat(text?.replace("Item total: $", "") ?? "0");
  }

  async getTotal(): Promise<number> {
    const text = await this.totalLabel.textContent();
    return parseFloat(text?.replace("Total: $", "") ?? "0");
  }

  async finishOrder() {
    await this.finishButton.click();
    await this.verifyOnConfirmation();
  }

  async verifyOrderComplete() {
    await expect(this.confirmationHeader).toHaveText("Thank you for your order!");
  }

  async backToHome() {
    await this.backHomeButton.click();
    await expect(this.page).toHaveURL(/.*inventory.html/);
  }

  async cancelCheckout() {
    await this.cancelButton.click();
  }
}
