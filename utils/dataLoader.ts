import * as fs from "fs";
import * as path from "path";
import * as XLSX from "xlsx";

export interface UserData {
  username: string;
  password: string;
  role?: string;
  description?: string;
  expectedError?: string;
  scenario?: string;
}

export interface ProductData {
  name: string;
  price: string;
  id: string;
}

export interface CheckoutData {
  firstName: string;
  lastName: string;
  zipCode: string;
  expectedError?: string;
}

export interface TestDataShape {
  validUsers: UserData[];
  invalidUsers: UserData[];
  products: ProductData[];
  sortOptions: { value: string; label: string; order: string }[];
  checkoutInfo: {
    valid: CheckoutData;
    missingFirstName: CheckoutData & { expectedError: string };
    missingLastName: CheckoutData & { expectedError: string };
    missingZip: CheckoutData & { expectedError: string };
  };
  urls: Record<string, string>;
}

/** Load test data from JSON file */
export function loadJsonTestData(): TestDataShape {
  const filePath = path.join(__dirname, "../data/testData.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as TestDataShape;
}

/** Load users from Excel file (Sheet: Users) */
export function loadUsersFromExcel(filePath: string): UserData[] {
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets["Users"];
  const rows = XLSX.utils.sheet_to_json<Record<string, string>>(sheet);
  return rows.map((row) => ({
    username: row["Username"] ?? "",
    password: row["Password"] ?? "",
    role: row["Role"],
    expectedError: row["Expected Error"] || undefined,
    scenario: row["Scenario"],
  }));
}

/** Load products from Excel file (Sheet: Products) */
export function loadProductsFromExcel(filePath: string): ProductData[] {
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets["Products"];
  const rows = XLSX.utils.sheet_to_json<Record<string, string>>(sheet);
  return rows.map((row) => ({
    name: row["Product Name"],
    price: row["Price"],
    id: row["ID"],
  }));
}

/** Load checkout scenarios from Excel (Sheet: Checkout) */
export function loadCheckoutFromExcel(
  filePath: string
): (CheckoutData & { scenario: string })[] {
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets["Checkout"];
  const rows = XLSX.utils.sheet_to_json<Record<string, string>>(sheet);
  return rows.map((row) => ({
    scenario: row["Scenario"],
    firstName: row["First Name"] ?? "",
    lastName: row["Last Name"] ?? "",
    zipCode: row["Zip Code"] ?? "",
    expectedError: row["Expected Error"] || undefined,
  }));
}
