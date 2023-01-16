import React from 'react';
import { render, screen } from '@testing-library/react';

import OAuth2Login from '../OAuth2Login';

const authorizationUrl = 'https://foo.test/authorize';
const onSuccess = () => {};
const onFailure = () => {};

// lazy way to circumvent jsdom's `Error: Not implemented: window.open`
window.open = () => {};

// test('has correct welcome text', () => {
//   const wrapper = shallow(<Welcome firstName="John" lastName="Doe" />)
//   expect(wrapper.find('h1').text()).toEqual('Welcome, John Doe')
// })

// test('has correct welcome text', () => {
//   render(<Welcome firstName="John" lastName="Doe" />)
//   expect(screen.getByRole('heading')).toHaveTextContent('Welcome, John Doe')
// })

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
  expect(screen.getByText('Login')).toMatchSnapshot();
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
  expect(screen.getByText('Login')).toMatchSnapshot();
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
  expect(screen.getByText('Foo')).toMatchSnapshot();
});

test('Renders with custom render function', () => {
  const { container } = render(
    <OAuth2Login
      onSuccess={onSuccess}
      onFailure={onFailure}
      authorizationUrl={authorizationUrl}
      clientId="foo"
      redirectUri="http://foo.test/auth/OAuth2"
      responseType="code"
      render={(renderProps) => (
        <div className={renderProps.className}>
          <a href="#" onClick={renderProps.onClick}>
            {renderProps.buttonText}
          </a>
        </div>
      )}
      className="theClassName"
    />
  );
  const button = container.querySelector('div');

  expect(button).toMatchSnapshot();
});

// xtest('Opens OAuth dialog', () => {
//   const clientId = 'foo';
//   const redirectUri = 'http://foo.test/auth/OAuth2';

//   const component = (
//     <OAuth2Login
//       onSuccess={onSuccess}
//       onFailure={onFailure}
//       authorizationUrl={authorizationUrl}
//       clientId={clientId}
//       redirectUri={redirectUri}
//       responseType="code"
//       scope="scope1 scope2"
//     />
//   );
//   const wrapper = shallow(component);

//   wrapper.find('button').simulate('click');

//   const query = `client_id=${clientId}&scope=scope1 scope2&redirect_uri=${redirectUri}&response_type=code`;

//   expect(wrapper.instance().popup.url).toBe(
//     `https://foo.test/authorize?${query}`
//   );
// });
