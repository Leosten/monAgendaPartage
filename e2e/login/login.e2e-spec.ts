import { browser, element, by, ElementFinder, protractor } from 'protractor';

describe('Example E2E Test', () => {

  beforeEach(() => {
    browser.get('http://localhost:8100');
  });

  it('The title is Mon Agenda Partagé', () => {
      expect(element(by.css('.ion-page .title .toolbar-title'))
        .getAttribute('innerHTML'))
        .toContain('Mon agenda partagé');
  });

  it('Cannot login without input', () => {
    expect(element(by.css('input[type="text"]')).getText()).toMatch('');
    expect(element(by.css('input[type="password"]')).getText()).toMatch('');
    expect(element(by.css('button[type="submit"]')).getAttribute('disabled')).toMatch('true');
  });

  it('Cannot login without minimum input', () => {
    let inputEmail = element(by.css('input[type="text"]'));
    let inputPwd = element(by.css('input[type="password"]'));

    inputEmail.sendKeys('leo@etna.io');
    inputPwd.sendKeys('1234');

    expect(element(by.css('button[type="submit"]')).getAttribute('disabled')).toMatch('true');
  });

  it('Can login with input', () => {
    let inputEmail = element(by.css('input[type="text"]'));
    let inputPwd = element(by.css('input[type="password"]'));

    inputEmail.sendKeys('leo@etna.io');
    inputPwd.sendKeys('testtest');
    let submitBtn = element(by.css('button[type="submit"]'));
    let click = submitBtn.click();

    let timeout = 10000;
    var EC = browser.ExpectedConditions;
    browser.wait(EC.urlContains('http://localhost:8100/#/home'), timeout); // Checks that the current URL contains the expected text
    browser.wait(EC.urlIs('http://localhost:8100/#/home'), timeout);
  });

});
