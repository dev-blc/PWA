import { devices, test, expect } from '@playwright/test'

test.describe('Given a mobile browser', async () => {
    test.describe('When opening the default page', async () => {
        test('Then the login button should be visible', async ({ page }) => {
            await page.goto('/')
            await expect(page.getByRole('button', { name: 'Login' })).toBeVisible()
            await expect(page.getByRole('heading', { name: 'No Upcoming Pools Yet' })).toBeVisible()
        })
    })
})
