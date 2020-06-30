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
    DataPath,
    DEFAULT_DATA_PATH,
    OnError,
    THROW_THE_ERROR,
    Value,
} from "@safelytyped/core-types";
import { makeIpPort } from "@safelytyped/ip-port";
import { URL as NodeURL, URLSearchParams } from "url";

import { InvalidURLDataError } from "../Errors";
import { ParsedURL } from "../ParsedURL";

export class URL extends NodeURL implements Value<string>{
    /**
     * `base` tracks the URL that this URL is (possibly) partial to.
     */
    public readonly _base?: string;

    public readonly _value: string;

    /**
     * `_parsed` is an internal cache. It holds the result of calling
     * `this.parse()`, so that we don't have to calculate it a second
     * time.
     */
    private _parsed?: ParsedURL;

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
        this._value = input;
    }

    /**
     * `base` is the base URL that was used to build this URL.
     */
    get base() {
        return this._base;
    }

    /**
     * `parse()` returns a breakdown of this URL. This is useful for
     * manipulating the URL.
     */
    public parse(): ParsedURL {
        // have we done this before?
        if (this._parsed) {
            return this._parsed;
        }

        const retval: ParsedURL = {
            protocol: this.protocol,
            hostname: this.hostname,
            pathname: this.pathname,
        };

        // unfortunately, this is the best way to handle these
        if (this.port.length > 0) {
            retval.port = makeIpPort(this.port);
        }
        if (this.search.length > 0) {
            retval.search = this.search;
        }
        if (this.hash.length > 0) {
            retval.hash = this.hash;
        }
        if (retval.search) {
            retval.searchParams = this.searchParams;
        }

        // remember this for next time
        this._parsed = retval;

        // all done
        return retval;
    }

    // =======================================================================
    //
    // URL protocol
    //
    // We need to turn this read/write object into an immutable object.
    // Unfortunately, that forces us to define getters as well as setters.
    //
    // -----------------------------------------------------------------------

    /**
     * `hash` is the `#fragment` section of this URL. May be an empty string.
     *
     * Unlike the underlying NodeJS URL, this is readonly.
     */
    get hash(): string {
        return super.hash;
    }

    /**
     * `host` is the `hostname:port` section of the URL.
     *
     * Unlike the underlying NodeJS URL, this is readonly.
     */
    get host() {
        return super.host;
    }

    /**
     * `hostname` is the `hostname` section of the URL. Guaranteed not
     * to be an empty string.
     *
     * Unlike the underlying NodeJS URL, this is readonly.
     */
    get hostname() {
        return super.hostname;
    }

    /**
     * `href` is the full, normalised URL string. It is the same value
     * returned by {@link URL.toString}.
     *
     * Unlike the underlying NodeJS URL, this is readonly.
     */
    get href() {
        return super.href;
    }

    /**
     * `origin` is the `protocol://hostname:port` portion of this URL.
     *
     * Unlike the underlying NodeJS URL, this is readonly.
     */
    get origin() {
        return super.origin;
    }

    // =======================================================================
    //
    // VALUE protocol
    //
    // -----------------------------------------------------------------------

    /**
     * `valueOf()` returns this URL as a string.
     *
     * This will be the `input` passed into the constructor. It doesn't
     * include the `base` value at all. Use {@link URL.toString} to get
     * the full, absolute URL.
     *
     * @returns
     * the `input` passed into the constructor.
     */
    public valueOf(): string {
        return this._value;
    }

    /**
     * `implementsValue()` is a helper method for the {@link isValue}
     * type guard function.
     */
    public implementsValue(): boolean {
        return true;
    }

    // =======================================================================
    //
    // PATH protocol
    //
    // -----------------------------------------------------------------------


}