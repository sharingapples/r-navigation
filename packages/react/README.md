# r-navigation
A pure react navigation component

## Usage
```javascript
import { ViewPort } from 'r-navigation';

import './Home';    // Need to import the screens on main
import './About';   // otherwise they won't be registered

class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <ViewPort home="home" />
        <Footer />
      </div>
    );
  }
}

export default App;
```

```javascript
import React, { Component} from 'react';
import { navigator, createScreen } from 'r-navigation';

const Link = ({ to, props, ...other }) => (
  <a href="#" onClick={() => navigator.push(to, props)} {...other} />
);

class Home extends Component {
  render() {
    return (
      <div>Home
        <Link to="another" props={{ p:1, s: 'john' }}>About</Link>
      </div>
    );
  }
}

createScreen('home', Home);
```

```javascript
import React, { Component } from 'react';
import { navigator, createScreen } from 'r-navigation';

class About extends Component {
  render() {
    return (
      <div>
        <h3>About</h3>
        <button onClick={() => navigator.pop()}>Back</button>
      </div>
    );
  }
}

createScreen('about', About);
```