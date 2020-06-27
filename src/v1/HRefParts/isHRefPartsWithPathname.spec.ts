//
// Copyright (c) 2020-present Ganbaro Digital Ltd.
//
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are
// met:
//
// 1. Redistributions of source code must retain the above copyright
//    notice, this list of conditions and the following disclaimer.
// 2. Redistributions in binary form must reproduce the above copyright
//    notice, this list of conditions and the following disclaimer in the
//    documentation and/or other materials provided with the
//    distribution.
// 3. Neither the names of the copyright holders nor the names of its
//    contributors may be used to endorse or promote products derived
//    from this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
// HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//

import { describe } from "mocha";
import { expect } from "chai";
import { isHRefPartsWithPathname } from "./isHRefPartsWithPathname";

describe("isHRefPartsWithPathname()", () => {
    describe("returns `true` for anything that has a `pathname` field", () => {
        [
            { pathname: "hello world" },
        ].forEach((inputValue) => {
            it("accepts " + JSON.stringify(inputValue), () => {
                const actualValue = isHRefPartsWithPathname(inputValue);
                expect(actualValue).to.equal(true);
            });
        });
    });

    describe("returns `false` if no `pathname` field is present", () => {
        [
            { not_a_pathname: "hello world" }
        ].forEach((inputValue) => {
            it("rejects " + JSON.stringify(inputValue), () => {
                const actualValue = isHRefPartsWithPathname(inputValue);
                expect(actualValue).to.equal(false);
            });
        });
    });

    describe("returns `false` if the `pathname` field is not a string", () => {
        [
            { pathname: true },
        ].forEach((inputValue) => {
            it("rejects " + JSON.stringify(inputValue), () => {
                const actualValue = isHRefPartsWithPathname(inputValue);
                expect(actualValue).to.equal(false);
            });
        });
    });
});