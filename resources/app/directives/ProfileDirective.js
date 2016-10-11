(function() {
    'use strict';

    angular
        .module('handbidDirectives')
        .directive('handbidProfile', ProfileDirective);


    function ProfileDirective(){
        return {
            restrict: 'A',
            scope: {
                profile: '=profile',
                inventory: '=inventory',
                auction: '=auction',
                tools: '=tools'
            },
            templateUrl: hb_routes.views.directives.profile,
            replace: true,
            link: function($scope, elem, attr, ctrl) {
                //
            }
        };
    }

})();

