import { test, expect } from "@playwright/test"

test.describe("Login page", () => {
  test("renders login form", async ({ page }) => {
    await page.goto("/auth/login")
    await expect(page.getByRole("heading", { name: "Welcome Back" })).toBeVisible()
    await expect(page.getByPlaceholder("your@email.com")).toBeVisible()
    await expect(page.getByPlaceholder("Enter your password")).toBeVisible()
    await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible()
  })

  test("shows error when submitting empty form", async ({ page }) => {
    await page.goto("/auth/login")
    await page.getByRole("button", { name: "Sign In" }).click()
    await expect(page.getByText("Please fill in all fields")).toBeVisible()
  })

  test("shows error for invalid credentials", async ({ page }) => {
    await page.goto("/auth/login")
    await page.getByPlaceholder("your@email.com").fill("notreal@example.com")
    await page.getByPlaceholder("Enter your password").fill("wrongpassword")
    await page.getByRole("button", { name: "Sign In" }).click()
    // Wait for async Supabase call
    await expect(page.getByText(/Invalid email or password/i)).toBeVisible({ timeout: 8000 })
  })

  test("has working borrower and lender signup links", async ({ page }) => {
    await page.goto("/auth/login")
    await expect(page.getByRole("button", { name: "Sign up as Borrower" })).toBeVisible()
    await expect(page.getByRole("button", { name: "Sign up as Financier" })).toBeVisible()
  })

  test("toggles user type selection", async ({ page }) => {
    await page.goto("/auth/login")
    const lenderBtn = page.getByRole("button", { name: "Financier" })
    await lenderBtn.click()
    await expect(lenderBtn).toHaveClass(/border-blue-600/)
  })
})

test.describe("Borrower signup page", () => {
  test("renders signup form", async ({ page }) => {
    await page.goto("/auth/signup-borrower")
    await expect(page.getByRole("heading", { name: /create.*account/i })).toBeVisible()
  })
})

test.describe("Lender signup page", () => {
  test("renders financier signup form", async ({ page }) => {
    await page.goto("/auth/signup-lender")
    await expect(page.getByRole("heading", { name: /financier|lender/i })).toBeVisible()
  })
})
