(function () {
    'use strict';

    angular
        .module('handbidApp')
        .controller('AuctionDetailsCtrl', AuctionDetailsCtrl);

    AuctionDetailsCtrl.$inject = ['$scope', '$routeParams', 'intermediator', 'auctions'];

    function AuctionDetailsCtrl($scope, $routeParams, intermediator, auctions) {

        var vm = this;

        vm.initialization = true;

        vm.intermediator = intermediator;

        vm.intermediator.setPageType('auction');

        vm.auctionSlug = $routeParams.auctionSlug;

        vm.items_type = 'all';
        vm.items_category = 'all';
        vm.items_search = '';

        vm.items_sorting_type = '_sortNameAsc';
        vm.order_by = 'name';
        vm.order_reverse = false;

        vm.auction = false;
        vm.categories = [];
        vm.items = [];

        vm.displayed_items = [];

        vm.clearItemsSearch = clearItemsSearch;
        vm.changeItemsType = changeItemsType;
        vm.changeItemsCategory = changeItemsCategory;
        vm.changeItemsOrdering = changeItemsOrdering;

        vm.getFiltersOrdering = getFiltersOrdering;
        vm.getFiltersByCategories = getFiltersByCategories;
        vm.getFiltersByType = getFiltersByType;

        getAuction();

        //##################################################

        function getAuction() {
            var data = {
                "slug": vm.auctionSlug
            };
            auctions.getAuctionBySlug(data).then(function (data) {
                vm.initialization = false;

                vm.auction = data;

                vm.intermediator.setPageObject(data);

                prepareCategoriesAndItems()

            });
        }

        function prepareCategoriesAndItems() {
            vm.categories = [];
            vm.items = [];

            angular.forEach(vm.auction.categories, function (category) {

                vm.categories.push(category);

                angular.forEach(category.items, function (item) {

                    item.isForSaleItem = (item.isDirectPurchaseItem || item.isTicket);

                    if (item.isForSaleItem) {
                        item.currentPrice = item.buyNowPrice;
                    }

                    vm.items.push(item);
                });
            });

            filterItems();
        }

        function filterItems() {
            vm.displayed_items = [];

            angular.forEach(vm.items, function (item) {

                var can_display = true;

                if (vm.items_category != 'all') {
                    can_display = can_display && (item.categoryId == vm.items_category);
                }

                if (vm.items_type != 'all') {
                    switch (vm.items_type) {
                        case 'for_sale':
                            can_display = can_display && (item.isForSaleItem);
                            break;
                        case 'live':
                            can_display = can_display && (item.disableMobileBidding || item.isBidpadOnly);
                            break;
                        case 'no_bids':
                            can_display = can_display && (!(item.isForSaleItem) ? (item.bidCount == 0) : false);
                            break;
                        case 'tickets':
                            can_display = can_display && (item.isTicket);
                            break;
                    }
                }

                if (vm.items_search != '') {
                    can_display = can_display && (item.name.toLowerCase().includes(vm.items_search.toLowerCase()))
                }

                if (parseInt(item.isHidden)) {
                    can_display = false;
                }

                if (can_display) {
                    vm.displayed_items.push(item);
                }
            });

        }

        function auctionHasAnyTickets() {

            var has_tickets = false;

            angular.forEach(vm.items, function (item)
            {
                if (item.isTicket) {
                    has_tickets = true;
                }
            });

            return has_tickets;
        }

        function clearItemsSearch() {
            vm.items_search = '';
        }

        function changeItemsType(type) {
            vm.items_type = type;
        }

        function changeItemsCategory(category_id) {
            vm.items_category = category_id;
        }

        function changeItemsOrdering() {
            switch (vm.items_sorting_type) {
                case '_sortNameAsc':
                    vm.order_by = 'name';
                    vm.order_reverse = false;
                    break;
                case '_sortNameDesc':
                    vm.order_by = 'name';
                    vm.order_reverse = true;
                    break;
                case '_sortPriceAsc':
                    vm.order_by = 'currentPrice';
                    vm.order_reverse = false;
                    break;
                case '_sortPriceDesc':
                    vm.order_by = 'currentPrice';
                    vm.order_reverse = true;
                    break;
                case '_sortBidsAsc':
                    vm.order_by = 'bidCount';
                    vm.order_reverse = false;
                    break;
                case '_sortBidsDesc':
                    vm.order_by = 'bidCount';
                    vm.order_reverse = true;
                    break;
            }
        }

        function getFiltersOrdering() {
            return [
                {
                    value : '_sortNameAsc',
                    title : 'Name: A-Z'
                },
                {
                    value : '_sortNameDesc',
                    title : 'Name: Z-A'
                },
                {
                    value : '_sortPriceAsc',
                    title : 'Price: Low to High'
                },
                {
                    value : '_sortPriceAsc',
                    title : 'Price: Low to High'
                },
                {
                    value : '_sortPriceDesc',
                    title : 'Price: High to Low'
                },
                {
                    value : '_sortBidsAsc',
                    title : 'Total Bids: Least to Most'
                },
                {
                    value : '_sortBidsDesc',
                    title : 'Total Bids: Most to Least'
                }
            ];
        }

        function getFiltersByType(mobile) {
            var filters = [
                {
                    value : 'all',
                    title : ((mobile) ? 'Type: ' : '') + 'All Items'
                },
                {
                    value : 'for_sale',
                    title : 'For Sale'
                },
                {
                    value : 'live',
                    title : 'Live'
                },
                {
                    value : 'no_bids',
                    title : 'No Bids'
                }
            ];

            if(auctionHasAnyTickets()){
                filters.push({
                    value : 'tickets',
                    title : 'Tickets'
                })
            }

            return filters;
        }

        function getFiltersByCategories(mobile) {
            var filters = [
                {
                    value : 'all',
                    title : ((mobile) ? 'Category: ' : '') + 'All Items (' + vm.items.length + ')'
                }
            ];

            angular.forEach(vm.categories, function (category)
            {
                filters.push({
                    value : category.id,
                    title : category.name + ' (' + category.items.length + ')'
                });
            });

            return filters;
        }

        $scope.$watch('vm.items_type + vm.items_category + vm.items_search', function (current, original) {
            filterItems();
        });
    }

})();

