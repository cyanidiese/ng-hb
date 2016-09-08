<?php

class HBItemsFactory extends HBFactory
{
    public static function getBySlug($slug)
    {
        $item = self::get('publicitem/slug/'.$slug, []);

        if(!empty($item->auction))
        {
            $item->auction = HBHelpers::makeAuctionTimes($item->auction);
        }

        return self::response($item);
    }
}