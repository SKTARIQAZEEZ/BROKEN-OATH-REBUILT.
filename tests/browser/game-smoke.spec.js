import {test,expect} from "@playwright/test";

async function waitForIntroToFinish(page){
 // The authored intro is a timed cinematic; let its three beats finish naturally.
 // This avoids racing a moving camera/dialogue panel with a synthetic tap.
 await expect(page.locator("#dialogue")).toBeVisible();
 await expect(page.locator("#dialogue")).toBeHidden({timeout:15000});
}

test("desktop game boots offline, renders the world and exposes core menus",async({page},testInfo)=>{
 test.skip(testInfo.project.name!=="desktop-chromium","Desktop-only smoke test");
 const errors=[];
 page.on("pageerror",error=>errors.push(error.message));
 await page.route("https://**/*",route=>route.abort());
 await page.goto("/");
 await expect(page.locator("#loading")).toBeHidden({timeout:20000});
 await expect(page.locator("#game canvas")).toBeVisible();
 await expect(page.locator("#chapter")).toContainText("CHAPTER 01");
 await waitForIntroToFinish(page);
 await page.locator("#pause").click();
 await expect(page.locator("#pauseMenu")).toBeVisible();
 await page.locator("#audioToggle").click();
 await expect(page.locator("#audioToggle")).toHaveAttribute("aria-pressed","false");
 await page.locator("#resume").click();
 await expect(page.locator("#pauseMenu")).toBeHidden();
 await page.keyboard.press("c");
 await expect.poll(()=>page.locator("#game canvas").evaluate(c=>c.width)).toBeGreaterThan(0);
 expect(errors).toEqual([]);
});

test("mobile layout exposes touch controls and camera surface",async({page},testInfo)=>{
 test.skip(testInfo.project.name!=="mobile-chromium","Mobile-only smoke test");
 const errors=[];
 page.on("pageerror",error=>errors.push(error.message));
 await page.route("https://**/*",route=>route.abort());
 await page.goto("/");
 await expect(page.locator("#loading")).toBeHidden({timeout:20000});
 await expect(page.locator("#game canvas")).toBeVisible();
 await waitForIntroToFinish(page);
 await expect(page.locator('#touch [data-move="forward"]')).toBeVisible();
 await expect(page.locator('#touch [data-act="attack"]')).toBeVisible();
 await page.locator('#touch [data-act="weapon"]').tap({force:true});
 await page.locator("#pause").tap({force:true});
 await expect(page.locator("#pauseMenu")).toBeVisible();
 await page.locator("#resume").tap({force:true});
 await expect(page.locator("#pauseMenu")).toBeHidden();
 expect(errors).toEqual([]);
});
