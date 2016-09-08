<?php

class HBFactory
{
    private static function makeRequestUrl($endpoint, $params){
        return  get_option('handbid_endpoint_base', 'https://st-rest.hand.bid/') . $endpoint . '?' . http_build_query($params);
    }

    public function get($endpoint, $params)
    {
        global $wp_version;

        $url = self::makeRequestUrl($endpoint, $params);

        $args = array(
            'timeout'     => 30,
            'httpversion' => '1.0',
            'user-agent'  => 'WordPress/' . $wp_version . '; ' . home_url(),
            'blocking'    => true,
            'headers'     => array(
                'Authorization' => 'Bearer 512a40ac34b2532d08daf681'
            ),
            'cookies'     => array(
            ),
            'sslverify'   => true,
        );

        $response = wp_remote_get( $url, $args );

        $body = wp_remote_retrieve_body($response);

        return json_decode($body);
    }

    public function post($endpoint, $params, $data = [])
    {
        global $wp_version;

        $url = self::makeRequestUrl($endpoint, $params);

        $args = array(
            'method' => 'POST',
            'timeout'     => 30,
            'httpversion' => '1.0',
            'user-agent'  => 'WordPress/' . $wp_version . '; ' . home_url(),
            'blocking'    => true,
            'headers'     => array(
            ),
            'cookies'     => array(
            ),
            'sslverify'   => true,
            'body' => $data,
        );

        $response = wp_remote_post( $url, $args );

        $body = wp_remote_retrieve_body($response);

        return json_decode($body);
    }

    public static function response($result = [])
    {
        return json_encode($result);
    }
}