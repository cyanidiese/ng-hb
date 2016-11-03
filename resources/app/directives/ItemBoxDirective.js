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

                $scope.recheckItemProperties = function(item){
                    $scope.leftText = $scope.getLeftText(item);
                    $scope.leftValue = $scope.getLeftValue(item);
                    $scope.rightClass = $scope.getRightClass(item);
                    $scope.rightText = $scope.getRightText(item);
                    $scope.rightValue = $scope.getRightValue(item);
                    $scope.rightValue = $scope.getRightValue(item);
                    $scope.itemInWinning = $scope.isItemInWinning(item);
                    $scope.itemInLosing = $scope.isItemInLosing(item);
                };

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
                    $scope.recheckItemProperties(current);
                });

                $scope.$watch('inventory', function (current, original)
                {
                    $scope.itemInWinning = $scope.isItemInWinning($scope.item);
                    $scope.itemInLosing = $scope.isItemInLosing($scope.item);
                });


            }
        };
    }

})();

