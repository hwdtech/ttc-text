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
    var ttc = (global.ttc || require('../ttc-text')),
        expect = (global.chai || require('chai')).expect;

    describe('Utils', function () {

        var utils,
            est;

        beforeEach(function () {
            ttc.lang('ru');
            est = ttc.langConf().estimation;
            utils = ttc.utils();
        });

        describe('#formatEstimation', function () {
            it('should return an empty string on an invalid number of minutes', function () {
                expect(utils.formatEstimation(-14)).to.be.empty;
                expect(utils.formatEstimation({})).to.be.empty;
            });

            it('should return only minutes', function () {
                expect(utils.formatEstimation(34)).to.equal(34 + est.minute);
            });

            it('should return only hours', function () {
                expect(utils.formatEstimation(120)).to.equal(2 + est.hour);
            });

            it('should return only hours and minutes', function () {
                expect(utils.formatEstimation(143)).to.equal(2 + est.hour + ' ' + 23 + est.minute);
            });
        });

        describe('#guidHexColor', function () {
            it('shouldn\'t return null on non string', function () {
                expect(utils.guidHexColor(function () {})).to.be.null;
            });

            it('should return hex color', function () {
                expect(utils.guidHexColor('620e9ef2-a686-4de0-adf6-240ea548947a')).to.match(/^#[0-9a-f]{6}$/);
            });
        });
    });

})(this);

