<?php

class HBHelpers
{
    public static function makeAuctionTimes($auction)
    {

        $auctionStartTime = (isset($auction->startTime)) ? $auction->startTime : "";
        $auctionEndTime   = (isset($auction->endTime)) ? $auction->endTime : "";
        $auctionTitle     = (isset($auction->name)) ? $auction->name : "";
        $auctionTimeZone  = (isset($auction->timeZone)) ? $auction->timeZone : "";

        $timeZone = (trim($auctionTimeZone)) ? $auctionTimeZone : 'America/Denver';

        $auctionHeaderTimes = '';

        date_default_timezone_set($timeZone);

        $sep = ' — ';

        if (date('Ymd', $auctionStartTime) == date('Ymd', $auctionEndTime))
        {
            //The same day of opening and closing
            $auctionHeaderTimes .= date('M jS g:i a', $auctionStartTime) . $sep . date('g:i a | Y', $auctionEndTime);
        }
        elseif (date('Ym', $auctionStartTime) == date('Ym', $auctionEndTime))
        {

            //The same month
            $auctionHeaderTimes .= date('M jS g:i a', $auctionStartTime) . $sep . date('jS g:i a | Y', $auctionEndTime);

        }
        elseif (date('Y', $auctionStartTime) == date('Y', $auctionEndTime))
        {
            //The same year
            $auctionHeaderTimes .= date('M jS g:i a', $auctionStartTime) . $sep . date('M jS g:i a | Y', $auctionEndTime);
        }
        else
        {
            //Different years
            $auctionHeaderTimes .= date('M jS g:i a | Y', $auctionStartTime) . $sep . date('M jS g:i a | Y', $auctionEndTime);
        }

        $auctionHeaderTimes .= ' ' . date("T", $auctionEndTime);

        $auction->auctionHeaderTimes = $auctionHeaderTimes;

        $format = 'n.j g:i a';
        switch($auction->status) {

            case 'open':
                $auctionBoxTimes = 'Closes: ' . date($format, $auctionEndTime);
                break;
            case 'closed':
                $auctionBoxTimes = 'Closed: ' . date($format, $auctionEndTime);
                break;
            default:
                $auctionBoxTimes = 'Opens: ' . date($format, $auctionStartTime);

        }
        if ($timeZone) {
            $auctionBoxTimes .= " " . date("T");
        }

        $auction->auctionBoxTimes = $auctionBoxTimes;

        return $auction;
    }
}