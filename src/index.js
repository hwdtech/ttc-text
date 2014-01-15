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

var Text = require('./text'),
    util = require('./util'),
    lang = require('./lang'),
    ttc;

/**
 * @param {string=} lang The initial language.
 * @constructor
 */
function Ttc(lang) {
    this.lang(lang || 'en');
}

util.extend(Ttc.prototype, {


    lang: function (key, config) {
        if (!key) {
            return this._lang.abbr;
        }

        if (config) {
            this._lang = lang.set(key, config);
        } else if (!lang.has[key]) {
            this._lang = lang.load(key);
        }

        return this._lang.abbr;
    },

    text: function (str) {
        return new Text(str);
    }
});

ttc = new Ttc();
module.exports = ttc;

if (typeof window !== 'undefined') {
    window.ttc = ttc;
}
