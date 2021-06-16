import React from 'react';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { shallow } from 'enzyme';
import OAuth2Login from '../OAuth2Login.jsx';

Enzyme.configure({ adapter: new Adapter() });

const authorizationUrl = 'https://foo.test/authorize';
const onSuccess = () => {};
const onFailure = () => {};

// lazy way to circumvent jsdom's `Error: Not implemented: window.open`
window.open = () => {};

test('Renders defaults', () => {
  const component = renderer.create(
    <OAuth2Login
      onSuccess={onSuccess}
      onFailure={onFailure}
      authorizationUrl={authorizationUrl}
      clientId="foo"
      redirectUri="http://foo.test/auth/OAuth2"
      responseType="code"
    />,
  );
  const tree = component.toJSON();

  expect(tree).toMatchSnapshot();
});

test('Renders with `className`', () => {
  const component = renderer.create(
    <OAuth2Login
      onSuccess={onSuccess}
      onFailure={onFailure}
      authorizationUrl={authorizationUrl}
      clientId="foo"
      redirectUri="http://foo.test/auth/OAuth2"
      responseType="code"
      className="foobar"
    />,
  );
  const tree = component.toJSON();

  expect(tree).toMatchSnapshot();
});

test('Renders with `buttonText`', () => {
  const component = renderer.create(
    <OAuth2Login
      onSuccess={onSuccess}
      onFailure={onFailure}
      authorizationUrl={authorizationUrl}
      clientId="foo"
      redirectUri="http://foo.test/auth/OAuth2"
      responseType="code"
      buttonText="Foo"
    />,
  );
  const tree = component.toJSON();

  expect(tree).toMatchSnapshot();
});

test('Renders with custom render function', () => {
  const component = renderer.create(
    <OAuth2Login
      onSuccess={onSuccess}
      onFailure={onFailure}
      authorizationUrl={authorizationUrl}
      clientId="foo"
      redirectUri="http://foo.test/auth/OAuth2"
      responseType="code"
      render={(renderProps) => (
        <div className={renderProps.className}>
          <a href onClick={renderProps.onClick}>
            {renderProps.buttonText}
          </a>
        </div>
      )}
    />,
  );
  const tree = component.toJSON();

  expect(tree).toMatchSnapshot();
});

test('Opens OAuth dialog', () => {
  const clientId = 'foo';
  const redirectUri = 'http://foo.test/auth/OAuth2';

  const component = (
    <OAuth2Login
      onSuccess={onSuccess}
      onFailure={onFailure}
      authorizationUrl={authorizationUrl}
      clientId={clientId}
      redirectUri={redirectUri}
      responseType="code"
      scope="scope1 scope2"
    />
  );
  const wrapper = shallow(component);

  wrapper.find('button').simulate('click');

  const query = `client_id=${clientId}&scope=scope1 scope2&redirect_uri=${redirectUri}&response_type=code`;

  expect(wrapper.instance().popup.url).toBe(
    `https://foo.test/authorize?${query}`,
  );
});
