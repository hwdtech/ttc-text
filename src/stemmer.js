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

var Snowball = require('snowball'),
    _ = require('lodash');

function Stemmer(lang) {
    var s,
        l = lang;

    Object.defineProperty(this, '_s', {
        get: function () {
            return (s = s || new Snowball(l));
        }
    });
}

_.extend(Stemmer.prototype, {
    /**
     * Stem a single word or an array of word
     * @param {string|string[]} word Word/word to stem
     * @return {string|string[]} Stem of a word or an array of stems,
     */
    stem: function (word) {
        if (_.isArray(word)) {
            return _.map(word, this.stem, this);
        }

        this._s.setCurrent(word);
        this._s.stem();
        return this._s.getCurrent();
    }
});

module.exports = Stemmer;
