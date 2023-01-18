/* eslint-disable no-restricted-syntax */
import { toParams, toQuery } from './utils';

class PopupWindow {
  constructor(id, url, popupOptions = {}, otherOptions = {}) {
    this.id = id;
    this.url = url;
    this.popupOptions = popupOptions;
    this.responseType = otherOptions.responseType;
    this.isCrossOrigin = otherOptions.isCrossOrigin;
    this.response = null;
    this.handlePostMessage = this.handlePostMessage.bind(this);
  }

  handlePostMessage(event) {
    if (event.data.message === 'deliverResult') {
      this.response = event.data.result;
    }
  }

  open() {
    const { url, id, popupOptions, isCrossOrigin } = this;

    if (isCrossOrigin) {
      window.addEventListener('message', this.handlePostMessage);
    }

    this.window = window.open(url, id, toQuery(popupOptions, ','));
  }

  close() {
    this.cancel();
    this.window.close();
    window.removeEventListener('message', this.handlePostMessage);
  }

  poll() {
    this.promise = new Promise((resolve, reject) => {
      this.iid = window.setInterval(() => {
        try {
          const popup = this.window;

          if (!popup || popup.closed !== false) {
            this.close();

            reject(new Error('The popup was closed for an unexpected reason'));

            return;
          }

          // Cross origin auth flows need to be handled differently
          if (this.isCrossOrigin) {
            if (this.response) {
              resolve(this.response);
              this.close();
            } else {
              popup.postMessage({ message: 'requestResult' }, '*');
              return;
            }
          } else {
            if (
              popup.location.href === this.url ||
              popup.location.pathname === 'blank'
            ) {
              // location unchanged, still polling
              return;
            }

            // Where should we look for the returned data in the redirected URL:
            // first from location.search, then from location.hash,
            // or the other way round.
            // OAuth2 RFC states that in Implicit Grant flow, the access token issued
            // by the server is delivered by "adding [...] parameters to the fragment
            // component of the redirection URI"
            // https://www.rfc-editor.org/rfc/rfc6749#section-4.2.2

            // However, some OAuth2 server implementations (such as ts-oauth2-server)
            // will return the data in the query string instead
            // So we search first in the "expected" part of the URL
            //   auth code => `search` (query string)
            //   implicit => `hash` (URI fragment)
            // And if we don't find the data in this expected part of the URL,
            // we search in the other one
            const searchFirst = this.responseType !== 'token';
            let locationKeys = ['search', 'hash'];
            if (!searchFirst) {
              locationKeys = locationKeys.reverse();
            }
            // Lookup returned data in search & hash and exit if data is found
            for (const locationKey of locationKeys) {
              const locationValue = popup.location[locationKey];
              if (locationValue) {
                const params = toParams(locationValue);
                resolve(params);
                this.close();
                break;
              }
            }
            reject(new Error("No data found in redirect URI's search or hash"));
            this.close();
          }
        } catch (error) {
          // Log the error to the console but remain silent
          if (
            error.name === 'SecurityError' &&
            error.message.includes('Blocked a frame with origin')
          ) {
            console.warn(
              'Encountered a cross-origin error, is your authorization URL on a different server? Use the "isCrossOrigin" property, see documentation for details.'
            );
          } else {
            console.error(error);
          }
        }
      }, 500);
    });
  }

  cancel() {
    if (this.iid) {
      window.clearInterval(this.iid);
      this.iid = null;
    }
  }

  then(...args) {
    return this.promise.then(...args);
  }

  catch(...args) {
    return this.promise.catch(...args);
  }

  static open(...args) {
    const popup = new this(...args);

    popup.open();
    popup.poll();

    return popup;
  }
}

export default PopupWindow;
