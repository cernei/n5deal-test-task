<?php

class Route
{
    protected static array $routes = [];

    public static function get(string $uri, callable|array $action): void {
        self::$routes['GET'][$uri] = $action;
    }

    public static function post(string $uri, callable|array $action): void {
        self::$routes['POST'][$uri] = $action;
    }

    public static function patch(string $uri, callable|array $action): void {
        self::$routes['PATCH'][$uri] = $action;
    }

    public static function put(string $uri, callable|array $action): void {
        self::$routes['PUT'][$uri] = $action;
    }

    /**
     * Register an UPDATE route for clients that use UPDATE as their method.
     * (PUT/PATCH are the standard HTTP methods for updates.)
     */
    public static function update(string $uri, callable|array $action): void {
        self::$routes['UPDATE'][$uri] = $action;
    }

    public static function delete(string $uri, callable|array $action): void {
        self::$routes['DELETE'][$uri] = $action;
    }

    public static function dispatch(): void {
        $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $method = $_SERVER['REQUEST_METHOD'];

        foreach (self::$routes[$method] ?? [] as $route => $action) {
            $parameterNames = [];
            $pattern = preg_replace_callback('/\{([A-Za-z_][A-Za-z0-9_]*)\}/',
                static function (array $match) use (&$parameterNames): string {
                    $parameterNames[] = $match[1];
                    return '([^/]+)';
                }, $route);

            if ($pattern === null || !preg_match('#^' . $pattern . '$#D', $uri, $matches)) {
                continue;
            }

            if (is_callable($action)) {
                array_shift($matches);
                $parameters = [];
                foreach ($parameterNames as $index => $name) {
                    $parameters[$name] = rawurldecode($matches[$index]);
                }
                try {
                    $response = call_user_func_array($action, array_values($parameters));
                } catch (Throwable $exception) {
                    $status = $exception->getCode();
                    if ($status < 100 || $status > 599) {
                        $status = 500;
                    }

                    http_response_code($status);
                    header('Content-Type: application/json');
                    echo json_encode(['message' => $exception->getMessage()]);
                    return;
                }

                if (is_array($response)) {
                    header('Content-Type: application/json');
                    echo json_encode($response);
                    return;
                }

                echo $response;
                return;
            }
        }

        http_response_code(404);
        header('Content-Type: application/json');
        echo json_encode(['message' => 'Not Found'], JSON_PRETTY_PRINT);
    }
}
