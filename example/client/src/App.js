import React from 'react';
import ImplicitGrantExample from './ImplicitGrantExample';
import PKCEExample from './PKCEExample';
import AuthorizationCodeExample from './AuthorizationCodeExample';

const onFailure = response => console.error(response);

export default function App() {
  return (
    <div className="App">
      <ImplicitGrantExample />
      <PKCEExample />
      <AuthorizationCodeExample />
    </div>
  );
}
