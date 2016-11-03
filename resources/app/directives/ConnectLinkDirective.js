(function() {
    'use strict';

    angular
        .module('handbidDirectives')
        .directive('dataHandbidConnect', ConnectLinkDirective);


    function ConnectLinkDirective(){
        return {
            restrict: 'A',
            scope: {
            },
            link: function($scope, elem, attr, ctrl) {
                $(elem).click(function(e){
                    e.preventDefault();
                    $('[data-handbid-modal-key="login-modal"]').modal('show');
                })
            }
        };
    }

})();

