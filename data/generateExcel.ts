/**
 * Script to generate Excel test data file (testData.xlsx)
 * Run: npx ts-node data/generateExcel.ts
 */
import * as XLSX from "xlsx";
import * as path from "path";

const workbook = XLSX.utils.book_new();

// Sheet 1: Users
const usersData = [
  ["Username", "Password", "Role", "Valid", "Expected Error"],
  ["standard_user", "secret_sauce", "standard", "TRUE", ""],
  ["performance_glitch_user", "secret_sauce", "performance", "TRUE", ""],
  ["locked_out_user", "secret_sauce", "locked", "FALSE", "Sorry, this user has been locked out."],
  ["invalid_user", "wrong_pass", "none", "FALSE", "Username and password do not match"],
  ["", "", "none", "FALSE", "Username is required"],
  ["standard_user", "", "none", "FALSE", "Password is required"],
];
const usersSheet = XLSX.utils.aoa_to_sheet(usersData);
XLSX.utils.book_append_sheet(workbook, usersSheet, "Users");

// Sheet 2: Products
const productsData = [
  ["Product Name", "Price", "ID"],
  ["Sauce Labs Backpack", "$29.99", "sauce-labs-backpack"],
  ["Sauce Labs Bike Light", "$9.99", "sauce-labs-bike-light"],
  ["Sauce Labs Bolt T-Shirt", "$15.99", "sauce-labs-bolt-t-shirt"],
  ["Sauce Labs Fleece Jacket", "$49.99", "sauce-labs-fleece-jacket"],
  ["Sauce Labs Onesie", "$7.99", "sauce-labs-onesie"],
];
const productsSheet = XLSX.utils.aoa_to_sheet(productsData);
XLSX.utils.book_append_sheet(workbook, productsSheet, "Products");

// Sheet 3: Checkout Info
const checkoutData = [
  ["Scenario", "First Name", "Last Name", "Zip Code", "Expected Error"],
  ["Valid Checkout", "John", "Doe", "10001", ""],
  ["Missing First Name", "", "Doe", "10001", "Error: First Name is required"],
  ["Missing Last Name", "John", "", "10001", "Error: Last Name is required"],
  ["Missing Zip Code", "John", "Doe", "", "Error: Postal Code is required"],
];
const checkoutSheet = XLSX.utils.aoa_to_sheet(checkoutData);
XLSX.utils.book_append_sheet(workbook, checkoutSheet, "Checkout");

const outputPath = path.join(__dirname, "testData.xlsx");
XLSX.writeFile(workbook, outputPath);
console.log(`✅ Excel file generated: ${outputPath}`);
