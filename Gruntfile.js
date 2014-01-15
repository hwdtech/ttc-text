/**
 * Copyright (C) 2011-2013 Limited Liability Company "Hello World! Technologies"
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for
 * the specific language governing permissions and limitations under the License.
 */

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            all: ['Gruntfile.js', 'src/**/*.js', 'test/node/**/*.js'],
            options: {
                "expr": true,
                "node": true,
                "browser": true,
                "boss": false,
                "curly": true,
                "debug": false,
                "devel": false,
                "eqeqeq": true,
                "eqnull": true,
                "evil": false,
                "forin": false,
                "immed": false,
                "laxbreak": false,
                "newcap": true,
                "noarg": true,
                "noempty": false,
                "nonew": false,
                "onevar": true,
                "plusplus": false,
                "regexp": false,
                "undef": true,
                "sub": true,
                "strict": false,
                "white": true,
                "globals": {
                    "define": false
                }
            }
        },

        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    ui: 'bdd'
                },
                src: ['test/node/**/*.js']
            }
        },

        browserify: {
            dist: {
                files: {
                    'dist/ttc-text.js': ['src/**/*.js'],
                    'dist/ttc-text-langs.js': ['src/**/*.js', 'langs/**/ *.js']
                }
            },
            test: {
                files: {
                    'test/browser/all.js': ['test/**/*.spec.js']
                }
            }
        },

        uglify: {
            target: {
                files: {
                    'dist/ttc-text.min.js': ['dist/ttc-text.js'],
                    'dist/ttc-text-langs.min.js': ['dist/ttc-text-langs.js'],
                    'dist/langs.min.js': ['lang/*.js']
                }
            }
        },

        concat: {
            langs: {
                src: 'lang/*.js',
                dest: 'dist/langs.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-browserify');

    grunt.registerTask('default', ['jshint', 'mochaTest']);
    grunt.registerTask('dist',
        [
            'default',
            'browserify',
            'concat:langs',
            'uglify'
        ]
    );
};
