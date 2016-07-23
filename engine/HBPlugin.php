<?php


if (!defined("HB_VERSION_MAIN")) {
    define("HB_VERSION_MAIN", "1");
}
if (!defined("HB_VERSION_BUILD")) {
    define("HB_VERSION_BUILD", "2");
}
if (!defined("HB_VERSION")) {
    define("HB_VERSION", HB_VERSION_MAIN . "." . HB_VERSION_BUILD);
}
if (!defined("HB_EMBED")) {
    define("HB_EMBED", false);
}

class HBPlugin
{
    private $pluginSlug;
    private $pluginName;

    public function includeGlobalAdminScriptsAndStyles()
    {
        wp_enqueue_style('hb_backend_styles', HB_URL . "assets/css/global-admin.css", array(), HB_VERSION);
        wp_enqueue_script('hb_backend_scripts', HB_URL . "assets/js/global-admin.js", array(), HB_VERSION);
    }

    public function includeFrontendScriptsAndStyles()
    {
        wp_enqueue_style('hb_frontend_styles', HB_URL . "assets/css/focus-groups.css", array(), HB_VERSION);
        wp_enqueue_style('hb_frontend_jquery_ui_css', "//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css", array(), HB_VERSION);
        wp_enqueue_script('hb_frontend_scripts', HB_URL . "assets/js/focus-groups.js", array("jquery"), HB_VERSION, true);
        wp_enqueue_script('hb_frontend_validation', "//cdnjs.cloudflare.com/ajax/libs/jquery-form-validator/2.2.43/jquery.form-validator.min.js", array("jquery"), HB_VERSION, false);
        wp_enqueue_script('hb_frontend_jquery_ui_js', "//code.jquery.com/ui/1.11.4/jquery-ui.js", array("jquery"), HB_VERSION, false);
    }

    public function addAllActions()
    {
        add_action('wp_enqueue_scripts', array($this, "includeFrontendScriptsAndStyles"));

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