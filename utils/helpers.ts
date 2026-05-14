import { Page } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

/** Logs in with standard_user before each test */
export async function loginAsStandardUser(page: Page) {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.loginAndExpectSuccess("standard_user", "secret_sauce");
}

/** Logs in with a given user */
export async function loginAs(page: Page, username: string, password: string) {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(username, password);
}

/** Checks if array is sorted ascending */
export function isSortedAscending(arr: string[]): boolean {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i].toLowerCase() > arr[i + 1].toLowerCase()) return false;
  }
  return true;
}

/** Checks if array is sorted descending */
export function isSortedDescending(arr: string[]): boolean {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i].toLowerCase() < arr[i + 1].toLowerCase()) return false;
  }
  return true;
}

/** Checks if numeric array is sorted ascending */
export function isNumericSortedAscending(arr: number[]): boolean {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] > arr[i + 1]) return false;
  }
  return true;
}

/** Checks if numeric array is sorted descending */
export function isNumericSortedDescending(arr: number[]): boolean {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] < arr[i + 1]) return false;
  }
  return true;
}
