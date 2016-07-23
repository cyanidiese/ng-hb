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
            "handbid_main" => "handbidMain",
        );

        foreach ($shortcodes as $name => $callback)
        {
            add_shortcode($name, array('HBShortcodes', $callback));
        }

    }

    public static function handbidMain($atts)
    {

//        $auctions = HBAuctionsFactory::getAll();
//        $bidd = HBBidderFactory::login('121212', '121212');
//        return '<pre>' . print_r($auctions, true) . '</pre>' . '<pre>' . print_r($bidd, true) . '</pre>';

        return HBView::view('main.auction.list');

    }

}