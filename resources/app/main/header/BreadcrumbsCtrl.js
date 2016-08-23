(function() {
    'use strict';

    angular
        .module('handbidApp')
        .controller('BreadcrumbsCtrl', BreadcrumbsCtrl);

    BreadcrumbsCtrl.$inject = ['$scope', 'intermediator'];

    function BreadcrumbsCtrl($scope, intermediator){

        var vm = this;

        vm.intermediator = intermediator;
    }

})();

