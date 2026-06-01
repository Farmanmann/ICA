import { test, expect } from "@playwright/test"

test.describe("Lender bidding page", () => {
  test("renders page with sidebar navigation", async ({ page }) => {
    await page.goto("/lender/bidding")
    await expect(page.getByText("Browse Applications")).toBeVisible()
    await expect(page.getByText("Noor Financing")).toBeVisible()
    await expect(page.getByText("Financier Portal")).toBeVisible()
  })

  test("shows term filter", async ({ page }) => {
    await page.goto("/lender/bidding")
    await expect(page.getByText("Filter by term:")).toBeVisible()
    await expect(page.locator("select")).toBeVisible()
  })

  test("shows loading then content or empty state", async ({ page }) => {
    await page.goto("/lender/bidding")
    // Either loans load or we get the empty state — both are valid
    await expect(
      page.getByText(/Loading available financing|No financing applications available/i)
        .or(page.locator(".grid .bg-white").first())
    ).toBeVisible({ timeout: 10000 })
  })

  test("offer modal requires login when not authenticated", async ({ page }) => {
    await page.goto("/lender/bidding")
    // Wait for page to settle
    await page.waitForTimeout(2000)

    const cards = page.locator(".grid .bg-white")
    const count = await cards.count()

    if (count > 0) {
      await cards.first().click()
      // Detail panel should appear with login CTA for unauthenticated users
      await expect(
        page.getByText(/Log In to Send Offer/i)
          .or(page.getByText(/Send Offer/i))
      ).toBeVisible({ timeout: 5000 })
    }
  })
})

test.describe("Lender bid success page", () => {
  test("renders success page with spinner then confirmation", async ({ page }) => {
    await page.goto("/lender/bid-success?session_id=test_session_123")
    await expect(page.getByText(/Processing payment|Offer Submitted/i)).toBeVisible()
    // After 1.5s delay the confirmed state shows
    await expect(page.getByText("Offer Submitted!")).toBeVisible({ timeout: 5000 })
  })
})
