/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import OAuth2Login from '../OAuth2Login';

const authorizationUrl = 'https://foo.test/authorize';
const onSuccess = () => {};
const onFailure = () => {};

test('Renders defaults', () => {
  render(
    <OAuth2Login
      onSuccess={onSuccess}
      onFailure={onFailure}
      authorizationUrl={authorizationUrl}
      clientId="foo"
      redirectUri="http://foo.test/auth/OAuth2"
      responseType="code"
    />
  );

  expect(screen.getByRole('button')).toHaveTextContent('Login');
});

test('Renders with `className`', () => {
  render(
    <OAuth2Login
      onSuccess={onSuccess}
      onFailure={onFailure}
      authorizationUrl={authorizationUrl}
      clientId="foo"
      redirectUri="http://foo.test/auth/OAuth2"
      responseType="code"
      className="foobar"
    />
  );
  expect(screen.getByRole('button')).toHaveClass('foobar');
});

test('Renders with `buttonText`', () => {
  render(
    <OAuth2Login
      onSuccess={onSuccess}
      onFailure={onFailure}
      authorizationUrl={authorizationUrl}
      clientId="foo"
      redirectUri="http://foo.test/auth/OAuth2"
      responseType="code"
      buttonText="Foo"
    />
  );

  expect(screen.getByRole('button')).toHaveTextContent('Foo');
});

test('Renders with custom render function', () => {
  render(
    <OAuth2Login
      onSuccess={onSuccess}
      onFailure={onFailure}
      authorizationUrl={authorizationUrl}
      clientId="foo"
      redirectUri="http://foo.test/auth/OAuth2"
      responseType="code"
      render={(renderProps) => (
        <div className={renderProps.className}>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a href="#" onClick={renderProps.onClick}>
            {renderProps.buttonText}
          </a>
        </div>
      )}
    />
  );
  expect(screen.getByRole('link')).toHaveTextContent('Login');
});

test('Opens OAuth dialog', async () => {
  const mockWindowOpen = jest.fn();
  window.open = mockWindowOpen;

  const popupWidth = 640;
  const popupHeight = 720;
  render(
    <OAuth2Login
      onSuccess={onSuccess}
      onFailure={onFailure}
      authorizationUrl={authorizationUrl}
      clientId="foo"
      redirectUri="http://foo.test/auth/OAuth2"
      responseType="code"
      scope="scope1 scope2"
      popupWidth={popupWidth}
      popupHeight={popupHeight}
    />,
  );
  await userEvent.click(screen.getByRole('button'));

  const left = window.screenX + (window.outerWidth - popupWidth) / 2;
  const top = window.screenY + (window.outerHeight - popupHeight) / 2.5;
  const expectedGeometry = `height=${popupHeight},width=${popupWidth},top=${top},left=${left}`;

  // TODO: fix later - see https://github.com/bhubr/react-simple-oauth2-login/issues/22
  // const expectedUrl = 'https://foo.test/authorize?client_id=foo&scope=scope1%20scope2&redirect_uri=http%3A%2F%2Ffoo.test%2Fauth%2FOAuth2&response_type=code';
  const expectedUrl = 'https://foo.test/authorize?client_id=foo&scope=scope1'
    + ' scope2&redirect_uri=http://foo.test/auth/OAuth2&response_type=code';

  expect(mockWindowOpen).toHaveBeenCalledWith(
    expectedUrl,
    'Login',
    expectedGeometry,
  );
});
