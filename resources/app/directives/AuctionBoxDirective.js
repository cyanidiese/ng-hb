(function() {
    'use strict';

    angular
        .module('handbidDirectives')
        .directive('handbidAuctionBox', AuctionBoxDirective);


    function AuctionBoxDirective(){
        return {
            restrict: 'A',
            scope: {
                auction: '=handbidAuctionBox'
            },
            templateUrl: hb_routes.views.directives.auction_box,
            replace: true,
            link: function($scope, elem, attr, ctrl) {
            }
        };
    }

})();

