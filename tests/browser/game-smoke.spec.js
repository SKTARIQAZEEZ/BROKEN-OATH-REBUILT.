import {test,expect} from "@playwright/test";

async function dismissIntroIfPresent(page){
 const dialogue=page.locator("#dialogue");
 if(await dialogue.isVisible()){
  // Trigger the same native click handler without racing the cinematic camera's
  // continuous movement against Playwright's pointer-stability heuristic.
  await page.locator("#next").evaluate(button=>button.click());
  await expect(dialogue).toBeHidden({timeout:3000});
 }
}

test("desktop game boots offline, renders the world and exposes core menus",async({page},testInfo)=>{
 test.skip(testInfo.project.name!=="desktop-chromium","Desktop-only smoke test");
 const errors=[];
 page.on("pageerror",error=>errors.push(error.message));
 await page.route("https://**/*",route=>route.abort());
 await page.goto("/?e2e=1");
 await expect(page.locator("#loading")).toBeHidden({timeout:20000});
 await expect(page.locator("#game canvas")).toBeVisible();
 await expect(page.locator("#chapter")).toContainText("CHAPTER 01");
 await dismissIntroIfPresent(page);
 // The WebGL scene animates continuously, so invoke the real button click handler\n // directly rather than waiting for Playwright pointer-stability heuristics.\n await page.locator("#pause").evaluate(button=>button.click());
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
 await page.goto("/?e2e=1");
 await expect(page.locator("#loading")).toBeHidden({timeout:20000});
 await expect(page.locator("#game canvas")).toBeVisible();
 await dismissIntroIfPresent(page);
 await expect(page.locator('#touch [data-move="forward"]')).toBeVisible();
 await expect(page.locator('#touch [data-act="attack"]')).toBeVisible();
 await page.locator('#touch [data-act="weapon"]').tap({force:true});
 await page.locator("#pause").evaluate(button=>button.click());
 await expect(page.locator("#pauseMenu")).toBeVisible();
 await page.locator("#resume").tap({force:true});
 await expect(page.locator("#pauseMenu")).toBeHidden();
 expect(errors).toEqual([]);
});
