import navigator from '../src/navigator';

describe('navigator specification', () => {
  it('check basic navigator specification', () => {
    expect(navigator.getRoutes()).toHaveLength(0);

    const routes = [
      { name: 'home', props: {} },
      { name: 'about', props: { p1: '1' } },
      { name: 'inner', props: { v: true } },
    ];

    // routes can be pushed with just a name
    navigator.push(routes[0].name);
    expect(navigator.getRoutes()).toHaveLength(1);
    expect(navigator.getRoutes()).toEqual(routes.slice(0, 1));

    // or additional props
    navigator.push(routes[1].name, routes[1].props);
    expect(navigator.getRoutes()).toHaveLength(2);
    expect(navigator.getRoutes()).toEqual(routes.slice(0, 2));
    navigator.push(routes[2].name, routes[2].props);
    expect(navigator.getRoutes()).toEqual(routes);

    // navigator can pop back to anywhere on the stack
    navigator.popTo('home');
    expect(navigator.getRoutes()).toEqual(routes.slice(0, 1));

    navigator.pop();
    expect(navigator.getRoutes()).toHaveLength(0);

    // Pop can be called even when the stack is empty
    navigator.pop();
    expect(navigator.getRoutes()).toHaveLength(0);
  });
});
