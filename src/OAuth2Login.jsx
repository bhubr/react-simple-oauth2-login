/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/button-has-type */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';

import useOAuth2Login from './useOAuth2Login';

function OAuth2Login(props) {
  const {
    id, className, buttonText, children, render, ...hookProps
  } = props;

  const { activate } = useOAuth2Login({
    ...hookProps,
    popupName: buttonText,
  });

  function handleClick() {
    activate();
  }

  if (render) {
    return render({
      className, buttonText, children, onClick: handleClick,
    });
  }

  const btnProps = {
    type: 'button',
    onClick: handleClick,
  };
  if (id) btnProps.id = id;
  if (className) btnProps.className = className;

  return (
    <button {...btnProps}>
      { children || buttonText }
    </button>
  );
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
  extraParams: {},
  onRequest: () => {},
};

OAuth2Login.propTypes = {
  id: PropTypes.string,
  authorizationUrl: PropTypes.string.isRequired,
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
  extraParams: PropTypes.object,
};

export default OAuth2Login;
