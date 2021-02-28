# css-example

Study CSS by some examples

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Responsive App

I use the [include-media](https://github.com/eduardoboucas/include-media) to write CSS media queries.

## Routers

See different examples by urls.

### /flex-box

See flex examples.

#### Grid tutorial

- Grid Container – The element that establishes the grid and that wraps the grid items
- Grid Items – The child elements inside a grid container
- Grid Lines – Horizontal and vertical lines that divide the grid
- Grid Tracks – Any grid column or row (i.e. what’s between grid lines)
- Grid Cell – A single cell, like in a table, where a column and row intersects
- Grid Area – Any rectangular area of one or more cells, bound by four grid lines

##### Grid container

- Contents comprise a grid, with grid lines forming boundaries around each grid area
- The following properties have no effect on grid items: *float*, *clear*, *vertical-align*
- Margins don’t collapse inside a grid container

## React Knowledge

### Unsafe lifetime functions after updating on async rendering

#### unsafe_componentWillMount

*ComponentWillMount* maybe called many times.<br />
Only once *componentDidMount* has been called does React guarantee that *componentWillUnmount* will later be called for clean up.

- initializing state: move state initialization to the constructor or to a property initializer
- fetching data: move to *componentDidMount*
- adding event listener: move to *componentDidMount* or *[create-subscription](https://github.com/facebook/react/tree/master/packages/create-subscription)*

#### unsafe_componentWillReceiveProps

- updating state based on props: move to *static getDerivedStateFromProps(props, state)*, which is called when a component is created and each time it re-renders due to changes to props or state
- side effects changed: move to *componentDidUpdate*
- fetching external data when props change: move to *static getDerivedStateFromProps(props, state)* which return null state and *componentDidUpdate* which fetch data

#### unsafe_componentWillUpdate

*ComponentWillUpdate* might get called multiple times for a single update.<br />
React ensures that any *setState* calls that happen during *componentDidMount* and *componentDidUpdate* are flushed before the user sees the updated UI.<br />
There may be delays between “render” phase lifecycles (like *componentWillUpdate* and *render*) and “commit” phase lifecycles (like *componentDidUpdate*).

- invoking external callbacks: move to *componentDidUpdate*
- reading DOM properties before an update: move to *getSnapshotBeforeUpdate(prevProps, prevState)*

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
