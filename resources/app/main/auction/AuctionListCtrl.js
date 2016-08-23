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

        vm.auctions = [];
        vm.auctions_chunks = [];

        vm.auctions_per_page = 8;

        vm.auctions_page = 1;

        vm.statuses = {
            current : ['open', 'extended', 'preview', 'presale', 'ending'],
            open : ['open', 'extended', 'ending'],
            presale : ['presale'],
            preview : ['preview'],
            closed : ['closed', 'reconciled', 'ending']
        };

        vm.current_status = 'current';

        vm.selectAuctionsByStatus = selectAuctionsByStatus;

        getAuctions();

        //##################################################

        function getAuctions()
        {
            vm.loading = true;

            var data = {
                statuses : vm.statuses[vm.current_status].join(','),
                page : vm.auctions_page,
                limit : vm.auctions_per_page
            };

            auctions.getAuctions(data).then(function(data)
            {
                vm.loading = false;

                vm.auctions = data;

                vm.intermediator.setPageObject(false);

                splitAuctions();
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
                vm.auctions_page = 0;
                getAuctions();
            }
        }
    }

})();

