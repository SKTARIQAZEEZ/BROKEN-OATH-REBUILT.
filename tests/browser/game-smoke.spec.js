import {test,expect} from "@playwright/test";

async function dismissIntro(page,interaction){
 const dialogue=page.locator("#dialogue");
 await expect(dialogue).toBeVisible();
 const next=page.locator("#next");
 // The intro cinematic advances on its own; if it is still on screen,
 // Continue skips the entire sequence instead of only hiding one caption.
 if(await next.isVisible()) await next[interaction]({force:true,timeout:5000});
 await expect(dialogue).toBeHidden({timeout:10000});
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
 await dismissIntro(page,"click");
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
 await dismissIntro(page,"tap");
 await expect(page.locator('#touch [data-move="forward"]')).toBeVisible();
 await expect(page.locator('#touch [data-act="attack"]')).toBeVisible();
 await page.locator('#touch [data-act="weapon"]').tap({force:true});
 await page.locator("#pause").tap({force:true});
 await expect(page.locator("#pauseMenu")).toBeVisible();
 await page.locator("#resume").tap({force:true});
 await expect(page.locator("#pauseMenu")).toBeHidden();
 expect(errors).toEqual([]);
});
