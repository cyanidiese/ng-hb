(function () {
    'use strict';

    angular
        .module('handbidServices')
        .service('hbsockets',  hbsockets);

    hbsockets.$inject = ['$rootScope'];

    function hbsockets($rootScope) {

        var socket,
            currentAuctionChannelId,
            auctionChannel,
            currentUserChannelId,
            userChannel;


        init();

        return {
            connectToAuctionChannel : connectToAuctionChannel,
            connectToUserChannel : connectToUserChannel
        };

        function init() {
            socket = new YiiNodeSocket();

            socket.onConnect(function () {
                console.log("success connect");
            });

            socket.onDisconnect(function(){
                console.log("socket disconnect");
            });
        }

        function connectToAuctionChannel(auctionChannelId) {


            if(auctionChannelId != currentAuctionChannelId) {

                socket.room(currentAuctionChannelId).leave();

                currentAuctionChannelId = auctionChannelId;

                auctionChannel = socket.room(auctionChannelId).join(function (success) {

                    if (success) {

                        this.on('event.bid', function (data) {
                            console.log(" ===== event.bid =====");
                            $rootScope.$broadcast('event.bid', data);
                            console.log(data);
                        });

                        this.on('event.auction', function (data) {
                            console.log(" ===== event.auction =====");
                            $rootScope.$broadcast('event.auction', data);
                            console.log(data);
                        });

                        this.on('event.broadcast', function (data) {
                            console.log(" ===== event.broadcast =====");
                            $rootScope.$broadcast('event.broadcast', data);
                            console.log(data);
                        });

                        this.on('event.item', function (data) {
                            console.log(" ===== event.item =====");
                            $rootScope.$broadcast('event.item', data);
                            console.log(data);
                        });

                        this.on('event.timer', function (data) {
                            console.log(" ===== event.timer =====");
                            $rootScope.$broadcast('event.timer', data);
                            console.log(data);
                        });

                        this.on('event.reset', function (data) {
                            console.log(" ===== event.reset =====");
                            $rootScope.$broadcast('event.reset', data);
                            console.log(data);
                        });

                    }
                    else {
                        console.log(" ===== ERROR =====");
                        this.log(this.getError());
                    }
                    return true;
                });
            }

        }

        function connectToUserChannel(userChannelId) {


            if(userChannelId != currentUserChannelId) {

                socket.room(currentUserChannelId).leave();

                currentUserChannelId = userChannelId;

                userChannel = socket.room(userChannelId).join(function (success) {

                    if (success) {

                        this.on('event.bid', function (data) {
                            console.log(" ===== user event.bid =====");
                            $rootScope.$broadcast('user.event.bid', data);
                            console.log(data);
                        });

                        this.on('event.broadcast', function (data) {
                            console.log(" ===== user event.broadcast =====");
                            $rootScope.$broadcast('user.event.broadcast', data);
                            console.log(data);
                        });

                        this.on('event.purchase', function (data) {
                            console.log(" ===== user event.purchase =====");
                            $rootScope.$broadcast('user.event.purchase', data);
                            console.log(data);
                        });

                        this.on('event.receipt', function (data) {
                            console.log(" ===== user event.receipt =====");
                            $rootScope.$broadcast('user.event.receipt', data);
                            console.log(data);
                        });

                        this.on('event.user', function (data) {
                            console.log(" ===== user event.user =====");
                            $rootScope.$broadcast('user.event.user', data);
                            console.log(data);
                        });

                    }
                    else {
                        console.log(" ===== USER CHANNEL ERROR =====");
                        this.log(this.getError());
                    }
                    return true;
                });
            }
        }
    }

})();



