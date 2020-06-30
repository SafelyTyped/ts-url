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
import { AppErrorOr, DataPath, validate, validateString } from "@safelytyped/core-types";

import { InvalidURLDataError } from "../Errors";
import { URL } from "./URL";

/**
 * `validateURLData()` is a data inspector. Use it to determine whether or
 * not the given `input` contains a well-formed URL or not.
 *
 * No attempt is made to prove that whatever the URL points at exists.
 *
 * NOTE: for partial URLS (e.g. fragments), and for relative URLs,
 * you need to set `base` too. The final URL will be evaluated by
 * combining `base` and `input`.
 *
 * @param path
 * Where are you in the nested structure that you are trying to validate?
 * Use {@link DEFAULT_DATA_PATH} if you are not inside a nested structure.
 * @param input
 * The data to validate.
 * @param base
 * If `input` is not a full URL, set `base` to a full URL.
 * @returns
 * - `input` on success, or
 * - an AppError explaining why `input` failed validation
 *
 * @category URL
 */
export function validateURLData(
    path: DataPath,
    input: unknown,
    {
        base
    }: {
        base?: string
    } = {}
): AppErrorOr<URL> {
    return validate(input)
        .next((x) => validateString(path, x))
        .next((x) => validateStringIsURL(path, x, base))
        .value();
}

function validateStringIsURL(
    path: DataPath,
    input: string,
    base?: string
): AppErrorOr<URL> {
    try {
        // tslint:disable-next-line: no-unused-expression
        return new URL(input, { base });
    } catch(e) {
        return new InvalidURLDataError({
            public: {
                dataPath: path,
                input: input
            }
        });
    }
}