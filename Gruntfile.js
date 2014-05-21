module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-uncss');

    var grunt_config = {
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            options: {
                scripturl: true
            },
            app: {
                src: [ "source/app/**/*.js" ]
            }
        },

        uncss: {
          dist: {
            src: ['source/html/about.html', 'source/html/index.html'],
            dest: 'dist/css/index.css',
            options: {
              report: 'min' // optional: include to report savings
            }
          }
        },


        handlebars: {
            compile: {
                options: {
                    namespace: 'jst',
                    commonjs: true,
                    processName: function(filename) {
                        return filename.split( '/').splice(2).join( '/').replace( /\.hb/, "");
                    }
                },
                files: {
                    "dist/tmp/templates.js" : "source/app/templates/**/*.hb"
                }
            }
        },


        requirejs: {
            js: {
                options: {
                    // Do not optimize
                    // optimize: "none",

                    // Show warnings
                    // logLevel: 2,
                    name: "require-config",
                    mainConfigFile: "source/app/",
                    out: "dist/tmp/require.js",
                    wrap: false
                }
            }
        },

        cssmin: {
            combine: {
                options: {
                    keepBreaks: true
                },
                files: {
                    'dist/debug/css/index.css': [ 'source/styles/index.css' ]
                }
            }
        },
        /*
        browserify: {
            dist: {
                src: ['app/main.js'],
                dest: 'dist/tmp/build.js',
                options: {
                    shim: {
                        backbone: {
                            path: './libs/backbone/backbone.js',
                            exports: null,
                            depends: {
                                jquery: 'jQuery'
                            }
                        },
                        jquery: {
                            path: './libs/jquery/dist/jquery.js',
                            exports: 'jQuery'
                        },
                        'jquery.jscrollpane': {
                            path: './libs/jquery.jscrollpane.js',
                            exports: null,
                            depends: {
                                jquery: 'jQuery'
                            }
                        }
                    }
                }
            }
        },
        */

        concat: {
            dist: {
                src: [
                    "dist/tmp/build.js"
                ],

                dest: "dist/debug/js/dashboard.js",

                separator: ";"
            }
        },

        copy: {
            app_images: {
                files: [
                    { cwd: "source/app/images/", src: "**", dest: "dist/debug/images/", expand: true }
                ]
            },

            jquery_ui_images: {
                files: [
                    { cwd: "libs/jquery-ui/css/custom-theme/images/", src: "*.png", dest: "dist/debug/css/images/", expand: true }
                ]
            },

            bootstrap_images: {
                files: [
                    { cwd: "libs/bootstrap/img/", src: "*.png", dest: "dist/debug/img/", expand: true }
                ]
            }
        }
    };

    // setup grunt.
    grunt.initConfig( grunt_config );

    // generate copy tasks from livelink.json.

    ( function() {

            var _ = require( "underscore"),
            fs = require( 'fs' );

        /**
         * returns true if str ends with pattern.
         * @param str
         * @param pattern
         * @returns {boolean}
         */
        function endsWith(str, pattern) {
            var d = str.length - pattern.length;
            return d >= 0 && str.indexOf(pattern, d) === d;
        }

        /**
         * Returns true if str ends with a front or back slash.
         * @param str
         * @returns {boolean}
         */
        function isDirSpec( str ) {
            return endsWith( str, "/" ) || endsWith( str, "\\" );
        }

        /**
         * Converts a directory specification to use forward slashes and
         * end with a trialing slash.
         * @param dir - directory name to convert.
         * @returns {string}
         */
        function makeDirSpec( dir ) {
            return ( isDirSpec( dir ) ? dir : dir + "/" ).replace( /\\/g, '/' );
        }

        /**
         * Converts a variable number of numeric strings to a single number.
         * Each argument should be between 0 and 99.
         * @returns {number}
         */
        function verToNumber( major, minor, rev ) {
            var val = 0, i = 0;
            for( ; i < arguments.length; ++i )  {
                var vnum = parseInt( arguments[i], 10 );
                vnum = isNaN( vnum ) ? 0 : vnum;
                val = val * 100 + vnum;
            }
            return val;
        }

        /**
         * @param ll_home       Livelink home directory.
         * @param modName       Module name to look for
         * @param installName   Name of the Livelink install (only for logging).
         * @returns {string}    The path of the module (with the largest version number if more than one)
         */
        function findModDir( ll_home, modName, installName ) {
            var allModDirs;

            try {
                allModDirs = fs.readdirSync( ll_home + "module");
            }
            catch( e ) {
                grunt.log.fail( "Warning: Can't find module directory for " + installName + ": " + e.message );
                return;
            }

            var mods = _.chain( allModDirs ).
                map( function( name ) {
                    var parts = name.split( "_" );

                    // break the directory name out into name/version.
                    return {
                        path: name,
                        name: parts[0],
                        version: verToNumber.apply( null, parts.slice( 1 ) )
                    };
                }).
                filter( function( mod ) {
                    // make sure we find the right module name..
                    return mod.name === modName;
                }).value();

            return mods.length ? _.max( mods, function( v ) { return v.version; }).path : null;
        }

        // these are the normal build tasks -- we will append additional copy tasks
        // based on the livelink.json configuration.

        var buildTasks = [
             'requirejs', 'concat:dist',"cssmin", "copy:app_images",
            "copy:jquery_ui_images", "copy:bootstrap_images"
        ];

        grunt.log.write( "Looking for local Livelink config (livelink.json/llconfig.json): " )

        // read our machine specific LL files ...
        // update grunt_config with copy tasks for each LL install.

        var llConfig;

        _.find( [  './llconfig.json', './livelink.json'], function(f) {
            try {
                llConfig = require( f );
                return true;
            }
            catch( e ) {
                return false;
            }
        } );

        if ( llConfig ) {
            grunt.log.ok();

            _.each( llConfig, function( path, llName ) {

                var llHome = makeDirSpec( path );
                var supportPath = llHome + "support/";
                var modDir = findModDir( llHome, 'replicator', llName );

                if( modDir ) {
                    modPath = llHome + "module/" + modDir + "/";

                    // add the new copy section to the config.
                    grunt_config.copy[llName] = {
                        files: [
                            { cwd: "dist/debug", src: "**", dest: modPath + "support/dashboard/", expand: true },
                            { cwd: "dist/debug", src: "**", dest: supportPath + "replicator/dashboard/", expand: true },
                            { src: "index.html", dest: modPath + "html/", expand: true, rename:
                                function(dest, src) { return dest + "replstatus.html"; } }
                        ]
                    };

                    grunt.log.ok( "Adding task copy: " + llName );

                    // add the new copy task to the debug command.
                    buildTasks.push( "copy:" + llName );
                };
            } );
        }
        else {
            grunt.log.fail( "Can NOT load." );
        }

        // Default task(s).
        grunt.registerTask( 'debug', buildTasks );
    } )();
};


