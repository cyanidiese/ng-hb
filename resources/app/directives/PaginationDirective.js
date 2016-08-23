(function() {
    'use strict';

    angular
        .module('handbidDirectives')
        .directive('lunchPagination', PaginationDirective);


    function PaginationDirective(){
        return {
            restrict: 'EA',
            scope: {
                current: '=',
                maximum: '=',
                total: '='
            },
            templateUrl: app_templates.directives.pagination,
            replace: true,
            link: function($scope, elem, attr, ctrl) {

                $scope.countNumberOfPages = function(){
                    return Math.ceil($scope.total / $scope.maximum);
                };

                $scope.getArrayOfPages = function(){
                    var pages = [];
                    for(var i = 1; i <= $scope.countNumberOfPages(); i++){
                        pages.push(i);
                    }
                    return pages;
                };

                $scope.setNewCurrentPage = function(page){
                    $scope.current = page;
                }
            }
        };
    }

})();

