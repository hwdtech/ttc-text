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

(function (ttcFactory) {
    if (typeof module !== 'undefined' && typeof require === 'function') {
        module.exports = ttcFactory(require('../ttc-text'));
    } else {
        ttcFactory(window.ttc);
    }
})(function (ttc) {

    return ttc.lang('ru', {
        snowballAbbr: 'Russian',

        ranges: {
            'на прошлой неделе': ttc.date().lastWeek,
            'прошлая неделя': ttc.date().lastWeek,

            'на этой неделе': ttc.date().week,
            'эта неделя': ttc.date().week,

            'на следующей неделе': ttc.date().nextWeek,
            'следующая неделя': ttc.date().nextWeek
        },

        relativeDays: [
            'позавчера',
            'вчера',
            'сегодня',
            'завтра',
            'послезавтра'
        ],

        prefix: {
            since: 'с|со|от',
            at: 'в|во',
            till: 'до|по|к'
        },

        defaultDateFormat: 'l',
        defaultDateRePattern: '\\d{1,2}[\\.]\\d{1,2}[\\.]\\d{4}'
    });
});
