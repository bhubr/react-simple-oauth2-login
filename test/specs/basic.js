// eslint-disable-next-line import/no-extraneous-dependencies
import { expect, browser, $ } from '@wdio/globals';

describe('webdriver.io page', () => {
  it('should have the right title', async () => {
    // Get to example client
    await browser.url('/');

    // Click the authorization code flow login button
    await $('#auth-code-login-btn').click();

    // Get handles to the main window and the popup, switch to popup
    const [mainHandle, popupHandle] = await browser.getWindowHandles();
    await browser.switchToWindow(popupHandle);

    // Fill-in the login form and submit
    await $('#emailField').setValue('peggy@example.com');
    await $('#passwordField').setValue('pass');
    await $('#login-btn').click();

    // Click the Allow button on the OAuth2 consent screen
    await $('#allow-btn').click();

    // Switch back to main window and wait for Ajax request completion
    await browser.switchToWindow(mainHandle);
    await browser.pause(600);
    const images = await browser.$$('img');

    // after OAuth2 login, we query a token-protected endpoint
    // to get the user's data, and display his/her picture
    expect(images.length).toBe(1);
  });
});
