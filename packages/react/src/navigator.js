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
  if (!screens[name]) {
    throw new Error(`No screen registered for '${name}'. Did you forget to create and then import screen on your main app ?`);
  }

  return screens[name];
}

function createNavigator(): Navigator {
  const currentRoutes = [];
  let viewPort = null;

  function updateViewPort() {
    const route = currentRoutes[currentRoutes.length - 1];

    // Resort to home screen (null path) if no route found
    if (viewPort) {
      const Screen = route ? getScreen(route.name) : null;
      viewPort.updateScreen(Screen, route && route.props);
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

    /**
     * Go back to a screen on the stack that matches
     * the given name
     */
    popTo: (name) => {
      // Iterate through the entire list until there are
      // any routes remaining or until a route with the
      // given name is found
      while (
        currentRoutes.length > 0
        && currentRoutes[currentRoutes.length - 1].name !== name
      ) {
        currentRoutes.pop();
      }
      updateViewPort();
    },
  };
}

// Create the global navigator
export default createNavigator();
