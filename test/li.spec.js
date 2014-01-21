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
        expect = (global.chai || require('chai')).expect,
        _ = (global._ || require('lodash'));

    describe('Lexical info', function () {

        beforeEach(function () {
            this._eli = ttc.li('');
            this._sli = ttc.li(this._eli);
        });

        it('should return lexical info for string', function () {
            expect(this._eli.__isLexicalInfo).to.be.true;
        });

        it('should return same lexical info for lexical info', function () {
            expect(this._sli.originalValue).to.equal(this._eli.originalValue);
        });

        describe('Russian', function () {
            var li = ttc.li('Совещание в пятницу после 12'),
                sub = 'в пятниц',
                labeled = ['в', 'пятницу'],
                notLabeled = ['Совещание', 'после', '12'],
                label = 'extracted';

            function getByLabel(li, label) {
                var words = _.map(li.words, function (word, idx) {
                    return _.contains(li.labels[idx], label) ? word : null;
                });

                return _.compact(words);
            }

            beforeEach(function () {
                ttc.lang('ru');
            });

            afterEach(function () {
                ttc.lang('en');
            });

            describe('#labelBySubstr', function () {
                it('should label by original substring', function () {
                    li.labelBySubstr(li.originalValue.indexOf(sub), sub);
                    expect(getByLabel(li, label)).to.deep.equal(labeled);
                });

                it('should label by stemmed substring', function () {
                    li.labelBySubstr(li.stemmedValue.indexOf(sub), sub, true);
                    expect(getByLabel(li, label)).to.deep.equal(labeled);
                });
            });

            describe('#notLabeled', function () {
                it('should return not labeled words by original substring', function () {
                    li.labelBySubstr(li.originalValue.indexOf(sub), sub);
                    expect(li.notLabeled()).to.deep.equal(notLabeled);
                });

                it('should return not labeled words by stemmed substring', function () {
                    li.labelBySubstr(li.stemmedValue.indexOf(sub), sub, true);
                    expect(li.notLabeled()).to.deep.equal(notLabeled);
                });
            });
        });
    });
})(this);
