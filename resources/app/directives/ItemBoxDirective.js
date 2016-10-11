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
                auction: '=auction',
                inventory: '=inventory',
                tools: '=tools'
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

                $scope.isItemInWinning = function(item){

                    return $scope.tools.isItemInWinning(item.id);
                };

                $scope.isItemInLosing = function(item){

                    return $scope.tools.isItemInLosing(item.id);
                };

                $scope.$watch('item', function (current, original)
                {
                    $scope.leftText = $scope.getLeftText(current);
                    $scope.leftValue = $scope.getLeftValue(current);
                    $scope.rightClass = $scope.getRightClass(current);
                    $scope.rightText = $scope.getRightText(current);
                    $scope.rightValue = $scope.getRightValue(current);
                    $scope.rightValue = $scope.getRightValue(current);
                    $scope.itemInWinning = $scope.isItemInWinning(current);
                    $scope.itemInLosing = $scope.isItemInLosing(current);
                });

                $scope.$watch('inventory', function (current, original)
                {
                    $scope.itemInWinning = $scope.isItemInWinning(current);
                    $scope.itemInLosing = $scope.isItemInLosing(current);
                });


            }
        };
    }

})();

