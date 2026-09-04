<?php

class Response
{
    public static function json($data, $status = 200): string|false
    {
        http_response_code($status);

        return json_encode($data);
    }

    public static function debug($data, $status = 200): string|null|false
    {
        http_response_code($status);

        return is_array($data) ? json_encode($data) : $data;
    }
}