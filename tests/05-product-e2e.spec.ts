import { test, expect } from "@playwright/test";
import { InventoryPage } from "../pages/InventoryPage";
import { ProductDetailPage } from "../pages/ProductDetailPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { loginAsStandardUser } from "../utils/helpers";
import { loadJsonTestData } from "../utils/dataLoader";

const data = loadJsonTestData();

test.describe("Product Detail Tests", () => {
  let inventoryPage: InventoryPage;
  let productDetailPage: ProductDetailPage;

  test.beforeEach(async ({ page }) => {
    await loginAsStandardUser(page);
    inventoryPage = new InventoryPage(page);
    productDetailPage = new ProductDetailPage(page);
    await inventoryPage.clickOnProduct(data.products[0].name);
  });

  test("TC_PD01 @regression - Product detail shows correct name and price", async () => {
    await productDetailPage.verifyProductDetails(
      data.products[0].name,
      data.products[0].price
    );
  });

  test("TC_PD02 @regression - Add to cart from detail page", async () => {
    await productDetailPage.addToCart();
  });

  test("TC_PD03 @regression - Back button from detail returns to inventory", async () => {
    await productDetailPage.goBack();
  });
});

test.describe("End-to-End Purchase Flow", () => {
  test("TC_E2E01 @smoke - Full purchase journey: login → add → checkout → confirm", async ({ page }) => {
    // Step 1: Login
    await loginAsStandardUser(page);
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    // Step 2: Add two items to cart
    await inventory.addItemToCartByName(data.products[0].name);
    await inventory.addItemToCartByName(data.products[1].name);
    expect(await inventory.getCartCount()).toBe(2);

    // Step 3: Go to cart and verify
    await inventory.navigateToCart();
    await cart.verifyOnCartPage();
    expect(await cart.getCartItemCount()).toBe(2);

    // Step 4: Checkout
    await cart.proceedToCheckout();
    await checkout.verifyOnCheckoutStep1();
    const info = data.checkoutInfo.valid;
    await checkout.submitCheckoutInfo(info.firstName, info.lastName, info.zipCode);

    // Step 5: Review order
    await checkout.verifyOnCheckoutStep2();
    const subtotal = await checkout.getSubtotal();
    const p1 = parseFloat(data.products[0].price.replace("$", ""));
    const p2 = parseFloat(data.products[1].price.replace("$", ""));
    expect(subtotal).toBeCloseTo(p1 + p2, 2);

    // Step 6: Finish
    await checkout.finishOrder();
    await checkout.verifyOrderComplete();
    await checkout.backToHome();
    await inventory.verifyOnInventoryPage();
  });

  test("TC_E2E02 @regression - Multiple add/remove cycle before purchase", async ({ page }) => {
    await loginAsStandardUser(page);
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    // Add 3 products
    for (let i = 0; i < 3; i++) {
      await inventory.addItemToCartByName(data.products[i].name);
    }
    expect(await inventory.getCartCount()).toBe(3);

    // Remove 1
    await inventory.removeItemFromCartByName(data.products[1].name);
    expect(await inventory.getCartCount()).toBe(2);

    // Checkout remaining 2
    await inventory.navigateToCart();
    expect(await cart.getCartItemCount()).toBe(2);
    await cart.proceedToCheckout();

    const info = data.checkoutInfo.valid;
    await checkout.submitCheckoutInfo(info.firstName, info.lastName, info.zipCode);
    await checkout.finishOrder();
    await checkout.verifyOrderComplete();
  });

  test("TC_E2E03 @regression - Product detail page add to cart completes purchase", async ({ page }) => {
    await loginAsStandardUser(page);
    const inventory = new InventoryPage(page);
    const detail = new ProductDetailPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    // Navigate to detail and add from there
    await inventory.clickOnProduct(data.products[3].name);
    await detail.verifyProductDetails(data.products[3].name, data.products[3].price);
    await detail.addToCart();
    await detail.goBack();

    // Proceed to checkout
    await inventory.navigateToCart();
    await cart.verifyCartContainsProduct(data.products[3].name);
    await cart.proceedToCheckout();

    const info = data.checkoutInfo.valid;
    await checkout.submitCheckoutInfo(info.firstName, info.lastName, info.zipCode);
    await checkout.finishOrder();
    await checkout.verifyOrderComplete();
  });
});
