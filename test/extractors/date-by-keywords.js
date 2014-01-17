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
        chai = (global.chai || require('chai')),
        expect = chai.expect;

    if (typeof require === 'function') {
        chai.use(require('chai-datetime'));
        require('../../lib/shared');
    }

    describe('Extractors#date', function () {

        var start, startDate,
            end, endDate,
            extractor,
            singles,
            dates;

        sharedBehaviourFor('date extracted by keyword', function () {
            describe('with a prefix', function () {
                it('should return start date when prefix `since` is specified', function () {
                    expect(extractor.date(start, true)).to.equalDate(startDate.toDate());
                });

                it('should return null end date when prefix `since` is specified', function () {
                    expect(extractor.date(start)).to.be.null;
                });

                it('should return end date when prefix `till` is specified', function () {
                    expect(extractor.date(end)).to.equalDate(endDate.toDate());
                });

                it('should return null start date when prefix `till` is specified', function () {
                    expect(extractor.date(end, true)).to.be.null;
                });
            });

            describe('without a prefix', function () {
                singles.forEach(function (text, i) {
                    (function (idx) {
                        var text = singles[idx],
                            date = dates[idx];

                        describe('text: ' + text, function () {
                            it('should return start date', function () {
                                var e = extractor.date(text);
                                expect(e).not.to.be.null;
                                expect(e).to.equalDate(date.toDate());
                            });

                            it('should return end date', function () {
                                var e = extractor.date(text);
                                expect(e).not.to.be.null;
                                expect(e).to.equalDate(date.toDate());
                            });
                        });
                    })(i);
                });
            });
        });

        describe('english', function () {
            singles = ['call Tom yesterday', 'buy some cheese today', 'copy documents tomorrow'];
            dates = [moment().subtract('days', 1), moment(), moment().add('days', 1)];

            beforeEach(function () {
                ttc.lang('en');
                start = 'write an essay since yesterday'; //:))
                startDate = moment().subtract('days', 1);
                end = 'copy documents till tomorrow';
                endDate = moment().add('days', 1);
                extractor = ttc.extractors();
            });

            itShouldBehaveLike('date extracted by keyword');
        });

        describe('russian', function () {
            singles = [
                'надо было позавчера купить хлеб',
                'вчера была классная погода',
                'сходить сегодня к парикмахеру',
                'отъезжаем завтра',
                'послезавтра у меня выходной'
            ];
            dates = [
                moment().subtract('days', 2),
                moment().subtract('days', 1),
                moment(),
                moment().add('days', 1),
                moment().add('days', 2)
            ];

            beforeEach(function () {
                ttc.lang('ru');
                start = 'выйти на работу с завтра'; //:))
                startDate = moment().add('days', 1);
                end = 'купить машину до послезавтра';
                endDate = moment().add('days', 2);
                extractor = ttc.extractors();
            });

            itShouldBehaveLike('date extracted by keyword');
        });
    });
})(this);
