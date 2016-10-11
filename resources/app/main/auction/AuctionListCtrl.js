(function() {
    'use strict';

    angular
        .module('handbidApp')
        .controller('AuctionListCtrl', AuctionListCtrl);

    AuctionListCtrl.$inject = ['$scope', 'intermediator', 'auctions'];

    function AuctionListCtrl($scope, intermediator, auctions){

        var vm = this;

        vm.loading = true;

        vm.intermediator = intermediator;

        vm.intermediator.broadcastPageType('auctions');


    }

})();

