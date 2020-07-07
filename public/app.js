/*
 * Copyright (c) 2015, timothydockins.com.  All rights reserved.
 * Created by tdockins on 11/6/2015.
 */
'use strict';

/*
 * mongodb://heroku_k53fczgb:cg3goughamkpot76dal84f87uv@ds051534.mongolab.com:51534/heroku_k53fczgb
 */

angular.module( 'sidamo', [
  'ui.router',
  'ui.bootstrap',
  'ngResource'
] )
  .controller( 'NavigationCtrl', [
    '$scope',
    function ( $scope ) {
      $scope.tree = {
        data : [
          {
            name : "Shops",
            link : "shops"
          }
        ]
      };
    }
  ] )
  .controller( 'MainCtrl', [
    'SidamoShopService',
    'SidamoDrinkService',
    '$http',
    function ( SidamoShopService, SidamoDrinkService, $http ) {
      var vm = this;



      vm.state = 'unsub';

      vm.shops = [];
      vm.selectedShop = undefined;
      vm.shopEntered = undefined;

      SidamoShopService.query( function ( data ) {
        window.console && console.log( data );
        data.forEach( function ( shop ) {
          vm.shops.push( shop );
        } )
      } );

      vm.submitShop = function () {
        if ( vm.selectedShop == undefined ) {
          vm.selectedShop = {
            name     : vm.shopEntered,
            location : null
          }
          vm.state = 'nameSubmitted';
        }
        else {
          vm.state = 'shopSubmitted';
        }

      }

      vm.getLocation = function ( val ) {
        return $http.get( '//maps.googleapis.com/maps/api/geocode/json', {
          params : {
            address : val,
            sensor  : false
          }
        } ).then( function ( response ) {
          return response.data.results.map( function ( item ) {
            return item.formatted_address;
          } );
        } );
      };

      vm.location = undefined;

      vm.typeaheadOnSelect = function ( $item, $model, $label ) {
        window.console && console.log( 'typeaheadOnSelect = ', $item, $model, $label );
        vm.selectedShop = $item;
      }


      vm.submitLocation = function ( location ) {
        vm.selectedShop.location = location;
        vm.state = 'shopSubmitted';
      }

      vm.submitEmail = function ( email ) {

        var saveObject = angular.extend( {}, vm.selectedShop, { vote : {
          email : email, timestamp : moment().format( 'YYYYMMDDHHmm' )
        }} );

        SidamoShopService.save( saveObject, function ( res ) {
          window.console && console.log( 'saved: ', res );
          vm.selectedShop = res.value;

          SidamoShopService.drinks( { shopId : vm.selectedShop._id }, function ( data ) {
            data.forEach( function ( drink ) {
              vm.drinks.push( drink );
            } );
            vm.state = 'emailSubmitted';
          } );
        } );
      };

      vm.drinks = [];
      vm.selectedDrink = undefined;
      vm.drinkEntered = undefined;
      vm.submitDrink = function () {

        var shopId, drinkName;
        shopId = vm.selectedShop._id;

        if ( vm.selectedDrink == undefined ) {
          drinkName = vm.drinkEntered;
          window.console && console.log(' saving drink to shop ', shopId, 'drink name', drinkName );
          SidamoDrinkService.save( { shopId : shopId, drinkName : drinkName }, function ( data ) {
            window.console && console.log('saved drink: ', data);
            vm.selectedDrink = data.value;
          })
        }
      };

      vm.typeaheadOnDrinkSelect = function( $item, $model, $label ) {
        window.console && console.log( 'typeaheadOnDrinkSelect = ', $item, $model, $label );
        vm.selectedDrink = $item;
      }

      vm.drinkExperience = undefined;

      vm.submitExperience = function() {
        var shopId = vm.selectedShop._id;

        SidamoDrinkService.experience( {drink : drink, experience : experience}, function( data ) {
          window.console && console.log('saved experience: ', data);
        })

      }

    }
  ] )
  .controller( 'ShopsCtrl', [
    'SidamoShopService',
    function ( SidamoShopService ) {
      var vm = this;

      vm.shops = [];

      SidamoShopService.query( function ( data ) {
        window.console && console.log( data );
        data.forEach( function ( shop ) {
          vm.shops.push( shop );
        } )
      } );

    }
  ] )
  .factory( 'SidamoDrinkService', [
    '$resource',
    function( $resource ) {
      return $resource( "//sidamo.herokuapp.com/api/drinks/:drinkId", {drinkId : '@drinkId'}, {})
    }
  ])
  .factory( 'SidamoShopService', [
    '$resource',
    function ( $resource ) {
      return $resource( "//sidamo.herokuapp.com/api/shop/:shopId", {shopId : '@id'}, {
        drinks : {
          method  : 'GET',
          url     : "//sidamo.herokuapp.com/api/shop/:shopId/drinks",
          isArray : true
        }
      } );
    }
  ] )
  .config( [
    '$stateProvider',
    '$locationProvider',
    '$urlRouterProvider',
    function ( $stateProvider, $locationProvider, $urlRouterProvider ) {

      $locationProvider.html5Mode( {enabled : true } ).hashPrefix( '!' );

      $urlRouterProvider.otherwise( "/" );

      $stateProvider
        .state( 'main', {
          url          : '/',
          controller   : 'MainCtrl',
          templateUrl  : 'modules/welcome/views/welcome.html',
          controllerAs : 'vm'
        } )
        .state( 'data', {
          abstract : true,
          url      : '/data',
          template : '<ui-view/>'
        } )
        .state( 'data.shops', {
          url          : '/shops',
          controller   : 'ShopsCtrl',
          templateUrl  : 'modules/shops/views/shops.html',
          controllerAs : 'vm'
        } )
      ;

    }
  ] );