<?php

class HBActions
{
    private static function getActions()
    {
        return [
            'views' => [
                'main' => [
                    'auction' => [
                        'list' => 'auctionListView'
                    ]
                ],
                'directives' => [

                ],
            ],
            'actions' => [

            ]
        ];
    }

    public static function actions($actions = null, $prefix = 'hb')
    {
        if (is_null($actions))
        {
            $actions = self::getActions();
        }

        if (is_array($actions) and count($actions))
        {
            foreach ($actions as $key => $method)
            {
                $prefix = $prefix . '_' . $key;

                if (is_array($method))
                {
                    self::actions($method, $prefix);
                }
                else
                {
                    if (method_exists('HBActions', $method))
                    {
                        add_action('wp_ajax_' . $prefix, ['HBActions', $method]);
                        add_action('wp_ajax_nopriv_' . $prefix, ['HBActions', $method]);
                    }

                }
            }
        }
    }

    public static function actionsLinks($actions = null, $prefix = 'hb')
    {
        $result = [];

        if (is_null($actions))
        {
            $actions = self::getActions();
        }

        if (is_array($actions) and count($actions))
        {
            foreach ($actions as $key => $method)
            {
                $prefix = $prefix . '_' . $key;

                if (is_array($method))
                {
                    $result[$key] = self::actionsLinks($method, $prefix);
                }
                else
                {
                    if (method_exists('HBActions', $method))
                    {
                        $result[] = add_query_arg(['action' => $prefix], admin_url('admin-ajax.php'));
                    }

                }
            }
        }

        return $result;
    }

    public static function auctionListView()
    {
        echo HBView::view('main.auction.list');

        echo '<pre>' . print_r(self::actionsLinks(), true) . '</pre>';

        exit;
    }



}