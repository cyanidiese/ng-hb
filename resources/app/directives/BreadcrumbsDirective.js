(function() {
    'use strict';

    angular
        .module('handbidDirectives')
        .directive('handbidBreadcrumbs', BreadcrumbsDirective);


    function BreadcrumbsDirective(){
        return {
            restrict: 'A',
            scope: {
                type: '=',
                inst: '='
            },
            templateUrl: hb_routes.views.directives.breadcrumbs,
            replace: true,
            link: function($scope, elem, attr, ctrl) {
                //
            }
        };
    }

})();

