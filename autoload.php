<?php

if (!function_exists('handbid_autoload'))
{
    function handbid_autoload($elem)
    {
        foreach (glob($elem . '/*.php') as $file)
        {
            if (is_file($file))
            {
                $info = pathinfo($file);

                if ($info['extension'] == 'php')
                {
                    require_once $file;
                }
            }
        }

        foreach (glob($elem . '/*', GLOB_ONLYDIR) as $file)
        {
            handbid_autoload($file);
        }
    }
}
handbid_autoload(HB_PATH . 'engine');