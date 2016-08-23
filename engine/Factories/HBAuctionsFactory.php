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

        return self::get('auction', $args);
    }

    public static function getBySlug($slug)
    {
        return self::get('publicauction/slug/'.$slug, []);
    }

    public static function search($search)
    {
        return self::get('publicauction', [
            'search' => $search
        ]);
    }

}