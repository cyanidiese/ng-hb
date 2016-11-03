(function() {
    'use strict';

    angular
        .module('handbidApp')
        .controller('ProfileCtrl', ProfileCtrl);

    ProfileCtrl.$inject = ['$scope', 'intermediator', 'profile', 'hbnotices', 'hbsockets'];

    function ProfileCtrl($scope, intermediator, profile, hbnotices, hbsockets){

        var vm = this;

        vm.loading = true;

        vm.profile = null;
        vm.auction = null;
        vm.inventory = null;
        vm.receipts = null;
        vm.intermediator = intermediator;
        vm.notices = hbnotices;
        vm.sockets = hbsockets;

        vm.isRemovingMaxBid = false;

        vm.inventory_auction_id = 0;

        vm.tools = {
            getInventoryMaxBidsCount : getInventoryMaxBidsCount,
            getInventoryWinningCount : getInventoryWinningCount,
            getInventoryLosingCount : getInventoryLosingCount,
            getInventoryPurchasesCount : getInventoryPurchasesCount,
            getInventoryTotal : getInventoryTotal,
            removeMaxBid : removeMaxBid,
            updateProfile : updateProfile,
            removeCreditCard : removeCreditCard,
            is_updating_profile : false,
            form_profile : vm.profile,
            countries_and_provinces : intermediator.getCountriesAndProvinces()
        };

        getProfile();
        getReceipts();

        //##################################################

        function getProfile() {
            console.log('==getting profile==');

            profile.getProfile().then(function (data) {

                vm.loading = false;

                vm.profile = data;

                vm.tools.form_profile = vm.intermediator.clone(data);

                console.log('==profile set==');
                console.log(vm.profile);

            });
        }

        function getReceipts() {
            console.log('==getting receipts==');

            profile.getReceipts().then(function (data) {

                vm.receipts = data;

                console.log('==receipts set==');
                console.log(vm.receipts);

            });
        }

        function getInventory(auction_id) {

            if(auction_id) {
                console.log('==getting inventory==');

                var data = {
                    'auction_id': auction_id
                };

                profile.getInventory(data).then(function (data) {

                    vm.inventory = data;

                    if (vm.inventory.max_bids == undefined) {
                        vm.inventory.max_bids = [];
                    }
                    if (vm.inventory.winning == undefined) {
                        vm.inventory.winning = [];
                    }
                    if (vm.inventory.losing == undefined) {
                        vm.inventory.losing = [];
                    }
                    if (vm.inventory.purchases == undefined) {
                        vm.inventory.purchases = [];
                    }

                    console.log('==inventory set==');

                });
            }
            else{
                vm.inventory = null;
            }
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

        function updateProfile(data) {

            if(data.length) {
                vm.tools.is_updating_profile = true;
                profile.updateProfile(data).then(function (data) {
                    vm.tools.is_updating_profile = false;

                    vm.profile = data;

                    vm.notices.success("Messaga", 'Profile set');

                    console.log('==profile updated==');
                    console.log(data);

                });
                console.log('=======update Profile=========');
            }

        }

        function removeCreditCard(card) {

            if(!card.isRemoving) {
                card.isRemoving = true;
                profile.removeCreditCard({ card_id : card.id }).then(function (data) {
                    card.isRemoving = false;

                    if(data.success){
                        vm.notices.success("Removed", data.message);
                    }

                    vm.profile.creditCards = angular.element.grep(
                        vm.profile.creditCards,
                        function(e){ return e.id !== card.id; }
                        );


                    console.log('==card was successfully removed==');
                    console.log(data);

                });
                console.log('=======remove card=========');
            }

        }

        $scope.$on('ask-resend-inventory', function(event, args) {

            vm.intermediator.broadcastInventory(vm.inventory);

        });

        $scope.$on('reload-inventory', function(event, args) {

            getInventory(args);

        });

        $scope.$on('auction-updated', function(event, args) {

            vm.auction = args;
            if(vm.auction){
                vm.sockets.connectToAuctionChannel(vm.auction.auctionGuid);
            }
            else{
                vm.sockets.connectToAuctionChannel(null);
            }

        });

        $scope.$on('page-type-updated', function(event, args) {

            if((args != 'auction') && (args != 'item')){
                vm.auction = null;
                vm.sockets.connectToAuctionChannel(null);
            }

        });

        $scope.$watch('vm.auction', function (current, original) {

            if(vm.auction) {
                vm.tools.currencyCode   = vm.auction.currencyCode;
                vm.tools.currencySymbol = vm.auction.currencySymbol;
                vm.tools.auctionName    = vm.auction.name;
            }

        });

        $scope.$watch('vm.profile', function (current, original) {

            vm.tools.form_profile = vm.intermediator.clone(current);
            vm.intermediator.broadcastProfile(current);

            if(current){
                vm.sockets.connectToUserChannel(current.usersGuid);
            }
            else{
                vm.sockets.connectToUserChannel(null);
            }

        });

        $scope.$watch('vm.inventory', function (current, original) {

            console.log('INVENTORY CHANGED');
            console.log(vm.inventory);

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

