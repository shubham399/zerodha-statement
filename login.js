const puppeteer = require('puppeteer-extra');
const fs = require('fs');
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

puppeteer.launch({ headless: headless }).then(async (browser) => {
    console.log('Opening chromium browser...');
    const page = await browser.newPage();
    const pages = await browser.pages();
    pages[0].close();
    await page.goto('https://console.zerodha.com/', { waitUntil: 'networkidle2' });
    await page.waitForTimeout(1000);
    await page.click('button[class="btn-blue"]', { waitUntil: 'networkidle2' });
    await page.waitForTimeout(2000);
    const username = await prompt('Enter Username: ');
    const password = await prompt('Enter Password: ', true);
    await page.type('#userid', username);
    await page.waitForTimeout(1000);
    await page.type('#password', password);
    await page.waitForTimeout(1000);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);
    const pin = await prompt('Enter Pin/TOTP: ', true);
    let isTOTP = await page.evaluate(() => document.querySelector('#totp') !== null);
    if (isTOTP) {
        await page.type('#totp', pin);
    }
    else {
        await page.type('#pin', pin);
    }
    await page.waitForTimeout(1000)
    await page.keyboard.press('Enter');
    await page.waitForTimeout(5000);
    await page.goto('https://console.zerodha.com/funds/statement', { waitUntil: 'networkidle2' });
    let cookies = await page.cookies()
    console.log(cookies);
    let session = cookies.find(c => c.name === 'session').value;
    let public_token = cookies.find(c => c.name === 'public_token').value;
    fs.writeFileSync('.env', `SESSION=${session}\nPUBLIC_TOKEN=${public_token}`);
    await browser.close();
});