(function () {
    'use strict';

    angular
        .module('handbidServices')
        .service('hbnotices',  hbnotices);

    hbnotices.$inject = ['$rootScope'];

    function hbnotices($rootScope) {

        return {
            success : success,
            error : error,
            info : info
        };

        function notice(msg, title, type, hide, formatting) {

            title = (title != undefined) ? title : 'Notice Message';
            hide = (hide != undefined) ? hide : true;
            type = (type != undefined) ? type : 'info';
            type = (type == "failed") ? "error" : type;

            var isBiddingNotice = (formatting != undefined && formatting.isBidding != undefined && formatting.isBidding);
            if (isBiddingNotice) {
                var itemLink = (formatting.itemLink != undefined) ? formatting.itemLink : "#";
                var itemImage = (formatting.itemImage != undefined && formatting.itemImage != "/images/default_photo-75px-white.png")
                    ? formatting.itemImage
                    : $("[data-default-item-image]").eq(0).val();
                msg = "<div class='col-xs-4 handbid-notice-image-container'>" +
                      "<a href='" + itemLink + "'>" +
                      "<img src='" + itemImage + "'>" +
                      "</a>" +
                      "</div>" +
                      "<div class='col-xs-8 handbid-notice-text-container'>" +
                      "<h5 class='notice-text-title'>" + title + "</h5>" + msg +
                      "</div>";
                title = "";
            }
            var params = {
                title: title,
                text: msg,
                type: type,
                hide: hide,
                mouse_reset: false,
                delay: 5000,
                addclass: 'handbid-message-notice',
                buttons: {
                    sticker: false
                }
            };
            if (title == "Broadcast Message") {
                params.icon = " glyphicon glyphicon-envelope ";
                params.addclass += " handbid-broadcast-notice";
            }
            if (isBiddingNotice) {
                params.icon = "";
                params.addclass += " handbid-bidding-notice";
            }

            return new PNotify(params);

        }

        function simpleNotice(args) {

            var title = (args.title != undefined) ? args.title : 'Notice Message',
                content = (args.content != undefined) ? args.content : 'Some Test Notice',
                hide = (args.hide != undefined) ? args.hide : true,
                delay = (args.delay != undefined) ? args.delay : 5000,
                type = (args.type != undefined) ? args.type : 'info',
                addclass = (args.addclass != undefined) ? args.addclass : 'handbid-message-notice';

            var notice_type = 'info';
            switch(type){
                case 'broadcast' : notice_type = 'info'; break;
                case 'failed' : notice_type = 'error'; break;
                default : notice_type = type;
            }

            var params = {
                title: title,
                text: content,
                type: notice_type,
                hide: hide,
                mouse_reset: false,
                delay: delay,
                addclass: addclass,
                buttons: {
                    sticker: false
                }
            };
            if (type == "broadcast") {
                params.icon = " glyphicon glyphicon-envelope ";
                params.addclass += " handbid-broadcast-notice";
            }

            return new PNotify(params);

        }

        function success(title, content) {
            simpleNotice(
                {
                    title : title,
                    content : content,
                    type : 'success'
                }
                );
        }

        function error(title, content) {
            simpleNotice(
                {
                    title : title,
                    content : content,
                    type : 'error'
                }
            );
        }

        function info(title, content) {
            simpleNotice(
                {
                    title : title,
                    content : content,
                    type : 'success'
                }
            );
        }
    }

})();



