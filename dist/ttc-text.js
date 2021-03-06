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

(function (global, factory) {
    if (typeof exports === 'object') {
        module.exports = factory(require('lodash'), require('snowball'), require('moment'));
    }
    else if (typeof define === 'function' && define.amd) {
        define('ttc-text', ['lodash', 'snowball', 'moment'], factory);
    }
    else {
        global['ttc'] = factory(global._, global.Snowball, global.moment);
    }
}(this, function (_, Snowball, moment) {

    var isNode = typeof exports === 'object',
        languages,
        text,
        stemmer,
        ttc,
        li,
        date,
        extractedLabel = 'extracted',
        extractors, u;

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
        return trim(string
            .replace(/[\.,\/#\?!$%\^&\*;:{}=\-_`~()](\s|$)/g, ' ')
            .replace(/\s+/g, ' '));
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
        return pattern.replace(/\{(\d+)\}/g, function (match, idx) {

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
        this.labels = _.map(this.words, function () {
            return [];
        });

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

    function week(m) {
        m = m || moment();
        return [
            m.startOf('week').toDate(),
            m.endOf('week').toDate()
        ];
    }

    function D() {
    }

    date = enhance(D);
    _.extend(date.fn = D.prototype, {
        __isDate: true,

        week: function () {
            return week();
        },

        lastWeek: function () {
            return week(moment().subtract('days', 7));
        },

        nextWeek: function () {
            return week(moment().add('days', 7));
        }
    });

    //region date extraction

    function valueByStemmed(list, stemmedName) {
        return _.find(list, function (wdn) {
            return wdn.toLowerCase().indexOf(stemmedName.toLowerCase()) === 0;
        }) || null;
    }

    function parseToDate(text, past) {
        var dayName = valueByStemmed(moment.weekdays(), text);
        if (dayName) {
            return (!!past ? moment().subtract('days', 7) : moment()).day(dayName).toDate();
        }
        dayName = valueByStemmed(ttc.fn._lang.relativeDays, text);
        return ttc.langConf().relativeDay(dayName) || null;
    }

    function extractDateBy(text, legalPr, illegalPr, pattern, fn) {

        function stem(pr) {
            var st = ttc.stemmer(),
                s = '|';
            return st.stem(pr.split(s)).join(s);
        }

        legalPr = stem(legalPr);
        illegalPr = stem(illegalPr);
        pattern = stem(pattern);

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
        return extractDateBy(text, legalPr, illegalPr, ttc.stemmer().stem(keywords).join('|'), parseToDate);
    }

    function extractSinceDateByKeyword(text) {
        var lang = ttc.langConf();
        return extractDateByKeyword(text, lang.prefix.since + '|' + lang.prefix.at, lang.prefix.till, lang.relativeDays);
    }

    function extractTillDateByKeyword(text) {
        var lang = ttc.langConf();
        return extractDateByKeyword(text, lang.prefix.till + '|' + lang.prefix.at, lang.prefix.since, lang.relativeDays);
    }

    //endregion

    //region format

    function extractDateByDefaultFormat(text, legalPr, illegalPr) {
        var lang = ttc.langConf(),
            fn = function (date) {
                return moment(date, 'l').toDate();
            };
        return extractDateBy(text, legalPr, illegalPr, lang.defaultDateRePattern, fn);
    }

    function extractSinceDateByFormat(text) {
        var pr = ttc.langConf().prefix;
        return extractDateByDefaultFormat(text, pr.since + '|' + pr.at, pr.till);
    }

    function extractTillDateByFormat(text) {
        var pr = ttc.langConf().prefix;
        return extractDateByDefaultFormat(text, pr.till + '|' + pr.at, pr.since);
    }

    //endregion

    //region day names

    function extractDateByDayName(text, legalPr, illegalPr, dayNames, past) {
        dayNames = _.map(dayNames, function (d) {
            return d.toLowerCase();
        }).join('|');

        return extractDateBy(text, legalPr, illegalPr, dayNames, function (val) {
            return parseToDate(val, past);
        });
    }

    function extractSinceDateByDayName(text, past) {
        var pr = ttc.langConf().prefix;
        return extractDateByDayName(text, pr.since + '|' + pr.at, pr.till, moment.weekdays(), past);
    }

    function extractTillDateByDayName(text, past) {
        var pr = ttc.langConf().prefix;
        return extractDateByDayName(text, pr.till + '|' + pr.at, pr.since, moment.weekdays(), past);
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

    function extractDate(text, isStart, past) {
        isStart = !!isStart;

        var maybeDate = isStart ?
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

    //endregion

    //endregion

    //region time extraction

    function extractTime(text, isStart) {
        var isMeridiem = moment.langData()._meridiemParse.test(text),
            f = !isMeridiem ? '(\\d{1,2}):(\\d{2})' : '(\\d{1,2}):(\\d{2})\\s?([ap])m',
            prs = ttc.langConf().prefix,
            prefix = isStart ? (prs.since + '|' + prs.at) : prs.till,
            re = new RegExp(format('({0})\\s+{1}', prefix, f), 'i'),
            matches,
            hours;

        text = li(text);
        matches = text.originalValue.match(re);

        if (matches && matches[2]) {
            text.labelBySubstr(matches.index, matches[0]);

            hours = +matches[2];
            if (matches[4] === 'a') {
                if (hours === 12) {
                    hours = 0;
                }
            } else if (matches[4] === 'p') {
                if (hours > 1 && hours < 12) {
                    hours += 12;
                }
            }

            return [hours, +matches[3] || 0, 0, 0];
        }

        return null;
    }

    //endregion

    //endregion

    //region Estimation

    function estimation(unit, count) {
        switch (unit) {
            case 'week':
                count *= 7;
                /* falls through */
            case 'day':
                count *= 24;
                /* falls through */
            case 'hour':
                count *= 60;
                /* falls through */
            case 'minute':
                return count;
        }

        return null;
    }

    function estimationRe(abbr) {
        return new RegExp('(\\d+(\\.\\d+)?)' + abbr, 'i');
    }

    //endregion

    //region Collection

    function matchInCollection(collection, stemmed, valueFn) {
        var an = ttc.langConf().alphaNum,
            rePattern = '^\\s*' + _.map(stemmed, escapeRe).join('(' + an + '){0,4}\\s+') +
                '(' + an + '){0,4}\\s*$',
            regex = new RegExp(rePattern, 'i');

        return _.find(collection, function (item, idx, col) {
            return regex.test(typeof valueFn === 'function' ? valueFn(item, idx, col) : item);
        });
    }

    //endregion

    //region Extractor

    function Extractors() {
    }

    extractors = enhance(Extractors);
    _.extend(extractors.fn = Extractors.prototype, {
        __isExtractors: true,

        estimation: function (text) {
            text = li(text);

            function matcher(abbr, full) {
                var matches = text.originalValue.match(estimationRe(abbr));
                if (matches) {
                    text.labelBySubstr(matches.index, matches[0]);
                    return estimation(full, parseFloat(matches[1]));
                }
                return 0;
            }

            var value = 0;
            _.each(ttc.langConf().estimation, function (abbr, full) {
                return value += matcher(abbr, full);
            });
            return value || null;
        },

        date: function (text, isStart, isPast) {
            var date = extractDate(text, isStart, !!isPast),
                time = extractTime(text, isStart);

            if (time) {
                date = date || new Date();
            }

            if (!date) {
                return null;
            }

            Date.prototype.setHours.apply(date, time || [0, 0, 0, 0]);
            return date;
        },

        collection: function (text, list, valueFn) {
            text = li(text);

            var stemmed = text.stems,
                len = stemmed.length,
                matched = [],
                item,
                i, j;

            for (i = 0; i < len; i++) {
                for (j = len; j > i; j--) {
                    item = matchInCollection(list, stemmed.slice(i, j), valueFn);

                    if (item) {
                        matched.push(item);
                        text._setLabels(i, j, extractedLabel);
                        // skip words that were successfully extracted, switch to next not extracted word
                        i = j - 1;
                        break;
                    }
                }
            }
            return matched;
        }
    });
    //endregion

    //region Utils

    function Utils() {}
    u = enhance(Utils);
    _.extend(u.fn = Utils.prototype, {
        formatEstimation: function (minutes) {
            var est = ttc.langConf().estimation,
                hours,
                rest;

            if (!_.isNumber(minutes) || minutes < 0) {
                return '';
            }

            if (minutes < 60) {
                return minutes + est.minute;
            }

            hours = Math.floor(minutes / 60);
            rest = minutes - hours * 60;

            return (rest > 0) ? format('{0}{1} {2}{3}', hours, est.hour, rest, est.minute) : hours + est.hour;
        },

        /**
         * Generates hex color based on the specified GUID
         * @param {string} guid
         * @return {string?}
         */
        guidHexColor: function (guid) {
            return !_.isFunction(guid.slice) ? null : '#' + guid.slice(4, 7) + guid.slice(-8, -5);
        }
    });

    //endregion

    _.extend(ttc, {
        text: text,
        stemmer: stemmer,
        li: li,
        date: date,
        extractors: extractors,
        utils: u
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

        relativeDay: function (name) {
            var idx = this.relativeDays.indexOf(name);
            if (idx === -1) {
                return null;
            }
            return moment().add('days', idx - 1).toDate();
        },

        prefix: {
            since: 'since|from',
            at: 'at|on',
            till: 'till|until'
        },

        defaultDateRePattern: '\\d{1,2}[\\/]\\d{1,2}[\\/]\\d{4}',

        estimation: {
            week: 'w',
            day: 'd',
            hour: 'h',
            minute: 'm'
        },

        alphaNum: '[\\w\\d\\.]'
    });
    ttc.lang('en');

    //endregion

    return ttc;
}));
