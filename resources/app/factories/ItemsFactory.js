(function () {
    'use strict';

    angular
        .module('handbidFactories')
        .factory('items', items);

    items.$inject = ['$http'];

    function items($http) {

        return {
            getItemBySlug: getItemBySlug
        };

        function getItemBySlug(data) {

            return $http.post(hb_routes.factories.auctions.items.details, data).then(function (response) {
                console.log(response.data);
                return response.data;
            });
        }
    }

})();

