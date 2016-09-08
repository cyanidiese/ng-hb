(function() {
    'use strict';

    angular
        .module('handbidDirectives')
        .directive('handbidItemBox', ItemBoxDirective);


    function ItemBoxDirective(){
        return {
            restrict: 'A',
            scope: {
                item: '=handbidItemBox',
                auction: '=auction'
            },
            templateUrl: hb_routes.views.directives.item_box,
            replace: true,
            link: function($scope, elem, attr, ctrl) {

                $scope.getLeftText = function(item){
                    return (item.isForSaleItem ? (item.isDonation ? 'Donated' : 'Sold') : 'Bids');
                };

                $scope.getLeftValue = function(item){
                    return (item.isForSaleItem ? (item.hideSales ? '' : item.quantitySold) : item.bidCount);
                };

                $scope.getRightClass = function(item){
                    return (item.isForSaleItem ? 'remaining' : 'bid-now');
                };

                $scope.getRightText = function(item){
                    return (item.isForSaleItem ? 'Left' : 'Bid Now');
                };

                $scope.getRightValue = function(item){

                    return (item.isForSaleItem
                        ? ((!item.hasInventory || (item.inventoryRemaining == -1)) ? '∞' : item.inventoryRemaining)
                        : '');
                };

            }
        };
    }

})();

