(function() {
    'use strict';

    angular
        .module('handbidApp')
        .controller('AuctionListCtrl', AuctionListCtrl);

    AuctionListCtrl.$inject = ['$scope', 'intermediator', 'auctions'];

    function AuctionListCtrl($scope, intermediator, auctions){

        var vm = this;

        vm.loading = true;

        vm.intermediator = intermediator;

        vm.intermediator.setPageType('auctions');
        vm.intermediator.setPageObject(false);

        vm.auctions = [];
        vm.auctions_chunks = [];

        vm.auctions_per_page = 24;

        vm.auctions_page = 1;

        vm.auctions_total = 0;

        vm.statuses = {
            current : ['open', 'extended', 'preview', 'presale', 'ending'],
            open : ['open', 'extended', 'ending'],
            presale : ['presale'],
            preview : ['preview'],
            closed : ['closed', 'reconciled', 'ending']
        };

        vm.current_status = 'current';

        vm.search_string = '';
        vm.search_time_changed = getCurrentSeconds();

        vm.selectAuctionsByStatus = selectAuctionsByStatus;
        vm.clearSearchString = clearSearchString;

        getAuctions();
        getAuctionsCount();

        //##################################################

        function getAuctions(paginated)
        {
            if(!paginated) {
                vm.loading = true;
            }

            var data = {
                statuses : vm.statuses[vm.current_status].join(','),
                page : vm.auctions_page,
                limit : vm.auctions_per_page
            };

            if(vm.search_string.trim() != ''){
                data.search = vm.search_string;
            }

            auctions.getAuctions(data).then(function(data)
            {
                vm.loading = false;

                vm.auctions = data;

                splitAuctions();
            });
        }

        function getAuctionsCount()
        {
            var data = {
                statuses : vm.statuses[vm.current_status].join(',')
            };

            if(vm.search_string.trim() != ''){
                data.search = vm.search_string;
            }

            auctions.getAuctionsCount(data).then(function(data)
            {
                vm.auctions_total = data.count;
            });
        }

        function splitAuctions()
        {
            vm.auctions_chunks = [];
            var i,j,chunk = 4;
            for (i=0,j=vm.auctions.length; i<j; i+=chunk) {
                vm.auctions_chunks.push(vm.auctions.slice(i,i+chunk));
            }
        }

        function selectAuctionsByStatus(status)
        {
            if(vm.current_status != status)
            {
                vm.current_status = status;
                vm.auctions_page = 1;
                vm.auctions_total = 0;
                getAuctions();
                getAuctionsCount();
            }
        }

        function clearSearchString()
        {
            vm.search_string = ''
        }

        function timeoutSearchCheck(search_time_changed)
        {
            if(search_time_changed == vm.search_time_changed)
            {
                vm.auctions_page = 1;
                vm.auctions_total = 0;
                getAuctions();
                getAuctionsCount();
            }
        }

        function getCurrentSeconds()
        {
            return new Date().getTime();
        }

        $scope.$watch('vm.auctions_page', function(current, original) {

            getAuctions(true);

        });

        $scope.$watch('vm.search_string', function(current, original) {

            if(original != current) {
                var search_time_changed = getCurrentSeconds();
                vm.search_time_changed = search_time_changed;
                setTimeout(function () {
                    timeoutSearchCheck(search_time_changed);
                }, 2000);
            }
        });
    }

})();

