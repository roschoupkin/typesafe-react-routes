# typesafe-react-routes

A set of types and utility functions to simplify routing using types in react-router.
Inspired by [typesafe-react-router](https://github.com/AveroLLC/typesafe-react-router).

This package will protect your project from incorrect route declaration.

## Installation

```bash
npm install typesafe-react-routes
```

## Motivation

- Typifies give necessary type for a route and errors with incorrect usage
- Allows you to specify query parameters that should be used inside the route
- Allows you not to forget named parameters, will work out the TypeScript error when creating
- You can add a new section of route with `extendWith` and create routes tree (or something like)
- You can add the required query params with `withQueryParams` to protect list pages with required params

## API

This package presents only two methods `route` and `param`

### `param()`

A method to separate static parts of route and dynamic:

```tsx
import { route, param } from 'typesafe-react-routes';

route('item', param('id')); // Static part – item, dynamic part – id
route('item', param('category'), param('id')); // Static part – item, dynamic parts – id and category
```

### `route()`

The main method to create a typesafe route in react-router
Includes methods `withQueryParams`, `extendWith`, `create` and `template`

#### `withQueryParams()`

Add required query params to your route:

```tsx
import { route } from 'typesafe-react-routes';

route('item').withQueryParams('id'); // Now you should set query param 'id' for this route
route('items').withQueryParams('page'); // Now you should set query param 'page' for this route
```

#### `extendWith()`

Allows you to create several routes from one parent (base) route:

```tsx
import { route, param } from 'typesafe-react-routes';

const items = route('items'); // Base route
const edit = items.extendWith(param('id')); // Extended route for edit page
const list = items.extendWith(param('tab')); // Extended route for list page
```

#### `create()`

Protect you from incorrect route declaration:

```tsx
import { route, param } from 'typesafe-react-routes';

route('item').create({}); // No errors

route('item', param('id')).create({}); // Error, forget param id
route('item', param('id')).create({ id: '1' }); // Correct route creation

route('item').withQueryParams('id').create({}); // Error, forget query param id
route('item').withQueryParams('id').create({}, { id: 1 }); // Correct route creation
```

#### `template()`

Return a template for routing for `Route` or `Redirect` component for example:

```tsx
import { route, param } from 'typesafe-react-routes';

route('item').template(); // Returns /item
route('item', param('id')).template(); // Returns /item/:id
route('item').withQueryParams('id').template(); // Returns /item
```

## Example of usage

### Initialize routes

```tsx
import { route, param } from 'typesafe-react-routes';

const items = route('items');
const itemsEdit = items.extendWith(param('id'));
const itemsList = route('items', param('tab')).withQueryParams('page');
```

### Usage in react-router

- `items.template()` converts to _/items_
- `itemsEdit.template()` converts to _/items/:id_
- `itemsList.template()` converts to _/items/:tab_

```tsx
import { Route, Redirect, Switch } from 'react-router-dom';

<Switch>
  <Route path={itemsList.template()} component={ListPage} />
  <Route path={itemsEdit.template()} component={EditPage} />

  <Redirect path={items.template()} to={itemsList.create({ tab: 'some_tab' })} />
</Switch>;
```

### Usage in links

- `items.create({})` converts to _/items_
  - No errors, it's a simple route without params or query
- `itemsEdit.create({ id: '1' })` converts to _/items/1_
  - You'll have an error for required part `id`
- `itemsList.create({ tab: 'some_tab' }, { page: 1 })` converts to _/items/some_tab?page=1_
  - You'll have errors for required part `tab` and required query param `page`

```tsx
<a href={items.create({})}>Root</a>
<a href={itemsEdit.create({ id: '1' })}>Edit</a>
<a href={itemsList.create({ component: 'tab' }, { page: '1' })}>List</a>
```
