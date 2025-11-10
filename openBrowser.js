const { chromium } = require('playwright');

(async () => {
  // Launch browser with --start-maximized
  const browser = await chromium.launch
  (
    {
    headless: false,
    args: ['--start-maximized'] // this makes the window full screen
    }
  );

  // Context with viewport null to match window size
  const context = await browser.newContext({ viewport: null });

  const page = await context.newPage();
  await page.goto('https://dev.erdster.co.in/GNFJourneyAdmin');

  console.log('Page Title:', await page.title());

  await page.fill('//*[@id="email"]', 'karunakaran@erdster.co.in');
  await page.fill('//*[@id="psw"]', 'gN7@pR5!yW3#sF8%');
  await page.click('//*[@id="loginForm"]/div[3]/button');

  // Wait 3 seconds to see the browser
  await page.waitForTimeout(1000);

  await browser.close();
})();
