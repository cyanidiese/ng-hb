(function () {
    'use strict';

    angular
        .module('handbidApp')
        .controller('ItemDetailsCtrl', ItemDetailsCtrl);

    ItemDetailsCtrl.$inject = ['$scope', '$routeParams', 'intermediator', 'items', 'profile'];

    function ItemDetailsCtrl($scope, $routeParams, intermediator, items, profile) {

        var vm = this;

        vm.initialization = true;

        vm.intermediator = intermediator;

        vm.intermediator.broadcastPageType('item');

        vm.auctionSlug = $routeParams.auctionSlug;
        vm.itemSlug = $routeParams.itemSlug;

        vm.item = [];
        vm.auction = [];
        vm.profile = [];
        vm.inventory = null;

        vm.currentBuyingCount = 1;
        vm.currentBiddingAmount = 1;
        vm.currentMaxBidAmount = 1;

        vm.isSettingBid = false;
        vm.isSettingMaxBid = false;
        vm.isBuyingNow = false;
        vm.isPurchasing = false;

        vm.getBidsCount = getBidsCount;
        vm.isTicket = isTicket;
        vm.isDonation = isDonation;
        vm.isBidpadOnly = isBidpadOnly;
        vm.isDirectPurchaseItem = isDirectPurchaseItem;
        vm.isBiddable = isBiddable;
        vm.isLiveItem = isLiveItem;
        vm.isBidpadOnly = isBidpadOnly;
        vm.isAlreadySold = isAlreadySold;
        vm.isValueHidden = isValueHidden;
        vm.isNotShownInPresale = isNotShownInPresale;
        vm.isAuctionClosed = isAuctionClosed;
        vm.isBuyItNowItem = isBuyItNowItem;

        vm.isItemInWinning = isItemInWinning;
        vm.isItemInLosing = isItemInLosing;

        vm.biddingDecrease = biddingDecrease;
        vm.biddingIncrease = biddingIncrease;
        vm.maxBidDecrease = maxBidDecrease;
        vm.maxBidIncrease = maxBidIncrease;

        vm.biddingSetBid = biddingSetBid;
        vm.biddingSetMaxBid = biddingSetMaxBid;
        vm.biddingBuyNow = biddingBuyNow;
        vm.biddingPurchase = biddingPurchase;

        getItem();

        //##################################################

        function getItem() {
            var data = {
                "slug": vm.itemSlug
            };
            items.getItemBySlug(data).then(function (data) {
                vm.initialization = false;

                vm.item = data;

                vm.intermediator.broadcastItem(data);

                vm.currentBiddingAmount = vm.item.minimumBidAmount;
                vm.currentMaxBidAmount = vm.item.minimumBidAmount;

                vm.auction = vm.item.auction;

                if (vm.item.bids == undefined) {
                    vm.item.bids = [];
                }

            });
        }

        //##################################################

        function getBidsCount() {
            if(vm.item.bids == undefined){
                return 0;
            }
            return vm.item.bids.length;
        }

        //##################################################

        function isTicket(item) {
            return item.isTicket;
        }

        function isDonation(item) {
            return item.isAppeal;
        }

        function isBidpadOnly(item) {
            return item.isBidpadOnly;
        }

        function isDirectPurchaseItem(item) {
            return item.isDirectPurchaseItem || isTicket(item);
        }

        function isBiddable(item) {
            return !isDirectPurchaseItem(item);
        }

        function isLiveItem(item) {
            return item.disableMobileBidding;
        }

        function isBidpadOnly(item) {
            return item.isBidpadOnly;
        }

        function isAlreadySold(item) {
            return (item.status == 'sold' || item.status == 'paid' || (isTicket(item) && (item.inventoryRemaining == 0)));
        }

        function isValueHidden(item) {
            return (item.showValue != undefined) && (parseInt(item.showValue) != 1);
        }

        function isNotShownInPresale(item) {
            if(item.auction == undefined){
                return false;
            }
            return (item.auction.status == 'presale' || item.auction.status == 'preview') && (parseInt(item.availableForPreSale) != 1);
        }

        function isAuctionClosed(item) {
            if(item.auction == undefined){
                return false;
            }
            return (item.auction.status == 'closed')
        }

        function isBuyItNowItem(item) {
            return isBiddable(item) && (parseInt(item.buyNowPrice) > 0) && (parseInt(item.buyNowPrice) > parseInt(item.minimumBidAmount))
        }

        //##################################################


        function canConnectToSockets() {
            return false;
        }

        function reloadInventoryIfNoSockets() {

            if(!canConnectToSockets()){
                vm.intermediator.broadcastReloadingInventory(vm.item.auction.id);
                getItem();
            }

        }

        //##################################################

        function isItemInWinning(item_id) {

            return vm.intermediator.isItemInWinning(item_id, vm.inventory);

        }

        function isItemInLosing(item_id, inventory) {

            return vm.intermediator.isItemInLosing(item_id, vm.inventory);
        }

        //##################################################

        function biddingDecrease() {

            console.log('=======bidding Decrease=========');

            if(isBiddable(vm.item)){
                if((vm.currentBiddingAmount - vm.item.bidIncrement) >= vm.minimumBidAmount){
                    vm.currentBiddingAmount -= vm.item.bidIncrement;
                }
            }
            else{
                if(vm.currentBuyingCount > 1){
                    vm.currentBuyingCount--;
                }
            }
        }

        function biddingIncrease() {

            console.log('=======bidding Increase=========');

            if(isBiddable(vm.item)){

                if((vm.item.buyNowPrice <= 0 ) || ((vm.item.buyNowPrice > 0) && ((vm.currentBiddingAmount + vm.item.bidIncrement) <= vm.item.buyNowPrice))){
                    vm.currentBiddingAmount += vm.item.bidIncrement;
                }

            }
            else{
                if((vm.item.inventoryRemaining == -1)
                   || ((vm.currentBuyingCount + 1) <= vm.item.inventoryRemaining )){
                    vm.currentBuyingCount++;
                }
            }
        }

        function maxBidDecrease() {

            console.log('=======maxBid Decrease=========');

            if((vm.currentMaxBidAmount - vm.item.bidIncrement) >= vm.currentBiddingAmount){
                vm.currentMaxBidAmount -= vm.item.bidIncrement;
            }
        }

        function maxBidIncrease() {

            console.log('=======maxBid Increase=========');

            if((vm.item.buyNowPrice <= 0 ) || ((vm.item.buyNowPrice > 0) && ((vm.currentMaxBidAmount + vm.item.bidIncrement) < vm.item.buyNowPrice))){
                vm.currentMaxBidAmount += vm.item.bidIncrement;
            }
        }

        function doingNoAction() {
            return (!vm.isSettingBid && !vm.isSettingMaxBid && !vm.isBuyingNow && !vm.isPurchasing);
        }

        function biddingSetBid() {
            if(doingNoAction()) {

                vm.isSettingBid = true;
                profile.createBid(vm.profile.id, vm.item.auction.id, vm.item.id, vm.currentBiddingAmount).then(function (data) {
                    vm.isSettingBid = false;
                    reloadInventoryIfNoSockets();
                    console.log('==bid set==');
                    console.log(data);

                });
                console.log('=======bidding Set Bid=========');
            }
        }

        function biddingSetMaxBid() {
            if(doingNoAction()) {
                vm.isSettingMaxBid = true;
                profile.createMaxBid(vm.profile.id, vm.item.auction.id, vm.item.id, vm.currentMaxBidAmount).then(function (data) {
                    vm.isSettingMaxBid = false;
                    reloadInventoryIfNoSockets();
                    console.log('==max bid set==');
                    console.log(data);

                });
                console.log('=======bidding Set Max Bid=========');
            }
        }

        function biddingBuyNow() {
            if(doingNoAction()) {
console.log(vm.profile);
                vm.isBuyingNow = true;
                profile.createBuyNow(vm.profile.id, vm.item.auction.id, vm.item.id, vm.item.buyNowPrice).then(function (data) {
                    vm.isBuyingNow = false;
                    reloadInventoryIfNoSockets();
                    console.log('==buy now success==');
                    console.log(data);

                });

                console.log('=======bidding Buy Now=========');
            }
        }

        function biddingPurchase() {
            if(doingNoAction()) {

                vm.isPurchasing = true;
                profile.createPurchase(vm.profile.id, vm.item.auction.id, vm.item.id, vm.item.buyNowPrice, vm.currentBuyingCount).then(function (data) {
                    vm.isPurchasing = false;
                    vm.currentBuyingCount = 1;
                    reloadInventoryIfNoSockets();
                    console.log('==purchase success==');
                    console.log(data);

                });
                console.log('=======bidding Purchase=========');
            }
        }

        //##################################################

        $scope.$watch('vm.currentBiddingAmount', function (current, original) {

            vm.currentMaxBidAmount = current;

        });

        $scope.$watch('vm.item.minimumBidAmount', function (current, original) {

            if(vm.currentBiddingAmount < current)
            {
                vm.currentBiddingAmount = current;
            }

        });

        $scope.$watch('vm.item.inventoryRemaining', function (current, original) {

            if(current != -1)
            {
                if (vm.currentBuyingCount > current)
                {
                    vm.currentBuyingCount = current;
                }
            }

        });


        $scope.$on('inventory-updated', function(event, args) {

            vm.inventory = args;

        });


        $scope.$on('profile-updated', function(event, args) {

            vm.profile = args;

        });
    }

})();

