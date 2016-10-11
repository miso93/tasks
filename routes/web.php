<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| This file is where you may define all of the routes that are handled
| by your application. Just tell Laravel the URIs it should respond
| to using a Closure or controller method. Build something great!
|
*/

use Illuminate\Support\Facades\App;

Route::get('/', function () {

    return view('welcome');
});

Route::get('test', function(){

    $pusher = App::make('pusher');
    
    $pusher->trigger('demoChannel', 'userLikedPost', []);

    return 'Done';
});
