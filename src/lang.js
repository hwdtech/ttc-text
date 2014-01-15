/**
 * Copyright (C) 2014 Limited Liability Company "Tik-Tok Coach"
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

var extend = require('./util').extend;

function Languages() {
    var langs = {};

    //default language
    langs.en = {
        abbr: 'en'
    };


    this.set = function (key, config) {
        config.abbr = key;
        langs[key] = langs[key] || {};
        return extend(langs[key], config);
    };

    this.get = function (key) {
        if (!langs[key]) {
            try {
                require('../lang/' + key);
            } catch (e) {}
        }
        return langs[key];
    };
}

module.exports = Languages;
