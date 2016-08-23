<?php

class HBShortcodes extends StdClass
{

    function __construct()
    {
        //
    }

    public static function activateShortCodes()
    {

        $shortcodes = array(
            "handbid_main" => "main",
            "handbid_header_title" => "headerTitle",
            "handbid_breadcrumb" => "breadcrumbs",
            "handbid_bidder_profile" => "bidderProfile",
            "handbid_auction_timer" => "auctionTimer",
        );

        foreach ($shortcodes as $name => $callback)
        {
            if(method_exists('HBShortcodes', $callback))
            {
                add_shortcode($name, array('HBShortcodes', $callback));
            }
        }

    }

    public static function main($atts)
    {
        return HBView::view('index');
    }

    public static function headerTitle($atts)
    {
        return HBView::view('header.title');
    }

    public static function breadcrumbs($atts)
    {
        return HBView::view('header.breadcrumbs');
    }

    public static function bidderProfile($atts)
    {
        return HBView::view('header.profile.main');
    }

    public static function auctionTimer($atts)
    {
        return '';
    }

}