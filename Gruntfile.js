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
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            test: {
                options: {
                    jshintrc: 'test/.jshintrc'
                },
                src: ['test/**./*.spec.js']
            },
            all: ['Gruntfile.js', 'ttc-text.js', 'lib/**/*.js']
        },

        copy: {
            dist: {
                files: [{
                    src: 'ttc-text.js',
                    dest: 'dist/ttc-text.js'
                }]
            }
        },

        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    ui: 'bdd',
                    require: 'coverage/blanket'
                },
                src: ['test/**/*.spec.js']
            },
            coverage: {
                options: {
                    reporter: 'html-cov',
                    // use the quiet flag to suppress the mocha console output
                    quiet: true,
                    // specify a destination file to capture the mocha
                    // output (the quiet option does not suppress this)
                    captureFile: 'coverage/index.html'
                },
                src: ['test/**/*.spec.js']
            }
        },

        uglify: {
            target: {
                files: {
                    'dist/ttc-text.min.js': ['ttc-text.js'],
                    'dist/ttc-text-langs.min.js': ['ttc-text.js', 'lang/*.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.registerTask('default', ['jshint', 'mochaTest']);
    grunt.registerTask('dist', ['default', 'copy', 'uglify']);
};
