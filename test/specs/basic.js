/* global browser */
const assert = require('assert');

describe('webdriver.io page', () => {
  it('should have the right title', () => {
    // Get to example client
    browser.url('http://localhost:1234');

    // Click the authorization code flow login button
    const authCodeLoginBtn = browser.$('#auth-code-login-btn');
    authCodeLoginBtn.click();

    // Get handles to the main window and the popup, switch to popup
    const [mainHandle, popupHandle] = browser.getWindowHandles();
    browser.switchToWindow(popupHandle);

    // Fill-in the login form and submit
    const emailField = browser.$('#emailField');
    emailField.setValue('peggy@example.com');
    const passField = browser.$('#passwordField');
    passField.setValue('pass');
    const loginBtn = browser.$('#login-btn');
    loginBtn.click();

    // Click the Allow button on the OAuth2 consent screen
    const allowAppBtn = browser.$('#allow-btn');
    allowAppBtn.click();

    // Switch back to main window and wait for Ajax request completion
    browser.switchToWindow(mainHandle);
    browser.pause(600);
    const images = browser.$$('img');

    // after OAuth2 login, we query a token-protected endpoint
    // to get the user's data, and display his/her picture
    assert.strictEqual(images.length, 1);
  });
});
