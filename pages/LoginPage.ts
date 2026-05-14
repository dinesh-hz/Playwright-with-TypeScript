import { Page, Locator, expect } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly errorCloseButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.errorCloseButton = page.locator('[data-test="error"] button');
  }

  async goto() {
    await this.page.goto("/");
    await expect(this.loginButton).toBeVisible();
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async loginAndExpectSuccess(username: string, password: string) {
    await this.login(username, password);
    await expect(this.page).toHaveURL(/.*inventory.html/);
  }

  async loginAndExpectError(
    username: string,
    password: string,
    expectedError: string
  ) {
    await this.login(username, password);
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(expectedError);
  }

  async dismissError() {
    await this.errorCloseButton.click();
    await expect(this.errorMessage).not.toBeVisible();
  }

  async getUsernameFieldValue(): Promise<string> {
    return (await this.usernameInput.inputValue()) ?? "";
  }

  async getPasswordFieldValue(): Promise<string> {
    return (await this.passwordInput.inputValue()) ?? "";
  }
}
