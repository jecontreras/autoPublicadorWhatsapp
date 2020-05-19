// const chromium = require('chromium');
// const { execFile } = require('child_process');
// const fs = require('fs');
// const webdriver = require('selenium-webdriver');
// const chrome = require('selenium-webdriver/chrome');
// require('chromedriver');

//  execFile(chromium.path, ['https://web.whatsapp.com/send?phone=573148487506&text=Hola&source&data&app_absent'], err => {
//      console.log('Hello Google!');
//  });

// async function init() {
//   let options = new chrome.Options();
//   options.setChromeBinaryPath(chromium.path);
//   options.addArguments('--headless');
//   options.addArguments('--disable-gpu');
//   options.addArguments('--window-size=1280,960');

//   const driver = await new webdriver.Builder()
//     .forBrowser('chrome')
//     .setChromeOptions(options)
//     .build();

//   await driver.get('http://google.com');
//   console.log('Hello Google!');

//   await driver.quit();
// }

// init();

//  const puppeteer = require('puppeteer');

//  (async () => {
//    const browser = await puppeteer.launch({ headless: false });
//    const page = await browser.newPage();

//     //Emulates an iPhone X
//     // await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1');
//     // await page.setViewport({ width: 375, height: 812 });

//    await page.goto('https://web.whatsapp.com/');

//     // await browser.close();
//  })();


// const puppeteer = require('puppeteer');

// (async () => {
//     const browser = await puppeteer.launch({ headless: false });
//   const page = await browser.newPage();

//   // Emitted when the DOM is parsed and ready (without waiting for resources)
// //   page.once('domcontentloaded', () => console.info('✅ DOM is ready'));

// //   // Emitted when the page is fully loaded
// //   page.once('load', () => console.info('✅ Page is loaded'));

// //   // Emitted when the page attaches a frame
// //   page.on('frameattached', () => console.info('✅ Frame is attached'));

// //   // Emitted when a frame within the page is navigated to a new URL
// //   page.on('framenavigated', () => console.info('👉 Frame is navigated'));

// //   // Emitted when a script within the page uses `console.timeStamp`
// //   page.on('metrics', data => console.info(`👉 Timestamp added at ${data.metrics.Timestamp}`));

// //   // Emitted when a script within the page uses `console`
// //   page.on('console', message => console[message.type()](`👉 ${message.text()}`));

// //   // Emitted when the page emits an error event (for example, the page crashes)
// //   page.on('error', error => console.error(`❌ ${error}`));

// //   // Emitted when a script within the page has uncaught exception
// //   page.on('pageerror', error => console.error(`❌ ${error}`));

// //   // Emitted when a script within the page uses `alert`, `prompt`, `confirm` or `beforeunload`
// //   page.on('dialog', async dialog => {
// //     console.info(`👉 ${dialog.message()}`);
// //     await dialog.dismiss();
// //   });

//   // Emitted when a new page, that belongs to the browser context, is opened
// //   page.on('popup', () => console.info('👉 New page is opened'));

//   // Emitted when the page produces a request
// //   page.on('request', request => console.info(`👉 Request: ${request.url()}`));

// //   // Emitted when a request, which is produced by the page, fails
// //   page.on('requestfailed', request => console.info(`❌ Failed request: ${request.url()}`));

// //   // Emitted when a request, which is produced by the page, finishes successfully
// //   page.on('requestfinished', request => console.info(`👉 Finished request: ${request.url()}`));

// //   // Emitted when a response is received
// //   page.on('response', response => console.info(`👉 Response: ${response.url()}`));

// //   // Emitted when the page creates a dedicated WebWorker
// //   page.on('workercreated', worker => console.info(`👉 Worker: ${worker.url()}`));

// //   // Emitted when the page destroys a dedicated WebWorker
// //   page.on('workerdestroyed', worker => console.info(`👉 Destroyed worker: ${worker.url()}`));

// //   // Emitted when the page detaches a frame
// //   page.on('framedetached', () => console.info('✅ Frame is detached'));

// //   // Emitted after the page is closed
// //   page.once('close', () => console.info('✅ Page is closed'));

//   await page.goto('https://web.whatsapp.com/');
//   //await page.screenshot({ path: 'example.png' });
//   setTimeout(async()=>{
//       const SEARCH_SELECTOR = 'input[placeholder=Search]';
//       await page.click(SEARCH_SELECTOR);
//   },5000)

//   //await browser.close();
// })();


// const puppeteer = require('puppeteer');

// (async () => {
//   const browser = await puppeteer.launch({ headless: false });
//   const page = await browser.newPage();

//   await page.setViewport({ width: 1920, height: 1080 });
//   await page.goto('https://pptr.dev');
//   await page.waitForSelector('sidebar-component');

//   // Drags the mouse from a point
//   await page.mouse.move(0, 0);
//   await page.mouse.down();

//   // Drops the mouse to another point
//   await page.mouse.move(100, 100);
//   await page.mouse.up();

//   await browser.close();
// })();



const puppeteer = require('puppeteer');
let countRequest = 0;
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://web.whatsapp.com/send?phone=573156027551&text=Hola&source&data&app_absent');
  page.on('request', request => { countRequest++;  /*console.info(`👉 Request: ${request.url()}`)*/ });

  let interval = setInterval(()=>{
    console.log( countRequest );
    if( 10 > countRequest ) return false;
    else {
      nextProceso();
      clearInterval( interval );
    }
  }, 5000);
  // other actions...
  // await browser.close();
  async function nextProceso(){
    let arreglo = [
      { 
        mensaje: "JOSE"
      },
      { 
        mensaje: "CONTRERAS"
      },
      { 
        mensaje: "PEÑA"
      },
    ]
    for( let row of arreglo ){
      const page2 = await browser.newPage();
      await page2.goto(`https://web.whatsapp.com/send?phone=573156027551&text=${ row.mensaje }&source&data&app_absent`);
      await sleep(8);
      await page2.keyboard.press('Enter');
      console.log("FINIX");
      await sleep(2);
      await page2.close();
    }
  }

  async function sleep(segundos) {
    return new Promise(resolve => {
        setTimeout(async () => { resolve(true) }, segundos * 1000)
    })
}

})();