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

export const ValidURLs = [
    { inputValue: "http://example.com", },
    { inputValue: "http://www.example.com", },
    { inputValue: "https://example.com", },
    { inputValue: "https://www.example.com", },
    { inputValue: "#this-is-a-fragment", baseValue: "http://example.com/" },
    { inputValue: "../this/is/a/relative/URL/", baseValue: "http://example.com/" },
];

export const InvalidURLs = [
    "#this-is-a-fragment-with-no-base",
    "../this/is/a/relative/URL/with/no/base"
];

export const ProtocolRelativeURLs = [
    "//archive.org",
    "//www.example.com",
    "//localhost"
];

export const AbsoluteURLs = [
    "http://example.com",
    "http://www.example.com",
    "https://example.com",
    "https://www.example.com",
];

export const RelativeURLs = [
    "#this-is-a-fragment",
    "../this/is/a/relative/URL",
    "?this=is&an-alternative=search"
];

export const RelativePathURLs = [
    "../this/is/a/relative/URL",
];

export const AbsolutePathURLs = [
    "/this/is/an/absolute/path/URL",
];

export const HashURLs = [
    "#this-is-a-fragment",
];

export const SearchURLs = [
    "?this=is&an-alternative=search",
];