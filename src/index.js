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
    Languages = require('./lang'),
    util = require('./util'),
    lang = require('./lang');

/**
 * @param {string=} lang The initial language.
 * @constructor
 */
function Ttc(lang) {
    this.languages = new Languages();
    this.lang(lang || 'en');
}

util.extend(Ttc.prototype, {
    lang: function (key, config) {
        if (!key) {
            return this._lang.abbr;
        }

        if (config) {
            return this.languages.set(key, config).abbr;
        }

        this._lang = this.languages.get(key);
        return this._lang.abbr;
    },

    text: function (str) {
        return new Text(str);
    }
});

function exposeTtc() {
    var ttc = new Ttc();

    if (typeof module.exports !== 'undefined') {
        module.exports = ttc;
    }

    if (typeof window !== 'undefined') {
        window.ttc = ttc;
    }
}

exposeTtc();
