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
        module.exports = ttcFactory(require('../ttc-text'), require('moment'));
    } else {
        ttcFactory(window.ttc, window.moment);
    }
})(function (ttc, moment) {

    return ttc.lang('ru', {
        snowballAbbr: 'Russian',

        ranges: {
            'на прошлой неделе': ttc.date().lastWeek,
            'прошлая неделя': ttc.date().lastWeek,

            'на этой неделе': ttc.date().week,
            'за эту неделю': ttc.date().week,

            'на следующей неделе': ttc.date().nextWeek,
            'за следующую неделю': ttc.date().nextWeek
        },

        relativeDays: [
            'позавчера',
            'вчера',
            'сегодня',
            'завтра',
            'послезавтра'
        ],

        relativeDay: function (name) {
            var idx = this.relativeDays.indexOf(name);
            if (idx === -1) {
                return null;
            }
            return moment().add('days', idx - 2).toDate();
        },

        prefix: {
            since: 'с|со|от',
            at: 'в|во',
            till: 'до|по|к'
        },

        defaultDateRePattern: '\\d{1,2}[\\.]\\d{1,2}[\\.]\\d{4}',

        estimation: {
            week: 'н',
            day: 'д',
            hour: 'ч',
            minute: 'м'
        }
    });
});
