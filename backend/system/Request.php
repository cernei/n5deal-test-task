<?php

class Request {
    public static function getBody()
    {
        return json_decode(file_get_contents('php://input'), true) ?? $_POST;
    }

    /**
     * @throws Exception
     */
    public static function authenticate(): array
    {
        $userId = Session::get('user_id');

        if (!$userId || !$user = DB::table('users')->where('id', '=', $userId)->first()) {
            throw new Exception('User not authenticated', 401);
        }

        return $user;
    }

    public static function getQueryParams(?string $url = null): array {
        $queryString = $url !== null ? parse_url($url, PHP_URL_QUERY) : ($_SERVER['QUERY_STRING'] ?? '');
        parse_str($queryString, $params);
        return $params;
    }
}