(function () {
    'use strict';

    angular
        .module('handbidServices')
        .service('intermediator', intermediator);

    function intermediator() {

        var _pageType = '';
        var _pageObject = false;

        return {
            setPageType: setPageType,
            getPageType: getPageType,
            setPageObject: setPageObject,
            getPageObject: getPageObject
        };

        function setPageType (pageType) {
            _pageType = pageType;
        }

        function getPageType () {
            return _pageType;
        }

        function setPageObject (pageObject) {
            _pageObject = pageObject;
        }

        function getPageObject () {
            return _pageObject;
        }
    }

})();



