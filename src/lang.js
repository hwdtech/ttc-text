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

var languages = {},
    util = require('./util');

function hasLang(abbr) {
    return !!languages[abbr];
}

function setLang(abbr, config) {
    config.abbr = abbr;
    if (!hasLang(abbr)) {
        languages[abbr] = {};
    }
    return util.extend(languages[abbr], config);
}

function removeLang(abbr) {
    languages[abbr] = null;
}

function getLangConfig(abbr) {
    if (!hasLang(abbr)) {
        try {
            require('../lang/' + abbr);
        } catch (e) { }
    }
    return languages[abbr];
}

module.exports = {
    set: setLang,
    remove: removeLang,
    load: getLangConfig,
    has: hasLang
};
