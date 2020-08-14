import React from 'react';
import OAuth2Login from '../OAuth2Login.jsx';
import PopupWindow from '../PopupWindow.js';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

test('Renders defaults', () => {
  const component = renderer.create(
    <OAuth2Login clientId="foo" redirectUri="http://foo.test/auth/OAuth2" />,
  );
  const tree = component.toJSON();

  expect(tree).toMatchSnapshot();
});

test('Renders with `className`', () => {
  const component = renderer.create(
    <OAuth2Login clientId="foo" redirectUri="http://foo.test/auth/OAuth2" className="foobar" />,
  );
  const tree = component.toJSON();

  expect(tree).toMatchSnapshot();
});

test('Renders with `buttonText`', () => {
  const component = renderer.create(
    <OAuth2Login clientId="foo" redirectUri="http://foo.test/auth/OAuth2" buttonText="Foo" />,
  );
  const tree = component.toJSON();

  expect(tree).toMatchSnapshot();
});

test('Opens OAuth dialog', () => {
  const clientId = 'foo';
  const redirectUri = 'http://foo.test/auth/OAuth2';

  const component = (
    <OAuth2Login clientId={clientId} redirectUri={redirectUri} />
  );
  const wrapper = shallow(component);

  wrapper.find('button').simulate('click');

  const query = `client_id=${clientId}&scope=user-read-private&redirect_uri=${redirectUri}&response_type=code`;

  expect(wrapper.instance().popup.url).toBe(
    `https://foo.test/authorize?${query}`,
  );
});
