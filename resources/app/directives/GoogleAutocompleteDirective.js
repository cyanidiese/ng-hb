(function() {
    'use strict';

    angular
        .module('handbidDirectives')
        .directive('handbidGoogleAutocomplete', GoogleAutocompleteDirective);


    function GoogleAutocompleteDirective(){
        return {
            restrict: 'A',
            scope: {
            },
            link: function($scope, elem, attr, ctrl, $timeout) {

                $scope.applyAutocomplete = function(){
                    if(google.maps.places == undefined){
                        $timeout(
                            function() {
                                $scope.applyAutocomplete();
                            },
                            1000
                        );
                    }
                    else {
                        var autocomplete = new google.maps.places.Autocomplete(
                            /** @type {!HTMLInputElement} */(document.getElementById(attr.id)),
                            {types: ['geocode']});
                        autocomplete.addListener('place_changed', function() {
                            attr.ngModel = autocomplete.getPlace().formatted_address;
                        });
                    }
                };

                $scope.applyAutocomplete();
            }
        };
    }

})();

