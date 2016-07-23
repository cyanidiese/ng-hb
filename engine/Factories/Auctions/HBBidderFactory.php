<?php

class HBBidderFactory extends HBFactory
{
    public static function login($user, $password)
    {
        try
        {
            $profile = self::post('auth/login', [], [
                'username' => $user,
                'password' => $password
            ]);

//            if($profile->success) {
            //$this->setCookie($profile);
//            }

            return $profile;

        } catch (\Exception $e)
        {
            return $e;
        }
    }

    public static function register($data)
    {
        $profile = self::post('auth/register', [], $data);

        if ($profile->success == true)
        {
            $profile = self::login($profile->data->username, $profile->data->pin);
        }

        return $profile;
    }

}