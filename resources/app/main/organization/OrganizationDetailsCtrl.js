(function() {
    'use strict';

    angular
        .module('handbidApp')
        .controller('OrganizationDetailsCtrl', OrganizationDetailsCtrl);

    OrganizationDetailsCtrl.$inject = ['$scope', '$routeParams', 'intermediator'];

    function OrganizationDetailsCtrl($scope, $routeParams, intermediator, organizations){

        var vm = this;

        vm.initialization = true;

        vm.intermediator = intermediator;

        vm.intermediator.setPageType('auction');

        vm.organizationSlug = $routeParams.organizationSlug;

        vm.organization = false;

        getOrganization();

        //##################################################

        function getOrganization()
        {
            var data = {
                "slug": vm.auctionSlug
            };

            organizations.getOrganizationBySlug(data).then(function(data)
            {
                vm.initialization = false;

                vm.organization = data;

                vm.intermediator.setPageObject(data);

            });
        }
    }

})();

