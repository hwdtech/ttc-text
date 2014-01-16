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
        isAmd = typeof define === 'function' && define.amd;

    /**
     *
     * @param {_} _
     * @param {Snowball} Snowball
     * @param {Moment} moment
     * @returns {*}
     */
    function load(_, Snowball, moment) {
        var languages,
            text,
            stemmer,
            ttc,
            li,
            date,
            extractedLabel = 'extracted', extractors;

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

        function undefinedLang(lang) {
            throw new Error('Undefined language: ' + lang);
        }

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
                        undefinedLang(key);
                    }
                }
                return langs[key];
            };
        }
        languages = new Languages();

        //endregion

        //region Ttc

        function Ttc() {
        }

        ttc = enhance(Ttc);
        ttc.fn = Ttc.prototype;

        _.extend(ttc, {
            lang: function (key, config) {
                //sync moment localization
                moment.lang(key, config);

                var p = ttc.fn,
                    lang;

                if (!key) {
                    return p._lang.abbr;
                }
                if (config) {
                    return languages.set(key, config).abbr;
                }

                lang = languages.get(key);
                if (!lang) {
                    undefinedLang(key);
                }
                p._lang = lang;
                return p._lang.abbr;
            },

            langConf: function () {
                return ttc.fn._lang;
            }
        });

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

        function format(pattern) {
            var subs = Array.prototype.slice.call(arguments, 1);
            return pattern.replace(/{\(d+\)}/, function (match, idx) {
                return subs[idx];
            });
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
        stemmer = function () {
            var lang = ttc.langConf();
            lang._stemmer = lang._stemmer || new Stemmer(lang.snowballAbbr);
            return lang._stemmer;
        };

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

        li = function (value) {
            return value && value.__isLexicalInfo ? value : new LexicalInfo(value);
        };

        _.extend(LexicalInfo.prototype, {
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

        //endregion

        //region Date

        function D() {
        }
        date = enhance(D);
        _.extend(date.fn = D.prototype, {
            week: function () {
                return moment()
                    .range('week')
                    .toDate();
            },

            lastWeek: function () {
                return moment()
                    .subtract('days', 7)
                    .range('week')
                    .toDate();
            },

            nextWeek: function () {
                return moment()
                    .add('days', 7)
                    .range('week')
                    .toDate();
            },

            weekDay: function (name, past) {
                var ml = moment.fn._lang;
                if (!ml.weekdaysParse(name)) {
                    return null;
                }
                return (!!past ? moment() : moment().subtract('days', 7)).day(name);
            },

            relativeDay: function (name) {
                var idx = ttc.langConf().relativeDays.indexOf(name);

                if (idx === -1) {
                    return null;
                }
                return moment().add('days', idx - 2).toDate();
            },

            parse: function (text, past) {
                return this.weekDay(text, !!past) || this.relativeDay(text);
            }
        });

        //region date extraction

        function extractDateBy(text, legalPr, illegalPr, pattern, fn) {
            var lex = li(text),
                re = new RegExp(format('(\\s|^)({0})\\s+({1})(\\s|$)', legalPr, pattern), 'i'),
                matches = lex.stemmedValue.match(re);

            if (matches) {
                lex.labelBySubstr(matches.index, matches[0], true);
                return fn(matches[3]);
            }

            re = new RegExp(format('((\\s|^)({0})\\s)?\\s*({1})(\\s|$)', illegalPr, pattern), 'i');
            matches = lex.stemmedValue.match(re);
            if (matches && matches[1] === undefined) {
                lex.labelBySubstr(matches.index, matches[0], true);
                return fn(matches[4]);
            }

            return null;
        }

        //region keywords

        function extractDateByKeyword(text, legalPr, illegalPr, keywords) {
            var date = ttc.date();
            return extractDateBy(text, legalPr, illegalPr, keywords.join('|'), date.parse.bind(date));
        }

        function extractSinceDateByKeyword(text) {
            var lang = ttc.langConf();
            return extractDateByKeyword(text, lang.prefix.since, lang.prefix.till, lang.relativeDays);
        }

        function extractTillDateByKeyword(text) {
            var lang = ttc.langConf();
            return extractDateByKeyword(text, lang.prefix.till, lang.prefix.since, lang.relativeDays);
        }

        //endregion

        //region format

        function extractDateByDefaultFormat(text, legalPr, illegalPr) {
            var lang = ttc.langConf(),
                fn = function (date) {
                    moment(date, lang.defaultDateFormat).toDate();
                };
            return extractDateBy(text, legalPr, illegalPr, lang.defaultDateRePattern, fn);
        }

        function extractSinceDateByFormat(text) {
            var pr = ttc.langConf().prefix;
            return extractDateByDefaultFormat(text, pr.since, pr.till);
        }

        function extractTillDateByFormat(text) {
            var pr = ttc.langConf().prefix;
            return extractDateByDefaultFormat(text, pr.till, pr.since);
        }

        //endregion

        //region day names

        function extractDateByDayName(text, legalPr, illegalPr, dayNames, past) {
            return extractDateBy(text, legalPr, illegalPr, dayNames.join('|'), function (d) {
                return ttc.date().parse(d, past);
            });
        }

        function extractSinceDateByDayName(text, past) {
            var pr = ttc.langConf().prefix;
            return extractDateByDayName(text, pr.since, pr.till, moment.weeksdays(), past);
        }

        function extractTillDateByDayName(text, past) {
            var pr = ttc.langConf().prefix;
            return extractDateByDayName(text, pr.till, pr.since, moment.weeksdays(), past);
        }

        //endregion

        //region day phrases

        function extractDateByPhrase(text, start) {
            var lex = ttc.li(text),
                factory = ttc.langConf().ranges,
                res = null;

            _.each(factory, function (fn, phrase) {
                var matches = lex.originalValue.match(new RegExp(phrase, 'i'));

                if (matches && res === null) {
                    lex.labelBySubstr(matches.index, matches[0]);
                    res = start ? fn()[0] : fn()[1];
                }
            });

            return res;
        }

        //endregion

        //endregion

        //endregion

        //region Extractor
        function Extractors() {
        }
        extractors = enhance(Extractors);
        _.extend(extractors.fn = Extractors.prototype, {
            date: function (text, isStart, past) {
                var maybeDate;

                maybeDate = isStart ?
                    extractSinceDateByFormat(text) : extractTillDateByFormat(text);
                if (maybeDate) {
                    return maybeDate;
                }

                maybeDate = isStart ?
                    extractSinceDateByKeyword(text) : extractTillDateByKeyword(text);
                if (maybeDate) {
                    return maybeDate;
                }

                maybeDate = isStart ?
                    extractSinceDateByDayName(text, past) : extractTillDateByDayName(text, past);
                if (maybeDate) {
                    return maybeDate;
                }

                return extractDateByPhrase(text, isStart);
            }
        });
        //

        _.extend(ttc, {
            text: text,
            stemmer: stemmer,
            li: li,
            date: date,
            extractors: extractors
        });

        //region Default localization

        ttc.lang('en', {
            snowballAbbr: 'English',

            ranges: {
                'last week': ttc.date().lastWeek,
                'this week': ttc.date().week,
                'next week': ttc.date().nextWeek
            },

            relativeDays: [
                'yesterday',
                'today',
                'tomorrow'
            ],

            prefix: {
                since: 'since',
                at: 'at|on',
                till: 'till|until'
            },

            defaultDateFormat: 'MM/DD/YYYY',
            defaultDateRePattern: '\\d{2}[\\/]\\d{2}[\\/]\\d{4}'
        });
        ttc.lang('en');

        //endregion

        return ttc;
    }

    if (isNode) {
        module.exports = load(require('lodash'), require('snowball'), require('moment'), require('moment-range'));
    } else if (isAmd) {
        define('ttc', ['_', 'Snowball', 'moment', 'moment-range'], load);
    } else {
        window.ttc = load(window._, window.Snowball, window.moment);
    }
})();
