(function() {
    'use strict';

    angular
        .module('handbidFactories')
        .factory('organizations', organizations);

    organizations.$inject = ['$http'];

    function organizations($http){
        return {
            getOrganizations: getOrganizations,
            getOrganizationBySlug: getOrganizationBySlug
        };

        function getOrganizations(){

            return $http.get(hb_routes.factories.organizations.list).then(function(response)
            {
                return response.data;
            });
        }

        function getOrganizationBySlug(data) {

            return $http.post(hb_routes.factories.organizations.details, data).then(function (response) {
                console.log(response.data);
                return response.data;
            });
        }
    }

})();

