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

/*global describe,beforeEach,it,sharedBehaviourFor,itShouldBehaveLike*/

(function (global) {
    var ttc = global.ttc || require('../../ttc-text'),
        expect = (global.chai || require('chai')).expect;

    if (typeof require === 'function') {
        require('../../lib/shared');
    }

    describe('Extractors', function () {
        describe('#estimation', function () {

            var extractor,
                estText,
                nonEstText,
                est;

            sharedBehaviourFor('extracted estimation', function () {
                it('should be a valid estimation in minutes', function () {
                    expect(extractor.estimation(estText)).to.equal(est);
                });

                it('should be null when estimation isn\'t specified', function () {
                    expect(extractor.estimation(nonEstText)).to.be.null;
                });
            });

            describe('english', function () {
                beforeEach(function () {
                    ttc.lang('en');
                    extractor = ttc.extractors();

                    estText = 'today 1.4d 13h 5m';
                    est = 1.4 * 24 * 60 + 13 * 60 + 5;

                    nonEstText = '14.453 yes';
                });

                itShouldBehaveLike('extracted estimation');
            });

            describe('russian', function () {
                beforeEach(function () {
                    ttc.lang('ru');
                    extractor = ttc.extractors();

                    estText = 'today 2.1н 13д 5м';
                    est = 2.1 * 7 * 24 * 60 + 13 * 24 * 60 + 5;

                    nonEstText = '14.453 недель';
                });

                itShouldBehaveLike('extracted estimation');
            });
        });
    });

})(this);
