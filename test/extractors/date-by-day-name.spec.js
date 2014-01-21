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
        moment = global.moment || require('moment'),
        chai = global.chai || require('chai'),
        _ = (global._ || require('lodash')),
        expect = chai.expect;

    if (typeof require === 'function') {
        chai.use(require('chai-datetime'));
    }

    describe('Extractors', function () {

        describe('#date', function () {
            var extractor,
                start, startDate,
                end, endDate;

            function shared(singles) {
                describe('extract by week day', function () {

                    describe('single day', function () {
                        _.each(singles, function (d, t) {
                            (function (text, date) {
                                describe('text: ' + text, function () {

                                    var d, pd;

                                    beforeEach(function () {
                                        d = date.toDate();
                                        pd = moment(date).subtract('day', 7).toDate();
                                    });

                                    it('should extract start date', function () {
                                        expect(extractor.date(text, true)).to.equalDate(d);
                                    });

                                    it('should extract past start date', function () {
                                        expect(extractor.date(text, true, true)).to.equalDate(pd);
                                    });

                                    it('should extract end date', function () {
                                        expect(extractor.date(text)).to.equalDate(d);
                                    });

                                    it('should extract past end date', function () {
                                        expect(extractor.date(text, null, true)).to.equalDate(pd);
                                    });
                                });
                            })(t, d);
                        });
                    });

                    describe('with prefix', function () {
                        it('should return start date with prefix `since` specified', function () {
                            expect(extractor.date(start, true)).to.equalDate(startDate.toDate());
                        });

                        it('should return null end date with prefix `since` specified', function () {
                            expect(extractor.date(start)).to.be.null;
                        });

                        it('should return end date with prefix `till` specified', function () {
                            expect(extractor.date(end)).to.equalDate(endDate.toDate());
                        });

                        it('should return null start date with prefix `since` specified', function () {
                            expect(extractor.date(end, true)).to.be.null;
                        });
                    });
                });
            }

            describe('english', function () {
                beforeEach(function () {
                    ttc.lang('en');

                    start = 'holidays since tuesday';
                    startDate = moment().day('tuesday');

                    end = 'report till friday';
                    endDate = moment().day('friday');

                    extractor = ttc.extractors();
                });

                ttc.lang('en');
                shared({
                    'at sunday': moment().day('sunday'),
                    'at monday': moment().day('monday'),
                    'at Tuesday': moment().day('tuesday'),
                    'at wednesday': moment().day('wednesday'),
                    'at thursday': moment().day('thursday'),
                    'at friday': moment().day('friday'),
                    'at Saturday': moment().day('saturday')
                });
            });

            describe('russian', function () {
                beforeEach(function () {
                    ttc.lang('ru');
                    extractor = ttc.extractors();
                    start = 'выходные с воскресенья';
                    startDate = moment().day('воскресенье');
                    end = 'отчет до четверга';
                    endDate = moment().day('четверг');
                });

                ttc.lang('en');
                shared({
                    'в понедельник': moment().day('monday'),
                    'во вторник': moment().day('tuesday'),
                    'в среду': moment().day('wednesday'),
                    'в четверг': moment().day('thursday'),
                    'в пятницу': moment().day('friday'),
                    'в субботу': moment().day('saturday'),
                    'в воскресенье': moment().day('sunday')
                });
            });
        });
    });
})(this);
