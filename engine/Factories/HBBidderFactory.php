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

    public static function bidder()
    {
        $result = self::get('bidder/index', []);

        return self::response($result);
    }

    public static function receipts()
    {
        $result = self::get('receipt/index', []);

        return self::response($result);
    }

    public static function inventory($auction_id)
    {
        $result = self::get('auction/myinventory/'.$auction_id, []);

        return self::response($result);
    }

    /*===================================================*/

    public static function update($data)
    {
        $result = self::put('bidder/update', [], $data);

        return self::response($result);
    }

    /*===================================================*/

    public static function addCard($data)
    {
        $result = self::put('creditcard/create', [], $data);

        return self::response($result);
    }

    public static function removeCard($card_id)
    {
        $result = self::delete('creditcard/delete/' . $card_id);

        return self::response($result);
    }

    /*===================================================*/

    public static function createBid($args)
    {

        $post = [
            'userId'    => intval($args['userId']),
            'auctionId' => intval($args['auctionId']),
            'itemId'    => intval($args['itemId']),
        ];
        if (isset($args["amount"]))
        {
            $post["amount"] = intval($args["amount"]);
        }
        if (isset($args["maxAmount"]))
        {
            $post["maxAmount"] = intval($args["maxAmount"]);
        }
        if (isset($args["quantity"]))
        {
            $post["quantity"] = intval($args["quantity"]);
        }

        $bid = self::post('bid/create', [], $post);

        return self::response($bid);
    }

    public static function removeBid($id)
    {
        $bid = self::post('bid/remove/' . $id, [], []);

        return self::response($bid);
    }

}