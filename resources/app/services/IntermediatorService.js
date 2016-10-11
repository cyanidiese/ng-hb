(function () {
    'use strict';

    angular
        .module('handbidServices')
        .service('intermediator',  intermediator);

    intermediator.$inject = ['$rootScope'];

    function intermediator($rootScope) {

        return {
            isItemInWinning : isItemInWinning,
            isItemInLosing : isItemInLosing,
            broadcastPageType : broadcastPageType,
            broadcastAuction : broadcastAuction,
            broadcastOrganization : broadcastOrganization,
            broadcastItem : broadcastItem,
            broadcastInventory : broadcastInventory,
            broadcastProfile : broadcastProfile,
            broadcastReloadingInventory : broadcastReloadingInventory
        };

        function broadcastPageType(page_type) {

            $rootScope.$broadcast('page-type-updated', page_type);
        }

        function broadcastAuction(auction) {

            $rootScope.$broadcast('auction-updated', auction);
        }

        function broadcastOrganization(organization) {

            $rootScope.$broadcast('organization-updated', organization);
        }

        function broadcastItem(item) {

            $rootScope.$broadcast('item-updated', item);

            broadcastAuction(item.auction);
        }

        function broadcastInventory(inventory) {

            $rootScope.$broadcast('inventory-updated', inventory);
        }

        function broadcastProfile(profile) {

            $rootScope.$broadcast('profile-updated', profile);
        }

        function broadcastReloadingInventory(auction_id) {

            $rootScope.$broadcast('reload-inventory', auction_id);
        }


        //#################################################################


        function isItemInWinning(item_id, inventory) {

            var presented = false;

            if (inventory != null && inventory.winning != undefined) {
                angular.forEach(inventory.winning, function (bid) {
                    if (bid.item.id == item_id) {
                        presented = true;
                    }
                });
            }

            return presented;

        }

        function isItemInLosing(item_id, inventory) {

            var presented = false;

            if (inventory != null && inventory.losing != undefined) {
                angular.forEach(inventory.losing, function (bid) {
                    if (bid.item.id == item_id) {
                        presented = true;
                    }
                });
            }
            return presented;
        }
    }

})();



