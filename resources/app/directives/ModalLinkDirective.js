(function() {
    'use strict';

    angular
        .module('handbidDirectives')
        .directive('handbidModalLink', ModalLinkDirective);


    function ModalLinkDirective(){
        return {
            restrict: 'A',
            scope: {
                key: '=handbidModalLink'
            },
            link: function($scope, elem, attr, ctrl) {

                $scope.linkModalButtonToModalWindow = function(){
                    var key = attr.handbidModalLink;
                    angular.element(elem).on('click', function(){
                        angular.element('[handbid-modal-window="'+key+'"]').modal('show');
                    });
                };

                $scope.linkModalButtonToModalWindow();
            }
        };
    }

})();

