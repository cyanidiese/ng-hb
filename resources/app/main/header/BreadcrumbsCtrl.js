(function() {
    'use strict';

    angular
        .module('handbidApp')
        .controller('BreadcrumbsCtrl', BreadcrumbsCtrl);

    BreadcrumbsCtrl.$inject = ['$scope'];

    function BreadcrumbsCtrl($scope){

        var vm = this;

        vm.page_type = false;

        vm.page_object = false;

        $scope.$on('page-type-updated', function(event, args) {

            vm.page_type = args;

            vm.page_object = false;

        });

        $scope.$on('auction-updated', function(event, args) {

            if(vm.page_type == 'auction') {
                vm.page_object = args;
            }

        });

        $scope.$on('organization-updated', function(event, args) {

            if(vm.page_type == 'organization') {
                vm.page_object = args;
            }

        });

        $scope.$on('item-updated', function(event, args) {

            if(vm.page_type == 'item') {
                vm.page_object = args;
            }

        });
    }

})();

