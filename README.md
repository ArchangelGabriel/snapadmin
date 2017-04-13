### Running the app on development mode
Make sure that you have the following software installed:
1. Node and NPM
2. MongoDB

```bash
git clone https://gitlab.com/snap123/snapadmin.git
cd snapadmin
npm install
npm start
```

### Structure of the app:
```javascript
| - app
  | - assets // Copy additional metronic files here
  | - controllers // Add your page controllers here
  | - directives
  | - services // api interfaced with cms and keystone
  | - templates // view templates
| - e2e-tests
| - tests
```

## Guides

### Adding a page to the app:

For example we want to add an `about` page,   
Do the following:
1. create `app/controllers/AboutController.js` and link it to index.html.
2. create `app/templates/about.html`.

Then add a route definition at `app/app.js`
```javascript
/*
 * For example you want to add an `about` page,
 * The templates/sidebar.html and templates/header.html already
 * exist  so you just have to add that in. If you want the content
 * to be fullscreen, remove nav and header keys in the about.views.
 */

/* <codes ommited for brevity> */

var about = {
  url: '/about',
  views: {
    nav: {
      templateUrl: 'templates/sidebar.html',
      controller: 'SidebarController'
    },
    content: {
      templateUrl: 'templates/about.html',
      controller: 'AboutController'
    },
    header: {
      templateUrl: 'templates/header.html',
      controller: 'HeaderController'
    }
  }
}

/*
 * At the end of the app.js file you will see a state  * declaration, it is where you will add in the state:
 */

$stateProvider
  .state('about', about);
```
