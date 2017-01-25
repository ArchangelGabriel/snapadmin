'use strict';

var snapadmin = angular.module('snapadmin', [
  'ui.router',
  'oc.lazyLoad',
  'ngSanitize',
  'ng-token-auth',
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

  var login = {
    url: '/login',
    views: {
      content: { templateUrl: 'templates/login.html', controller: 'AuthenticationController' },
    },
    resolve: {
      deps: ['$ocLazyLoad', function($ocLazyLoad) {
        return $ocLazyLoad.load({
          name: 'snapadmin',
          insertBefore: '#ng_load_plugins_before',
          files: [
            'assets/pages/css/login-2.min.css'
          ]
        })
      }]
    }
  };
  var profile = {
    url: '/profile',
    views: {
      nav: { templateUrl: 'templates/sidebar.html', controller: 'SidebarController' },
      content: { templateUrl: 'templates/profile.html', controller: 'ProfileController' },
      header: { templateUrl: 'templates/header.html', controller: 'HeaderController' }
    },
    resolve: {
      auth: function($auth) {
        return $auth.validateUser();
      }
    }
  };
  var dashboard = {
    url: '/dashboard',
    views: {
      nav: { templateUrl: 'templates/sidebar.html', controller: 'SidebarController' },
      content: { templateUrl: 'templates/dashboard.html', controller: 'DashboardController' },
      header: { templateUrl: 'templates/header.html', controller: 'HeaderController' }
    },
    resolve: {
      auth: function($auth) {
        return $auth.validateUser();
      }
    }
  };
  var users = {
    url: '/users',
    views: {
      nav: { templateUrl: 'templates/sidebar.html', controller: 'SidebarController' },
      content: { templateUrl: 'templates/users.html', controller: 'UsersController' },
      header: { templateUrl: 'templates/header.html', controller: 'HeaderController' }
    },
    data: { pageTitle: 'Users' },
    resolve: {
      auth: function($auth) {
        return $auth.validateUser();
      },

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
      }]
    }
  };
  var userDetail = {
    url: '/users/1',
    views: {
      nav: { templateUrl: 'templates/sidebar.html', controller: 'SidebarController' },
      content: { templateUrl: 'templates/userDetail.html', controller: 'UsersController' },
      header: { templateUrl: 'templates/header.html', controller: 'HeaderController' }
    },
    resolve: {
      auth: function($auth) {
        return $auth.validateUser();
      },
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
  var userNew = {
    url: '/users/new',
    views: {
      nav: { templateUrl: 'templates/sidebar.html', controller: 'SidebarController' },
      content: { templateUrl: 'templates/userNew.html', controller: 'UsersNewController' },
      header: { templateUrl: 'templates/header.html', controller: 'HeaderController' }
    },
    resolve: {
      auth: function($auth) {
        return $auth.validateUser();
      }
    }
  };
  var providers = {
    url: '/providers',
    views: {
      nav: { templateUrl: 'templates/sidebar.html', controller: 'SidebarController' },
      content: { templateUrl: 'templates/providers.html', controller: 'ProvidersController' },
      header: { templateUrl: 'templates/header.html', controller: 'HeaderController' }
    },
    resolve: {
      auth: function($auth) {
        return $auth.validateUser();
      },
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
    views: {
      nav: { templateUrl: 'templates/sidebar.html', controller: 'SidebarController' },
      content: { templateUrl: 'templates/providerDetail.html', controller: 'ProvidersDetailController' },
      header: { templateUrl: 'templates/header.html', controller: 'HeaderController' }
    },
    resolve: {
      auth: function($auth) {
        return $auth.validateUser();
      },
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
    views: {
      nav: { templateUrl: 'templates/sidebar.html', controller: 'SidebarController' },
      content: { templateUrl: 'templates/providerNew.html', controller: 'ProvidersNewController' },
      header: { templateUrl: 'templates/header.html', controller: 'HeaderController' }
    },
  };
  var providerEdit = {
    url: '/providers/:id/edit',
    views: {
      nav: { templateUrl: 'templates/sidebar.html', controller: 'SidebarController' },
      content: { templateUrl: 'templates/providerEdit.html', controller: 'ProvidersEditController' },
      header: { templateUrl: 'templates/header.html', controller: 'HeaderController' }
    },
    resolve: {
      auth: function($auth) {
        return $auth.validateUser();
      },
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
    views: {
      nav: { templateUrl: 'templates/sidebar.html', controller: 'SidebarController' },
      content: { templateUrl: 'templates/gamification.html', controller: 'GamificationController' },
      header: { templateUrl: 'templates/header.html', controller: 'HeaderController' }
    },
    data: { pageTitle: 'Gamification' }
  };
  var gamificationCampaigns = {
    url: '/gamification/campaigns',
    views: {
      nav: { templateUrl: 'templates/sidebar.html', controller: 'SidebarController' },
      content: { templateUrl: 'templates/gamification/campaigns.html', controller: 'CampaignsController' },
      header: { templateUrl: 'templates/header.html', controller: 'HeaderController' }
    },
    data: { pageTitle: 'Campaigns' },
    resolve: {
      auth: function($auth) {
        return $auth.validateUser();
      },

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
    views: {
      nav: { templateUrl: 'templates/sidebar.html', controller: 'SidebarController' },
      content: { templateUrl: 'templates/gamification/campaignNew.html', controller: 'CampaignNewController' },
      header: { templateUrl: 'templates/header.html', controller: 'HeaderController' }
    },
    data: { pageTitle: 'New Campaign' },
    resolve: {
      auth: function($auth) {
        return $auth.validateUser();
      },
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
  var gamificationCampaignEdit = {
    url: '/gamification/campaigns/:id/edit',
    views: {
      nav: { templateUrl: 'templates/sidebar.html', controller: 'SidebarController' },
      content: { templateUrl: 'templates/gamification/campaignEdit.html', controller: 'CampaignEditController' },
      header: { templateUrl: 'templates/header.html', controller: 'HeaderController' }
    },
    data: { pageTitle: 'Edit Campaign' },
    resolve: {
      auth: function($auth) {
        return $auth.validateUser();
      },
      deps: ['$ocLazyLoad', function($ocLazyLoad) {
        return $ocLazyLoad.load({
          name: 'snapadmin',
          insertBefore: '#ng_load_plugins_before',
          files: [
            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js'
          ]
        })
      }],

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
    views: {
      nav: { templateUrl: 'templates/sidebar.html', controller: 'SidebarController' },
      content: { templateUrl: 'templates/gamification/campaignDetail.html', controller: 'CampaignDetailController' },
      header: { templateUrl: 'templates/header.html', controller: 'HeaderController' }
    },
    data: { pageTitle: 'Campaign' },
    resolve: {
      auth: function($auth) {
        return $auth.validateUser();
      },
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
    views: {
      nav: { templateUrl: 'templates/sidebar.html', controller: 'SidebarController' },
      content: { templateUrl: 'templates/gamification/events.html', controller: 'EventsController' },
      header: { templateUrl: 'templates/header.html', controller: 'HeaderController' }
    },
    data: { pageTitle: 'Events' },
    resolve: {
      auth: function($auth) {
        return $auth.validateUser();
      },

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
    views: {
      nav: { templateUrl: 'templates/sidebar.html', controller: 'SidebarController' },
      content: { templateUrl: 'templates/gamification/eventNew.html', controller: 'EventNewController' },
      header: { templateUrl: 'templates/header.html', controller: 'HeaderController' }
    },
    resolve: {
      auth: function($auth) {
        return $auth.validateUser();
      },
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
    views: {
      nav: { templateUrl: 'templates/sidebar.html', controller: 'SidebarController' },
      content: { templateUrl: 'templates/gamification/eventEdit.html', controller: 'EventEditController' },
      header: { templateUrl: 'templates/header.html', controller: 'HeaderController' }
    },
    data: { pageTitle: 'Edit Event' },
    resolve: {
      auth: function($auth) {
        return $auth.validateUser();
      },
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
    views: {
      nav: { templateUrl: 'templates/sidebar.html', controller: 'SidebarController' },
      content: { templateUrl: 'templates/gamification/eventDetail.html', controller: 'EventDetailController' },
      header: { templateUrl: 'templates/header.html', controller: 'HeaderController' }
    },
    data: { pageTitle: 'Event' },
    resolve: {
      auth: function($auth) {
        return $auth.validateUser();
      },
      deps: ['$ocLazyLoad', function($ocLazyLoad) {
        return $ocLazyLoad.load({
          name: 'snapadmin',
          insertBefore: '#ng_load_plugins_before',
          files: [
            'assets/pages/css/profile-2.min.css'
          ]
        })
      }],

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
    views: {
      nav: { templateUrl: 'templates/sidebar.html', controller: 'SidebarController' },
      content: { templateUrl: 'templates/gamification/activities.html', controller: 'GamificationController' },
      header: { templateUrl: 'templates/header.html', controller: 'HeaderController' }
    },
  };
  var gamificationActivityNew = {
    url: '/gamification/events/:event_id/activities/new',
    views: {
      nav: { templateUrl: 'templates/sidebar.html', controller: 'SidebarController' },
      content: { templateUrl: 'templates/gamification/activityNew.html', controller: 'ActivityNewController' },
      header: { templateUrl: 'templates/header.html', controller: 'HeaderController' }
    },
    resolve: {
      auth: function($auth) {
        return $auth.validateUser();
      },

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
    views: {
      nav: { templateUrl: 'templates/sidebar.html', controller: 'SidebarController' },
      content: { templateUrl: 'templates/gamification/activityEdit.html', controller: 'ActivityEditController' },
      header: { templateUrl: 'templates/header.html', controller: 'HeaderController' }
    },
    data: { pageTitle: 'Edit Activity' },
    resolve: {
      auth: function($auth) {
        return $auth.validateUser();
      },
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
    views: {
      nav: { templateUrl: 'templates/sidebar.html', controller: 'SidebarController' },
      content: { templateUrl: 'templates/categories.html', controller: 'CategoriesController' },
      header: { templateUrl: 'templates/header.html', controller: 'HeaderController' }
    },
    resolve: {
      auth: function($auth) {
        return $auth.validateUser();
      },
      categoriesDep: ['CategoryService', function(CategoryService) {
        return CategoryService.list().then(function(categories) {
          return categories.data;
        });
      }]
    }
  };
  var categoryNew = {
    url: '/categories/new',
    views: {
      nav: { templateUrl: 'templates/sidebar.html', controller: 'SidebarController' },
      content: { templateUrl: 'templates/categoryNew.html', controller: 'CategoryNewController' },
      header: { templateUrl: 'templates/header.html', controller: 'HeaderController' }
    },
  };

  var categoryEdit = {
    url: '/categories/:id/edit',
    views: {
      nav: { templateUrl: 'templates/sidebar.html', controller: 'SidebarController' },
      content: { templateUrl: 'templates/categoryEdit.html', controller: 'CategoryEditController' },
      header: { templateUrl: 'templates/header.html', controller: 'HeaderController' }
    },
    resolve: {
      auth: function($auth) {
        return $auth.validateUser();
      },
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
    views: {
      nav: { templateUrl: 'templates/sidebar.html', controller: 'SidebarController' },
      content: { templateUrl: 'templates/broadcast.html', controller: 'BroadcastController' },
      header: { templateUrl: 'templates/header.html', controller: 'HeaderController' }
    },
    resolve: {
      auth: function($auth) {
        return $auth.validateUser();
      },
      deps: ['$ocLazyLoad', function($ocLazyLoad) {
        return $ocLazyLoad.load({
          name: 'snapadmin',
          insertBefore: '#ng_load_plugins_before',
          files: [
            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
          ]
        })
      }],

      notificationsDep: ['NotificationService', function(NotificationService) {
        return NotificationService.list().then(function(notifications) {
          return notifications.data;
        });
      }]
    }
  };

  var broadcastEdit = {
    url: '/broadcast/:id',
    views: {
      nav: { templateUrl: 'templates/sidebar.html', controller: 'SidebarController' },
      content: { templateUrl: 'templates/broadcastEdit.html', controller: 'BroadcastEditController' },
      header: { templateUrl: 'templates/header.html', controller: 'HeaderController' }
    },
    resolve: {
      auth: function($auth) {
        return $auth.validateUser();
      },
      deps: ['$ocLazyLoad', function($ocLazyLoad) {
        return $ocLazyLoad.load({
          name: 'snapadmin',
          insertBefore: '#ng_load_plugins_before',
          files: [
            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
          ]
        })
      }],

      notificationDep: ['$stateParams', 'NotificationService', function($stateParams, NotificationService) {
        return NotificationService.get($stateParams.id)
          .then(function(result) {
            var notification = result.data;
            return notification;
          });
      }]
    }
  };

  var notificationLogs = {
    url: '/logs/notification',
    views: {
      nav: { templateUrl: 'templates/sidebar.html', controller: 'SidebarController' },
      content: { templateUrl: 'templates/notificationLogs.html', controller: 'NotificationsController' },
      header: { templateUrl: 'templates/header.html', controller: 'HeaderController' }
    },
    resolve: {
      auth: function($auth) {
        return $auth.validateUser();
      },
      notificationsDep: ['NotificationService', function(NotificationService) {
        return NotificationService.list().then(function(notifications) {
          return notifications.data;
        });
      }]

    }
  };

  $stateProvider
    .state('login', login)
    .state('profile', profile)
    .state('dashboard', dashboard)
    .state('users', users)
    .state('userDetail', userDetail)
    .state('userNew', userNew)
    .state('providers', providers)
    .state('providerNew', providerNew)
    .state('providerEdit', providerEdit)
    .state('providerDetail', providerDetail)
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
    .state('notificationLogs', notificationLogs);
}])

.run(['$rootScope', 'settings', '$state', function($rootScope, settings, $state) {
    $rootScope.$state = $state; // state to be accessed from view
    $rootScope.$settings = settings; // state to be accessed from view
    $rootScope.moment = moment;
}]);
