(function () {
    'use strict';

    angular
        .module('handbidApp')
        .controller('ItemDetailsCtrl', ItemDetailsCtrl);

    ItemDetailsCtrl.$inject = ['$scope', '$routeParams', 'intermediator', 'items'];

    function ItemDetailsCtrl($scope, $routeParams, intermediator, items) {

        var vm = this;

        vm.initialization = true;

        vm.intermediator = intermediator;

        vm.intermediator.setPageType('item');

        vm.auctionSlug = $routeParams.auctionSlug;
        vm.itemSlug = $routeParams.itemSlug;

        vm.item = [];
        vm.auction = [];

        getItem();

        //##################################################

        function getItem() {
            var data = {
                "slug": vm.itemSlug
            };
            items.getItemBySlug(data).then(function (data) {
                vm.initialization = false;

                vm.item = data;

                vm.intermediator.setPageObject(data);

                vm.auction = vm.item.auction;

            });
        }
    }

})();

