// @flow
import { Component } from 'react';
import type ViewPort from './ViewPort';

export type Navigator = {
  registerViewPort: (ViewPort) => void;
  push: (name: string, props: {}) => void,
  pop: () => false | string,
};

// All the screens that are available to the app
const screens: {[string]: Class<Component<*, *>>} = {};

export function createScreen(name: string, Screen: Class<Component<*, *>>) {
  if (screens[name]) {
    throw new Error(`Screen already registered at ${name}`);
  }

  screens[name] = Screen;
  return Screen;
}

export function getScreen(name: string): Class<Component<*, *>> {
  return screens[name];
}

function createNavigator(): Navigator {
  const currentRoutes = [];
  let viewPort = null;

  function updateViewPort() {
    const route = currentRoutes[currentRoutes.length - 1];
    if (route) {
      const Screen = getScreen(route.name);

      if (viewPort) {
        viewPort.updateScreen(Screen, route.props);
      }
    }
  }

  return {
    registerViewPort: (instance: ViewPort) => {
      if (viewPort !== null) {
        throw new Error('View port is already registered');
      }

      viewPort = instance;
    },

    push: (name: string, props?: {} = {}) => {
      currentRoutes.push({
        name,
        props,
      });
      updateViewPort();
    },

    pop: () => {
      if (currentRoutes.length === 0) {
        return false;
      }

      const removed = currentRoutes.pop();
      updateViewPort();
      return removed.name;
    },
  };
}

// Create the global navigator
export default createNavigator();
