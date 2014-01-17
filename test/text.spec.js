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

/*global describe,beforeEach,afterEach,it */

(function (global) {
    var ttc = (global.ttc || require('../ttc-text')),
        expect = (global.chai || require('chai')).expect;

    describe('TextString', function () {

        beforeEach(function () {
            this._s = 'some string';
            this._sp = 'some, ! string?';
            this._words = ['some', 'string'];

            this._ts = ttc.text(this._s);
            this._tsp = ttc.text(this._sp);
        });

        it('should return a TextString instance', function () {
            expect(this._ts.__isTextString).to.be.true;
        });

        describe('#toString', function () {
            it('should return a string if it was specified', function () {
                expect(this._ts.toString()).to.equal(this._s);
            });

            it('should return an empty string if it wasn\'t specified', function () {
                expect(ttc.text().toString()).to.be.equal('');
            });
        });

        describe('#words', function () {
            it('should return an empty array on empty string', function () {
                expect(ttc.text().words()).to.deep.equal([]);
            });

            it('should splits string into a TextString array', function () {
                var modifiers = this._ts.words().map(function (w) { return w.__isTextString; });
                expect(modifiers).to.deep.equal([true, true]);
            });

            it('should splits string into a TextString array without any punctuation', function () {
                var words = this._tsp.words().map(function (w) { return w.toString(); });
                expect(words).to.deep.equal(this._words);
            });
        });
    });
})(this);
