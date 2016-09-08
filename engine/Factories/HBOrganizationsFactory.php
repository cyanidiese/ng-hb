<?php

class HBOrganizationsFactory extends HBFactory
{
    public static function getList($params)
    {
        $args = [
            'limit' => $params['limit'],
            'per-page' => $params['limit'],
        ];

        if(!empty($params['page'])){
            $args['page'] = intval($params['page']);
        }

        $organizations = self::get('publicorganization', $args);

        return self::response($organizations);
    }

    public static function getCount()
    {
        $count = self::get('publicorganization/count', []);

        return self::response($count);
    }

    public static function getBySlug($slug)
    {
        $organization = self::get('publicorganization/slug/'.$slug, []);

        return self::response($organization);
    }

}