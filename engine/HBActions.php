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
                    'pagination' => 'directivePagination',
                    'auction_box' => 'directiveAuctionBox',
                    'auction_list' => 'directiveAuctionList',
                    'item_box' => 'directiveItemBox',
                    'profile' => 'directiveProfile',
                ],
            ],
            'factories' => [
                'auctions' => [
                    'list' => 'auctionsFactoryGetList',
                    'count' => 'auctionsFactoryGetCount',
                    'details' => 'auctionsFactoryGetDetails',
                    'items' => [
                        'details' => 'itemsFactoryGetDetails',
                    ],
                ],
                'organizations' => [
                    'list' => 'organizationsFactoryGetList',
                    'count' => 'organizationsFactoryGetCount',
                    'details' => 'organizationsFactoryGetDetails',
                ],
                'profile' => [
                    'bidder' => 'profileFactoryGetBidder',
                    'inventory' => 'profileFactoryGetInventory',
                    'bidding' => [
                        'create_bid' => 'biddingFactoryCreateBid',
                        'remove_bid' => 'biddingFactoryRemoveBid',
                    ],
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
                $new_prefix = $prefix . '_' . $key;

                if (is_array($method))
                {
                    self::actions($method, $new_prefix);
                }
                else
                {
                    if (method_exists('HBActions', $method))
                    {
                        add_action('wp_ajax_' . $new_prefix, ['HBActions', $method]);
                        add_action('wp_ajax_nopriv_' . $new_prefix, ['HBActions', $method]);
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
                $new_prefix = $prefix . '_' . $key;

                if (is_array($method))
                {
                    $result[$key] = self::actionsLinks($method, $new_prefix);
                }
                else
                {
                    if (method_exists('HBActions', $method))
                    {
                        $result[$key] = add_query_arg(['action' => $new_prefix], admin_url('admin-ajax.php'));
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

    public static function directivePagination()
    {
        echo HBView::view('directives.pagination');

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

    public static function directiveAuctionList()
    {
        echo HBView::view('directives.auction_list');

        exit;
    }

    public static function directiveItemBox()
    {
        echo HBView::view('directives.item_box');

        exit;
    }

    public static function directiveProfile()
    {
        echo HBView::view('directives.profile.main');

        exit;
    }

    //=============  AUCTIONS  ==================

    public static function auctionsFactoryGetList()
    {
        $params = self::getPostData();

        echo HBAuctionsFactory::getList($params);

        exit;
    }

    public static function auctionsFactoryGetCount()
    {
        $params = self::getPostData();

        echo HBAuctionsFactory::getCount($params);

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
        $params = self::getPostData();

        echo HBOrganizationsFactory::getList($params);

        exit;
    }

    public static function organizationsFactoryGetCount()
    {
        echo HBOrganizationsFactory::getCount();

        exit;
    }

    public static function organizationsFactoryGetDetails()
    {
        $params = self::getPostData();

        echo HBOrganizationsFactory::getBySlug($params['slug']);

        exit;
    }

    public static function profileFactoryGetBidder()
    {
        echo HBBidderFactory::bidder();

        exit;
    }

    public static function profileFactoryGetInventory()
    {
        $params = self::getPostData();

        echo HBBidderFactory::inventory($params['auction_id']);

        exit;
    }

    public static function biddingFactoryCreateBid()
    {
        $params = self::getPostData();

        echo HBBidderFactory::createBid($params);

        exit;
    }

    public static function biddingFactoryRemoveBid()
    {
        $params = self::getPostData();

        echo HBBidderFactory::removeBid($params['bid_id']);

        exit;
    }

}