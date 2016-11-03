(function () {
    'use strict';

    angular
        .module('handbidFactories')
        .factory('profile', profile);

    profile.$inject = ['$http'];

    function profile($http) {

        return {
            getProfile: getProfile,
            getInventory: getInventory,
            getReceipts: getReceipts,
            removeBid: removeBid,
            createBidAll: createBid,
            createBid: createBid,
            createBuyNow: createBuyNow,
            createMaxBid: createMaxBid,
            createPurchase: createPurchase,
            isAuthorized: isAuthorized,
            isBidConfirmRequired: isBidConfirmRequired,
            updateProfile: updateProfile,
            addCreditCard: addCreditCard,
            removeCreditCard: removeCreditCard
        };

        function getProfile() {

            return $http.post(hb_routes.factories.profile.bidder).then(function (response) {
                return response.data;
            });
        }

        function getReceipts() {

            return $http.post(hb_routes.factories.profile.receipts).then(function (response) {
                return response.data;
            });
        }

        function getInventory(data) {

            return $http.post(hb_routes.factories.profile.inventory, data).then(function (response) {
                return response.data;
            });
        }

        //=========================================================================================

        function isAuthorized() {

            return true;
        }

        function isBidConfirmRequired() {

            return false;
        }

        //=========================================================================================

        function updateProfile(data) {

            return $http.post(hb_routes.factories.profile.update, data).then(function (response) {
                return response.data;
            });
        }

        //=========================================================================================

        function addCreditCard(data) {

            return $http.post(hb_routes.factories.profile.card.add, data).then(function (response) {
                return response.data;
            });
        }

        function removeCreditCard(data) {

            return $http.post(hb_routes.factories.profile.card.remove, data).then(function (response) {
                return response.data;
            });
        }

        //=========================================================================================

        function createBidAll(data) {

            return $http.post(hb_routes.factories.profile.bidding.create_bid, data).then(function (response) {
                return response.data;
            });
        }

        function createBid(user_id, auction_id, item_id, current_amount) {

            var data = {
                userId: user_id,
                auctionId: auction_id,
                itemId: item_id,
                amount: current_amount
            };

            return createBidAll(data);
        }

        function createBuyNow(user_id, auction_id, item_id, buy_now_price) {

            var data = {
                userId: user_id,
                auctionId: auction_id,
                itemId: item_id,
                amount: buy_now_price
            };

            return createBidAll(data);
        }

        function createPurchase(user_id, auction_id, item_id, per_item, quantity) {

            var data = {
                userId: user_id,
                auctionId: auction_id,
                itemId: item_id,
                amount: per_item,
                quantity: quantity
            };

            return createBidAll(data);
        }

        function createMaxBid(user_id, auction_id, item_id, max_amount) {

            var data = {
                userId: user_id,
                auctionId: auction_id,
                itemId: item_id,
                maxAmount: max_amount
            };

            return createBidAll(data);
        }

        function removeBid(bid_id) {

            var data = {
                bid_id : bid_id
            };
            return $http.post(hb_routes.factories.profile.bidding.remove_bid, data).then(function (response) {
                return response.data;
            });
        }
    }

})();

