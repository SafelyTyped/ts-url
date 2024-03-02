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
import { URL as NodeURL, URLSearchParams } from "url";

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
                const inputValue = example.inputValue;
                const baseValue = example.baseValue ?? inputValue;

                it("contains " + baseValue + " for a URL built with " + JSON.stringify(example), () => {
                    const unit = new URL(inputValue, { base: baseValue });
                    const actualValue = unit.base;

                    expect(actualValue).to.equal(baseValue);
                });
            });
        });

        describe(".hash", () => {
            it("contains the #fragment section of a URL", () => {
                const unit = new URL("http://example.com:8080/this/is/a/path?with=search#andFragment");
                const expectedValue = "#andFragment";

                const actualValue = unit.hash;
                expect(actualValue).to.equal(expectedValue);
            });

            it("is an empty string when the URL does not contain a #fragment", () => {
                const unit = new URL("http://example.com:8080/this/is/a/path?with=search");
                const expectedValue = "";

                const actualValue = unit.hash;
                expect(actualValue).to.equal(expectedValue);
            });
        });

        describe(".host", () => {
            it("contains the hostname:port section of a URL", () => {
                const unit = new URL("http://example.com:8080/this/is/a/path?with=search#andFragment");
                const expectedValue = "example.com:8080";

                const actualValue = unit.host;
                expect(actualValue).to.equal(expectedValue);
            });

            it("contains just the hostname section if there is no port defined", () => {
                const unit = new URL("http://example.com/this/is/a/path?with=search#andFragment");
                const expectedValue = "example.com";

                const actualValue = unit.host;
                expect(actualValue).to.equal(expectedValue);
            });
        });

        describe(".hostname", () => {
            it("contains the hostname section of a URL", () => {
                const unit = new URL("http://example.com:8080/this/is/a/path?with=search#andFragment");
                const expectedValue = "example.com";

                const actualValue = unit.hostname;
                expect(actualValue).to.equal(expectedValue);
            });

            it("gets the hostname from the base URL, it not present in the main input value", () => {
                const unit = new URL("../relative/path", { base: "http://example.com/this/is/a/path?with=search#andFragment" });
                const expectedValue = "example.com";

                const actualValue = unit.hostname;
                expect(actualValue).to.equal(expectedValue);
            });
        });

        describe(".href", () => {
            it("contains the full URL", () => {
                const unit = new URL("http://example.com:8080/this/is/a/path?with=search#andFragment");
                const expectedValue = "http://example.com:8080/this/is/a/path?with=search#andFragment";

                const actualValue = unit.href;
                expect(actualValue).to.equal(expectedValue);
            });

            it("contains the normalised combination of main input value and base value", () => {
                const unit = new URL("../another/path#andDifferentFragment", { base: "http://example.com/this/is/a/path?with=search#andFragment" });
                const expectedValue = "http://example.com/this/is/another/path#andDifferentFragment";

                const actualValue = unit.href;
                expect(actualValue).to.equal(expectedValue);
            });
        });

        describe(".origin", () => {
            it("contains the `protocol:hostname` section of the URL", () => {
                const unit = new URL("http://example.com:8080/this/is/a/path?with=search#andFragment");
                const expectedValue = "http://example.com:8080";

                const actualValue = unit.origin;
                expect(actualValue).to.equal(expectedValue);
            });

            it("contains the normalised combination of main input value and base value", () => {
                const unit = new URL("../another/path#andDifferentFragment", { base: "http://example.com/this/is/a/path?with=search#andFragment" });
                const expectedValue = "http://example.com";

                const actualValue = unit.origin;
                expect(actualValue).to.equal(expectedValue);
            });
        });

        describe(".password", () => {
            it("contains the `password` section of the URL", () => {
                const unit = new URL("http://user:donotusethis@example.com:8080/this/is/a/path?with=search#andFragment");
                const expectedValue = "donotusethis";

                const actualValue = unit.password;
                expect(actualValue).to.equal(expectedValue);
            });

            it("contains the normalised combination of main input value and base value", () => {
                const unit = new URL("../another/path#andDifferentFragment", { base: "http://user:donotusethis@example.com/this/is/a/path?with=search#andFragment" });
                const expectedValue = "donotusethis";

                const actualValue = unit.password;
                expect(actualValue).to.equal(expectedValue);
            });

            it("is an empty string if the URL does not have a `password` section", () => {
                const unit = new URL("http://example.com:8080/this/is/a/path?with=search#andFragment");
                const expectedValue = "";

                const actualValue = unit.password;
                expect(actualValue).to.equal(expectedValue);
            });
        });

        describe(".pathname", () => {
            it("contains the `password` section of the URL", () => {
                const unit = new URL("http://user:donotusethis@example.com:8080/this/is/a/path?with=search#andFragment");
                const expectedValue = "/this/is/a/path";

                const actualValue = unit.pathname;
                expect(actualValue).to.equal(expectedValue);
            });

            it("contains the normalised combination of main input value and base value", () => {
                const unit = new URL("../another/path#andDifferentFragment", { base: "http://user:donotusethis@example.com/this/is/a/path?with=search#andFragment" });
                const expectedValue = "/this/is/another/path";

                const actualValue = unit.pathname;
                expect(actualValue).to.equal(expectedValue);
            });

            it("is `/` if the URL does not have a `password` section", () => {
                const unit = new URL("http://example.com:8080");
                const expectedValue = "/";

                const actualValue = unit.pathname;
                expect(actualValue).to.equal(expectedValue);
            });
        });

        describe(".port", () => {
            it("contains the `port` section of the URL", () => {
                const unit = new URL("http://example.com:8080/this/is/a/path?with=search#andFragment");
                const expectedValue = "8080";

                const actualValue = unit.port;
                expect(actualValue).to.equal(expectedValue);
            });

            it("contains the normalised combination of main input value and base value", () => {
                const unit = new URL("../another/path#andDifferentFragment", { base: "http://example.com:8080/this/is/a/path?with=search#andFragment" });
                const expectedValue = "8080";

                const actualValue = unit.port;
                expect(actualValue).to.equal(expectedValue);
            });

            it("is empty string if the URL does not have a `port` section", () => {
                const unit = new URL("http://example.com");
                const expectedValue = "";

                const actualValue = unit.port;
                expect(actualValue).to.equal(expectedValue);
            });
        });

        describe(".protocol", () => {
            it("contains the `protocol` section of the URL", () => {
                const unit = new URL("http://example.com:8080/this/is/a/path?with=search#andFragment");
                const expectedValue = "http:";

                const actualValue = unit.protocol;
                expect(actualValue).to.equal(expectedValue);
            });

            it("contains the normalised combination of main input value and base value", () => {
                const unit = new URL("../another/path#andDifferentFragment", { base: "http://example.com:8080/this/is/a/path?with=search#andFragment" });
                const expectedValue = "http:";

                const actualValue = unit.protocol;
                expect(actualValue).to.equal(expectedValue);
            });
        });

        describe(".search", () => {
            it("contains the `search` section of the URL", () => {
                const unit = new URL("http://example.com:8080/this/is/a/path?with=search#andFragment");
                const expectedValue = "?with=search";

                const actualValue = unit.search;
                expect(actualValue).to.equal(expectedValue);
            });

            it("contains the normalised combination of main input value and base value", () => {
                const unit = new URL("#andDifferentFragment", { base: "http://example.com:8080/this/is/a/path?with=search#andFragment" });
                const expectedValue = "?with=search";

                const actualValue = unit.search;
                expect(actualValue).to.equal(expectedValue);
            });

            it("is empty string if the URL does not have a `search` section", () => {
                const unit = new URL("http://example.com");
                const expectedValue = "";

                const actualValue = unit.search;
                expect(actualValue).to.equal(expectedValue);
            });
        });

        describe(".searchParams", () => {
            it("contains the `search` section of the URL", () => {
                const unit = new URL("http://example.com:8080/this/is/a/path?with=search#andFragment");
                const expectedValue = new URLSearchParams("?with=search");

                const actualValue = unit.searchParams;
                expect(actualValue).to.eql(expectedValue);
            });

            it("changing the returned value does not affect the URL", () => {
                const url = new URL("http://example.com");
                const unit = url.searchParams;
                const expectedValue = "";

                // with NodeJS' built-in URL type, this action would have
                // modified the original URL value
                unit.append("with", "search");

                const actualValue = url.search;
                expect(actualValue).to.equal(expectedValue);
            });
        });

        describe(".username", () => {
            it("contains the `username` section of the URL", () => {
                const unit = new URL("http://donotusethis:password@example.com:8080/this/is/a/path?with=search#andFragment");
                const expectedValue = "donotusethis";

                const actualValue = unit.username;
                expect(actualValue).to.equal(expectedValue);
            });

            it("contains the normalised combination of main input value and base value", () => {
                const unit = new URL("../another/path#andDifferentFragment", { base: "http://donotusethis:password@example.com/this/is/a/path?with=search#andFragment" });
                const expectedValue = "donotusethis";

                const actualValue = unit.username;
                expect(actualValue).to.equal(expectedValue);
            });

            it("is an empty string if the URL does not have a `username` section", () => {
                const unit = new URL("http://example.com:8080/this/is/a/path?with=search#andFragment");
                const expectedValue = "";

                const actualValue = unit.username;
                expect(actualValue).to.equal(expectedValue);
            });
        });

        describe(".parse()", () => {
            it("returns a breakdown of the URL's contents", () => {
                const inputLocation = "http://user:password@example.com:8080/this/is/a/path?with=search#andFragment";
                const unit = new URL(inputLocation);
                const expectedValue: ParsedURL = {
                    protocol: "http:",
                    username: "user",
                    password: "password",
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

            it("caches the parsed URL details for next time", () => {
                // we cannot access the cache from here
                //
                // the best we can do is make multiple calls
                // to URL.parse(), and rely on code coverage
                // to prove that the cache is being used
                const inputLocation = "http://example.com";
                const unit = new URL(inputLocation);
                const expectedValue: ParsedURL = {
                    protocol: "http:",
                    hostname: "example.com",
                    pathname: "/",
                }

                const actualValue = unit.parse();

                expect(actualValue).to.eql(expectedValue);
                expect(unit.parse()).to.eql(expectedValue);
            });
        });
    });

    describe("class conversions", () => {
        describe(".toNodeUrl()", () => {
            it("returns instance of NodeJS built-in URL", () => {
                const unit = new URL("http://example.com");

                const actualValue = unit.toNodeUrl();

                expect(unit).to.be.instanceOf(URL);
                expect(actualValue).to.be.instanceOf(NodeURL);
            });
        });
    });

    describe("JSON protocol", () => {
        describe(".toJSON()", () => {
            it("returns a JSON representation of the URL", () => {
                const inputValue = "http://example.com/this/is/a/path";
                const control = new NodeURL(inputValue);
                const expectedValue = control.toJSON();

                const unit = new URL(inputValue);
                const actualValue = unit.toJSON();

                expect(actualValue).to.eql(expectedValue);
            });
        });
    });

    describe("path protocol", () => {
        describe(".dirname()", () => {
            it("returns a new URL that points to the parent folder", () => {
                const unit = new URL("http://example.com/this/is/a/path");
                const expectedValue = "http://example.com/this/is/a";

                const actualValue = unit.dirname().href;
                expect(actualValue).to.equal(expectedValue);
            });

            it("if orig URL already points to top-level folder, so will the new URL", () => {
                const url = new URL("http://example.com");
                const expectedHRef = "http://example.com/";
                const expectedPathname = "/";

                const unit = url.dirname();

                const actualHRef = unit.href;
                const actualPathname = unit.pathname;

                expect(actualHRef).to.equal(expectedHRef);
                expect(actualPathname).to.equal(expectedPathname);
            });

            it("returned URL has the same base", () => {
                const url = new URL("this/is/a/path", { base: "http://example.com" });
                const expectedHRef = "http://example.com/this/is/a";
                const expectedBase = "http://example.com";

                const unit = url.dirname();
                const actualHRef = unit.href;
                const actualBase = unit.base;

                expect(actualHRef).to.equal(expectedHRef);
                expect(actualBase).to.equal(expectedBase);
                expect(unit.base).to.equal(url.base);
            });

            it("drops any search terms", () => {
                const url = new URL("http://example.com/this/is/a/path?with=search");
                const expectedValue = "http://example.com/this/is/a";

                const unit = url.dirname();

                expect(unit.href).to.equal(expectedValue);
                expect(unit.search).to.equal("");
            });

            it("drops any #fragment", () => {
                const url = new URL("http://example.com/this/is/a/path#withFragment");
                const expectedValue = "http://example.com/this/is/a";

                const unit = url.dirname();

                expect(unit.href).to.equal(expectedValue);
                expect(unit.hash).to.equal("");
            });
        });

        describe(".join()", () => {
            it("returns a new URL that points to the parent folder", () => {
                const url = new URL("http://example.com/this/is/a/path");
                const expectedHRef = "http://example.com/this/is/another/path/";
                const expectedPathname = "/this/is/another/path/";

                const unit = url.join("..", "../another", "path/");

                const actualHRef = unit.href;
                const actualPathname = unit.pathname;

                expect(actualHRef).to.equal(expectedHRef);
                expect(actualPathname).to.equal(expectedPathname);
            });

            it("returned URL has the same base", () => {
                const url = new URL("this/is/a/path", { base: "http://example.com" });
                const expectedHRef = "http://example.com/this/is/another/path/";
                const expectedBase = "http://example.com";

                const unit = url.join("..", "../another", "path/");

                const actualHRef = unit.href;
                const actualBase = unit.base;

                expect(actualHRef).to.equal(expectedHRef);
                expect(actualBase).to.equal(expectedBase);
                expect(unit.base).to.equal(url.base);
            });

            it("drops any search terms", () => {
                const url = new URL("http://example.com/this/is/a/path?with=search");
                const expectedHRef = "http://example.com/this/is/another/path/";

                const unit = url.join("..", "../another", "path/");

                expect(unit.href).to.equal(expectedHRef);
                expect(unit.search).to.equal("");
            });

            it("drops any #fragment", () => {
                const url = new URL("http://example.com/this/is/a/path#withFragment");
                const expectedHRef = "http://example.com/this/is/another/path/";

                const unit = url.join("..", "../another", "path/");

                expect(unit.href).to.equal(expectedHRef);
                expect(unit.hash).to.equal("");
            });
        });

        describe(".resolve()", () => {
            it("ignores empty parts", () => {
                const origUrl = new URL("http://example.com/this/is/a/path?with=search#andFragment");
                const expectedHRef = "http://example.com/this/is/our/new/path";

                // resolve() works right to left, which is a bit weird
                // to work with!
                const newUrl = origUrl.resolve("path", "", "our/new", "", "../", "..");
                const actualHRef = newUrl.href;

                expect(actualHRef).to.equal(expectedHRef);
            });

            it("returns a new URL that incorporates a modified pathname", () => {
                const origUrl = new URL("http://example.com/this/is/a/path?with=search#andFragment");
                const expectedHRef = "http://example.com/this/is/our/new/path";

                // resolve() works right to left, which is a bit weird
                // to work with!
                const newUrl = origUrl.resolve("path", "our/new", "../", "..");
                const actualHRef = newUrl.href;

                expect(actualHRef).to.equal(expectedHRef);
            });

            it("returns a new URL that incorporates a replaced fragment", () => {
                const origUrl = new URL("http://example.com/this/is/a/path?with=search#andFragment");
                const expectedHRef = "http://example.com/this/is/a/path?with=search#andDifferentFragment";

                const newUrl = origUrl.resolve("#andDifferentFragment");
                const actualHRef = newUrl.href;

                expect(actualHRef).to.equal(expectedHRef);
            });

            it("returns a new URL that incorporates a replaced search", () => {
                const origUrl = new URL("http://example.com/this/is/a/path?with=search#andFragment");
                const expectedHRef = "http://example.com/this/is/a/path?with=aDifferentSearch";

                const newUrl = origUrl.resolve("?with=aDifferentSearch");
                const actualHRef = newUrl.href;

                expect(actualHRef).to.equal(expectedHRef);
            });

            it("ignores any prior changes if it comes across a new URL part", () => {
                const origUrl = new URL("http://example.com/this/is/a/path?with=search#andFragment");
                const expectedHRef = "https://www.example.com/this/is/a/path?with=aDifferentSearch#andDifferentFragment";

                const newUrl = origUrl.resolve(expectedHRef, "..");
                const actualHRef = newUrl.href;

                expect(actualHRef).to.equal(expectedHRef);
            });
        });
    });

    describe("ToString protocol", () => {
        describe(".toString()", () => {
            it("returns the URL as a string", () => {
                const inputValue = "http://example.com/this/is/a/path";
                const control = new NodeURL(inputValue);
                const expectedValue = control.toString();

                const unit = new URL(inputValue);
                const actualValue = unit.toString();

                expect(actualValue).to.eql(expectedValue);
            });
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