import { test, expect } from "@playwright/test";
import { InventoryPage } from "../pages/InventoryPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { loginAsStandardUser } from "../utils/helpers";
import { loadJsonTestData } from "../utils/dataLoader";

const data = loadJsonTestData();

test.describe("Checkout Tests", () => {
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    await loginAsStandardUser(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);

    // Add a product and navigate to checkout
    await inventoryPage.addItemToCartByName(data.products[0].name);
    await inventoryPage.navigateToCart();
    await cartPage.proceedToCheckout();
  });

  // ─────────────────────────────────────────────
  // TEST 24: Complete checkout with valid info
  // ─────────────────────────────────────────────
  test("TC24 @smoke - Complete checkout with valid information", async () => {
    const info = data.checkoutInfo.valid;
    await checkoutPage.verifyOnCheckoutStep1();
    await checkoutPage.submitCheckoutInfo(
      info.firstName,
      info.lastName,
      info.zipCode
    );
    await checkoutPage.verifyOnCheckoutStep2();
    await checkoutPage.finishOrder();
    await checkoutPage.verifyOrderComplete();
  });

  // ─────────────────────────────────────────────
  // TEST 25: Missing first name validation
  // ─────────────────────────────────────────────
  test("TC25 @negative - Missing first name shows error", async () => {
    const info = data.checkoutInfo.missingFirstName;
    await checkoutPage.submitCheckoutInfo(
      info.firstName,
      info.lastName,
      info.zipCode
    );
    await checkoutPage.verifyErrorMessage(info.expectedError);
  });

  // ─────────────────────────────────────────────
  // TEST 26: Missing last name validation
  // ─────────────────────────────────────────────
  test("TC26 @negative - Missing last name shows error", async () => {
    const info = data.checkoutInfo.missingLastName;
    await checkoutPage.submitCheckoutInfo(
      info.firstName,
      info.lastName,
      info.zipCode
    );
    await checkoutPage.verifyErrorMessage(info.expectedError);
  });

  // ─────────────────────────────────────────────
  // TEST 27: Missing zip code validation
  // ─────────────────────────────────────────────
  test("TC27 @negative - Missing zip code shows error", async () => {
    const info = data.checkoutInfo.missingZip;
    await checkoutPage.submitCheckoutInfo(
      info.firstName,
      info.lastName,
      info.zipCode
    );
    await checkoutPage.verifyErrorMessage(info.expectedError);
  });

  // ─────────────────────────────────────────────
  // TEST 28: Order summary price calculation
  // ─────────────────────────────────────────────
  test("TC28 @regression - Order summary shows correct subtotal", async () => {
    const info = data.checkoutInfo.valid;
    await checkoutPage.submitCheckoutInfo(
      info.firstName,
      info.lastName,
      info.zipCode
    );
    await checkoutPage.verifyOnCheckoutStep2();
    const subtotal = await checkoutPage.getSubtotal();
    const expectedPrice = parseFloat(data.products[0].price.replace("$", ""));
    expect(subtotal).toBe(expectedPrice);
  });

  // ─────────────────────────────────────────────
  // TEST 29: Cancel from checkout step 1 returns to cart
  // ─────────────────────────────────────────────
  test("TC29 @regression - Cancel checkout step 1 returns to cart", async ({ page }) => {
    await checkoutPage.verifyOnCheckoutStep1();
    await checkoutPage.cancelCheckout();
    await expect(page).toHaveURL(/.*cart.html/);
  });

  // ─────────────────────────────────────────────
  // TEST 30: Back to home after order completion
  // ─────────────────────────────────────────────
  test("TC30 @smoke - Back to products after order completion", async () => {
    const info = data.checkoutInfo.valid;
    await checkoutPage.submitCheckoutInfo(
      info.firstName,
      info.lastName,
      info.zipCode
    );
    await checkoutPage.verifyOnCheckoutStep2();
    await checkoutPage.finishOrder();
    await checkoutPage.verifyOrderComplete();
    await checkoutPage.backToHome();
  });
});
