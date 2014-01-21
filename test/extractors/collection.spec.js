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
    var ttc = global.ttc || require('../../ttc-text'),
        expect = (global.chai || require('chai')).expect,
        _ = (global._ || require('lodash'));

    if (typeof require === 'function') {
        require('../../lib/shared');
    }

    describe('Extractors', function () {
        describe('#collection', function () {
            var list,
                extractor,
                valueFn;

            beforeEach(function () {
                ttc.lang('ru');
                extractor = ttc.extractors();

                list = [
                    {
                        displayField: 'Простои',
                        submitField: '620e9ef2-a686-4de0-adf6-240ea548947a'
                    },
                    {
                        displayField: 'Внепроектные задачи',
                        submitField: '620e9ef2-a686-4de0-adf6-240ea548947b'
                    },
                    {
                        displayField: 'Chieftime 10',
                        submitField: '620e9ef2-a686-4de0-adf6-240ea548947c'
                    },
                    {
                        displayField: 'Разработка TikTokCoach',
                        submitField: '620e9ef2-a686-4de0-adf6-240ea548947d'
                    },
                    {
                        displayField: 'Город55. Литературный отдел',
                        submitField: '620e9ef2-a686-4de0-adf6-240ea548947e'
                    },
                    {
                        displayField: 'Конференц зал',
                        submitField: '620e9ef2-a686-4de0-adf6-240ea548947f'
                    },
                    {
                        displayField: 'Иван Иванов',
                        submitField: '620e9ef2-a686-4de0-adf6-240ea548947g'
                    },
                    {
                        displayField: 'Иван Петров',
                        submitField: '620e9ef2-a686-4de0-adf6-240ea548947h'
                    },
                    {
                        displayField: 'TikTokCoach development',
                        submitField: '620e9ef2-a686-4de0-adf6-240ea548947i'
                    },
                    {
                        displayField: 'сейчас',
                        submitField: '620e9ef2-a686-4de0-adf6-240ea548947i'
                    }
                ];

                valueFn = function (item) { return item.displayField; };
            });

            it('should extract project name', function () {
                expect(extractor.collection('убрать из внепроектных задач', list, valueFn))
                    .to.have.deep.property('[0].displayField', 'Внепроектные задачи');
            });

            it('should extract user name', function () {
                expect(extractor.collection('повысить Ивана Петрова', list, valueFn))
                    .to.have.deep.property('[0].displayField', 'Иван Петров');
            });

            it('should extract combined values', function () {
                expect(extractor.collection('перевести Ивана Иванова на проект TikTokCoach development', list, valueFn))
                    .to.deep.equal([{
                        displayField: 'Иван Иванов',
                        submitField: '620e9ef2-a686-4de0-adf6-240ea548947g'
                    }, {
                        displayField: 'TikTokCoach development',
                        submitField: '620e9ef2-a686-4de0-adf6-240ea548947i'
                    }]);
            });

            it('shouldn\'t extract anything out of the collection', function () {
                expect(extractor.collection('some text out of collection', list, valueFn)).to.be.empty;
            });

            it('shouldn\'t extract prepositions', function () {
                expect(extractor.collection('с', list, valueFn)).to.be.empty;
            });
        });
    });


})(this);
