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

(function (global) {
    var ttc = global.ttc || require('../../ttc-text'),
        chai = global.chai || require('chai'),
        _ = global._ || require('lodash'),
        expect = chai.expect;

    if (typeof require === 'function') {
        chai.use(require('chai-datetime'));
    }

    describe('Extractors', function () {

        describe('#date', function () {
            var extractor;

            function shared(map) {
                describe('extract by range phrase', function () {
                    _.each(map, function (week, text) {
                        describe('text: ' + text, function () {
                            it('should return week start date', function () {
                                expect(extractor.date(text, true)).to.equalDate(week[0]);
                            });

                            it('should return week end date', function () {
                                expect(extractor.date(text)).to.equalDate(week[1]);
                            });
                        });
                    });
                });
            }

            describe('english', function () {

                beforeEach(function () {
                    ttc.lang('en');
                    extractor = ttc.extractors();
                });

                shared({
                    'at last week': ttc.date().lastWeek(),
                    'last week': ttc.date().lastWeek(),

                    'at this week': ttc.date().week(),
                    'this week': ttc.date().week(),

                    'at next week': ttc.date().nextWeek(),
                    'next week': ttc.date().nextWeek()
                });
            });

            describe('russian', function () {
                var lang = ttc.lang();

                beforeEach(function () {
                    ttc.lang('ru');
                    extractor = ttc.extractors();
                });

                ttc.lang('ru');
                shared({
                    'на прошлой неделе': ttc.date().lastWeek(),
                    'прошлая неделя': ttc.date().lastWeek(),

                    'на этой неделе': ttc.date().week(),
                    'за эту неделю': ttc.date().week(),

                    'на следующей неделе': ttc.date().nextWeek(),
                    'за следующую неделю': ttc.date().nextWeek()
                });
                ttc.lang(lang);
            });
        });
    });
})(this);
