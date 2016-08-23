<?php

class HBOrganizationsFactory extends HBFactory
{
    public static function getList()
    {
        return self::get('publicorganization', [
            'limit' => 24,
            'per-page' => 24,
        ]);
    }

    public static function getBySlug($slug)
    {
        return self::get('publicorganization/slug/'.$slug, []);
    }

}