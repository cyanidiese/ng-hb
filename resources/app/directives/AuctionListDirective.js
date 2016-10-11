(function() {
    'use strict';

    angular
        .module('handbidDirectives')
        .directive('handbidAuctionList', ['auctions', AuctionListDirective]);

    function AuctionListDirective(auctions){

        return {
            restrict: 'EA',
            scope: {
                organization: '=organization'
            },
            templateUrl: hb_routes.views.directives.auction_list,
            replace: true,
            link: function($scope, elem, attr, ctrl) {

                $scope.init = function() {

                    console.log('=========START INIT=========');
                    console.log($scope.organization);
                    console.log('=========STARTed INIT=========');

                    $scope.auctions = [];
                    $scope.auctions_chunks = [];

                    $scope.auctions_per_page = 24;

                    $scope.auctions_page = 1;

                    $scope.auctions_total = 0;

                    $scope.statuses = {
                        current: ['open', 'extended', 'preview', 'presale', 'ending'],
                        open: ['open', 'extended', 'ending'],
                        presale: ['presale'],
                        preview: ['preview'],
                        closed: ['closed', 'reconciled', 'ending']
                    };

                    $scope.current_status = 'current';

                    $scope.search_string = '';
                    $scope.search_time_changed = $scope.getCurrentSeconds();

                    $scope.getAuctions();
                    $scope.getAuctionsCount();
                };

                //##################################################

                $scope.getAuctions = function(paginated)
                {
                    if(!paginated) {
                        $scope.loading = true;
                    }

                    console.log('=========START AUCTIONS GET=========');

                    var data = {
                        statuses : $scope.statuses[$scope.current_status].join(','),
                        page : $scope.auctions_page,
                        limit : $scope.auctions_per_page
                    };

                    if($scope.search_string.trim() != ''){
                        data.search = $scope.search_string;
                    }

                    console.log(data);

                    auctions.getAuctions(data).then(function(data)
                    {
                        console.log('=========AUCTIONS LOADED=========');

                        $scope.loading = false;

                        $scope.auctions = data;
                        console.log(data);

                        $scope.splitAuctions();
                    });
                };

                $scope.getAuctionsCount = function()
                {
                    var data = {
                        statuses : $scope.statuses[$scope.current_status].join(',')
                    };

                    if($scope.search_string.trim() != ''){
                        data.search = $scope.search_string;
                    }

                    auctions.getAuctionsCount(data).then(function(data)
                    {
                        console.log('=========AUCTIONS COUNT LOADED=========');
                        console.log(data.count);
                        $scope.auctions_total = data.count;
                    });
                };

                $scope.splitAuctions = function()
                {
                    $scope.auctions_chunks = [];
                    var i,j,chunk = 4;
                    for (i=0,j=$scope.auctions.length; i<j; i+=chunk) {
                        $scope.auctions_chunks.push($scope.auctions.slice(i,i+chunk));
                    }

                    console.log($scope.auctions_chunks);
                };

                $scope.selectAuctionsByStatus = function(status)
                {
                    if($scope.current_status != status)
                    {
                        $scope.current_status = status;
                        $scope.auctions_page = 1;
                        $scope.auctions_total = 0;
                        $scope.getAuctions();
                        $scope.getAuctionsCount();
                    }
                };

                $scope.clearSearchString = function()
                {
                    $scope.search_string = ''
                };

                $scope.timeoutSearchCheck = function(search_time_changed)
                {
                    if(search_time_changed == $scope.search_time_changed)
                    {
                        $scope.auctions_page = 1;
                        $scope.auctions_total = 0;
                        $scope.getAuctions();
                        $scope.getAuctionsCount();
                    }
                };

                $scope.getCurrentSeconds = function()
                {
                    return new Date().getTime();
                };

                $scope.$watch('$scope.auctions_page', function(current, original) {

                    $scope.getAuctions(true);

                });

                $scope.$watch('$scope.search_string', function(current, original) {

                    if(original != current) {
                        var search_time_changed = $scope.getCurrentSeconds();
                        $scope.search_time_changed = search_time_changed;
                        $timeout(function () {
                            $scope.timeoutSearchCheck(search_time_changed);
                        }, 2000);
                    }
                });


                $scope.init();
            }
        };
    }

})();

