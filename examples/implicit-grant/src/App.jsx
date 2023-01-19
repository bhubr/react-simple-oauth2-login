import ImplicitGrantExample from './ImplicitGrantExample';
import ImplicitGrantHeadless from './ImplicitGrantHeadless';

import './App.css';

function App() {
  return (
    <div className="App">
      <h1>Implicit Grant flow example</h1>
      <p className="warning">
        ⚠️ Use of the Implicit Grant flow is <strong>discouraged</strong> (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://oauth.net/2/grant-types/implicit/"
        >
          why?
        </a>
        ).
      </p>
      <p>
        If you&#39;re using this example &#34;out of the box&#34;, without
        overriding the values in <code>.env</code> by a <code>.env.local</code>{' '}
        file, you&#39;ll need to start the &#34;test OAuth2 server&#34;.
      </p>
      <div className="row">
        <div className="column">
          <h2>Component-based</h2>
          <ImplicitGrantExample />
        </div>
        <div className="column">
          <h2>Hook-based (&#34;headless&#34;)</h2>
          <ImplicitGrantHeadless />
        </div>
      </div>
    </div>
  );
}

export default App;
