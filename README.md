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
