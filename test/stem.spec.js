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

    describe('Stemmer', function () {

        it('should return stemmer', function () {
            expect(ttc.stemmer().__isStemmer).to.be.true;
        });

        describe('Russian', function () {

            var stemmer;

            beforeEach(function () {
                ttc.lang('ru');
                stemmer  = ttc.stemmer();
            });

            it('should return empty string', function () {
                expect(stemmer.stem('')).to.equal('');
            });

            it('should stem word', function () {
                expect(stemmer.stem('пятница')).to.equal('пятниц');
            });

            it('shouldn\'t stem word in other language', function () {
                expect(stemmer.stem('sdasfd')).to.equal('sdasfd');
            });

            it('should stem words', function () {
                expect(stemmer.stem(['пятница', 'идея'])).to.deep.equal(['пятниц', 'иде']);
            });
        });

        describe('English', function () {
            var stemmer;

            beforeEach(function () {
                ttc.lang('en');
                stemmer  = ttc.stemmer();
            });

            it('should return empty string', function () {
                expect(stemmer.stem('')).to.equal('');
            });

            it('should stem word', function () {
                expect(stemmer.stem('compactness')).to.equal('compact');
            });

            it('should stem words', function () {
                expect(stemmer.stem(['compactness', 'friday'])).to.deep.equal(['compact', 'friday']);
            });

            it('shouldn\'t stem word in other language', function () {
                expect(stemmer.stem('выаdf')).to.equal('выаdf');
            });
        });
    });
})(this);
