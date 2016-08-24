(function() {
    'use strict';

    angular
        .module('handbidDirectives')
        .directive('handbidPagination', PaginationDirective);


    function PaginationDirective(){
        return {
            restrict: 'EA',
            scope: {
                current: '=',
                maximum: '=',
                total: '='
            },
            templateUrl: hb_routes.views.directives.pagination,
            replace: true,
            link: function($scope, elem, attr, ctrl) {

                $scope.countNumberOfPages = function(){
                    return Math.ceil($scope.total / $scope.maximum);
                };

                $scope.getArrayOfPages = function(){
                    var pages = {};
                    var maxCount = $scope.countNumberOfPages();
                    var prevIndex = 0;

                    for(var i = 1; i <= maxCount; i++){
                        if(
                            (i == 1) ||
                            (i == 2) ||
                            (i == 3) ||
                            (i == $scope.current - 1) ||
                            (i == $scope.current) ||
                            (i == $scope.current + 1) ||
                            (i == maxCount - 2) ||
                            (i == maxCount - 1) ||
                            (i == maxCount)
                        ){
                            pages[prevIndex] = i;
                            prevIndex = i;
                        }

                    }
                    return pages;
                };

                $scope.setNewCurrentPage = function(page){
                    $scope.current = page;
                };

                $scope.incrementPage = function(){
                    $scope.current++;
                };

                $scope.decrementPage = function(){
                    $scope.current--;
                };

                $scope.setMaxPage = function(){
                    $scope.current = $scope.countNumberOfPages();
                };

                $scope.setMinPage = function(){
                    $scope.current = 1;
                };
            }
        };
    }

})();

