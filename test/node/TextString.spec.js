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

/*global describe,it,beforeEach,afterEach */

var ttc = require('../../src/index'),
    expect = require('chai').expect;

describe('TextString', function () {

    beforeEach(function () {
        this._s = 'some string';
        this._sp = 'some, ! string?';
        this._words = ['some', 'string'];

        this._ts = ttc().text(this._s);
        this._tsp = ttc().text(this._sp);
    });

    it('should return a TextString instance', function () {
        expect(this._ts.__isTextString).to.be.true;
    });

    describe('#toString', function () {
        it('should return a string if it was specified', function () {
            expect(this._ts.toString()).to.equal(this._s);
        });

        it('should return an empty string if it wasn\'t specified', function () {
            expect(ttc().text().toString()).to.be.equal('');
        });
    });

    describe('#words', function () {
        it('should return an empty array on empty string', function () {
            expect(ttc().text().words()).to.be.an('array');
            expect(ttc().text().words()).to.be.empty;
        });

        it('should splits string into a TextString array', function () {
            var words = this._ts.words();
            expect(words).to.have.length(2);
            words.forEach(function (w, idx) {
                expect(w.__isTextString).to.be.true;
                expect(w.toString()).to.be.equal(this._words[idx]);
            }, this);
        });

        it('should splits string into a TextString array without any punctuation', function () {
            var words = this._tsp.words(),
                punctRe = /[\.,-\/#\?!$%\^&\*;:{}=\-_`~()]/g,
                spacesRe = /\s{2,}$/g;

            expect(words).to.have.length(2);

            words.forEach(function (w) {
                expect(w.toString()).not.to.match(punctRe);
                expect(w.toString()).not.to.match(spacesRe);
            }, this);
        });
    });
});
