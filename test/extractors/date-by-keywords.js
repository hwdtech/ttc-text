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

/*global describe,beforeEach,it,sharedBehaviourFor,itShouldBehaveLike */

(function (global) {
    var ttc = (global.ttc || require('../../ttc-text')),
        moment = (global.moment || require('moment')),
        expect = (global.chai || require('chai')).expect;

    if (typeof require === 'function') {
        require('../../lib/shared');
    }

    describe('Extractors#date', function () {

        var single, singleDates,
            extractor;

        sharedBehaviourFor('date extracted by keyword', function () {

            it('should return same start and end date when only one keyword specified (possibly wit prefix `at`)', function () {
                single.forEach(function (text, idx) {
                    expect(extractor.date(text)).to.equalDate(singleDates[idx].toDate());
                });
            });
        });

        describe('english', function () {
            beforeEach(function () {
                ttc.lang('en');
                single = [
                    'call Tom at yesterday', // ;)
                    'buy today',
                    'break the wall tomorrow'
                ];
                singleDates = [
                    moment().subtract('days', 1),
                    moment(),
                    moment().add('days', 1)
                ];
                extractor = ttc.extractors();
            });

            itShouldBehaveLike('date extracted by keyword');
        });
    });
})(this);
