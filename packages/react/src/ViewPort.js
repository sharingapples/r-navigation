// @flow
import React, { Component } from 'react';
import navigator, { getScreen } from './navigator';

type Props = {
  home: string,
};

type State = {
  Screen: null | Class<Component<*>>,
  extraProps: {},
};

class ViewPort extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      Screen: null,
      extraProps: {},
    };
  }

  updateScreen(Screen: Class<Component<*, *>> | null, extraProps: {} = {}) {
    this.setState({
      Screen,
      extraProps,
    });
  }

  componentDidMount() {
    navigator.registerViewPort(this);
  }

  componentWillUnmount() {
    navigator.unregisterViewPort(this);
  }

  render() {
    const { Screen, extraProps } = this.state;
    const { home, ...other } = this.props;

    if (Screen !== null) {
      return <Screen {...extraProps} />;
    }

    const HomeScreen = getScreen(home);
    return <HomeScreen {...other} />;
  }
}

export default ViewPort;
