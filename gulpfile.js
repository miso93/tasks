const elixir = require('laravel-elixir');

require('laravel-elixir-vue-2');

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

elixir(mix => {
    mix.sass('app.scss')
    .version('css/app.css');

});

var gutil = require( 'gulp-util' );
var ftp = require( 'vinyl-ftp' );

gulp.task( 'deploy', function () {

    var conn = ftp.create( {
        host:     'ftp.michalcech.sk',
        user:     'u398139863',
        password: 'Korela219',
        parallel: 10,
        log:      gutil.log
    } );

    var globs = [
        'src/**',
        'css/**',
        'js/**',
        'fonts/**',
        'index.html'
    ];

    // using base = '.' will transfer everything to /public_html correctly
    // turn off buffering in gulp.src for best performance

    return gulp.src( globs, { base: '.', buffer: false } )
        .pipe( conn.newer( '/public_html/tasks' ) ) // only upload newer files
        .pipe( conn.dest( '/public_html/tasks' ) );

} );