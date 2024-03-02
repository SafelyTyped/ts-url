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
import {
    applyFunctionalOptions,
    type DataPath,
    DEFAULT_DATA_PATH,
    type FunctionalOption,
    type OnError,
    THROW_THE_ERROR,
} from "@safelytyped/core-types";

import { URL } from "./URL";

/**
 * `mustBeURLData()` is a data guard. Use it to ensure that the given
 * `input` value can be used as a URL.
 *
 * NOTE: for partial URLS (e.g. fragments), and for relative URLs,
 * you need to set `base` too. The final URL will be evaluated by
 * combining `base` and `input`.
 *
 * @param input
 * The value to ensure.
 * @param base
 * If `input` is not a full URL, set `base` to a full URL.
 * @param onError
 * If `input` fails validation, we'll call your `onError` handler with an
 * `AppError` to explain why.
 * @param path
 * Where are you in validating your nested structure? Use
 * {@link DEFAULT_DATA_PATH} if you are not in a nested data structure.
 * @returns
 * - `input` converted to a `URL` on success
 *
 * @category URL
 */
export function makeURL(
    input: string,
    {
        base,
        onError = THROW_THE_ERROR,
        path = DEFAULT_DATA_PATH
    }: {
        base?: string,
        onError?: OnError,
        path?: DataPath
    } = {},
    ... fnOpts: FunctionalOption<URL>[]
): URL {
    return applyFunctionalOptions(
        new URL(
            input,
            { base, onError, path }
        ),
        { base, onError },
        ...fnOpts
    );
}