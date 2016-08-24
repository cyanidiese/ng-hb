(function() {
    'use strict';

    angular
        .module('handbidFactories')
        .factory('organizations', organizations);

    organizations.$inject = ['$http'];

    function organizations($http){
        return {
            getOrganizations: getOrganizations,
            getOrganizationsCount: getOrganizationsCount,
            getOrganizationBySlug: getOrganizationBySlug
        };

        function getOrganizations(data){

            return $http.post(hb_routes.factories.organizations.list, data).then(function(response)
            {
                return response.data;
            });
        }

        function getOrganizationsCount() {

            return $http.post(hb_routes.factories.organizations.count).then(function (response) {
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

