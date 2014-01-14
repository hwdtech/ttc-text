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

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['ttc'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('../src/ttc-text'));
    } else {
        factory(window.ttc);
    }
})(function (ttc) {
    return ttc.lang('en', {});
});
