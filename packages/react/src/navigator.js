// @flow
import { Component } from 'react';
import type ViewPort from './ViewPort';

export type Navigator = {
  registerViewPort: (ViewPort) => void;
  push: (name: string, props: {}) => void,
  pop: () => false | string,
};

// The screens are kept globally and uniquely identified by their name
// There is no way to unregister a screen once its registered
const screens: {[string]: Class<Component<*, *>>} = {};

/**
 * Register screen in the app with the given React class. Do not use
 * functional component here, as the reference to the component would be
 * required for injecting route specific life cycle methods.
 *
 * @param {string} name The name to identify the screen throughout the app
 * @param {Class<Component>} Screen The Component class to be associted with the screen name
 */
export function createScreen(name: string, Screen: Class<Component<*, *>>) {
  if (screens[name]) {
    throw new Error(`Screen already registered at ${name}`);
  }

  screens[name] = Screen;
  return Screen;
}

/**
 * Get the Screen component class for the given name
 * @param {string} name
 */
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
