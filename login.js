const puppeteer = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth'); // Use v2.4.5 instead of latest
const readline = require("readline");

puppeteer.use(pluginStealth());

// Use '-h' arg for headful login.
const headless = !process.argv.includes('-h');

// Prompt user for email and password.
const prompt = (query, hidden = false) =>
    new Promise((resolve, reject) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        try {
            if (hidden) {
                const stdin = process.openStdin();
                process.stdin.on('data', (char) => {
                    char = char + '';
                    switch (char) {
                        case '\n':
                        case '\r':
                        case '\u0004':
                            stdin.pause();
                            break;
                        default:
                            process.stdout.clearLine(0);
                            readline.cursorTo(process.stdout, 0);
                            process.stdout.write(query + Array(rl.line.length + 1).join('*'));
                            break;
                    }
                });
            }
            rl.question(query, (value) => {
                resolve(value);
                rl.close();
            });
        } catch (err) {
            reject(err);
        }
    });

// Launch puppeteer browser.
puppeteer.launch({ headless: headless }).then(async (browser) => {
    console.log('Opening chromium browser...');
    const page = await browser.newPage();
    const pages = await browser.pages();
    // Close the new tab that chromium always opens first.
    pages[0].close();
    await page.goto('https://accounts.google.com/signin/v2/identifier', { waitUntil: 'networkidle2' });
    if (headless) {
        // Only needed if sign in requires you to click 'sign in with google' button.
        // await page.waitForSelector('button[data-test="google-button-login"]');
        // await page.waitFor(1000);
        // await page.click('button[data-test="google-button-login"]');

        // Wait for email input.
        await page.waitForSelector('#identifierId');
        let badInput = true;

        // Keep trying email until user inputs email correctly.
        // This will error due to captcha if too many incorrect inputs.
        while (badInput) {
            const email = await prompt('Email or phone: ');
            await page.type('#identifierId', email);
            await page.waitFor(1000);
            await page.keyboard.press('Enter');
            await page.waitFor(1000);
            badInput = await page.evaluate(() => document.querySelector('#identifierId[aria-invalid="true"]') !== null);
            if (badInput) {
                console.log('Incorrect email or phone. Please try again.');
                await page.click('#identifierId', { clickCount: 3 });
            }
        }
        const password = await prompt('Enter your password: ', true);
        console.log('Finishing up...');
        // Wait for password input
        await page.type('input[type="password"]', password);
        await page.waitFor(1000);
        await page.keyboard.press('Enter');
        // For headless mode, 2FA needs to be handled here.
        // Login via gmail app works autmatically.
    }
});