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
import { expect } from "chai";
import { describe } from "mocha";

import {
    AbsoluteURLs,
    AbsolutePathURLs,
    HashURLs,
    ProtocolRelativeURLs,
    RelativePathURLs,
    SearchURLs,
} from "../_fixtures/URLs.spec";
import { isPRHRefData } from "@safelytyped/url";


describe("isPRHRefData()", () => {
    describe("accepts protocol-relative URLs", () => {
        ProtocolRelativeURLs.forEach((inputValue) => {
            it("accepts " + inputValue, () => {
                expect(isPRHRefData(inputValue)).to.equal(true);
            });
        });
    });

    describe("rejects absolute URLs", () => {
        AbsoluteURLs.forEach((inputValue) => {
            it("rejects " + inputValue, () => {
                expect(isPRHRefData(inputValue)).to.equal(false);
            });
        });
    });

    describe("rejects absolute-path URLs", () => {
        AbsolutePathURLs.forEach((inputValue) => {
            it("rejects " + inputValue, () => {
                expect(isPRHRefData(inputValue)).to.equal(false);
            });
        });
    });

    describe("rejects relative-path URLs", () => {
        RelativePathURLs.forEach((inputValue) => {
            it("rejects " + inputValue, () => {
                expect(isPRHRefData(inputValue)).to.equal(false);
            });
        });
    });

    describe("rejects URL fragments", () => {
        HashURLs.forEach((inputValue) => {
            it("rejects " + inputValue, () => {
                expect(isPRHRefData(inputValue)).to.equal(false);
            });
        });
    });

    describe("rejects search URLs", () => {
        SearchURLs.forEach((inputValue) => {
            it("rejects " + inputValue, () => {
                expect(isPRHRefData(inputValue)).to.equal(false);
            });
        });
    });
});