'use strict';

var snapadmin = angular.module('snapadmin', [
  'ui.router',
  'oc.lazyLoad',
  'ngSanitize',
  'ng-token-auth',
  'ngFileUpload'
])

// TODO: separate this filter
.filter('moment', function() {
  return function (input, momentFn /*, param1, param2, ...param n */) {
    var args = Array.prototype.slice.call(arguments, 2),
        momentObj = moment(input);
    return momentObj[momentFn].apply(momentObj, args);
  };
})

.filter('firstKey', function() {
  return function(input) {
    return Object.keys(input)[0];
  }
})

.factory('settings', ['$rootScope', '$http', '$state', function($rootScope, $http, $state) {
  $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
    $state.go('login');
  });

  var settings = {
    layout: {
      pageSidebarClosed: false,
      pageContentWhite: true,
      pageBodySolid: false,
      pageAutoScrollOnLoad: 1000
    },
    imagePath: 'https://snaplar.blob.core.windows.net/image/Users/juangabriel/Desktop/temp/pixeloak/snapadmin_backend/public',
    isExperimental: false,
    assetsPath: 'assets',
    globalPath: 'assets/global',
    layoutPath: 'assets/layouts/layout4',
    railsApi: 'http://localhost:3001/api/',
    cmsApi: 'http://localhost:3000/api/'
    // railsApi: 'http://snaplar-backend.southeastasia.cloudapp.azure.com:3001/api/',
    // cmsApi: 'http://snaplar-backend.southeastasia.cloudapp.azure.com:3000/api/'
  };

  $rootScope.settings = settings;
  return settings;
}])

