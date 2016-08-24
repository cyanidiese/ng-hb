<?php

class HBAuctionsFactory extends HBFactory
{
    public static function getList($params)
    {
        $args = [
            'excluded_fields' => 'organization,sponsor,categories,locations,images,description',
            'limit' => $params['limit'],
            'per-page' => $params['limit'],
        ];

        if(!empty($params['page'])){
            $args['page'] = intval($params['page']);
        }

        if(!empty($params['statuses'])){
            $args['status'] = $params['statuses'];
        }

        $auctions = self::get('auction', $args);

        return $auctions;
    }

    public static function getCount($params)
    {
        $args = [ ];

        if(!empty($params['statuses'])){
            $args['status'] = $params['statuses'];
        }

        $count = self::get('auction/count', $args);

        return $count;
    }

    public static function getBySlug($slug)
    {
        $auction = self::get('publicauction/slug/'.$slug, []);

        return $auction;
    }

    public static function search($search)
    {
        $auctions = self::get('publicauction', [
            'search' => $search
        ]);

        return $auctions;
    }

}