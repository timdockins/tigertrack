/*
 * Copyright (c) 2015, timothydockins.com.  All rights reserved.
 * Created by tdockins on 11/6/2015.
 */
'use strict';
const URL = "//tigertrack.herokuapp.com/"
/*
 * mongodb://heroku_k53fczgb:cg3goughamkpot76dal84f87uv@ds051534.mongolab.com:51534/heroku_k53fczgb
 */

angular.module('tigertrack', [
    'ui.router',
    'ui.bootstrap',
    'angularMoment',
    'ngResource'
])
       .controller('NavigationCtrl', [
           '$scope',
           function ($scope) {
               $scope.tree = {
                   data : [
                       {
                           name : "Account",
                           link : "account"
                       },
                       {
                           name : "Track",
                           link : "track"
                       },
                       {
                           name : "Team",
                           link : "team"
                       }
                   ]
               };
           }
       ])
       .controller('MainCtrl', [
           'TigerAccountService',
           '$http',
           function (TigerAccountService, $http) {
               const vm = this;
               window.console && console.log(`MainCtrl defined`); //todo remove debug output

           }
       ])
       .controller('TrackEditController', [
           'TigerTrackService',
           'moment',
           '$http',
           function (TigerTrackService, moment, $http) {
               const vm = this;
               window.console && console.log(`TrackEditController defined`); //todo remove debug output

               vm.entryDate = moment().toDate();

               vm.activityTemplates = [
                   {
                       name        : "emails",
                       label       : "Emails",
                       description : "The number of emails sent today",
                       value       : 0
                   },
                   {
                       name        : "phonecalls",
                       label       : "Phone Calls",
                       description : "The number of phone calls today",
                       value       : 0
                   },
                   {
                       name        : "textmessages",
                       label       : "Text Messages",
                       description : "The number of text messages sent today",
                       value       : 0
                   },
                   {
                       name        : "proposals",
                       label       : "Proposals",
                       description : "The number of proposals made today",
                       value       : 0
                   }
               ]


           }
       ])
       .factory('TigerAccountService', [
           '$resource',
           function ($resource) {
               return $resource("//tigertrack.herokuapp.com/api/accounts/:accountId", {accountId : '@accountId'}, {})
           }
       ])
       .factory('TigerTrackService', [
           '$resource',
           function ($resource) {
               return $resource("//tigertrack.herokuapp.com/api/track/:trackId", {trackId : '@id'}, {});
           }
       ])
       .config([
                   '$stateProvider',
                   '$locationProvider',
                   '$urlRouterProvider',
                   function ($stateProvider, $locationProvider, $urlRouterProvider) {

                       // $locationProvider.html5Mode( {enabled : true } ).hashPrefix( '!' );

                       $urlRouterProvider.otherwise("/");
                       window.console && console.log(`config`, $stateProvider, $locationProvider, $urlRouterProvider); //todo remove debug output
                       $stateProvider
                           .state('main', {
                               url          : '/',
                               controller   : 'MainCtrl',
                               templateUrl  : 'modules/welcome/views/welcome.html',
                               controllerAs : 'vm'
                           })
                           .state('track', {
                               url          : '/track',
                               controller   : 'TrackEditController',
                               templateUrl  : 'modules/track/views/edit.html',
                               controllerAs : 'vm'
                           })
                       // .state( 'tracks', {
                       //   abstract : true,
                       //   url      : '/tracks',
                       //   template : '<ui-view/>'
                       // } )
                       // .state( 'data.shops', {
                       //   url          : '/shops',
                       //   controller   : 'ShopsCtrl',
                       //   templateUrl  : 'modules/shops/views/shops.html',
                       //   controllerAs : 'vm'
                       // } )
                       ;

                   }
               ]);
