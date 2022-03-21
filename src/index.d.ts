declare module 'react-simple-oauth2-login' {
  const OAuth2Login: React.FC<{
    id?: string,
    authorizationUrl: string,
    clientId: string,
    redirectUri: string,
    responseType: 'code' | 'token',
    onSuccess?: (data: Record<string, any>) => void,
    onFailure?: (err: Error) => void,
    buttonText?: string,
    children?: React.ReactChildren,
    popupWidth?: number,
    popupHeight?: number,
    className?: string,
    render?: (props: {
      className: string,
      buttonText: string,
      children: React.ReactChildren,
    }) => void,
    isCrossOrigin?: boolean,
    onRequest?: () => void,
    scope?: string,
    state?: string,
    extraParams?: Record<string, any>
  }>

  export = OAuth2Login
}