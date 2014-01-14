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

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        window.ttc = factory();
    }
})(function () {

    //region utility functions

    function trim(string) {
        return typeof String.prototype.trim === 'function' ?
            string.trim() :
            string.replace(/^\s+|\s+$/g, '');
    }

    function escapeRe(value) {
        return value.replace(/([\-.*+?\^${}()|\[\]\/\\])/g, '\\$1');
    }

    function clearPunctuation(string) {
        return string
            .replace(/[\.,-\/#\?!$%\^&\*;:{}=\-_`~()]/g, '')
            .replace(/\s{2,}$/g, ' ');
    }

    function words(string) {
        string = trim(string);
        if (!string) {
            return [];
        }
        return clearPunctuation(string).split(' ');
    }

    function extend(dest, src) {
        for (var i in src) {
            if (src.hasOwnProperty(i)) {
                dest[i] = src[i];
            }
        }
        if (src.hasOwnProperty("toString")) {
            dest.toString = src.toString;
        }
        if (src.hasOwnProperty("valueOf")) {
            dest.valueOf = src.valueOf;
        }
        return dest;
    }

    //endregion

    //region TextString

    function TextString(str) {
        this._s = str || '';
    }

    function wrap(str) {
        return str && str.__isTextString ? str : new TextString(str);
    }

    extend(TextString.prototype, {
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
                return wrap(autocomplete);
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

                return new TextString(keep + ' ' + autocomplete);
            }

            return new TextString(autocomplete);
        },

        /**
         * Returns all words within this string.
         * @returns {TextString[]}
         */
        words: function () {
            return words(this._s).map(wrap);
        },

        /**
         * Returns last word in this string.
         * @returns {TextString?}
         */
        lastWord: function () {
            var ws = this.words();
            return ws.length === 0 ? null : wrap(ws[ws.length - 1]);
        }
    });

    //endregion TextString

    //region Language

    var languages = {};

    function Language() {}
    //endregion

    return {
        text: wrap,
        TextString: TextString
    };
});
