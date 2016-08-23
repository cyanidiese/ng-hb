(function () {
    'use strict';

    angular
        .module('handbidFactories')
        .factory('auctions', auctions);

    auctions.$inject = ['$http'];

    function auctions($http) {

        return {
            getAuctions: getAuctions,
            getAuctionBySlug: getAuctionBySlug
        };

        function getAuctions(data) {

            return $http.post(hb_routes.factories.auctions.list, data).then(function (response) {
                return response.data;
            });
        }

        function getAuctionBySlug(data) {

            return $http.post(hb_routes.factories.auctions.details, data).then(function (response) {
                console.log(response.data);
                return response.data;
            });
        }
    }

})();

