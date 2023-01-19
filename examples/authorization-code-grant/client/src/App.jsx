import AuthorizationCodeExample from './AuthorizationCodeExample';
import AuthorizationCodeHeadless from './AuthorizationCodeHeadless';

import './App.css';

function App() {
  return (
    <div className="App">
      <h1>Authorization Code flow example</h1>
      <p>
        If you&#39;re using this example &#34;out of the box&#34;, without
        overriding the values in <code>.env</code> by a <code>.env.local</code>{' '}
        file, you&#39;ll need to start the &#34;test OAuth2 server&#34;.
      </p>
      <div className="row">
        <div className="column">
          <h2>Component-based</h2>
          <AuthorizationCodeExample />
        </div>
        <div className="column">
          <h2>Hook-based (&#34;headless&#34;)</h2>
          <AuthorizationCodeHeadless />
        </div>
      </div>
    </div>
  );
}

export default App;
