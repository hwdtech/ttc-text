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
            all: ['Gruntfile.js', 'src/ttc-text.js', 'test/**/*.js'],
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
                src: ['test/**/*.spec.js']
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.registerTask('default', ['jshint', 'mochaTest']);
};
