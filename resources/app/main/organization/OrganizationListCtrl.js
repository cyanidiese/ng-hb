(function() {
    'use strict';

    angular
        .module('handbidApp')
        .controller('OrganizationListCtrl', OrganizationListCtrl);

    OrganizationListCtrl.$inject = ['$scope', 'intermediator', 'organizations'];

    function OrganizationListCtrl($scope, intermediator, organizations){

        var vm = this;

        vm.loading = true;

        vm.intermediator = intermediator;

        vm.intermediator.setPageType('organizations');
        vm.intermediator.setPageObject(false);

        vm.organizations = [];
        vm.organizations_chunks = [];

        vm.organizations_per_page = 24;

        vm.organizations_page = 1;

        vm.organizations_total = 0;

        getOrganizations();
        getOrganizationsCount();

        //##################################################

        function getOrganizations()
        {
            var data = {
                page : vm.organizations_page,
                limit : vm.organizations_per_page
            };

            organizations.getOrganizations(data).then(function(data)
            {
                vm.loading = false;
                vm.organizations = data;

                splitOrganizations();
            });
        }

        function getOrganizationsCount()
        {
            organizations.getOrganizationsCount().then(function(data)
            {
                vm.organizations_total = data.count;
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


        $scope.$watch('vm.organizations_page', function(current, original) {

            getOrganizations();
        });
    }

})();

