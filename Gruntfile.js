var fse = require('fs-extra');
var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config');

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        env : {
            options : {
                //Shared Options Hash
            },
            prod : {
                BABEL_ENV : 'production'
            }
        },
        webpack: { 
            options: webpackConfig,
            watch: {
                watch: true,
                //keepalive: true, // this will block next grunt task
                watchOptions: {
                    poll:1000
                }
            },            
            dev: {
            },
            prod: {
                // replicate from webpack config, since node_env cannot be passed onto webpack
                plugins: webpackConfig.plugins.concat(
                    new webpack.optimize.UglifyJsPlugin({
                        compress: {
                            screw_ie8: true
                        }
                    }),
                    new webpack.DefinePlugin({
                        'process.env': {
                            NODE_ENV: JSON.stringify("production")
                        }
                    })
                )
            }
        },

        less: {
            options: {
                //cleancss: true
                //compress:true
            },
            files: {
                expand: true,
                cwd: "assets/less",
                src: ["common/*.less","*.less"],
                dest: "assets/css-temp",
                ext: ".css"
            }
        },
        concat: {
            css: {
                src: ['assets/css-temp/**/*.css'],
                dest: "assets/css/all.css"
            }
        },
        watch: {
            locale: {
                files: ['locales/**/*.json'],
                tasks: ['build-locales']
            },
            styles: {
              files: ['assets/less/**/*.less'], // which files to watch
              tasks: ['build-less'],
              options: {
                nospawn: true
              }
            }
        }
    });

    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-webpack');
    grunt.registerTask('clean-less', function() {
        console.log('removing css-temp folder...');
        fse.removeSync('assets/css-temp');
    });
    grunt.registerTask('build-less', function() {
        grunt.task.run('less','concat:css', 'clean-less');
    });
    grunt.registerTask('build-locales', function() {
        console.log('checking locale files...')
        if (fs.existsSync('locales')) {
            console.log('concat locale files...');
            fs.readdirSync('locales').forEach(lng => {
                let res = {};
                fs.readdirSync(`locales/${lng}`).forEach(filepath => {
                    res[path.basename(filepath, '.json')] = fse.readJsonSync(`locales/${lng}/${filepath}`);
                })
                fse.outputJsonSync(`assets/locales/${lng}.json`, res);
            });
        }
    });
    grunt.registerTask('clean', function() {
        console.log('cleaning generated assets...')
        fse.removeSync('assets/js')
        fse.removeSync('assets/css')
        fse.removeSync('assets/locales')
    });
    grunt.registerTask('clean-all', function() {
        grunt.task.run('clean');

        console.log('cleaning dependencies...')
        fse.removeSync('node_modules')
        fse.removeSync('assets/lib')
    });
    grunt.registerTask('default', ['webpack:watch', 'build-less', /*'eslint',*/'build-locales', 'watch'])
    grunt.registerTask('dev', ['webpack:dev', 'build-less', /*'eslint',*/'build-locales'])
    grunt.registerTask('prod', ['env:prod','webpack:prod', 'build-less', /*'eslint',*/'build-locales'])
};
