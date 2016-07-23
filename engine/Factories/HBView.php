<?php

class HBView
{
    public static function view($view_path)
    {
        $real_path = HB_PATH . 'views/' . str_replace('.', '/', $view_path) . '.phtml';

        if (file_exists($real_path))
        {
            return file_get_contents($real_path);
        }
        else
        {
            return "Cannot find view '{$view_path}'";
        }
    }
}