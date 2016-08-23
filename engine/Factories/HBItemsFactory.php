<?php

class HBItemsFactory extends HBFactory
{
    public static function getBySlug($slug)
    {
        return self::get('publicitem/slug/'.$slug, []);
    }
}