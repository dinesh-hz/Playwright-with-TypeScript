import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { loadJsonTestData } from "../utils/dataLoader";

const data = loadJsonTestData();

test.describe("Login Tests", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  // ─────────────────────────────────────────────
  // TEST 01: Successful login with standard_user
  // ─────────────────────────────────────────────
  test("TC01 @smoke - Successful login with standard_user", async ({ page }) => {
    const user = data.validUsers.find((u) => u.role === "standard")!;
    await loginPage.loginAndExpectSuccess(user.username, user.password);
    await expect(page.locator(".title")).toHaveText("Products");
  });

  // ─────────────────────────────────────────────
  // TEST 02: Login with locked_out_user
  // ─────────────────────────────────────────────
  test("TC02 @negative - Locked out user gets error message", async () => {
    const user = data.invalidUsers.find((u) => u.username === "locked_out_user")!;
    await loginPage.loginAndExpectError(
      user.username,
      user.password,
      user.expectedError!
    );
  });

  // ─────────────────────────────────────────────
  // TEST 03: Login with invalid credentials
  // ─────────────────────────────────────────────
  test("TC03 @negative - Invalid credentials show error", async () => {
    const user = data.invalidUsers.find((u) => u.username === "invalid_user")!;
    await loginPage.loginAndExpectError(
      user.username,
      user.password,
      user.expectedError!
    );
  });

  // ─────────────────────────────────────────────
  // TEST 04: Empty credentials validation
  // ─────────────────────────────────────────────
  test("TC04 @negative - Empty credentials shows username required error", async () => {
    const user = data.invalidUsers.find((u) => u.scenario === "Empty credentials")!;
    await loginPage.loginAndExpectError(
      user.username,
      user.password,
      user.expectedError!
    );
  });

  // ─────────────────────────────────────────────
  // TEST 05: Missing password validation
  // ─────────────────────────────────────────────
  test("TC05 @negative - Missing password shows password required error", async () => {
    const user = data.invalidUsers.find((u) => u.scenario === "Missing password")!;
    await loginPage.loginAndExpectError(
      user.username,
      user.password,
      user.expectedError!
    );
  });

  // ─────────────────────────────────────────────
  // TEST 06: Error dismiss button works
  // ─────────────────────────────────────────────
  test("TC06 @regression - Error message can be dismissed", async () => {
    await loginPage.login("wrong_user", "wrong_pass");
    await loginPage.dismissError();
  });

  // ─────────────────────────────────────────────
  // TEST 07: Login page title and elements present
  // ─────────────────────────────────────────────
  test("TC07 @smoke - Login page has required elements", async ({ page }) => {
    await expect(page.locator(".login_logo")).toBeVisible();
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });
});
