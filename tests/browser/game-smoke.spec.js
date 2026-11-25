import {test,expect} from "@playwright/test";

test("desktop game boots offline, renders the world and exposes core menus",async({page})=>{
 const errors=[];
 page.on("pageerror",error=>errors.push(error.message));
 await page.route("https://**/*",route=>route.abort());
 await page.goto("/");
 await expect(page.locator("#loading")).toBeHidden({timeout:20000});
 await expect(page.locator("#game canvas")).toBeVisible();
 await expect(page.locator("#chapter")).toContainText("CHAPTER 01");
 await expect(page.locator("#dialogue")).toBeVisible();
 await page.locator("#next").click();
 await page.locator("#pause").click();
 await expect(page.locator("#pauseMenu")).toBeVisible();
 await page.locator("#audioToggle").click();
 await expect(page.locator("#audioToggle")).toContainText("SOUND: OFF");
 await page.locator("#resume").click();
 await expect(page.locator("#pauseMenu")).toBeHidden();
 await page.keyboard.press("c");
 await expect.poll(()=>page.locator("#game canvas").evaluate(c=>c.width)).toBeGreaterThan(0);
 expect(errors).toEqual([]);
});

test("mobile layout exposes touch controls and camera surface",async({page})=>{
 const errors=[];
 page.on("pageerror",error=>errors.push(error.message));
 await page.route("https://**/*",route=>route.abort());
 await page.goto("/");
 await expect(page.locator("#loading")).toBeHidden({timeout:20000});
 await expect(page.locator("#game canvas")).toBeVisible();
 await expect(page.locator('#touch [data-move="forward"]')).toBeVisible();
 await expect(page.locator('#touch [data-act="attack"]')).toBeVisible();
 await page.locator('#touch [data-act="weapon"]').tap();
 await page.locator("#pause").tap();
 await expect(page.locator("#pauseMenu")).toBeVisible();
 await page.locator("#resume").tap();
 await expect(page.locator("#pauseMenu")).toBeHidden();
 expect(errors).toEqual([]);
});
