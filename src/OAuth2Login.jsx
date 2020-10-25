import React, { Component } from 'react';
import PropTypes from 'prop-types';

import PopupWindow from './PopupWindow';
import { toQuery } from './utils';

const responseTypeLocationKeys = {
  code: 'search',
  token: 'hash',
};

const responseTypeDataKeys = {
  code: 'code',
  token: 'access_token',
};

class OAuth2Login extends Component {
  constructor(props) {
    super(props);
    this.onBtnClick = this.onBtnClick.bind(this);
    this.onRequest = this.onRequest.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
    this.onFailure = this.onFailure.bind(this);
  }

  onBtnClick() {
    const {
      buttonText, authorizationUrl, clientId, scope, redirectUri, state, responseType,
    } = this.props;
    const payload = {
      client_id: clientId,
      scope,
      redirect_uri: redirectUri,
      response_type: responseType,
    };
    if (state) {
      payload.state = state;
    }
    const search = toQuery(payload);
    const width = 680;
    const height = 440;
    const left = window.screenX + ((window.outerWidth - width) / 2);
    const top = window.screenY + ((window.outerHeight - height) / 2.5);
    const locationKey = responseTypeLocationKeys[responseType];
    const popup = PopupWindow.open(
      buttonText,
      `${authorizationUrl}?${search}`,
      {
        height, width, top, left,
      },
      {
        locationKey,
      },
    );
    this.popup = popup;

    this.onRequest();
    popup
      .then(this.onSuccess)
      .catch(this.onFailure);
  }

  onRequest() {
    const { onRequest } = this.props;
    onRequest();
  }

  onSuccess(data) {
    const { responseType, onSuccess } = this.props;
    const responseKey = responseTypeDataKeys[responseType];
    if (!data[responseKey]) {
      console.error('received data', data);
      return this.onFailure(new Error(`'${responseKey}' not found in received data`));
    }

    return onSuccess(data);
  }

  onFailure(error) {
    const { onFailure } = this.props;
    onFailure(error);
  }

  render() {
    const { className, buttonText, children } = this.props;
    const attrs = { onClick: this.onBtnClick };

    if (className) {
      attrs.className = className;
    }

    // eslint-disable-next-line react/jsx-props-no-spreading
    return <button type="button" {...attrs}>{ children || buttonText }</button>;
  }
}

OAuth2Login.defaultProps = {
  buttonText: 'Login',
  scope: '',
  state: '',
  className: '',
  children: null,
  onRequest: () => {},
};

OAuth2Login.propTypes = {
  authorizationUrl: PropTypes.string.isRequired,
  clientId: PropTypes.string.isRequired,
  redirectUri: PropTypes.string.isRequired,
  responseType: PropTypes.oneOf(['code', 'token']).isRequired,
  onSuccess: PropTypes.func.isRequired,
  onFailure: PropTypes.func.isRequired,
  buttonText: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  onRequest: PropTypes.func,
  scope: PropTypes.string,
  state: PropTypes.string,
};

export default OAuth2Login;
