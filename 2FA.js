// loginWith2FA.js
const { chromium } = require('playwright');

(async () => {
  // CONFIG - change these to your test credentials
  const url = 'https://dev.erdster.co.in/GNFJourneyAdmin';
  const email = 'yourEmail@example.com';
  const password = 'yourPassword';

  // Launch browser visible & maximized
  const browser = await chromium.launch({
    headless: false,
    args: ['--start-maximized']
  });

  // Create context that uses the full window size
  const context = await browser.newContext({ viewport: null });
  const page = await context.newPage();

  // Go to login page
  await page.goto(url);

  // Fill email and password (update selectors if needed)
  await page.fill('//*[@id="email"]', 'karunakaran@erdster.co.in');
  await page.fill('//*[@id="psw"]', 'gN7@pR5!yW3#sF8%');
  

  // Click submit/login button
  // Update selector if the button has a different id/class/text
  await page.click('//*[@id="loginForm"]/div[3]/button');

  // Wait for the 2FA input to appear (optional: update selector to match your 2FA input)
  // This waits up to 120 seconds for an element that looks like a 2FA input.
  try {
    await page.waitForSelector('//*[@id="loginForm"]/div[2]/button[1]"]', { timeout: 5000 });
    console.log('2FA input detected on page.');
  } catch (e) {
    console.log('No explicit 2FA input detected immediately — script will pause for manual 2FA entry.');
  }

  // Pause for manual 2FA entry:
  // - Open the browser window
  // - Enter the 2FA code manually (email/SMS/authenticator)
  // - Then either wait the timeout or press Enter in the terminal to continue
  console.log('\n*** Please enter the 2FA code in the browser now. ***');
  console.log('When done, press Enter here to continue (or wait up to 2 minutes).');

  // Two ways to continue:
  // 1) Press Enter in terminal to continue immediately (preferred for manual flow)
  // 2) Or wait for timeout (120000 ms) and script will continue automatically
  const waitForEnterOrTimeout = () => {
    return new Promise((resolve) => {
      // timeout fallback
      const timeout = setTimeout(() => {
        process.stdin.pause();
        resolve('timeout');
      }, 120000); // 120s

      // listen for Enter key
      process.stdin.resume();
      process.stdin.once('data', () => {
        clearTimeout(timeout);
        process.stdin.pause();
        resolve('enter');
      });
    });
  };

  await waitForEnterOrTimeout();

  // Optional: wait a bit for post-2FA navigation to finish
  await page.waitForTimeout(2000);

  // Now you should be logged in — print page title or any post-login check
  try {
    const title = await page.title();
    console.log('Page Title after login:', title);
  } catch (err) {
    console.log('Could not read page title:', err.message);
  }

  // Optional: take a screenshot after login for verification
  await page.screenshot({ path: 'post_login_screenshot.png', fullPage: false });

  // Close the browser
  await browser.close();
  console.log('Browser closed. Script finished.');
})();
