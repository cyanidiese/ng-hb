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

        return self::get('publicorganization', $args);
    }

    public static function getCount()
    {
        $count = self::get('publicorganization/count', []);

        return $count;
    }

    public static function getBySlug($slug)
    {
        return self::get('publicorganization/slug/'.$slug, []);
    }

}