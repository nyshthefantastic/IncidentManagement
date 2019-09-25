const puppeteer = require('puppeteer')
let browser
let page
jest.setTimeout(3000000);

beforeAll(async () => {
  browser = await puppeteer.launch({ headless: false })
  page = await browser.newPage()
  await page.goto('https://incidents.ecdev.opensource.lk/sign-in')
  await page.type('#email', 'manager', { delay: 20 })
  await page.type('#password', 'eclk2019', { delay: 20 })
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
    await page.waitForXPath("//span[contains(., 'Inquiry')]").then(selector => selector.click())
    await page.waitForXPath("//span[contains(., 'Fax')]").then(selector => selector.click())
    const input = await page.$('input[name=title]');
    await input.click({ clickCount: 3 })
    await input.type("New Title");
    await page.type('textarea[name=description]', 'New Description')
    await page.waitForXPath("//span[contains(., 'Occurring')]").then(selector => selector.click())
    await page.type('#location', 'New location')
    await page.type('#address', 'New Address')
    await page.type('#city', 'New city')
    await page.click('#select-province')
    await page.click('#select-district')
    await page.click('#select-divisionalSecretariat')
    await page.click('#select-pollingDivision')
    await page.click('#select-pollingStation')
    await page.type('#city', 'New City')
    await page.type('#reporterName', 'New Complainer Name')
    await page.type('#reporterAddress', 'New Complainer Address')
    await page.type('#reporterMobile', '0773356745')
    await page.type('#reporterEmail', 'abc@gmail.com', { delay: 20 })
    await page.click('#reporterConsent')

    // await page.screenshot({ path: screenshot })
    await page.click("button[type=submit]")
    let checkUrl = await page.evaluate(() => location.href);
    expect(checkUrl).toBe('https://incidents.ecdev.opensource.lk/app/review')
  })
})

describe('Report', () => {
  test('On Report Click Police Division Summary Report', async () => {
    await page.goto('https://incidents.ecdev.opensource.lk/app/reports', { waitUntil: 'networkidle0' })
    await page.waitForXPath("//td[contains(., 'Police Division Summary Report')]").then(selector => selector.click())
    let checkUrl = await page.evaluate(() => location.href);
    expect(checkUrl).toBe('https://incidents.ecdev.opensource.lk/app/reports/view?report=di_division_summary_report')
  })
})
describe('Report2', () => {
  test('On Report Click Caategory-wise Summary Report', async () => {
    await page.goto('https://incidents.ecdev.opensource.lk/app/reports', { waitUntil: 'networkidle0' })
    await page.waitForXPath("//td[contains(., 'Caategory-wise Summary Report')]").then(selector => selector.click())
    let checkUrl = await page.evaluate(() => location.href);
    expect(checkUrl).toBe('https://incidents.ecdev.opensource.lk/app/reports/view?report=category_wise_summary_report')
  })
})
describe('Archive', () => {
  test('On Text Search', async () => {
    await page.goto('https://incidents.ecdev.opensource.lk/app/archive', { waitUntil: 'networkidle0' })
    await page.type('#outlined-full-width', 'New Report')
    await page.click("button[type=submit]")

    //  let checkUrl = await page.evaluate(() => location.href);
    // expect(checkUrl).toBe('https://incidents.ecdev.opensource.lk/app/reports/view?report=di_division_summary_report')
  })
})
describe('Home', () => {
  test('On Incident Click', async () => {
    await page.goto('https://incidents.ecdev.opensource.lk/app/home', { waitUntil: 'networkidle0' })
    // await page.click('.jss1962 jss1964 jss2089');

    //  let checkUrl = await page.evaluate(() => location.href);
    // expect(checkUrl).toBe('https://incidents.ecdev.opensource.lk/app/reports/view?report=di_division_summary_report')
  })
})
afterAll(async () => {

  await browser.close()
})
