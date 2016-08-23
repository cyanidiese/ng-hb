(function() {
    'use strict';

    angular
        .module('handbidDirectives')
        .directive('handbidTitle', TitleDirective);


    function TitleDirective(){
        return {
            restrict: 'A',
            scope: {
                type: '=',
                inst: '='
            },
            templateUrl: hb_routes.views.directives.title,
            replace: true,
            link: function($scope, elem, attr, ctrl) {
                //
            }
        };
    }

})();

