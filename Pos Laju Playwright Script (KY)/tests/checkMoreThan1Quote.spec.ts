import { test, expect } from '@playwright/test'
import assert from 'assert';

test.describe('Test Automation Assessment', () => {
    test('Verify Pos Laju offer more than one quote', async ({ page }, testInfo) => {
        await page.goto('https://pos.com.my/send/ratecalculator');
        await page.waitForTimeout(1000);
        await page.locator('div[class="text-xl font-extrabold mb-2"]', { hasText: 'From' }).click({ force: true });
        await page.locator("input[formcontrolname='postcodeFrom']").fill('35600');
        let state = await page.locator('input[placeholder="State"]').first().inputValue();
        // await page.locator('input[placeholder="State"]').first().waitFor({ state: 'attached' });
        // await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);
        await page.waitForLoadState('domcontentloaded');


        // while (state == ''){
        // await page.waitForTimeout(1000);
        // state = await page.locator('input[placeholder="State"]').first().inputValue(); 
        // }
        // await page.waitForLoadState('networkidle');
        await page.locator("input[id='mat-input-0'][placeholder='Select country']").fill('India');
        const option = page.locator('mat-option >> text=India');
        await option.waitFor();
        await option.click();
        await page.waitForTimeout(1000);
        // await page.waitForLoadState('networkidle');
        await page.locator("input[formcontrolname='itemWeight']").fill('1');
        await page.locator("a[type=' button']", { hasText: ' Calculate ' }).click();
        // await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1500);

        await page.setViewportSize({ width: 1300, height: 1150 });
        await page.locator('div[class="text-xl font-extrabold mb-2"]', { hasText: 'From' }).click({ force: true });
        await testInfo.attach("Quotes", {
            body: await page.screenshot({ fullPage: true }),
            contentType: 'image/png',
        });

        await page.waitForTimeout(1000);

        const serviceTypes = await page.locator('dt:has-text("Service Type") + dd');
        const estDeliverTimes = await page.locator('dt:has-text("Estimated Delivery Time") + dd');
        const price = await page.locator("div[class='flex flex-col justify-start sm:items-center items-start h-full']")
        const count = await serviceTypes.count();
        console.log(`Service Type offered: ${count}`);
        expect(count).toBeGreaterThan(1);

        const listServiceType: { // Store the important info for future verfication...
            serviceType: string;
            price: string;
            deliverTime: string
        }[] = [];

        for (let i = 0; i < count; i++) {
            const st = await serviceTypes.nth(i).innerText();
            const dt = await estDeliverTimes.nth(i).innerText();
            const rm = await price.locator('h3').nth(i).innerText();
            const arrayList = {
                serviceType: st,
                price: rm,
                deliverTime: dt
            }

            listServiceType.push(arrayList);
        }
    })
});