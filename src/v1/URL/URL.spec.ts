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
import { makeIpPort } from "@safelytyped/ip-port";
import { expect } from "chai";
import { describe } from "mocha";
import { URL as NodeURL } from "url";

import { InvalidURLs, ValidURLs } from "../_fixtures/URLs.spec";
import { InvalidURLDataError } from "../Errors";
import { ParsedURL } from "../ParsedURL";
import { URL } from "./URL";

describe("URL", () => {
    describe(".constructor()", () => {
        describe("accepts valid URLs", () => {
            ValidURLs.forEach((example) => {
                const { inputValue, baseValue } = example;

                it("accepts " + inputValue + " (base: " + baseValue + ")", () => {
                    const actualValue = new URL(
                        inputValue, {
                            base: baseValue
                        }
                    );
                    expect(actualValue).to.be.instanceOf(URL);
                });
            });
        });

        describe("rejects invalid / partial URLs", () => {
            InvalidURLs.forEach((inputValue) => {
                it("rejects " + inputValue, () => {
                    let caughtException;

                    try {
                        const dummy = new URL(inputValue);
                        dummy.toString();
                    } catch (e) {
                        caughtException = e;
                    }
                    expect(caughtException).to.be.instanceOf(InvalidURLDataError);
                });
            });
        });

        describe(".base", () => {
            ValidURLs.forEach((example) => {
                const { inputValue, baseValue } = example;
                it("contains " + baseValue + " for a URL built with " + JSON.stringify(example), () => {
                    const unit = new URL(inputValue, { base: baseValue });
                    const actualValue = unit.base;

                    expect(actualValue).to.equal(baseValue);
                });
            });
        });

        describe(".parse()", () => {
            it("returns a breakdown of the URL's contents", () => {
                const inputLocation = "http://example.com:8080/this/is/a/path?with=search#andFragment";
                const unit = new URL(inputLocation);
                const expectedValue: ParsedURL = {
                    protocol: "http:",
                    hostname: "example.com",
                    port: makeIpPort("8080"),
                    pathname: "/this/is/a/path",
                    search: "?with=search",
                    searchParams: new URLSearchParams("with=search"),
                    hash: "#andFragment",
                }

                const actualValue = unit.parse();

                expect(actualValue).to.eql(expectedValue);
            });

            it("only sets the fields that have a meaningful value", () => {
                const inputLocation = "http://example.com";
                const unit = new URL(inputLocation);
                const expectedValue: ParsedURL = {
                    protocol: "http:",
                    hostname: "example.com",
                    pathname: "/",
                }

                const actualValue = unit.parse();

                expect(actualValue).to.eql(expectedValue);
            });
        });
    });

    describe("base class", () => {
        it("is an instance of NodeJS built-in URL", () => {
            const unit = new URL("http://example.com");

            expect(unit).to.be.instanceOf(URL);
            expect(unit).to.be.instanceOf(NodeURL);
        });
    });

    describe("value protocol", () => {
        describe(".valueOf()", () => {
            ValidURLs.forEach((example) => {
                const { inputValue, baseValue } = example;
                it("returns " + inputValue + " for a URL built with " + JSON.stringify(example), () => {
                    const unit = new URL(inputValue, { base: baseValue });
                    const actualValue = unit.valueOf();

                    expect(actualValue).to.equal(inputValue);
                });
            });
        });

        describe(".implementsValue()", () => {
            it("returns `true`", () => {
                const unit = new URL("http://www.example.com");

                expect(unit.implementsValue()).to.equal(true);
            });
        });
    });
});