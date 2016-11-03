<?php


if (!defined("HB_VERSION_MAIN"))
{
    define("HB_VERSION_MAIN", "1");
}
if (!defined("HB_VERSION_BUILD"))
{
    define("HB_VERSION_BUILD", "2");
}
if (!defined("HB_VERSION"))
{
    define("HB_VERSION", HB_VERSION_MAIN . "." . HB_VERSION_BUILD);
}
if (!defined("HB_EMBED"))
{
    define("HB_EMBED", false);
}

class HBPlugin
{
    private $pluginSlug;
    private $pluginName;

    private $stripeApiKey     = "pk_Yidx0zkypJ6stL4BO6VnDfslNBYXF";
    private $stripeApiKeyLive = "pk_hHpGKGGc39SSpUlP2TwghF4hONv1v";

    private $smoochToken = "3hnfyxyhjbs459794216b8qjw";

    public function includeFrontendScriptsAndStyles()
    {
        $socketUrl   = $this->getSocketUrl();
        $socketIoUrl = sprintf('%ssocket.io/socket.io.js', $socketUrl);

        $outerScripts = [
            'socket-io-js'   => $socketIoUrl,
            'stripe-api-js'  => 'https://js.stripe.com/v2/',
            'smooch-chat-js' => 'https://cdn.smooch.io/smooch.min.js',

            'angular-js'          => 'https://ajax.googleapis.com/ajax/libs/angularjs/1.5.3/angular.js',
            'angular-route-js'    => 'https://ajax.googleapis.com/ajax/libs/angularjs/1.5.3/angular-route.js',
            'angular-animate-js'  => 'https://ajax.googleapis.com/ajax/libs/angularjs/1.5.3/angular-animate.js',
            'angular-resource-js' => 'https://ajax.googleapis.com/ajax/libs/angularjs/1.5.3/angular-resource.js',
        ];

        foreach ($outerScripts as $key => $sc)
        {
            wp_register_script($key, $sc, [], null, true);
            wp_enqueue_script($key);
        }

        $scripts = [
            'yii-node-socket-js'     => 'public/js/yii-node-socket.js',
//            'node-socket-manager-js' => 'public/js/node-socket-manager.js',
            'stripe-init-js'         => 'public/js/stripe-init.js',
            'smooch-init-js'         => 'public/js/smooch-init.js',

            'handbid-notices-js' => 'public/js/pnotify.custom.min.js',

            'progress-bar-js'      => 'public/plugins/progressbar.js/progressbar.min.js',
            'cookie-plugin-js'     => 'public/plugins/jquery.cookie/jquery.cookie.js',
            'visible-plugin-js'    => 'public/plugins/df-visible/jquery.visible.min.js',
//            'handbid-isotope-js'   => 'public/plugins/isotope/isotope.pkgd.min.js',
            'handbid-unslider-js'  => 'public/plugins/unslider/js/unslider-min.js',
            'handbid-bootstrap-js' => 'public/plugins/bootstrap/js/bootstrap.min.js',
            'handbid-select2-js'   => 'public/plugins/select2/js/select2.full.min.js',

            'handbid-old-js' => 'public/js/app_old.min.js',
            'handbid-js'     => 'public/js/app.min.js',

        ];

        foreach ($scripts as $key => $sc)
        {
            wp_register_script($key, plugins_url($sc, HB_MAIN_FILE_PATH), [], null, true);
            wp_enqueue_script($key);
        }


        $styles = [
            'handid-notices-css'   => 'public/css/pnotify.custom.min.css',
            'handid-bootstrap-css' => 'public/plugins/bootstrap/css/bootstrap.min.css',
            'handbid-select2-css'  => 'public/plugins/select2/css/select2.min.css',

            'handid-css' => 'public/css/app.min.css',

        ];

        foreach ($styles as $key => $sc)
        {
            wp_register_style($key, plugins_url($sc, HB_MAIN_FILE_PATH));
            wp_enqueue_style($key);
        }
    }

    public function onRenderFooter()
    {

        // Determined Values
        $socketUrl     = $this->getSocketUrl();
        $nodeClientUrl = sprintf('%sclient', $socketUrl);

        $params = json_encode(["secure" => true, "cookie" => '']);
        ?>
        <script>
            var hb_routes = <?php echo json_encode(HBActions::actionsLinks())?>,
                auctionChannelId = '<?php echo ''; ?>',
                currentAuctionKey = '<?php echo ''; ?>',
                userChannelId = '<?php echo ''; ?>',
                url = '<?php echo $nodeClientUrl; ?>',
                params = <?php echo $params; ?>,
                stripePublishableKey = '<?php echo $this->getStripeApiKey();?>',
                smoochAppToken = '<?php echo $this->getSmoochToken();?>';
        </script>

        <script type="text/javascript">
            (function (h, l, i, n, k, s) {
                s = h.createElement(i);
                s.type = "text/javascript";
                s.async = 1;
                s.src = l + n + ".js";
                k = h.getElementsByTagName(i)[0];
                k.parentNode.insertBefore(s, k);
            })(document, "//cdn.hokolinks.com/banner/v1/", "script", "af303d2c3f3fb386");
        </script>
        <script type="text/javascript">
            WebFontConfig = {
                google: {families: ['Lato:300,400,500', 'Oswald']}
            };
            (function () {
                var wf = document.createElement('script');
                wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
                    '://ajax.googleapis.com/ajax/libs/webfont/1.5.18/webfont.js';
                wf.type = 'text/javascript';
                wf.async = 'true';
                var s = document.getElementsByTagName('script')[0];
                s.parentNode.insertBefore(wf, s);
            })(); </script>

        <?php

        $map_params = [
            'v' => '3.exp',
            'key' => 'AIzaSyAJsBZcOzH5mWubgqRYnefsSIN9aQtAsiI',
            'libraries' => 'places',
        ];

        $map_url = add_query_arg($map_params, 'https://maps.googleapis.com/maps/api/js');

        echo '<script async defer src="' . $map_url . '"></script>';

    }

    function getSocketUrl()
    {
        $socketUrl = get_option('handbidSocketUrl', 'https://'.HB_REST.'rest.hand.bid:3003');
        $socketUrl = 'https://'.HB_REST.'rest.hand.bid:3003';
        $socketUrl = (substr($socketUrl, -1) != "/") ? $socketUrl . "/" : $socketUrl;

        return $socketUrl;
    }

    public function getSmoochToken()
    {
        return $this->smoochToken;
    }

    public function getStripeApiKey()
    {
        $stripeMode = get_option('handbidStripeMode', 'test');

        return ($stripeMode == "test") ? $this->stripeApiKey : $this->stripeApiKeyLive;
    }

    public function addAllActions()
    {
        add_action('wp_enqueue_scripts', [$this, "includeFrontendScriptsAndStyles"]);
        add_action('wp_footer', [$this, 'onRenderFooter']);

        HBShortcodes::activateShortCodes();

        HBActions::actions();
    }

    public function __construct()
    {
        load_plugin_textdomain(HB_LANG, false, dirname(plugin_basename(__FILE__)) . '/lang');

        $this->pluginSlug = "hb_admin";
        $this->pluginName = "HandBid";

        $this->addAllActions();
    }

}