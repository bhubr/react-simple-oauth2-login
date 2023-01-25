import PopupWindow from './PopupWindow';
import { toQuery } from './utils';

const responseTypeDataKeys = {
  code: 'code',
  token: 'access_token',
};

function useOAuth2Login(options) {
  const {
    authorizationUrl,
    clientId,
    scope,
    redirectUri,
    state,
    responseType,
    popupWidth,
    popupHeight,
    popupName,
    isCrossOrigin,
    extraParams,
    onFailure,
    onSuccess,
    onRequest,
  } = options;

  function activate() {
    function handleRequest() {
      if (onRequest) {
        onRequest();
      }
    }

    function handleSuccess(data) {
      const responseKey = responseTypeDataKeys[responseType];

      // Cross origin requests will already handle this, let's just return the data
      if (!isCrossOrigin && !data[responseKey]) {
        console.error('received data', data);
        return (
          onFailure &&
          onFailure(new Error(`'${responseKey}' not found in received data`))
        );
      }

      return onSuccess && onSuccess(data);
    }

    function handleFailure(error) {
      onFailure && onFailure(error);
    }

    const payload = {
      client_id: clientId,
      redirect_uri: encodeURIComponent(redirectUri),
      response_type: responseType,
      ...extraParams,
    };
    if (scope) {
      payload.scope = scope;
    }
    if (state) {
      payload.state = state;
    }
    const authorizationQueryString = toQuery(payload);
    const width = popupWidth;
    const height = popupHeight;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2.5;

    const popup = PopupWindow.open(
      popupName,
      `${authorizationUrl}?${authorizationQueryString}`,
      {
        height,
        width,
        top,
        left,
      },
      {
        responseType,
        isCrossOrigin,
      }
    );

    handleRequest();

    popup.then(handleSuccess).catch(handleFailure);
  }

  return {
    activate,
  };
}

export default useOAuth2Login;
