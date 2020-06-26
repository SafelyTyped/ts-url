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
import { DataPath, DEFAULT_DATA_PATH, OnError, THROW_THE_ERROR } from "@safelytyped/core-types";
import { URL as NodeURL } from "url";

import { InvalidURLDataError } from "../Errors";


export class URL extends NodeURL {
    /**
     * `base` tracks the URL that this URL is (possibly) partial to.
     */
    public readonly _base?: string;

    /**
     * `constructor()` is a smart constructor.
     *
     * @param input
     * @param param1
     */
    public constructor(
        input: string,
        {
            onError = THROW_THE_ERROR,
            path = DEFAULT_DATA_PATH,
            base,
        }: {
            base?: string,
            onError?: OnError,
            path?: DataPath
        } = {}
    ) {
        // this is a bit different, because we're wrapping a built-in
        // base class
        try {
            // keep the base class happy
            super(input, base);
        } catch (e) {
            throw onError(new InvalidURLDataError({
                public: {
                    dataPath: path,
                    input: base + input
                }
            }));
        }

        // As far as I can tell, there's no way to get the base value
        // our of our base class. We have to track it ourselves.
        this._base = base;
    }
}