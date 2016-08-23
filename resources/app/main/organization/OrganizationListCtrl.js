(function() {
    'use strict';

    angular
        .module('handbidApp')
        .controller('OrganizationListCtrl', OrganizationListCtrl);

    OrganizationListCtrl.$inject = ['$scope', 'intermediator', 'organizations'];

    function OrganizationListCtrl($scope, intermediator, organizations){

        var vm = this;

        vm.initialization = true;

        vm.intermediator = intermediator;

        vm.intermediator.setPageType('organizations');

        vm.organizations = [];
        vm.organizations_chunks = [];

        getOrganizations();

        //##################################################

        function getOrganizations()
        {
            organizations.getOrganizations().then(function(data)
            {
                vm.initialization = false;
                vm.organizations = data;

                vm.intermediator.setPageObject(false);

                splitOrganizations();
            });
        }

        function splitOrganizations()
        {
            vm.organizations_chunks = [];
            var i,j,chunk = 4;
            for (i=0,j=vm.organizations.length; i<j; i+=chunk) {
                vm.organizations_chunks.push(vm.organizations.slice(i,i+chunk));
            }
        }
    }

})();

