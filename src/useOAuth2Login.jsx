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
        return onFailure && onFailure(new Error(`'${responseKey}' not found in received data`));
      }

      return onSuccess && onSuccess(data);
    }

    function handleFailure(error) {
      if (onFailure) {
        onFailure(error);
      }
    }

    const payload = {
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: responseType,
      ...extraParams,
    };

    if (state) {
      payload.state = state;
    }
    if (scope) {
      payload.scope = scope;
    }
    const search = toQuery(payload);
    const width = popupWidth;
    const height = popupHeight;
    const left = window.screenX + ((window.outerWidth - width) / 2);
    const top = window.screenY + ((window.outerHeight - height) / 2.5);
    const locationKey = responseTypeLocationKeys[responseType];

    const popup = PopupWindow.open(
      popupName,
      `${authorizationUrl}?${search}`,
      {
        height, width, top, left,
      },
      {
        locationKey,
        isCrossOrigin,
      },
    );

    handleRequest();

    popup
      .then(handleSuccess)
      .catch(handleFailure);
  }

  return {
    activate,
  };
}

export default useOAuth2Login;
