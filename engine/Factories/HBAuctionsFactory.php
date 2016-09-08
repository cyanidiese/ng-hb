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

        if(!empty($params['search'])){
            $args['search'] = $params['search'];
        }

        $auctions = self::get('auction', $args);

        if(is_array($auctions) && !empty($auctions))
        {
            foreach($auctions as $i => $auction)
            {
                $auctions[$i] = HBHelpers::makeAuctionTimes($auction);
            }
        }

        return self::response($auctions);
    }

    public static function getCount($params)
    {
        $args = [ ];

        if(!empty($params['statuses'])){
            $args['status'] = $params['statuses'];
        }

        if(!empty($params['search'])){
            $args['search'] = $params['search'];
        }

        $count = self::get('auction/count', $args);

        return self::response($count);
    }

    public static function getBySlug($slug)
    {
        $auction = self::get('publicauction/slug/'.$slug, []);

        $auction = HBHelpers::makeAuctionTimes($auction);

        return self::response($auction);
    }

    public static function search($search)
    {
        $auctions = self::get('publicauction', [
            'search' => $search
        ]);


        if(is_array($auctions) && !empty($auctions))
        {
            foreach($auctions as $i => $auction)
            {
                $auctions[$i] = HBHelpers::makeAuctionTimes($auction);
            }
        }

        return self::response($auctions);
    }

}