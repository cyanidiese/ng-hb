(function() {
    'use strict';

    angular
        .module('handbidDirectives')
        .directive('handbidProfile', ProfileDirective);


    function ProfileDirective(){
        return {
            restrict: 'A',
            scope: {
                profile: '=profile',
                inventory: '=inventory',
                receipts: '=receipts',
                auction: '=auction',
                tools: '=tools'
            },
            templateUrl: hb_routes.views.directives.profile,
            replace: true,
            link: function($scope, elem, attr, ctrl) {

                $scope.tryToUpdateProfile = function(){

                    if(!$scope.tools.is_updating_profile) {

                        var differences = {};

                        for (var attr in $scope.tools.form_profile) {
                            if ($scope.profile.hasOwnProperty(attr) && $scope.tools.form_profile.hasOwnProperty(attr)
                                && ($scope.profile[attr] != $scope.tools.form_profile[attr])) {
                                differences[attr] = $scope.tools.form_profile[attr];
                            }
                        }

                        $scope.tools.updateProfile(differences);
                    }
                };

                $scope.getPaymentTitle = function(payment){

                    var payment_title = '';

                    switch (payment.paymentMethod) {
                        case 'creditcard' :
                            payment_title = payment.card + ' xxxx-xxxx-xxxx-' + payment.last4;
                            break;
                        case 'creditcard_external' :
                            payment_title = 'Credit Card (external)';
                            break;
                        case 'cash' :
                            payment_title = 'Cash';
                            break;
                        case 'checking_account' :
                            payment_title = 'Check';
                            break;
                        case 'credited_amount' :
                            payment_title = 'Credit';
                            break;
                        case 'discount_amount' :
                            payment_title = 'Discount';
                            break;
                    }
                    return payment_title;
                };

                $scope.recalculateAllValues = function(){

                    var amount_paid = 0;

                    if($scope.inventory && $scope.inventory.payments) {

                        angular.forEach($scope.inventory.payments, function (payment, index) {

                            amount_paid += payment.amount;
                        });

                    }

                    $scope.amount_paid = amount_paid;

                    //$balanceDue = $totalPurchases + $premium + $itemsTax - $amountPaid;
                };

                $scope.$watch('$scope.inventory', function(current, original) {

                    $scope.recalculateAllValues();

                });

                $scope.recalculateAllValues();
            }
        };
    }

})();

