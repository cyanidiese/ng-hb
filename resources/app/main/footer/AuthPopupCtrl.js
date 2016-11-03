(function() {
    'use strict';

    angular
        .module('handbidApp')
        .controller('AuthPopupCtrl', AuthPopupCtrl);

    AuthPopupCtrl.$inject = ['$scope', 'intermediator'];

    function AuthPopupCtrl($scope, intermediator){

        var vm = this;

        vm.current_auth_screen = 'login-form';
        vm.current_login_page = 'login';
        vm.popup_title = 'Sign in to Handbid';

        vm.auction = null;

        vm.intermediator = intermediator;
        vm.countries = intermediator.getCountriesAndProvinces();

        vm.setCurrentAuthScreen = setCurrentAuthScreen;
        vm.isAuthorized = isAuthorized;

        function setCurrentAuthScreen(screen) {

            vm.current_auth_screen = screen;

        }

        function isAuthorized() {

            return false;

        }


        $scope.$watch('vm.current_auth_screen', function (current, original) {

            switch(current){
                case 'login-form' :
                    vm.popup_title = 'Sign in to Handbid';
                    break;
                case 'forgot-pass' :
                    vm.popup_title = 'Forgot Password?';
                    break;
                case 'forgot-pass-sent' :
                    vm.popup_title = 'Login Info has been Sent';
                    break;
                case 'register-form' :
                    vm.popup_title = 'Getting Started!';
                    break;
                case 'register-form-confirm' :
                    vm.popup_title = 'Confirm Registration';
                    break;
                case 'purchase-tickets' :
                    vm.popup_title = (vm.auction ? vm.auction.name : '') + ' Tickets';
                    break;
                case 'confirm-purchase' :
                    vm.popup_title = 'Confirm Purchase';
                    break;
                case 'process-payment' :
                    vm.popup_title = 'Process Payment';
                    break;
                case 'process-error' :
                    vm.popup_title = 'Process Error';
                    break;
                case 'process-success' :
                    vm.popup_title = 'Completed!';
                    break;
                default :
                    vm.popup_title = 'Sign in to Handbid';
            }
            switch(current){
                case 'login-form' :
                    vm.current_login_page = 'login';
                    break;
                case 'forgot-pass' :
                    vm.current_login_page = 'forgot';
                    break;
                case 'forgot-pass-sent' :
                    vm.current_login_page = 'forgot';
                    break;
                case 'register-form' :
                    vm.current_login_page = 'register';
                    break;
                case 'register-form-confirm' :
                    vm.current_login_page = 'register';
                    break;
                default :
                    vm.current_login_page = false;
            }
        });

        $scope.$on('current-auth-screen', function(event, args) {

            setCurrentAuthScreen(args);

        });

        $scope.$on('auction-updated', function(event, args) {

            vm.auction = args;

        });
    }

})();

