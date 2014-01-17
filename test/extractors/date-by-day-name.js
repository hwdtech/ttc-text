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

    describe('Extractors', function () {

        describe('#date', function () {
            var singles,
                dates,
                pastDates,
                extractor,

                start, startDate,
                end, endDate;

            sharedBehaviourFor('date extracted by day name', function () {
                describe('single day', function () {
                    singles.forEach(function (t, i) {
                        (function (text, idx) {
                            describe('text: ' + text, function () {
                                it('should extract start date', function () {
                                    var date = extractor.date(text, true);
                                    expect(date).not.to.be.null;
                                    expect(date).to.equalDate(dates[idx].toDate());
                                });

                                it('should extract past start date', function () {
                                    var date = extractor.date(text, true, true);
                                    expect(date).not.to.be.null;
                                    expect(date).to.equalDate(pastDates[idx].toDate());
                                });

                                it('should extract end date', function () {
                                    var date = extractor.date(text);
                                    expect(date).not.to.be.null;
                                    expect(date).to.equalDate(dates[idx].toDate());
                                });

                                it('should extract past end date', function () {
                                    var date = extractor.date(text, null, true);
                                    expect(date).not.to.be.null;
                                    expect(date).to.equalDate(pastDates[idx].toDate());
                                });
                            });
                        })(t, i);
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

            describe('english', function () {
                singles = [
                    'at sunday',
                    'at monday',
                    'at Tuesday',
                    'at wednesday',
                    'at thursday',
                    'at friday',
                    'at Saturday'
                ];
                dates = singles.map(function (s) {
                    return moment().day(s.split(' ')[1]);
                });
                pastDates = singles.map(function (s) {
                    return moment().subtract('day', 7).day(s.split(' ')[1]);
                });

                start = 'holidays since tuesday';
                startDate = moment().day('tuesday');

                end = 'report till friday';
                endDate = moment().day('friday');

                beforeEach(function () {
                    ttc.lang('en');
                    extractor = ttc.extractors();
                });

                itShouldBehaveLike('date extracted by day name');
            });

        });
    });
})(this);
