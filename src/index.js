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

var _ = require('lodash'),
    Text = require('./text'),
    Languages = require('./lang'),
    Stemmer = require('./stemmer'),
    lang = require('./lang'),
    ttc;

/**
 * @param {string=} lang The initial language.
 * @constructor
 */
function Ttc(lang) {
    this.languages = new Languages();
    this.lang(lang || 'en');
}

_.extend(Ttc.prototype, {
    lang: function (key, config) {
        if (!key) {
            return this._lang.abbr;
        }

        if (config) {
            return this.languages.set(key, config).abbr;
        }

        var lang = this.languages.get(key);

        if (!lang) {
            throw new Error('Undefined language: ' + key);
        }

        this._lang = lang;
        return lang;
    },

    text: function (str) {
        return new Text(str);
    },

    stemmer: function () {
        var lang = this._lang;
        if (!lang.stemmer) {
            lang.stemmer = new Stemmer(this._lang.snowballAbbr);
        }
        return lang.stemmer;
    }
});

function getTtc() {
    return (ttc = ttc || new Ttc());
}

module.exports = getTtc;

if (typeof window !== 'undefined') {
    (function (global) {
        var ttc;

        function getTtc() {
            return (ttc = ttc || new Ttc());
        }

        global['ttc'] = getTtc();
    })(window);
}
