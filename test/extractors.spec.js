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

(function () {
    var global = this,
        ttc = (global.ttc || require('../ttc-text')),
        expect = (global.chai || require('chai')).expect;

    describe('Extractors', function () {
        it('should return extractors instance', function () {
            expect(ttc.extractors().__isExtractors).to.be.true;
        });
    });
})();
