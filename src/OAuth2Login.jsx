import React, { Component } from 'react';
import PropTypes from 'prop-types';

import PopupWindow from './PopupWindow';
import { toQuery, generateRandomString, pkceChallengeFromVerifier } from './utils';

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

  async onBtnClick() {
    const {
      buttonText,
      authorizationUrl,
      tokenUrl,
      clientId,
      scope,
      redirectUri,
      state,
      responseType,
      popupWidth,
      popupHeight,
      isCrossOrigin,
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
    if (tokenUrl) {
      const pkceState = generateRandomString();
      localStorage.setItem('pkce_state', pkceState);

      // Create and store a new PKCE code_verifier (the plaintext random secret)
      const pkceCodeVerifier = generateRandomString();
      localStorage.setItem('pkce_code_verifier', pkceCodeVerifier);

      // Hash and base64-urlencode the secret to use as the challenge
      const codeChallenge = await pkceChallengeFromVerifier(pkceCodeVerifier);
      payload.code_challenge = codeChallenge;
      payload.code_challenge_method = 'S256';
    }
    const search = toQuery(payload);
    const width = popupWidth;
    const height = popupHeight;
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
        isCrossOrigin,
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
    const {
      responseType, onSuccess, isCrossOrigin, tokenUrl,
    } = this.props;
    const responseKey = responseTypeDataKeys[responseType];

    // Cross origin requests will already handle this, let's just return the data
    if (!isCrossOrigin && !data[responseKey]) {
      console.error('received data', data);
      return this.onFailure(new Error(`'${responseKey}' not found in received data`));
    }

    if (tokenUrl) {
      return this.requestsAccessToken(data.code);
    }

    return onSuccess(data);
  }

  onFailure(error) {
    const { onFailure } = this.props;
    onFailure(error);
  }

  requestsAccessToken(code) {
    const {
      clientId, redirectUri, tokenUrl, onSuccess, onFailure,
    } = this.props;
    const payload = {
      grant_type: 'authorization_code',
      code,
      client_id: clientId,
      redirect_uri: redirectUri,
      code_verifier: localStorage.getItem('pkce_code_verifier'),
    };
    fetch(tokenUrl, {
      method: 'POST',
      body: toQuery(payload),
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Could not get access token: ${res.status} -  ${res.statusText}`);
        }
        return res.json();
      })
      .then(onSuccess)
      .catch(onFailure);
  }

  render() {
    const {
      id, className, buttonText, children, render,
    } = this.props;

    if (render) {
      return render({
        className, buttonText, children, onClick: this.onBtnClick,
      });
    }
    const attrs = { onClick: this.onBtnClick };
    if (id) {
      attrs.id = id;
    }
    if (className) {
      attrs.className = className;
    }
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <button type="button" {...attrs}>{ children || buttonText }</button>;
  }
}

OAuth2Login.defaultProps = {
  id: undefined,
  buttonText: 'Login',
  scope: '',
  state: '',
  className: '',
  children: null,
  popupWidth: 680,
  popupHeight: 680,
  render: null,
  isCrossOrigin: false,
  onRequest: () => {},
  tokenUrl: '',
};

OAuth2Login.propTypes = {
  id: PropTypes.string,
  authorizationUrl: PropTypes.string.isRequired,
  tokenUrl: PropTypes.string,
  clientId: PropTypes.string.isRequired,
  redirectUri: PropTypes.string.isRequired,
  responseType: PropTypes.oneOf(['code', 'token']).isRequired,
  onSuccess: PropTypes.func.isRequired,
  onFailure: PropTypes.func.isRequired,
  buttonText: PropTypes.string,
  children: PropTypes.node,
  popupWidth: PropTypes.number,
  popupHeight: PropTypes.number,
  className: PropTypes.string,
  render: PropTypes.func,
  isCrossOrigin: PropTypes.bool,
  onRequest: PropTypes.func,
  scope: PropTypes.string,
  state: PropTypes.string,
};

export default OAuth2Login;
