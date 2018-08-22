# r-navigation
A pure react navigation component

## Usage
```javascript
import { Navigation, ViewPort } from 'r-navigation';

class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <ViewPort home="one" />
        <Footer />
      </div>
    );
  }
}

export default App;
```

```javascript
import { navigator, createScreen } from 'r-navigation';

const Link = ({ to, extra, ...other }) => (
  <a href="#" onClick={() => navigator.push(to, extra)} {...other} />
);

class ScreenOne extends Component {
  render() {
    return (
      <div>Your screen
        <Link to="another">Another Screen</Link>
      </div>
    );
  }
}

createScreen('one', ScreenOne);
```

