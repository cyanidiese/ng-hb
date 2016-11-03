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

        vm.intermediator.broadcastPageType('auction');

        vm.auctionSlug = $routeParams.auctionSlug;

        vm.items_type = 'all';
        vm.items_category = 'all';
        vm.items_search = '';

        vm.items_sorting_vars = setFiltersOrdering();
        vm.items_sorting_type = '_sortNameAsc';
        vm.order_by = 'name';
        vm.order_reverse = false;
        vm.filters_by_type = getFiltersByType();
        vm.filters_by_type_mobile = getFiltersByType(true);
        vm.filters_by_categories = getFiltersByCategories();
        vm.filters_by_categories_mobile = getFiltersByCategories(true);

        vm.inventory = null;
        vm.profile = [];
        vm.auction = false;
        vm.categories = [];
        vm.items = [];

        vm.ticket_counts = {};
        vm.tickets_price = 0;

        vm.displayed_items = [];

        vm.clearItemsSearch = clearItemsSearch;
        vm.changeItemsType = changeItemsType;
        vm.changeItemsCategory = changeItemsCategory;
        vm.changeItemsOrdering = changeItemsOrdering;

        vm.ticketBuyCountIncrease = ticketBuyCountIncrease;
        vm.ticketBuyCountDecrease = ticketBuyCountDecrease;
        vm.buySelectedTickets = buySelectedTickets;

        vm.isAuthorized = isAuthorized;

        vm.tools = {
            isItemInWinning : isItemInWinning,
            isItemInLosing : isItemInLosing
        };

        getAuction();

        //##################################################

        function getAuction() {
            var data = {
                "slug": vm.auctionSlug
            };
            auctions.getAuctionBySlug(data).then(function (data) {
                vm.initialization = false;

                vm.auction = data;

                vm.intermediator.broadcastAuction(data);

                prepareCategoriesAndItems();

                vm.intermediator.askResendInventory();

            });
        }

        function prepareCategoriesAndItems() {
            vm.categories = [];
            vm.items = [];

            angular.forEach(vm.auction.categories, function (category) {

                vm.categories.push(category);

                angular.forEach(category.items, function (item) {

                    item.isForSaleItem = (item.isDirectPurchaseItem || item.isTicket);

                    item.bidCount = parseInt((item.isForSaleItem ? item.quantitySold : item.bidCount));

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

        //##################################################

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

        function setFiltersOrdering() {
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

            var all_items_count = (vm.items) ? vm.items.length : 0;

            var filters = [
                {
                    value : 'all',
                    title : ((mobile) ? 'Category: ' : '') + 'All Items (' + all_items_count + ')'
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

        //##################################################


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

        function removeNonTicketsCounts() {

            angular.forEach(vm.items, function (item) {

                if (!item.isTicket) {
                    delete vm.ticket_counts[item.id];
                }
            });
        }

        function ticketBuyCountIncrease(item) {

            if(vm.ticket_counts[item.id] == undefined){
                vm.ticket_counts[item.id] = {
                    name: item.name,
                    description: item.description,
                    userId: vm.profile.id,
                    auctionId: vm.auction.id,
                    itemId: item.id,
                    amount: item.buyNowPrice,
                    quantity: 0
                };
            }

            if((item.inventoryRemaining == -1) || ((vm.ticket_counts[item.id].quantity + 1) <= item.inventoryRemaining)){
                vm.ticket_counts[item.id].quantity++;

                recalculateTotal();
            }

        }

        function ticketBuyCountDecrease(item) {

            if((vm.ticket_counts[item.id] != undefined) && ((vm.ticket_counts[item.id].quantity - 1) >= 0)){
                vm.ticket_counts[item.id].quantity--;

                recalculateTotal();
            }

        }

        function recalculateTotal() {

            var tickets_price = 0;

            angular.forEach(vm.ticket_counts, function (item) {

                tickets_price += item.quantity * item.amount;
            });

            vm.tickets_price = tickets_price;

        }

        function buySelectedTickets() {



        }

        //##################################################

        function isItemInWinning(item_id) {

            return vm.intermediator.isItemInWinning(item_id, vm.inventory);

        }

        function isItemInLosing(item_id, inventory) {

            return vm.intermediator.isItemInLosing(item_id, vm.inventory);
        }

        //##################################################

        function isAuthorized() {

            return false;

        }

        //##################################################

        function socketUpdateItem(data) {

            if(vm.items)
            {
                angular.forEach(vm.items, function(item, key)
                {
                    if((item.id == data.values.id))
                    {
                        angular.forEach(data.attributes, function(value)
                        {
                            if((item[value] != undefined) && (data.values[value] != undefined))
                            {
                                item[value] = data.values[value];
                            }
                        });

                    }
                    vm.items[key] = item;
                });

            }
        }

        //##################################################


        $scope.$watch('vm.items_type + vm.items_category + vm.items_search', function (current, original) {
            filterItems();
        });

        $scope.$watch('vm.items', function (current, original) {
            vm.filters_by_type = getFiltersByType();
            vm.filters_by_type_mobile = getFiltersByType(true);
            removeNonTicketsCounts();
            filterItems();
        });

        $scope.$watch('vm.categories', function (current, original) {
            vm.filters_by_categories = getFiltersByCategories();
            vm.filters_by_categories_mobile = getFiltersByCategories(true);
        });


        $scope.$on('inventory-updated', function(event, args) {

            vm.inventory = args;

        });


        $scope.$on('profile-updated', function(event, args) {

            vm.profile = args;

        });


        $scope.$on('event.item', function(event, args) {

            socketUpdateItem(args);

        });
    }

})();

