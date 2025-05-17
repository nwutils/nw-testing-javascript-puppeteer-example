import path from 'node:path';
import process from 'node:process';

import { findpath } from 'nw';
import puppeteer, { Browser } from "puppeteer";
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe.skipIf(process.platform === 'linux')('NW.js Puppeteer test suite', function () {

    /**
     * @type {Browser}
     */
    let browser = undefined;
    let page = undefined;

    /* Setup NW.js Puppeteer browser */
    beforeAll(async function () {

        const nwPath = await findpath('nwjs', { flavor: 'sdk' });

        /* Launch NW.js via Puppeteer */
        browser = await puppeteer.launch({
            headless: true,
            ignoreDefaultArgs: true,
            executablePath: nwPath,
            /* Specify file path to NW.js app */
            args: [`--nwapp=${path.resolve('js', 'puppeteer')}`],
        });

        const entryPath = path.resolve('js', 'puppeteer', 'index.html')
        page = await browser.newPage();

        /* Browser needs to prepend file:// to open the file present on local file system. */
        await page.goto(`file://${entryPath}`);
    });

    /* Get text via element's ID and assert it is equal. */
    it('Hello, World! text by ID', async function () {

        const textElement = await page.$('#test');

        const text = await page.evaluate(el => el.textContent, textElement);

        expect(text).toEqual('Hello, World!\n\n');
    }, { timeout: Infinity });

    /* Quit Puppeteer browser. */
    afterAll(async function () {
        await browser.close();
    });
});
