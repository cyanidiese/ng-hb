(function() {
    'use strict';

    angular
        .module('handbidApp')
        .controller('TitleCtrl', TitleCtrl);

    TitleCtrl.$inject = ['$scope', 'intermediator'];

    function TitleCtrl($scope, intermediator){

        var vm = this;

        vm.intermediator = intermediator;
    }

})();

