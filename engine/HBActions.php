<?php

class HBActions
{
    private static function getActions()
    {
        return [
            'views' => [
                'main' => [
                    'auction' => [
                        'list' => 'auctionListView',
                        'details' => 'auctionDetailsView',
                        'item' => [
                            'list' => 'itemListView',
                            'details' => 'itemDetailsView',
                        ],
                    ],
                    'organization' => [
                        'list' => 'organizationListView',
                        'details' => 'organizationDetailsView',
                    ],

                ],
                'directives' => [
                    'title' => 'directiveTitle',
                    'breadcrumbs' => 'directiveBreadcrumbs',
                    'auction_box' => 'directiveAuctionBox',
                ],
            ],
            'factories' => [
                'auctions' => [
                    'list' => 'auctionsFactoryGetList',
                    'details' => 'auctionsFactoryGetDetails',
                    'items' => [
                        'details' => 'itemsFactoryGetDetails',
                    ],
                ],
                'organizations' => [
                    'list' => 'organizationsFactoryGetList',
                    'details' => 'organizationsFactoryGetDetails',
                ],
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
                        $result[$key] = add_query_arg(['action' => $prefix], admin_url('admin-ajax.php'));
                    }

                }
            }
        }

        return $result;
    }

    private static function getPostData()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    public static function auctionListView()
    {
        echo HBView::view('main.auction.list');

        exit;
    }

    public static function auctionDetailsView()
    {
        echo HBView::view('main.auction.details');

        exit;
    }

    public static function itemDetailsView()
    {
        echo HBView::view('main.auction.item.details');

        exit;
    }

    public static function organizationListView()
    {
        echo HBView::view('main.organization.list');

        exit;
    }

    public static function organizationDetailsView()
    {
        echo HBView::view('main.organization.details');

        exit;
    }

    //=============  DIRECTIVES  ==================

    public static function directiveTitle()
    {
        echo HBView::view('directives.title');

        exit;
    }

    public static function directiveBreadcrumbs()
    {
        echo HBView::view('directives.breadcrumbs');

        exit;
    }

    public static function directiveAuctionBox()
    {
        echo HBView::view('directives.auction_box');

        exit;
    }

    //=============  AUCTIONS  ==================

    public static function auctionsFactoryGetList()
    {
        $params = self::getPostData();

        echo HBAuctionsFactory::getList($params);

        exit;
    }

    public static function auctionsFactoryGetDetails()
    {
        $params = self::getPostData();

        echo HBAuctionsFactory::getBySlug($params['slug']);

        exit;
    }

    //===============  ITEMS  ==================

    public static function itemsFactoryGetDetails()
    {
        $params = self::getPostData();

        echo HBItemsFactory::getBySlug($params['slug']);

        exit;
    }

    //===========  ORGANIZATIONS  ===============

    public static function organizationsFactoryGetList()
    {
        echo HBOrganizationsFactory::getList();

        exit;
    }

    public static function organizationsFactoryGetDetails()
    {
        $params = self::getPostData();

        echo HBOrganizationsFactory::getBySlug($params['slug']);

        exit;
    }

}