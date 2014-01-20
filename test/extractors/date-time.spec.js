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

/*global describe,beforeEach,it*/

(function (global) {
    var ttc = (global.ttc || require('../../ttc-text')),
        chai = (global.chai || require('chai')),
        _ = (global._ || require('lodash')),
        expect = chai.expect;

    if (typeof require === 'function') {
        chai.use(require('chai-datetime'));
    }

    describe('Extractors', function () {
        describe('#date', function () {

            var extractor,
                tomorrow = new Date(),
                d = new Date(2013, 3, 12, 11, 0, 0, 0);

            tomorrow.setDate((new Date()).getDate() + 1);
            tomorrow.setHours(19, 0, 0, 0);

            function shared(map) {
                describe('extract date and time', function () {
                    _.each(map, function (date, text) {
                        describe('text: ' + text, function () {
                            it('should return date with time', function () {
                                expect(extractor.date(text)).to.equalTime(date);
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
                    'at tomorrow till 7:00pm': tomorrow,
                    'till 11:00am 4/12/2013': d
                });
            });

            describe('russian', function () {
                beforeEach(function () {
                    ttc.lang('ru');
                    extractor = ttc.extractors();
                });

                shared({
                    'завтра до 19:00': tomorrow,
                    'до 11:00 12.4.2013': d
                });
            });
        });
    });

})(this);
