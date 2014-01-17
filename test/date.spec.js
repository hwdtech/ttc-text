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
    var ttc = (global.ttc || require('../ttc-text')),
        chai = (global.chai || require('chai')),
        moment = (global.moment || require('moment')),
        expect = chai.expect;

    if (typeof require === 'function') {
        chai.use(require('chai-datetime'));
        require('../lib/shared');
    }

    describe('Date', function () {
        it('should return date instance', function () {
            expect(ttc.date().__isDate).to.be.true;
        });

        var week,
            day;

        sharedBehaviourFor('week', function () {
            it('should return an array with start and end dates of th current week', function () {
                expect(week).to.deep.equal([day.startOf('week').toDate(), day.endOf('week').toDate()]);
            });
        });

        describe('#week', function () {
            beforeEach(function () {
                week = ttc.date().week();
                day = moment();
            });
            itShouldBehaveLike('week');
        });

        describe('#lastWeek', function () {
            beforeEach(function () {
                week = ttc.date().lastWeek();
                day = moment().subtract('days', 7);
            });
            itShouldBehaveLike('week');
        });

        describe('#nextWeek', function () {
            beforeEach(function () {
                week = ttc.date().nextWeek();
                day = moment().add('days', 7);
            });
            itShouldBehaveLike('week');
        });
    });
})(this);
