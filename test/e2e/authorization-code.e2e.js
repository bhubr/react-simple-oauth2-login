/* global browser */
const assert = require('assert');
const jwtDwcode = require('jwt-decode');

const testCases = [
  {
    label: 'Component-based example',
    identifier: 'component',
  },
  {
    label: 'Hook-based (headless) example',
    identifier: 'headless',
  },
];

describe('Authorization Code flow', () => {
  testCases.forEach(({ label, identifier }) => {
    it(label, async () => {
      const idBase = `#authorization-code-${identifier}`;

      // Get to Implicit Grant example URL
      await browser.url('http://localhost:5174');
      await browser.pause(500);

      // Click the authorization code flow login button
      await browser.$(`${idBase}-btn`).click();

      // Get handles to the main window and the popup, switch to popup
      const windowHandles = await browser.getWindowHandles();
      if (!windowHandles || windowHandles.length < 2) {
        throw new Error('Unable to get window&popup handles');
      }
      const [mainHandle, popupHandle] = windowHandles;
      await browser.switchToWindow(popupHandle);

      // Fill-in the login form and submit
      const emailField = await browser.$('#emailField');
      emailField.setValue('dwight@example.com');
      const passField = await browser.$('#passwordField');
      passField.setValue('pass');
      const loginBtn = await browser.$('#login-btn');
      await browser.pause(200);
      loginBtn.click();
      await browser.pause(200);

      // Click the Allow button on the OAuth2 consent screen
      const allowAppBtn = await browser.$('#allow-btn');
      allowAppBtn.click();
      await browser.pause(200);

      // Switch back to main window and wait for Ajax request completion
      await browser.switchToWindow(mainHandle);
      await browser.pause(400);
      const accessTokenSpan = await browser.$(`${idBase}-token`);
      if (accessTokenSpan.error) {
        throw new Error('Could not find span containing access token');
      }
      const accessToken = await accessTokenSpan.getText();
      const accessTokenPayload = jwtDwcode(accessToken);

      assert.strictEqual(accessTokenPayload.sub, 'uuid-0002');
      assert.strictEqual(accessTokenPayload.scope, 'user-email');

      // // after OAuth2 login, we query a token-protected endpoint
      // // to get the user's data, and display his/her picture
      // assert.strictEqual(images.length, 1);

      await browser.url('http://localhost:4000/auth/logout');
    });
  });
});
