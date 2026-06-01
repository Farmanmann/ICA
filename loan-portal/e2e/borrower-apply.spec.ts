import { test, expect } from "@playwright/test"

test.describe("Borrower application flow", () => {
  test("personal info page renders form", async ({ page }) => {
    await page.goto("/borrower/apply/personal-info")
    // Unauthenticated users should see the form or be redirected to login
    const isFormOrRedirect = await page
      .getByText(/personal|login|sign in/i)
      .first()
      .isVisible({ timeout: 5000 })
      .catch(() => false)
    expect(isFormOrRedirect).toBe(true)
  })

  test("property details page exists", async ({ page }) => {
    const res = await page.goto("/borrower/apply/property-details")
    // Should not 404
    expect(res?.status()).not.toBe(404)
  })

  test("financial info page exists", async ({ page }) => {
    const res = await page.goto("/borrower/apply/financial-info")
    expect(res?.status()).not.toBe(404)
  })

  test("review page exists", async ({ page }) => {
    const res = await page.goto("/borrower/apply/review")
    expect(res?.status()).not.toBe(404)
  })
})

test.describe("Borrower calculator", () => {
  test("calculator page renders", async ({ page }) => {
    await page.goto("/borrower/calculator")
    await expect(page.getByRole("heading", { name: /calculator/i })).toBeVisible({ timeout: 5000 })
  })
})

test.describe("Public pages", () => {
  test("home page loads", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByText(/Noor/i).first()).toBeVisible()
  })

  test("how it works page loads", async ({ page }) => {
    await page.goto("/how-it-works")
    await expect(page).toHaveTitle(/.+/)
  })

  test("sharia page loads", async ({ page }) => {
    const res = await page.goto("/sharia")
    expect(res?.status()).not.toBe(404)
  })

  test("privacy policy page loads", async ({ page }) => {
    const res = await page.goto("/privacy")
    expect(res?.status()).not.toBe(404)
  })

  test("terms page loads", async ({ page }) => {
    const res = await page.goto("/terms")
    expect(res?.status()).not.toBe(404)
  })
})
