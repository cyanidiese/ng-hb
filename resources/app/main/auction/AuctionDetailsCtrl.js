(function() {
    'use strict';

    angular
        .module('handbidApp')
        .controller('AuctionDetailsCtrl', AuctionDetailsCtrl);

    AuctionDetailsCtrl.$inject = ['$scope', '$routeParams', 'intermediator', 'auctions'];

    function AuctionDetailsCtrl($scope, $routeParams, intermediator, auctions){

        var vm = this;

        vm.initialization = true;

        vm.intermediator = intermediator;

        vm.intermediator.setPageType('auction');

        vm.auctionSlug = $routeParams.auctionSlug;

        vm.auction = false;
        vm.categories = [];
        vm.items = [];

        getAuction();

        //##################################################

        function getAuction()
        {
            var data = {
                "slug": vm.auctionSlug
            };
            auctions.getAuctionBySlug(data).then(function(data)
            {
                vm.initialization = false;

                vm.auction = data;

                vm.intermediator.setPageObject(data);

                prepareCategoriesAndItems()

            });
        }

        function prepareCategoriesAndItems()
        {
            vm.categories = [];
            vm.items = [];

            angular.forEach(vm.auction.categories, function(category) {

                vm.categories.push(category);

                angular.forEach(category.items, function(item) {
                    vm.items.push(item);
                });
            });
        }
    }

})();

