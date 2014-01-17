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

        var single, singleDate,
            multiple, multipleSinceDate, multipleTillDate,
            extractor;

        sharedBehaviourFor('date extracted by format', function () {

            it('should return same start and end date when only one day specified with or without `at` prefix', function () {
                single.forEach(function (text) {
                    expect(extractor.date(text), true).to.equalDate(singleDate.toDate());
                    expect(extractor.date(text)).to.equalDate(singleDate.toDate());
                });
            });

            it('should return start date with `since` prefix', function () {
                multiple.forEach(function (text) {
                    expect(extractor.date(text, true)).to.equalDate(multipleSinceDate.toDate());
                });
            });

            it('should return end date with `till` prefix', function () {
                multiple.forEach(function (text) {
                    expect(extractor.date(text)).to.equalDate(multipleTillDate.toDate());
                });
            });
        });

        describe('english', function () {
            beforeEach(function () {
                ttc.lang('en');

                single = [
                    'copy documents 7/15/2013 for Bill',
                    'copy documents at 7/15/2013 for Bill'
                ];
                multiple = [
                    'copy documents since 2/12/2012 till 12/12/2012',
                    'copy documents since 2/12/2012 until 12/12/2012'
                ];

                singleDate = moment('7/15/2013', 'l');
                multipleSinceDate = moment('2/12/2012', 'l');
                multipleTillDate = moment('12/12/2012', 'l');

                extractor = ttc.extractors();
            });

            itShouldBehaveLike('date extracted by format');
        });

        describe('russian', function () {
            beforeEach(function () {
                ttc.lang('ru');
                single = ['подготовить документы 12.4.2013 для Виктора'];
                multiple = [
                    'подготовка документов с 1.12.2013 до 2.12.2013 для Виктора',
                    'подготовка документов со 1.12.2013 по 2.12.2013 для Виктора'
                ];
                singleDate = moment('12.4.2013', 'l');
                multipleSinceDate = moment('1.12.2013', 'l');
                multipleTillDate = moment('2.12.2013', 'l');
                extractor = ttc.extractors();
            });

            itShouldBehaveLike('date extracted by format');
        });
    });
})(this);
