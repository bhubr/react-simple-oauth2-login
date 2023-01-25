import ErrorAlert from './ErrorAlert';

export default function MissingParamsAlert() {
  return (
    <ErrorAlert
      error={{
        message:
          'Missing at least one of `authorizationUrl`, `clientId`, `redirectUri`',
      }}
    />
  );
}
