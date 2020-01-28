import React, { Component } from 'react';
import PropTypes from 'prop-types';

import PopupWindow from './PopupWindow';
import { toQuery } from './utils';

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
      buttonText, authorizationUrl, clientId, scope, provider, redirectUri,
    } = this.props;
    const search = toQuery({
      client_id: clientId,
      scope,
      redirect_uri: redirectUri,
      response_type: 'code',
    });
    const width = 680;
    const height = 440;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2.5;
    const popup = PopupWindow.open(
      buttonText,
      `${authorizationUrl}?${search}`,
      {
        height, width, top, left,
      },
    );
    this.popup = popup;

    this.onRequest();
    popup.then(
      (data) => this.onSuccess({ ...data, provider }),
      (error) => this.onFailure(error),
    );
  }

  onRequest() {
    const { onRequest } = this.props;
    onRequest();
  }

  onSuccess(data) {
    if (!data.code) {
      return this.onFailure(new Error('\'code\' not found'));
    }

    const { onSuccess } = this.props;
    return onSuccess(data);
  }

  onFailure(error) {
    const { onRequest } = this.props;
    onRequest(error);
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
  scope: '',
  onRequest: () => {},
};

OAuth2Login.propTypes = {
  buttonText: PropTypes.string.isRequired,
  authorizationUrl: PropTypes.string.isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
  clientId: PropTypes.string.isRequired,
  onRequest: PropTypes.func,
  onSuccess: PropTypes.func.isRequired,
  onFailure: PropTypes.func.isRequired,
  provider: PropTypes.string.isRequired,
  redirectUri: PropTypes.string.isRequired,
  scope: PropTypes.string,
};

export default OAuth2Login;
