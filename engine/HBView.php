<?php

class HBView
{
    public static function view($view_path)
    {
        $real_path = HB_PATH . 'views/' . str_replace('.', '/', $view_path) . '.phtml';

        if (file_exists($real_path))
        {
            $content = file_get_contents($real_path);

            preg_match_all('/@include\([\'"]([^\(]+)[\'"]\)/ui', $content, $matches);

            if(!empty($matches[0]))
            {
                foreach ($matches[0] as $key => $replace)
                {
                    $replace_path = $matches[1][$key];
                    $replace_by = self::view($replace_path);
                    $content = str_replace($replace, $replace_by, $content);
                }
            }

            return $content;
        }
        else
        {
            return "Cannot find view '{$view_path}'";
        }
    }
}