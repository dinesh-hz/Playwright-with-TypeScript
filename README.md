# 🎭 Playwright TypeScript Automation — SauceDemo

A professional, production-grade Playwright test automation suite targeting [SauceDemo](https://www.saucedemo.com) — a purpose-built e-commerce demo application ideal for QA automation practice.

---

## 📁 Project Structure

```
playwright-automation/
├── data/
│   ├── testData.json          # Primary test data (users, products, checkout)
│   ├── testData.xlsx          # Excel test data (generated via script)
│   └── generateExcel.ts       # Script to create/regenerate Excel data
├── pages/                     # Page Object Models (POM)
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   ├── CheckoutPage.ts
│   └── ProductDetailPage.ts
├── tests/                     # Test specs (30 test cases)
│   ├── 01-login.spec.ts       # Login & auth tests (TC01–TC07)
│   ├── 02-inventory.spec.ts   # Navigation & sorting (TC08–TC15)
│   ├── 03-cart.spec.ts        # Cart operations (TC16–TC23)
│   ├── 04-checkout.spec.ts    # Checkout & validation (TC24–TC30)
│   └── 05-product-e2e.spec.ts # Product detail & E2E flows
├── utils/
│   ├── dataLoader.ts          # JSON & Excel data loader utilities
│   └── helpers.ts             # Reusable login & assertion helpers
├── playwright.config.ts       # Playwright configuration
├── tsconfig.json              # TypeScript configuration
└── package.json
```

---

## ✅ Test Cases Overview

| TC ID   | Test Name                                          | Tag         |
|---------|----------------------------------------------------|-------------|
| TC01    | Successful login with standard_user                | @smoke      |
| TC02    | Locked out user gets error message                 | @negative   |
| TC03    | Invalid credentials show error                     | @negative   |
| TC04    | Empty credentials shows username required          | @negative   |
| TC05    | Missing password shows error                       | @negative   |
| TC06    | Error message can be dismissed                     | @regression |
| TC07    | Login page has all required elements               | @smoke      |
| TC08    | All 6 products displayed on inventory page         | @smoke      |
| TC09    | Sort products by Name A–Z                          | @regression |
| TC10    | Sort products by Name Z–A                          | @regression |
| TC11    | Sort products by Price Low to High                 | @regression |
| TC12    | Sort products by Price High to Low                 | @regression |
| TC13    | Navigate to product detail page                    | @smoke      |
| TC14    | Logout via hamburger menu                          | @smoke      |
| TC15    | Accessing inventory without login redirects        | @negative   |
| TC16    | Add single item to cart updates badge              | @smoke      |
| TC17    | Add multiple items updates cart count              | @regression |
| TC18    | Remove item from inventory page                    | @regression |
| TC19    | Cart shows correct added items                     | @regression |
| TC20    | Remove item directly from cart page                | @regression |
| TC21    | Empty cart shows no badge                          | @regression |
| TC22    | Continue shopping returns to inventory             | @smoke      |
| TC23    | Add to cart button changes to Remove               | @regression |
| TC24    | Complete checkout with valid information            | @smoke      |
| TC25    | Missing first name shows error                     | @negative   |
| TC26    | Missing last name shows error                      | @negative   |
| TC27    | Missing zip code shows error                       | @negative   |
| TC28    | Order summary shows correct subtotal               | @regression |
| TC29    | Cancel checkout returns to cart                    | @regression |
| TC30    | Back to products after order completion            | @smoke      |
| TC_PD01 | Product detail shows correct name and price        | @regression |
| TC_PD02 | Add to cart from detail page                       | @regression |
| TC_PD03 | Back button from detail returns to inventory       | @regression |
| TC_E2E01| Full purchase journey (login→add→checkout→confirm) | @smoke      |
| TC_E2E02| Multiple add/remove cycle before purchase          | @regression |
| TC_E2E03| Detail page add to cart completes purchase         | @regression |

---

## 🚀 Setup Instructions

### Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x

### 1. Install Dependencies

```bash
cd playwright-automation
npm install
npx playwright install
```

### 2. (Optional) Generate Excel Test Data

```bash
npx ts-node data/generateExcel.ts
```

This creates `data/testData.xlsx` with three sheets:
- **Users** — valid/invalid user credentials
- **Products** — product catalog data
- **Checkout** — checkout form scenarios

---

## ▶️ Running Tests

### Run All Tests

```bash
npm test
```

### Run with Browser UI (Headed Mode)

```bash
npm run test:headed
```

### Run with Playwright UI (Interactive)

```bash
npm run test:ui
```

### Run by Tag

```bash
# Smoke tests only
npm run test:smoke

# Regression tests only
npm run test:regression

# Negative tests only
npm run test:negative
```

### Run a Specific Test File

```bash
npx playwright test tests/01-login.spec.ts
```

### Run a Specific Test by Name

```bash
npx playwright test -g "TC01"
```

---

## 📊 Test Reports

After running tests, view the HTML report:

```bash
npm run test:report
```

The report opens at `playwright-report/index.html` and includes:
- Test pass/fail status
- Screenshots on failure
- Video recordings on failure
- Trace files for debugging

---

## 🏗️ Design Patterns & Best Practices

### Page Object Model (POM)
Each page has a dedicated class in `/pages/` encapsulating:
- Locators as readonly class properties
- Reusable action methods
- Built-in assertions where appropriate

### Data-Driven Testing
- **JSON**: `data/testData.json` loaded via `utils/dataLoader.ts`
- **Excel**: `data/testData.xlsx` loadable via `loadUsersFromExcel()`, `loadProductsFromExcel()`, `loadCheckoutFromExcel()`

### Test Tagging
Tests use Playwright's grep-based tagging:
- `@smoke` — critical happy-path tests
- `@regression` — extended coverage
- `@negative` — error/edge case validation

### Configuration
`playwright.config.ts` provides:
- Multi-browser support (Chromium, Firefox)
- Retry logic for flaky tests
- HTML + JSON + list reporters
- Screenshot/video on failure
- Configurable timeouts

---

## 🛠️ Extending the Suite

To add new tests:
1. Create a new spec file in `/tests/`
2. Import the relevant POM from `/pages/`
3. Load test data via `loadJsonTestData()` or Excel helpers
4. Use `loginAsStandardUser()` helper for pre-authenticated tests
5. Tag tests with `@smoke`, `@regression`, or `@negative`

---

## 📦 Tech Stack

| Tool              | Purpose                        |
|-------------------|--------------------------------|
| Playwright        | Browser automation framework   |
| TypeScript        | Type-safe test development     |
| xlsx              | Excel file read/write          |
| HTML Reporter     | Visual test result reporting   |

---

## 🌐 Target Application

**[SauceDemo](https://www.saucedemo.com)** — A publicly accessible demo e-commerce site by Sauce Labs, designed specifically for testing automation frameworks. No credentials or registration required beyond the built-in test users.

| Username              | Password      | Behavior              |
|-----------------------|---------------|-----------------------|
| standard_user         | secret_sauce  | Normal flow           |
| locked_out_user       | secret_sauce  | Cannot login          |
| problem_user          | secret_sauce  | UI issues             |
| performance_glitch_user | secret_sauce | Slow performance    |
