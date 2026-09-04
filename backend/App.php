<?php
Route::get('/', fn() => ['status' => 'success', 'message' => 'Welcome to your micro-Laravel framework!']);

Route::get('/reset-log', function () {
    ResetLog::reset();
    return ['status' => 'success', 'message' => 'Log as been reset'];
});
Route::get('/reset', function () {
    ResetLog::reset();
    Seeder::run();
    return ['status' => 'success', 'message' => 'Database has been reset'];
});
//Route::get('/users', fn() => DB::table('users')->get());
Route::get('/assets', function () {
    $params = Request::getQueryParams();

    $query = DB::table('assets');
    if (isset($params['min']) && $params['min'] !== '') {
        $query->where('askingPrice', '>=', $params['min']);
    }
    if (isset($params['max']) && $params['max'] !== '') {
        $query->where('askingPrice', '<=', $params['max']);
    }
    if (isset($params['country']) && $params['country'] !== '') {
        $query->where('country', '=', $params['country']);
    }

    return Response::json($query->get());
});

Route::post('/login', function () {
    $body = Request::getBody();

    $email = $body['email'] ?? '';
    $password = $body['password'] ?? '';
    $user = DB::table('users')->where('email', '=', $email)->first();

    if ($user && password_verify($password, $user['password'])) {
        Session::put('email', $user['email']);
        Session::put('user_id', $user['id']);
        unset($user['password']);

        return Response::json(['message' => 'Login successful', 'user' => $user]);
    }

    return Response::json(['message' => 'Invalid email or password.'], 401);
});
Route::get('/logout', function () {
    Session::forget('user_id');
    Session::forget('email');
    return ['message' => 'Logout successful'];
});
Route::get('/my-assets', function () {
    $user = Request::authenticate();

    $assets = DB::table('assets')
        ->where('user_id', '=', $user['id'])
        ->get();

    return Response::json($assets);
});
Route::get('/my-assets/{id}', function ($id) {
    $user = Request::authenticate();
    $assets = DB::table('assets')
        ->where('id', '=', $id)
        ->where('user_id', '=', $user['id'])
        ->first();

    return Response::json($assets);
});
Route::post('/my-assets', function ()  {
    $user = Request::authenticate();
    $body = Request::getBody();
    $body['user_id'] = $user['id'];
    DB::table('assets')->insert($body);

    return Response::json(['message' => 'Asset created successfully']);
});
Route::put('/my-assets/{id}', function ($assetId) {
    $user = Request::authenticate();
    $body = Request::getBody();

    DB::table('assets')
        ->where('id', '=', $assetId)
        ->where('user_id', '=', $user['id'])
        ->update($body);
    return ['message' => 'Asset updated successfully'];
});
Route::delete('/my-assets/{id}', function ($assetId) {
    $user = Request::authenticate();

    DB::table('assets')
        ->where('id', '=', $assetId)
        ->where('user_id', '=', $user['id'])
        ->delete();
    return ['message' => 'Asset deleted successfully'];
});