.config(['$locationProvider', '$stateProvider', '$urlRouterProvider', '$authProvider', function($locationProvider, $stateProvider, $urlRouterProvider, $authProvider) {
  $authProvider.configure({
    apiUrl: 'http://localhost:3001/api',
    emailSignInPath: '/admin_auth/sign_in',
    signOutUrl: '/admin_auth/sign_out',
    tokenValidationPath: '/admin_auth/validate_token'
  });

  $locationProvider.hashPrefix('!');
  $urlRouterProvider.otherwise('/dashboard');
  // $urlRouterProvider.otherwise(function ($injector, $location) {
  //   var $state = $injector.get("$state");
  //   $state.go("dashboard");
  // });

  // $locationProvider.html5Mode(true);

  var login = {
    url: '/login',
    views: {
      content: { templateUrl: 'templates/login.html', controller: 'AuthenticationController' },
    },
    resolve: {
      deps: lazyLoad(['assets/pages/css/login-2.min.css'])
    }
  };
  var profile = {
    url: '/profile',
    views: viewsHelper('profile'),
    resolve: {
      auth: resolveAuthHelper
    }
  };
  var dashboard = {
    url: '/dashboard',
    views: viewsHelper('dashboard'),
    resolve: {
      auth: resolveAuthHelper
    }
  };
  var users = {
    url: '/users',
    views: viewsHelper('users', 'list'),
    data: { pageTitle: 'Users' },
    resolve: {
      auth: resolveAuthHelper
    }
  };
  var usersDetail = {
    url: '/users/1',
    views: viewsHelper('users', 'detail'),
    resolve: {
      auth: resolveAuthHelper
    }
  };
  var usersNew = {
    url: '/users/new',
    views: viewsHelper('users', 'new'),
    resolve: {
      auth: resolveAuthHelper
    }
  };
  var providers = {
    url: '/providers',
    views: viewsHelper('providers'),
    resolve: {
      auth: resolveAuthHelper,
      providersDep: ['ProviderService', function(ProviderService) {
        return ProviderService.list()
          .then(function(result) {
            var providers = result.data;
            return providers;
          });
      }]
    }
  };
  var providersDetail = {
    url: '/providers/:id',
    views: viewsHelper('providers', 'detail'),
    resolve: {
      auth: resolveAuthHelper,

      providerDep: ['$stateParams', 'ProviderService', function($stateParams, ProviderService) {
        return ProviderService.get($stateParams.id)
          .then(function(result) {
            var provider = result.data;
            return provider;
          });
      }],

      campaignsDep: ['$stateParams', 'CampaignService', function($stateParams, CampaignService) {
        return CampaignService.list({provider_id: $stateParams.id})
          .then(function(result) {
            var campaigns = result.data;
            console.log(campaigns);
            return campaigns;
          })
      }],

      eventsDep: ['$stateParams', 'EventService', function($stateParams, EventService) {
        return EventService.list({provider_id: $stateParams.id})
          .then(function(result) {
            var events = result.data;
            return events;
          });
      }]
    }
  };
  var providerNew = {
    url: '/providers/new',
    views: viewsHelper('providers', 'new'),
  };
  var providerEdit = {
    url: '/providers/:id/edit',
    views: viewsHelper('providers', 'helper'),
    resolve: {
      auth: resolveAuthHelper,
      providerDep: ['$stateParams', 'ProviderService', function($stateParams, ProviderService) {
        return ProviderService.get($stateParams.id)
          .then(function(result) {
            var provider = result.data;
            return provider;
          });
      }]
    }
  };
  var gamification = {
    url: '/gamification',
    views: viewsHelper('gamification'),
    data: { pageTitle: 'Gamification' }
  };
  var gamificationCampaigns = {
    url: '/gamification/campaigns',
    views: viewsHelper('campaigns', 'list', 'gamification/'),
    data: { pageTitle: 'Campaigns' },
    resolve: {
      auth: resolveAuthHelper,

      campaignsDep: ['CampaignService', 'ProviderService', function(CampaignService, ProviderService) {
        return CampaignService.list().then(function(campaigns) {
          if (campaigns) {
            return Promise.all(
              campaigns.data.map(function(campaign) {
                return ProviderService.get(campaign.provider_id).then(function(provider) {
                  return angular.extend({}, campaign, {provider: provider.data});
                });
              })
            );
          } else return [];
        });
      }]

    }
  };
  var gamificationCampaignNew = {
    url: '/gamification/campaigns/new',
    views: viewsHelper('campaigns', 'new', 'gamification/'),
    data: { pageTitle: 'New Campaign' },
    resolve: {
      auth: resolveAuthHelper,

      providersDep: ['ProviderService', function(ProviderService) {
        return ProviderService.list()
          .then(function(result) {
            var providers = result.data;
            return providers;
          });
      }]
    }
  };
  var gamificationCampaignEdit = {
    url: '/gamification/campaigns/:id/edit',
    views: viewsHelper('campaigns', 'edit', 'gamification/'),
    data: { pageTitle: 'Edit Campaign' },
    resolve: {
      auth: resolveAuthHelper,

      campaignDep: ['$stateParams', 'CampaignService', function($stateParams, CampaignService) {
        return CampaignService.get($stateParams.id)
          .then(function(result) {
            var campaign = result.data;
            return campaign;
          });
      }],

      providersDep: ['ProviderService', function(ProviderService) {
        return ProviderService.list()
          .then(function(result) {
            var providers = result.data;
            return providers;
          });
      }]

    }
  };

  var gamificationCampaignDetail = {
    url: '/gamification/campaigns/:id',
    views: viewsHelper('campaigns', 'detail', 'gamification/'),
    data: { pageTitle: 'Campaign' },
    resolve: {
      auth: resolveAuthHelper,

      campaignDep: ['$stateParams', 'CampaignService', 'ProviderService', 'EventService', function($stateParams, CampaignService, ProviderService, EventService) {
        return CampaignService.get($stateParams.id)
          .then(function(result) {
            var campaign = result.data;
            return Promise.all([
              ProviderService.get(campaign.provider_id),
              EventService.list({campaign_id: campaign.id})
            ]).then(function(result) {
              var provider = result[0].data;
              var events   = result[1].data;
              return angular.extend({}, campaign, {provider: provider, events: events});
            })
          });
      }]
    }
  };
  var gamificationEvents = {
    url: '/gamification/events',
    views: viewsHelper('events', 'list', 'gamification/'),
    data: { pageTitle: 'Events' },
    resolve: {
      auth: resolveAuthHelper,

      eventsDep: ['EventService', 'ProviderService', function(EventService, ProviderService) {
        return EventService.list().then(function(events) {
          return Promise.all(
            events.data.map(function(event) {
              return ProviderService.get(event.provider_id).then(function(provider) {
                return angular.extend({}, event, {provider: provider.data});
              });
            })
          );
        });
      }]

    }
  };

  var gamificationEventNew = {
    url: '/gamification/campaigns/:campaign_id/events/new',
    views: viewsHelper('events', 'new', 'gamification/'),
    resolve: {
      auth: resolveAuthHelper,
      deps: ['$ocLazyLoad', function($ocLazyLoad) {
        return $ocLazyLoad.load({
          name: 'snapadmin',
          insertBefore: '#ng_load_plugins_before',
          files: [
            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
            'assets/global/plugins/select2/css/select2.min.css',
            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
            'assets/global/plugins/select2/js/select2.full.min.js',
            'assets/pages/scripts/components-select2.min.js',

          ]
        })
      }],

      campaignDep: ['$stateParams', 'CampaignService', function($stateParams, CampaignService) {
        return CampaignService.get($stateParams.campaign_id)
          .then(function(result) {
            var campaign = result.data;
            return campaign;
          });
      }],

      categoriesDep: ['CategoryService', function(CategoryService) {
        return CategoryService.list()
          .then(function(result) {
            var categories = result.data;
            return categories;
          });
      }]
    }
  };

  var gamificationEventEdit = {
    url: '/gamification/events/:id/edit',
    views: viewsHelper('events', 'edit', 'gamification/'),
    data: { pageTitle: 'Edit Event' },
    resolve: {
      auth: resolveAuthHelper,
      deps: ['$ocLazyLoad', function($ocLazyLoad) {
        return $ocLazyLoad.load({
          name: 'snapadmin',
          insertBefore: '#ng_load_plugins_before',
          files: [
            'assets/global/plugins/select2/css/select2.min.css',
            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
            'assets/global/plugins/select2/js/select2.full.min.js',
            'assets/pages/scripts/components-select2.min.js',
          ]
        })
      }],

      eventDep: ['$stateParams', 'EventService', 'CampaignService', function($stateParams, EventService, CampaignService) {
        return EventService.get($stateParams.id)
          .then(function(result) {
            var event = result.data;
            return Promise.all([
              CampaignService.list()
            ]).then(function(result) {
              var campaigns = result[0].data;
              var campaign;
              angular.forEach(campaigns, function(campaignItem) {
                if (event.campaign_id == campaignItem.id) campaign = campaignItem;
              });

              return angular.extend({}, event, { campaign: campaign });
            });
          });
      }],

      categoriesDep: ['CategoryService', function(CategoryService) {
        return CategoryService.list()
          .then(function(result) {
            var categories = result.data;
            return categories;
          });
      }]

    }
  };

  var gamificationEventDetail = {
    url: '/gamification/events/:id',
    views: viewsHelper('events', 'detail', 'gamification/'),
    data: { pageTitle: 'Event' },
    resolve: {
      auth: resolveAuthHelper,

      eventDep: ['$stateParams', 'EventService', 'ProviderService', 'CampaignService', 'ActivityService', 'CategoryService', function($stateParams, EventService, ProviderService, CampaignService, ActivityService, CategoryService) {
        return EventService.get($stateParams.id)
          .then(function(result) {
            var event = result.data;
            return Promise.all([
              ProviderService.get(event.provider_id),
              CampaignService.get(event.campaign_id),
              ActivityService.list({event_id: event.id}),
              CategoryService.list()
            ]).then(function(result) {
              var provider   = result[0].data;
              var campaign = result[1].data;
              var activities = result[2].data;
              var categoryList = result[3].data;
              var categories = [];

              angular.forEach(categoryList, function(category) {
                if(event.category_ids.includes(category.id))  {
                  categories.push(category)
                }
              });

              return angular.extend({}, event, {provider: provider, activities: activities, campaign: campaign, categories: categories});
            });
          })
      }]
    }
  };
  var gamificationActivities = {
    url: '/activities',
    views: viewsHelper('activities', 'list', 'gamification/')
  };
  var gamificationActivityNew = {
    url: '/gamification/events/:event_id/activities/new',
    views: viewsHelper('activities', 'new', 'gamification/'),
    resolve: {
      auth: resolveAuthHelper,

      eventDep: ['$stateParams', 'EventService', function($stateParams, EventService) {
        return EventService.get($stateParams.event_id)
          .then(function(result) {
            var event = result.data;
            return event;
          });
      }]
    }
  };

  var gamificationActivityEdit = {
    url: '/gamification/events/:event_id/activities/:id/edit',
    views: viewsHelper('activities', 'edit', 'gamification/'),
    data: { pageTitle: 'Edit Activity' },
    resolve: {
      auth: resolveAuthHelper,
      deps: ['$ocLazyLoad', function($ocLazyLoad) {
        return $ocLazyLoad.load({
          name: 'snapadmin',
          insertBefore: '#ng_load_plugins_before',
          files: [
            'assets/global/plugins/bootstrap-tabdrop/js/bootstrap-tabdrop.js'
          ]
        })
      }],

      activityDep: ['$stateParams', 'ActivityService' ,function($stateParams, ActivityService) {
        return ActivityService.get($stateParams.id)
          .then(function(result) {
            var activity = result.data;
            return activity;
          });
      }],
      eventDep: ['$stateParams', 'EventService', function($stateParams, EventService) {
        return EventService.get($stateParams.event_id)
          .then(function(result) {
            var event = result.data;
            return event;
          });
      }]
    }
  };

  var categories = {
    url: '/categories',
    views: viewsHelper('categories', 'list'),
    resolve: {
      auth: resolveAuthHelper,
      categoriesDep: ['CategoryService', function(CategoryService) {
        return CategoryService.list().then(function(categories) {
          return categories.data;
        });
      }]
    }
  };
  var categoryNew = {
    url: '/categories/new',
    views: viewsHelper('categories', 'new'),
  };

  var categoryEdit = {
    url: '/categories/:id/edit',
    views: viewsHelper('categories', 'edit'),
    resolve: {
      auth: resolveAuthHelper,
      categoryDep: ['$stateParams', 'CategoryService', function($stateParams, CategoryService) {
        return CategoryService.get($stateParams.id)
          .then(function(result) {
            var category = result.data;
            return category;
          });
      }]
    }
  };

  var broadcast = {
    url: '/broadcast',
    views: viewsHelper('broadcast'),
    resolve: {
      auth: resolveAuthHelper,

      notificationsDep: ['NotificationService', function(NotificationService) {
        return NotificationService.list().then(function(notifications) {
          return notifications.data;
        });
      }]
    }
  };

  var broadcastEdit = {
    url: '/broadcast/:id/edit',
    views: viewsHelper('broadcast', 'edit'),
    resolve: {
      auth: resolveAuthHelper,

      notificationDep: ['$stateParams', 'NotificationService', function($stateParams, NotificationService) {
        return NotificationService.get($stateParams.id)
          .then(function(result) {
            var notification = result.data;
            return notification;
          });
      }]
    }
  };

  var notifications = {
    url: '/notifications',
    views: viewsHelper('notifications'),
    resolve: {
      auth: resolveAuthHelper,
      notificationsDep: ['NotificationService', function(NotificationService) {
        return NotificationService.list().then(function(notifications) {
          return notifications.data;
        });
      }]

    }
  };

  var pois = {
    list: {
      url: '/pois',
      views: viewsHelper('pois', 'list'),
      data: { pageTitle: 'Points Of Interest' },
      resolve: {
        auth: function($auth) {
          return $auth.validateUser();
        }
      }
    },
    'new': {
      url: '/pois/new',
      views: viewsHelper('pois', 'new'),
      resolve: {
        auth: resolveAuthHelper
      }
    },
    edit: {
      url: '/pois/:id/edit',
      views: viewsHelper('pois', 'edit'),
      resolve: {
        auth: resolveAuthHelper,
        currentPoi: ['$stateParams', 'PoisService', function($stateParams, PoisService) {
          return PoisService.get($stateParams.id).then(result => result.data);
        }]
      }
    },
    show: {
      url: '/pois/:id',
      views: viewsHelper('pois', 'show'),
      resolve: {
        auth: resolveAuthHelper,
        currentPoi: ['$stateParams', 'PoisService', function($stateParams, PoisService) {
          return PoisService.get($stateParams.id).then(result => result.data);
        }]
      }
    }
  };

  var malls = {
    list: {
      url: '/malls?city',
      views: viewsHelper('malls', 'list', 'malls/'),
      resolve: { auth: resolveAuthHelper }
    },
    'new': {
      url: '/malls/new',
      views: viewsHelper('malls', 'new', 'malls/'),
      resolve: { auth: resolveAuthHelper }
    },
    detail: {
      url: '/malls/:id',
      views: viewsHelper('malls', 'detail', 'malls/'),
      resolve: { auth: resolveAuthHelper }
    },
    edit: {
      url: '/malls/:id/edit',
      views: viewsHelper('malls', 'edit', 'malls/'),
      resolve: { auth: resolveAuthHelper }
    }
  };

  var stores = {
    'new': {
      url: '/malls/:mall_id/stores/new',
      views: viewsHelper('stores', 'new', 'stores/'),
      resolve: { auth: resolveAuthHelper }
    },
    edit: {
      url: '/malls/:mall_id/stores/:id',
      views: viewsHelper('stores', 'edit', 'stores/'),
      resolve: { auth: resolveAuthHelper }
    }
  }

  var billboards = {
    'new': {
      url: '/billboards/new',
      views: viewsHelper('billboards', 'new', 'billboards/'),
      resolve: { auth: resolveAuthHelper }
    }
  }

  var businesses = {
    'new': {
      url: '/businesses/new',
      views: viewsHelper('businesses', 'new', 'businesses/'),
      resolve: { auth: resolveAuthHelper }
    },
    list: {
      url: '/businesses',
      views: viewsHelper('businesses', 'list', 'businesses/'),
      resolve: { auth: resolveAuthHelper }
    }
  }

  var advertisements = {
    list: {
      url: '/advertisements',
      views: viewsHelper('advertisements', 'list', 'advertisements/'),//viewsHelper('ads', 'list', 'ads/'),
      resolve: { auth: resolveAuthHelper }
    },
    'new': {
      url: '/advertisements/new',
      views: viewsHelper('advertisements', 'new', 'advertisements/'),
      resolve: { auth: resolveAuthHelper }
    }
  }

  var studio = {
    stores: {
      list: {
        url: '/stores',
        views: {
          nav: { templateUrl: 'templates/sidebar.html', controller: 'SidebarController' },
          content: { templateUrl: 'templates/studio/stores.list.html' },
          header: { templateUrl: 'templates/header.html', controller: 'HeaderController' }
        },
        data: { pageTitle: 'Stores' },
      },
      'new': {
        url: '/stores/new',
        views: {
          nav: { templateUrl: 'templates/sidebar.html', controller: 'SidebarController' },
          content: { templateUrl: 'templates/studio/stores.new.html' },
          header: { templateUrl: 'templates/header.html', controller: 'HeaderController' }
        },
        data: { pageTitle: 'Create a new Store' },
      }
    },
    billboards: {
      list: {
        url: '/billboards',
        views: {
          nav: { templateUrl: 'templates/sidebar.html', controller: 'SidebarController' },
          content: { templateUrl: 'templates/studio/billboards.list.html' },
          header: { templateUrl: 'templates/header.html', controller: 'HeaderController' }
        },
        data: { pageTitle: 'Billboards' },
      },
      'new': {
        url: '/billboards/new',
        views: {
          nav: { templateUrl: 'templates/sidebar.html', controller: 'SidebarController' },
          content: { templateUrl: 'templates/studio/billboards.new.html' },
          header: { templateUrl: 'templates/header.html', controller: 'HeaderController' }
        },
        data: { pageTitle: 'Create a new Billboard' },
      }
    },
    ads: {
      list: {
        url: '/ads',
        views: viewsHelper('ads', 'list', 'ads/'),
        resolve: { auth: resolveAuthHelper }
      },
      'new': {

      }
    },
    campaigns: {

    },
    reports: {

    }
  }

  $stateProvider
    .state('login', login)
    .state('profile', profile)
    .state('dashboard', dashboard)
    .state('users', users)
    .state('usersDetail', usersDetail)
    .state('usersNew', usersNew)
    .state('providers', providers)
    .state('providerNew', providerNew)
    .state('providerEdit', providerEdit)
    .state('providersDetail', providersDetail)
    .state('gamification', gamification)
    .state('gamificationCampaigns', gamificationCampaigns)
    .state('gamificationCampaignNew', gamificationCampaignNew)
    .state('gamificationCampaignEdit', gamificationCampaignEdit)
    .state('gamificationCampaignDetail', gamificationCampaignDetail)
    .state('gamificationEvents', gamificationEvents)
    .state('gamificationEventNew', gamificationEventNew)
    .state('gamificationEventEdit', gamificationEventEdit)
    .state('gamificationEventDetail', gamificationEventDetail)
    .state('gamification.activities', gamificationActivities)
    .state('gamificationActivityNew', gamificationActivityNew)
    .state('gamificationActivityEdit', gamificationActivityEdit)
    .state('categories', categories)
    .state('categoryNew', categoryNew)
    .state('categoryEdit', categoryEdit)
    .state('broadcast', broadcast)
    .state('broadcastEdit', broadcastEdit)
    .state('notifications', notifications)
    .state('pois', pois.list)
    .state('poiNew', pois['new'])
    .state('poiEdit', pois.edit)
    .state('poiShow', pois.show)

    .state('malls', malls.list)
    .state('mallsNew', malls['new'])
    .state('mallsDetail', malls.detail)
    .state('mallsEdit', malls.edit)
    .state('stores', studio.stores.list)
    .state('storesNew', stores['new'])
    .state('storesEdit', stores.edit)
    .state('billboardsNew', billboards['new'])
    .state('businesses', businesses.list)
    .state('businessesNew', businesses['new'])
    .state('advertisements', advertisements.list)
    .state('advertisementsNew', advertisements['new']);
}])

.run(['$rootScope', 'settings', '$state', function($rootScope, settings, $state) {
    $rootScope.$state = $state; // state to be accessed from view
    $rootScope.$settings = settings; // state to be accessed from view
    $rootScope.moment = moment;
}]);

var capitalize = (str) => str[0].toUpperCase() + str.slice(1);
var resolveAuthHelper = ['$auth', ($auth) => { return $auth.validateUser() }];
var viewsHelper = (name, action = '', folder = '') => ({
  nav: { templateUrl: 'templates/sidebar.html', controller: 'SidebarController' },
  content: { templateUrl: `templates/${folder && folder + '/'}${name}.${action && action + '.'}html`, controller: `${capitalize(name)}${action && capitalize(action)}Controller` },
  header: { templateUrl: 'templates/header.html', controller: 'HeaderController' }
});
var lazyLoad = (files) => ['$ocLazyLoad', function($ocLazyLoad) {
  return $ocLazyLoad.load({
    name: 'snapadmin',
    insertBefore: '#ng_load_plugins_before',
    files: files
  })
}];
