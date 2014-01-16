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

/*global describe,beforeEach,afterEach,it,sharedBehaviourFor,itShouldBehaveLike */

(function () {
    var global = this,
        ttc = (global.ttc || require('../ttc-text')),
        moment = (global.moment || require('moment')),
        expect = (global.chai || require('chai')).expect;

    if (typeof require === 'function') {
        require('../lib/shared');
    }

    describe('Extractors', function () {
        it('should return extractors instance', function () {
            expect(ttc.extractors().__isExtractors).to.be.true;
        });

        describe('date', function () {

            describe('extract by format', function () {
                var single, singleDate,
                    multiple, multipleSinceDate, multipleTillDate,
                    extractor;

                sharedBehaviourFor('extracted by format', function () {
                    it('should return end date when only one day specified', function () {
                        expect(extractor.date(single)).to.equalDate(singleDate.toDate());
                    });

                    it('should return start date with `since` prefix', function () {
                        expect(extractor.date(multiple, true)).to.equalDate(multipleSinceDate.toDate());
                    });

                    it('should return end date with `till` prefix', function () {
                        expect(extractor.date(multiple)).to.equalDate(multipleTillDate.toDate());
                    });
                });

                describe('english', function () {
                    beforeEach(function () {
                        ttc.lang('en');
                        single = 'copy documents 7/15/2013 for Bill';
                        multiple = 'copy documents since 2/12/2012 till 12/12/2012';
                        singleDate = moment('7/15/2013', 'l');
                        multipleSinceDate = moment('2/12/2012', 'l');
                        multipleTillDate = moment('12/12/2012', 'l');
                        extractor = ttc.extractors();
                    });

                    itShouldBehaveLike('extracted by format');
                });

                describe('russian', function () {
                    beforeEach(function () {
                        ttc.lang('ru');
                        single = 'подготовить документы 12.4.2013 для Виктора';
                        multiple = 'подготовка документов с 1.12.2013 до 2.12.2013 для Виктора';
                        singleDate = moment('12.4.2013', 'l');
                        multipleSinceDate = moment('1.12.2013', 'l');
                        multipleTillDate = moment('2.12.2013', 'l');
                        extractor = ttc.extractors();
                    });

                    itShouldBehaveLike('extracted by format');
                });
            });

        });
    });
})();
