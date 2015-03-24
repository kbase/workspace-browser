
/*
 *  KBase "Functional Website"
 *
 *  Login, Workspace/Narrative Browser, Upload, Apps
 *
 *  Uses Angular.js
 *
 *  -- Some of the critical files --
 *  App:               js/app.js
 *  Controllers:       js/controllers.js
 *  Directives:        js/directives/landingpages.js
 *                     js/directives/*
 *
 *  Views (templates): views/*
 *
*/

var app = angular.module('landing-pages',
    ['config',
     'kbase-auth',
     'kbase-rpc',
     'ws-directives',
     'ws-controllers',
     'wsModals',
     'uiTools',
     'ui.router'])
    .config(['$locationProvider', '$stateProvider', '$httpProvider', '$urlRouterProvider',
    function($locationProvider, $stateProvider, $httpProvider, $urlRouterProvider) {


    // enable CORS
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    // with some configuration, we can change this in the future.
    $locationProvider.html5Mode(false);

    $stateProvider
        .state('login', {
          url: "/login/",
          templateUrl: 'views/login.html',
          controller: 'Login'
        });


    // workspace browser routing
    $stateProvider
        .state('ws', {
          url: "/",
          templateUrl: 'views/ws/ws.html',
          controller: 'WB'
        }).state('ws.id', {
          url: "objects/:ws?type",
          templateUrl: 'views/ws/objtable.html',
          controller: 'WB'
        }).state('ws.tour', {
          url: "/tour/",
          templateUrl: 'views/ws/objtable.html',
          controller: 'WBTour'
        }).state('ws-manage', {
          url: "/manage",
          templateUrl: 'views/ws/manage.html',
          controller: 'WSManage',
        });


    // revised output widget test page
    $stateProvider
        .state('test', {
          url: "/test/",
          templateUrl: 'views/test-landing.html',
          controller: 'KBaseExamples'
        }).state('landing', {
          url: "/test/:type/:ws/:name",
          templateUrl: 'views/test.html',
          controller: 'KBaseTables'
        })



    $stateProvider
        .state('rxns',
            {url:'/rxns',
             templateUrl: 'views/object-list.html',
             controller: 'WSObjects'})
        .state('rxnsids', {
            url: "/rxns/:ids",
            templateUrl: 'views/objects/rxn.html',
            controller: 'RxnDetail'
        });

    $stateProvider
        .state('cpds',
            {url:'/cpds',
             templateUrl: 'views/object-list.html',
             controller: 'WSObjects'})
        .state('cpdsids',
            {url:'/cpds/:ids',
             templateUrl: 'views/objects/cpd.html',
             controller: 'CpdDetail'
         });

    $urlRouterProvider.when('', '/')

    $urlRouterProvider.otherwise('/404/');

    $stateProvider.state("404",
            {url: '*path',
             templateUrl : 'views/404.html'});

}])


.run(['$rootScope', '$state', '$stateParams', 'auth',
function($rootScope, $state, $stateParams, auth) {
    kbui = new UIUtils();

    // Critical: used for navigation urls and highlighting
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    //$rootScope.kb = kb;

    $rootScope.user = auth.user;
    $rootScope.token = auth.token;

}]);


