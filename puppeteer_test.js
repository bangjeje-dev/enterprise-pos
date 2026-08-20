const puppeteer = require('puppeteer');

(async () => {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Listen for console logs and errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('BROWSER CONSOLE ERROR:', msg.text());
    } else {
      console.log('BROWSER LOG:', msg.text());
    }
  });

  page.on('pageerror', error => {
    console.log('BROWSER PAGE ERROR:', error.message);
  });
  
  page.on('requestfailed', request => {
    console.log('BROWSER REQUEST FAILED:', request.url(), request.failure().errorText);
  });

  try {
    console.log("Navigating to http://localhost:5173/crm/loyalty/new...");
    await page.goto('http://localhost:5173/crm/loyalty/new', { waitUntil: 'networkidle0' });

    console.log("Filling out form...");
    // Type program name
    await page.type('input[placeholder="e.g. VIP Member"]', 'End-to-End Test Program');
    
    // Earning Rule - Using existing defaults or re-typing
    // Redemption Rule - Using existing defaults

    console.log("Clicking 'Save Program'...");
    // Find button by text content
    const buttons = await page.$$('button');
    let saveButton = null;
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && text.includes('Save Program')) {
        saveButton = btn;
        break;
      }
    }
    
    if (saveButton) {
      await saveButton.click();
      console.log("Save button clicked. Waiting for 3 seconds to capture any async errors...");
      await new Promise(r => setTimeout(r, 3000));
      
      console.log("Checking current URL...");
      console.log("Current URL is:", page.url());
      
      // Let's also check if there's any error box on the screen
      const errorBoxes = await page.$$eval('.bg-red-50.text-red-600', els => els.map(e => e.textContent.trim()));
      if (errorBoxes.length > 0) {
        console.log("UI ERROR BOX FOUND:", errorBoxes);
      } else {
        console.log("No UI error box found.");
      }
    } else {
      console.log("COULD NOT FIND SAVE BUTTON!");
    }
    
  } catch (err) {
    console.error("Test script failed:", err);
  } finally {
    await browser.close();
  }
})();
