'use strict';

var snapadmin = angular.module('snapadmin', [
  'ui.router',
  'oc.lazyLoad'
])

// TODO: separate this filter
.filter('moment', function() {
  return function (input, momentFn /*, param1, param2, ...param n */) {
    var args = Array.prototype.slice.call(arguments, 2),
        momentObj = moment(input);
    return momentObj[momentFn].apply(momentObj, args);
  };
})

.factory('settings', ['$rootScope', function($rootScope) {
  var settings = {
    layout: {
      pageSidebarClosed: false,
      pageContentWhite: true,
      pageBodySolid: false,
      pageAutoScrollOnLoad: 1000
    },
    assetsPath: 'assets',
    globalPath: 'assets/global',
    layoutPath: 'assets/layouts/layout4',
    railsApi: 'https://morning-ocean-86025.herokuapp.com/api/'
  };

  $rootScope.settings = settings;

  return settings;
}])

.config(['$locationProvider', '$stateProvider', '$urlRouterProvider', function($locationProvider, $stateProvider, $urlRouterProvider) {
  $locationProvider.hashPrefix('!');
  $urlRouterProvider.otherwise('/dashboard');

  var profile = {
    url: '/profile',
    templateUrl: 'templates/profile.html',
    controller: 'ProfileController'
  };
  var dashboard = {
    url: '/dashboard',
    templateUrl: 'templates/dashboard.html',
    controller: 'DashboardController'
  };
  var users = {
    url: '/users',
    templateUrl: 'templates/users.html',
    controller: 'UsersController',
    resolve: {
      deps: ['$ocLazyLoad', function($ocLazyLoad) {
        return $ocLazyLoad.load({
          name: 'snapadmin',
          insertBefore: '#ng_load_plugins_before',
          files: [
            'assets/global/plugins/datatables/datatables.min.css',
            'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
            'assets/global/plugins/datatables/datatables.all.min.js',
            'assets/global/plugins/datatables/datatables.buttons.min.js',
            'assets/pages/scripts/table-datatables-managed.min.js'
          ]
        })
      }]
    }
  };
  var userDetail = {
    url: '/users/1',
    templateUrl: 'templates/userDetail.html',
    controller: 'UsersController',
    resolve: {
      deps: ['$ocLazyLoad', function($ocLazyLoad) {
        return $ocLazyLoad.load({
          name: 'snapadmin',
          insertBefore: '#ng_load_plugins_before',
          files: [
            'assets/pages/css/profile-2.min.css'
          ]
        })
      }]
    }
  };
  var providers = {
    url: '/providers',
    templateUrl: 'templates/providers.html',
    controller: 'ProvidersController',
    resolve: {
      providersDep: ['ProviderService', function(ProviderService) {
        return ProviderService.list()
          .then(function(result) {
            var providers = result.data;
            return providers;
          });
      }]
    }
  };
  var providerDetail = {
    url: '/providers/:id',
    templateUrl: 'templates/providerDetail.html',
    controller: 'ProvidersDetailController',
    resolve: {
      deps: ['$ocLazyLoad', function($ocLazyLoad) {
        return $ocLazyLoad.load({
          name: 'snapadmin',
          insertBefore: '#ng_load_plugins_before',
          files: [
            'assets/pages/css/profile-2.min.css'
          ]
        })
      }],

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
    templateUrl: 'templates/providerNew.html',
    controller: 'ProvidersNewController'
  };
  var gamification = {
    url: '/gamification',
    templateUrl: 'templates/gamification.html',
    controller: 'GamificationController',
    data: { pageTitle: 'Gamification' }
  };
  var gamificationCampaigns = {
    url: '/gamification/campaigns',
    templateUrl: 'templates/gamification/campaigns.html',
    controller: 'CampaignsController',
    data: { pageTitle: 'Campaigns' },
    resolve: {

      deps: ['$ocLazyLoad', function($ocLazyLoad) {
        return $ocLazyLoad.load({
          name: 'snapadmin',
          insertBefore: '#ng_load_plugins_before',
          files: [
            'assets/global/plugins/datatables/datatables.min.css',
            'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
            'assets/global/plugins/datatables/datatables.all.min.js'
          ]
        })
      }],

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
    templateUrl: 'templates/gamification/campaignNew.html',
    controller: 'CampaignNewController',
    data: { pageTitle: 'New Campaign' },
    resolve: {
      deps: ['$ocLazyLoad', function($ocLazyLoad) {
        return $ocLazyLoad.load({
          name: 'snapadmin',
          insertBefore: '#ng_load_plugins_before',
          files: [
            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js'
          ]
        })
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
    templateUrl: 'templates/gamification/campaignDetail.html',
    controller: 'CampaignDetailController',
    data: { pageTitle: 'Campaign' },
    resolve: {
      deps: ['$ocLazyLoad', function($ocLazyLoad) {
        return $ocLazyLoad.load({
          name: 'snapadmin',
          insertBefore: '#ng_load_plugins_before',
          files: [
            'assets/pages/css/profile-2.min.css'
          ]
        })
      }],
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
    templateUrl: 'templates/gamification/events.html',
    controller: 'EventsController',
    data: { pageTitle: 'Events' },
    resolve: {

      deps: ['$ocLazyLoad', function($ocLazyLoad) {
        return $ocLazyLoad.load({
          name: 'snapadmin',
          insertBefore: '#ng_load_plugins_before',
          files: [
            'assets/global/plugins/datatables/datatables.min.css',
            'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
            'assets/global/plugins/datatables/datatables.all.min.js'
          ]
        })
      }],

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
    templateUrl: 'templates/gamification/eventNew.html',
    controller: 'EventNewController',
    data: { pageTitle: 'Create New Event' },
    resolve: {
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
  var gamificationEventDetail = {
    url: '/gamification/events/:id',
    templateUrl: 'templates/gamification/eventDetail.html',
    controller: 'EventDetailController',
    data: { pageTitle: 'Event' },
    resolve: {
      deps: ['$ocLazyLoad', function($ocLazyLoad) {
        return $ocLazyLoad.load({
          name: 'snapadmin',
          insertBefore: '#ng_load_plugins_before',
          files: [
            'assets/pages/css/profile-2.min.css'
          ]
        })
      }],

      eventDep: ['$stateParams', 'EventService', 'ProviderService', 'ActivityService', function($stateParams, EventService, ProviderService, ActivityService) {
        return EventService.get($stateParams.id)
          .then(function(result) {
            var event = result.data;
            return Promise.all([
              ProviderService.get(event.provider_id),
              ActivityService.list({event_id: event.id})
            ]).then(function(result) {
              var provider   = result[0].data;
              var activities = result[1].data;
              return angular.extend({}, event, {provider: provider, activities: activities});
            });
          })
      }]
    }
  };
  var gamificationActivities = {
    url: '/activities',
    templateUrl: 'templates/gamification/activities.html',
    controller: 'GamificationController'
  };
  var gamificationActivityNew = {
    url: '/gamification/events/:event_id/activities/new',
    templateUrl: 'templates/gamification/activityNew.html',
    controller: 'ActivityNewController',
    data: { pageTitle: 'Create New Activity' },
    resolve: {
      deps: ['$ocLazyLoad', function($ocLazyLoad) {
        return $ocLazyLoad.load({
          name: 'snapadmin',
          insertBefore: '#ng_load_plugins_before',
          files: [
            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js'
          ]
        })
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
    templateUrl: 'templates/categories.html',
    controller: 'CategoriesController',
    resolve: {
      categoriesDep: ['CategoryService', function(CategoryService) {
        return CategoryService.list().then(function(categories) {
          return categories.data;
        });
      }]
    }
  };
  var categoryNew = {
    url: '/categories/new',
    templateUrl: 'templates/categoryNew.html',
    controller: 'CategoryNewController'
  };

  $stateProvider
    .state('profile', profile)
    .state('dashboard', dashboard)
    .state('users', users)
    .state('userDetail', userDetail)
    .state('providers', providers)
    .state('providerNew', providerNew)
    .state('providerDetail', providerDetail)
    .state('gamification', gamification)
    .state('gamificationCampaigns', gamificationCampaigns)
    .state('gamificationCampaignNew', gamificationCampaignNew)
    .state('gamificationCampaignDetail', gamificationCampaignDetail)
    .state('gamificationEvents', gamificationEvents)
    .state('gamificationEventNew', gamificationEventNew)
    .state('gamificationEventDetail', gamificationEventDetail)
    .state('gamification.activities', gamificationActivities)
    .state('gamificationActivityNew', gamificationActivityNew)
    .state('categories', categories)
    .state('categoryNew', categoryNew);
}])

.run(['$rootScope', 'settings', '$state', function($rootScope, settings, $state) {
    $rootScope.$state = $state; // state to be accessed from view
    $rootScope.$settings = settings; // state to be accessed from view
    $rootScope.moment = moment;
}]);
