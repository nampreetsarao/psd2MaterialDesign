angular.module('app.routes', ['app.controllers'])

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {


    //psdConfigurationsProvider.setURL("169.44.112.56","8084");
   // psdConfigurationsProvider.setAccNo("8899");

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js

    $stateProvider.state('menu', {
        url: '/menu',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'MenuCtrl'
    })

    .state('menu.transactionDetails', {
    url: '/transactionDetails',
    views: {
      'menuContent': {
        templateUrl: 'templates/transactionDetails.html',
        controller: 'transactionDetailsCtrl'
      }
    }
    })

     .state('menu.credits', {
      url: '/credits',
      views: {
          'menuContent': {
                templateUrl: 'templates/credits.html',
                controller: 'creditsCtrl'
            }
      }
  })

      .state('menu.profile', {
    url: '/profile',
    views: {
      'menuContent': {
        templateUrl: 'templates/profile.html',
        controller: 'profileCtrl'
      }
    }
    })

      .state('menu.aboutPSD2', {
    url: '/accountDetails',
    views: {
      'menuContent': {
        templateUrl: 'templates/aboutPSD2.html',
        controller: 'aboutPSD2Ctrl'
      }
    }
  })

  .state('menu.exploreAPI', {
    url: '/page2',
    views: {
      'menuContent': {
        templateUrl: 'templates/exploreAPI.html',
        controller: 'exploreAPICtrl'
      }
    }
  })

  .state('menu.aboutPSD22', {
    url: '/aboutPSD22',
    views: {
      'menuContent': {
        templateUrl: 'templates/aboutPSD22.html',
        controller: 'aboutPSD22Ctrl'
      }
    }
  })

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('signup', {
    url: '/signup',
    templateUrl: 'templates/signup.html',
    controller: 'signupCtrl'
  })


  .state('menu.showAllAccounts', {
  url: '/showAllAccounts',
  views: {
  'menuContent': {
    templateUrl: 'templates/showAllAccounts.html',
    controller: 'showAllAccountCtrl'
  }
  }
  })

  .state('menu.makeAPayment', {
  url: '/makeAPayment',
  views: {
  'menuContent': {
    templateUrl: 'templates/makeAPayment.html',
    controller: 'makeAPaymentCtrl'
  }
  }
  })

  .state('menu.tech', {
      url: '/tech',
      views: {
          'menuContent': {
                templateUrl: 'templates/tech.html',
                controller: 'techCtrl'
            }
      }
  })

   .state('menu.subscription', {
    url: '/subscription',
    views: {
      'menuContent': {
        templateUrl: 'templates/subscription.html',
        controller: 'subscriptionCtrl'
      }
    }
  })


$urlRouterProvider.otherwise('/login')
});
