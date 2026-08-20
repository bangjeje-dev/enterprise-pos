const puppeteer = require('puppeteer-core');

(async () => {
  const executablePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = await puppeteer.launch({ executablePath, headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', error => console.log('BROWSER PAGE ERROR:', error.message));

  try {
    console.log("Go to home...");
    await page.goto('http://localhost:5175/', { waitUntil: 'networkidle2' });

    console.log("Go to /crm/loyalty/new...");
    await page.evaluate(() => {
      window.history.pushState({}, '', '/crm/loyalty/new');
      window.dispatchEvent(new Event('popstate'));
    });
    
    console.log("Wait for input...");
    await page.waitForSelector('input[placeholder="e.g. VIP Member"]', { timeout: 5000 });
    
    console.log("Fill form...");
    await page.type('input[placeholder="e.g. VIP Member"]', 'End-to-End Test Program');
    
    console.log("Save...");
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const saveBtn = buttons.find(b => b.textContent.includes('Save Program'));
      if (saveBtn) saveBtn.click();
    });
    
    console.log("Wait 2s...");
    await new Promise(r => setTimeout(r, 2000));
    
    console.log("URL AFTER SAVE IS:", page.url());
    
    console.log("Check error UI...");
    const errorBoxes = await page.$$eval('.bg-red-50.text-red-600', els => els.map(e => e.textContent.trim()));
    if (errorBoxes.length > 0) {
      console.log("UI ERROR BOX FOUND:", errorBoxes);
    } else {
      console.log("No UI error box found.");
    }
  } catch (err) {
    console.error("Test script failed:", err);
  } finally {
    await browser.close();
  }
})();
