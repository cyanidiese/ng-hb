(function() {
    'use strict';

    angular
        .module('handbidApp')
        .controller('ProfileCtrl', ProfileCtrl);

    ProfileCtrl.$inject = ['$scope', 'intermediator', 'profile'];

    function ProfileCtrl($scope, intermediator, profile){

        var vm = this;

        vm.loading = true;

        vm.profile = null;
        vm.auction = null;
        vm.inventory = null;
        vm.intermediator = intermediator;

        vm.isRemovingMaxBid = false;

        vm.inventory_auction_id = 0;

        vm.tools = {
            getInventoryMaxBidsCount : getInventoryMaxBidsCount,
            getInventoryWinningCount : getInventoryWinningCount,
            getInventoryLosingCount : getInventoryLosingCount,
            getInventoryPurchasesCount : getInventoryPurchasesCount,
            getInventoryTotal : getInventoryTotal,
            removeMaxBid : removeMaxBid
        };

        getProfile();

        //##################################################

        function getProfile() {
            console.log('==getting profile==');

            profile.getProfile().then(function (data) {

                vm.loading = false;

                vm.profile = data;

                console.log('==profile set==');

            });
        }

        function getInventory(auction_id) {

            console.log('==getting inventory==');

            var data = {
                'auction_id' : auction_id
            };

            profile.getInventory(data).then(function (data) {

                vm.inventory = data;

                if(vm.inventory.max_bids == undefined){
                    vm.inventory.max_bids = [];
                }
                if(vm.inventory.winning == undefined){
                    vm.inventory.winning = [];
                }
                if(vm.inventory.losing == undefined){
                    vm.inventory.losing = [];
                }
                if(vm.inventory.purchases == undefined){
                    vm.inventory.purchases = [];
                }

                console.log('==inventory set==');

            });
        }

        function getInventoryMaxBidsCount() {

            return vm.inventory.max_bids.length;
        }

        function getInventoryWinningCount() {

            return vm.inventory.winning.length;
        }

        function getInventoryLosingCount() {

            return vm.inventory.losing.length;
        }

        function getInventoryPurchasesCount() {

            return vm.inventory.purchases.length;
        }

        function getInventoryTotal() {

            var count = 0;

            if(vm.inventory != null && vm.inventory.purchases != undefined) {

                angular.forEach(vm.inventory.purchases, function (purchase) {
                    count += purchase.quantity * purchase.pricePerItem;
                });
            }

            if(vm.inventory != null && vm.inventory.winning != undefined) {

                angular.forEach(vm.inventory.winning, function (winning) {
                    count += winning.amount;
                });
            }

            return count;
        }

        function removeMaxBid(max_bid) {

            if(!max_bid.is_removing) {

                max_bid.is_removing = true;
                profile.removeBid(max_bid.id).then(function (data) {
                    vm.isRemovingMaxBid = false;
                    console.log('==max bid removed==');
                    console.log(data);

                });
                console.log('=======bidding Remove Max Bid=========');
            }

        }

        $scope.$on('reload-inventory', function(event, args) {

            getInventory(args);

        });

        $scope.$on('auction-updated', function(event, args) {

            vm.auction = args;

        });

        $scope.$watch('vm.auction', function (current, original) {

            if(vm.auction) {
                vm.tools.currencyCode   = vm.auction.currencyCode;
                vm.tools.currencySymbol = vm.auction.currencySymbol;
            }

        });

        $scope.$watch('vm.profile', function (current, original) {

            vm.intermediator.broadcastProfile(current);

        });

        $scope.$watch('vm.inventory', function (current, original) {

            vm.intermediator.broadcastInventory(current);

            if(vm.inventory) {
                vm.tools.inventoryMaxBidsCount   = getInventoryMaxBidsCount();
                vm.tools.inventoryWinningCount   = getInventoryWinningCount();
                vm.tools.inventoryLosingCount    = getInventoryLosingCount();
                vm.tools.inventoryPurchasesCount = getInventoryPurchasesCount();
                vm.tools.inventoryTotal          = getInventoryTotal();
            }

        });

        $scope.$watch('vm.auction.id', function (current, original) {

            getInventory(current);

        });
    }

})();

