<?php
/*
Plugin Name: HandBid
Description: HandBid plugin
Author: CYAN-ID
Version: 3.0
*/

define( "HB_LANG", "handbid" );
define( "HB_PATH", plugin_dir_path(__FILE__) );
define( "HB_MAIN_FILE_PATH", __FILE__ );
define( "HB_URL", plugin_dir_url(__FILE__) );
define( "HB_REST", 'dev1-' );

require_once "autoload.php";
$handbid = new HBPlugin();
