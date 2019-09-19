const puppeteer = require('puppeteer')
//const screenshot = 'github.png';

let browser
let page
jest.setTimeout(30000);

beforeAll(async () => {
  browser = await puppeteer.launch({headless: false})
  page = await browser.newPage()
  await page.goto('https://incidents.ecdev.opensource.lk/sign-in')
  await page.type('#email', 'manager', {delay: 20})
  await page.type('#password', 'eclk2019', {delay: 20})
  await page.click("button[type=button]")
  await page.waitForNavigation()
  
})

describe('Incident Homepage', () => {
  test('On Sucess Login Homepage', async () => {
    await page.goto('https://incidents.ecdev.opensource.lk/app/incident', { waitUntil: 'networkidle0' })
    const title = await page.title()
    expect(title).toBe('Incident Management')
  })
})
  describe('Create Page', () => {
    test('On Click Create tab Homepage', async () => {
      await page.goto('https://incidents.ecdev.opensource.lk/app/incident', { waitUntil: 'networkidle0' })
      await page.click('#select-infoChannel')
      const input = await page.$('input[name=title]');
      await input.click({ clickCount: 3 })
      await input.type("New Title");
      await page.type('textarea[name=description]', 'New Description')
      await page.click('input[name=occurrence]', 'OCCURRING')
      await page.type('#location', 'New location')
      await page.type('#address', 'New Address')
      await page.type('#city', 'New city')
      await page.click('#select-province')

      
      await page.keyboard.press('Enter');
      
      await page.click('#select-district')

      await page.click('#select-divisionalSecretariat')

      await page.click('#select-pollingDivision')

      await page.click('#select-pollingStation')

      await page.click('input[name=severity]', '1')
      
      //await page.click('#district')
      await page.type('#city', 'New City')
      await page.type('#reporterName', 'New Complainer Name')
      await page.type('#reporterAddress', 'New Complainer Address')
      await page.type('#reporterMobile', '0773356745')
      await page.type('#reporterEmail', 'abc@gmail.com', {delay: 20})

     // await page.screenshot({ path: screenshot })

     // await page.click("button[type=submit]")
      let checkUrl = await page.evaluate(() => location.href);
      expect(checkUrl).toBe('https://incidents.ecdev.opensource.lk/app/review')
    })
  })
  afterAll( async () => {

     // await browser.close()
  })
