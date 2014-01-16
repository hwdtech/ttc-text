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

(function () {
    var isNode = typeof module !== 'undefined' && typeof require === 'function',
        global = this,

        _ = isNode ? require('lodash') : global._,
        Snowball = isNode ? require('snowball') : global.Snowball,

        languages,
        text,
        stemmer,
        ttc,

        _li,
        li,
        extractedLabel = 'extracted';

    //region helpers

    function enhance(constr) {
        return function () {
            if (Object.getPrototypeOf(this) !== constr.prototype) {
                var o = Object.create(constr.prototype);
                constr.apply(o, arguments);
                return o;
            }
            return constr.apply(this, arguments);
        };
    }

    //endregion

    //region Languages

    function Languages() {
        var langs = {};

        //default language
        langs.en = {
            abbr: 'en'
        };


        this.set = function (key, config) {
            config.abbr = key;
            langs[key] = langs[key] || {};
            return _.extend(langs[key], config);
        };

        this.get = function (key) {
            if (!langs[key] && isNode) {
                try {
                    require('./lang/' + key);
                } catch (e) {
                    throw new Error('Undefined language: ' + key);
                }
            }
            return langs[key];
        };
    }
    languages = new Languages();

    //endregion

    //region Text

    function trim(string) {
        return typeof String.prototype.trim === 'function' ?
            string.trim() :
            string.replace(/^\s+|\s+$/g, '');
    }

    function escapeRe(value) {
        return value.replace(/([\-.*+?\^${}()|\[\]\/\\])/g, '\\$1');
    }

    function clearPunctuation(string) {
        string = trim(string);
        return string
            .replace(/[\.,-\/#\?!$%\^&\*;:{}=\-_`~()]/g, '')
            .replace(/\s+/g, ' ');
    }

    function words(string) {
        string = trim(string);
        if (!string) {
            return [];
        }
        return clearPunctuation(string).split(' ');
    }

    function TextString(str) {
        this._s = str || '';
    }
    text = enhance(TextString);

    _.extend(text.fn = TextString.prototype, {
        __isTextString: true,

        toString: function () {
            return this._s;
        },

        /**
         * Apply specified autocomplete for this string.
         * @param {string} autocomplete  Auto complete value
         * @return {TextString} Value after applying auto complete
         */
        autocomplete: function (autocomplete) {
            if (!this._s) {
                return text(autocomplete);
            }

            var originalWords = words(this._s),
                regexWords = originalWords.map(function (word) {
                    return '(' + escapeRe(word) + ')';
                }, this),
                ws = regexWords,
                reStr,
                re,
                keep,
                keepCount;

            // calculate how many words we must delete
            while (ws.length > 0) {
                reStr = ws.join('\\s+');
                re = new RegExp(reStr, 'i');

                if (re.test(autocomplete)) {
                    break;
                }

                ws = ws.slice(1);
            }

            keepCount = originalWords.length - ws.length;
            if (keepCount > 0) {
                reStr = regexWords.slice(0, keepCount).join('\\s+');
                re = new RegExp('^' + reStr, 'i');
                keep = re.exec(this._s)[0];

                return text(keep + ' ' + autocomplete);
            }

            return text(autocomplete);
        },

        /**
         * Returns all words within this string.
         * @returns {TextString[]}
         */
        words: function () {
            return words(this._s).map(text);
        }
    });

    //endregion

    //region Stemmer
    function Stemmer(lang) {
        var s,
            l = lang;

        Object.defineProperty(this, '_s', {
            get: function () {
                return (s = s || new Snowball(l));
            }
        });
    }
    stemmer = enhance(Stemmer);

    _.extend(stemmer.fn = Stemmer.prototype, {
        __isStemmer: true,
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
    //endregion

    //region Ttc

    function Ttc() {
    }

    ttc = enhance(Ttc);
    ttc.fn = Ttc.prototype;
    ttc.text = text;

    ttc.stemmer = function () {
        var lang = ttc.fn._lang;

        if (!lang._stemmer) {
            lang._stemmer = stemmer(lang.snowballAbbr);
        }
        return lang._stemmer;
    };

    ttc.lang = function (key, config) {
        var p = ttc.fn,
            lang;

        if (!key) {
            return p._lang.abbr;
        }
        if (config) {
            return languages.set(key, config).abbr;
        }

        p._lang = languages.get(key);
        return p._lang.abbr;
    };
    ttc.lang('en', {
        snowballAbbr: 'English'
    });
    ttc.lang('en');

    //endregion

    //region LexicalInfo (only for private use in Extractor)
    /**
     * @param {string} val
     * @constructor
     * @private
     */
    function LexicalInfo(val) {
        /** @type {string} */
        this.originalValue = val;

        /** @type {string[]} */
        this.words = words(val);

        /** @type {string[]} */
        this.stems = ttc.stemmer().stem(this.words);

        /** * @type {[][]} */
        this.labels = _.map(this.words, function () { return []; });

        /** @type {string} */
        this.stemmedValue = this.stems.join(' ');
    }

    _li = enhance(LexicalInfo);
    li = function (value) {
        return value && value.__isLexicalInfo ? value : _li(value);
    };

    _.extend(li.fn = LexicalInfo.prototype, {
        __isLexicalInfo: true,

        /**
         * Set label for word an specified index
         * @param {number} index Index of word
         * @param {string} label Label for word
         */
        _setLabel: function (index, label) {
            var labels = this.labels[index];
            if (!_.contains(labels, label)) {
                labels.push(label);
            }
        },

        /**
         * Set label for words
         * @param {number} startIndex Index of first word
         * @param {number} endIndex Index of last word (last word is not included)
         * @param {string} label Label for words
         */
        _setLabels: function (startIndex, endIndex, label) {
            for (var i = startIndex; i < endIndex; i++) {
                this._setLabel(i, label);
            }
        },

        /**
         * Set labels for words or stems in substring of {@link LexicalInfo#originalValue}
         * @param {number} startIndex Start index of substring in {@link LexicalInfo#originalValue}
         * @param {string} substring Substring of text corresponding to current instance
         * @param {boolean} [stemmed=false]
         */
        labelBySubstr: function (startIndex, substring, stemmed) {
            var value = !!stemmed ? this.stemmedValue : this.originalValue,
                wordsBefore = words(value.substring(0, startIndex)).length,
                count = words(substring).length;
            this._setLabels(wordsBefore, wordsBefore + count, extractedLabel);
        },

        /**
         * Returns all not labeled words.
         * @returns {string[]}
         */
        notLabeled: function () {
            var me = this,
                len = me.labels.length,
                words = [],
                i;

            for (i = 0; i < len; i++) {
                if (me.labels[i].length === 0) {
                    words.push(me.words[i]);
                }
            }

            return words;
        }
    });

    ttc.li = li;
    //endregion

    //region exposing
    if (isNode) {
        module.exports = ttc;
    }
    global['ttc'] = ttc;
    //endregion

})();
