import { toParams, toQuery } from './utils';

class PopupWindow {
  constructor(id, url, popupOptions = {}, otherOptions = {}) {
    this.id = id;
    this.url = url;
    this.popupOptions = popupOptions;
    this.locationKey = otherOptions.locationKey;
  }

  open() {
    const { url, id, popupOptions } = this;

    this.window = window.open(url, id, toQuery(popupOptions, ','));
  }

  close() {
    this.cancel();
    this.window.close();
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
        } catch (error) {
          /*
           * Ignore DOMException: Blocked a frame with origin from accessing a
           * cross-origin frame.
           */
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
