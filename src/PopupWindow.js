import { toParams, toQuery } from './utils';

class PopupWindow {
  constructor(id, url, popupOptions = {}, otherOptions = {}) {
    this.id = id;
    this.url = url;
    this.popupOptions = popupOptions;
    this.locationKey = otherOptions.locationKey;
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
    const {
      url, id, popupOptions, isCrossOrigin,
    } = this;

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
            if (popup.location.href === this.url || popup.location.pathname === 'blank') {
              // location unchanged, still polling
              return;
            }
            if (!['search', 'hash'].includes(this.locationKey)) {
              reject(new Error(`Cannot get data from location.${this.locationKey}, check the responseType prop`));
              this.close();
              return;
            }

            const locationValue = popup.location[this.locationKey];
            const params = toParams(locationValue);
            resolve(params);
            this.close();
          }
        } catch (error) {
          // Log the error to the console but remain silent
          if (error.name === 'SecurityError' && error.message.includes('Blocked a frame with origin')) {
            console.warn('Encountered a cross-origin error, is your authorization URL on a different server? Use the "isCrossOrigin" property, see documentation for details.');
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
