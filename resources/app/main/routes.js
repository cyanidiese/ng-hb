(function() {
    'use strict';

    angular
        .module('handbidApp')
        .config(config);

    config.$inject = ['$routeProvider'];

    function config($routeProvider) {
        $routeProvider.
            when('/', {
                redirectTo: '/auctions'
            }).
            when('/auctions', {
                templateUrl: hb_routes.views.main.auction.list,
                controller: 'AuctionListCtrl',
                controllerAs: 'vm'
            }).
            when('/auctions/:auctionSlug', {
                templateUrl: hb_routes.views.main.auction.details,
                controller: 'AuctionDetailsCtrl',
                controllerAs: 'vm'
            }).
            when('/auctions/:auctionSlug/item/:itemSlug', {
                templateUrl: hb_routes.views.main.auction.item.details,
                controller: 'ItemDetailsCtrl',
                controllerAs: 'vm'
            }).
            when('/organizations', {
                templateUrl: hb_routes.views.main.organization.list,
                controller: 'OrganizationListCtrl',
                controllerAs: 'vm'
            }).
            when('/organizations/:organizationSlug', {
                templateUrl: hb_routes.views.main.organization.details,
                controller: 'OrganizationDetailsCtrl',
                controllerAs: 'vm'
            }).
            otherwise({
                redirectTo: '/auctions'
            });
    }
})();

