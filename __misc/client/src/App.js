import React from 'react';
import ImplicitGrantExample from './ImplicitGrantExample';
import AuthorizationCodeExample from './AuthorizationCodeExample';

const onFailure = response => console.error(response);

export default function App() {
  return (
    <div className="App">
      <ImplicitGrantExample />
      <AuthorizationCodeExample />
    </div>
  );
}
