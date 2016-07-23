<?php

class HBAuctionsFactory extends HBFactory
{
    public static function getAll()
    {
        return self::get('auction', []);
    }

    public static function search($search)
    {
        return self::get('publicauction', [
            'search' => $search
        ]);
    }

}