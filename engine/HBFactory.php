<?php

class HBFactory
{
    private static function makeRequestUrl($endpoint, $params){
        return  get_option('handbid_endpoint_base', 'https://'.HB_REST.'rest.hand.bid/') . $endpoint . '?' . http_build_query($params);
    }

    private static function getHeaders(){
        return array(
            'Authorization' => 'Bearer 512a40ac34b2532d08daf681'
        );
    }

    private static function getDefaultRequestArgs(){

        global $wp_version;

        return array(
            'timeout'     => 30,
            'httpversion' => '1.0',
            'user-agent'  => 'WordPress/' . $wp_version . '; ' . home_url(),
            'blocking'    => true,
            'headers'     => self::getHeaders(),
            'cookies'     => array(
            ),
            'sslverify'   => true,
        );
    }

    private static function getResponse($method, $endpoint, $params = [], $args = false){

        $url = self::makeRequestUrl($endpoint, $params);

        if(!$args){
            $args = self::getDefaultRequestArgs();
        }
        else{
            $args = array_merge(self::getDefaultRequestArgs(), $args);
        }

        $args['method'] = strtoupper($method);

        $response = wp_remote_request( $url, $args );

        $body = wp_remote_retrieve_body($response);

        return json_decode($body);
    }

    public function get($endpoint, $params = [])
    {
        return self::getResponse('GET', $endpoint, $params);
    }

    public function post($endpoint, $params = [], $data = [])
    {
        return self::getResponse('POST', $endpoint, $params, ['body' => $data]);
    }

    public function put($endpoint, $params = [], $data = [])
    {
        return self::getResponse('PUT', $endpoint, $params, ['body' => $data]);
    }

    public function delete($endpoint, $params = [])
    {
        return self::getResponse('DELETE', $endpoint, $params);
    }

    public static function response($result = [])
    {
        return json_encode($result);
    }
}