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
    ToString,
} from "@safelytyped/core-types";
import { makeIpPort } from "@safelytyped/ip-port";
import { posix } from "path";
import { URL as NodeURL, URLSearchParams } from "url";

import { InvalidURLDataError } from "../Errors";
import { isAbsoluteHRefData, isHRefHashData, isHRefSearchData, makeHRef } from "../HRef";
import { ParsedURL } from "../ParsedURL";

/**
 * `URL` is a safe type. It is an immutable equivalent of NodeJS's built-in
 * `URL` type.
 *
 * Internally, it uses a wrapped NodeJS `URL` to guarantee the same behaviour.
 */
export class URL implements ToString, Value<string> {
    /**
     * `base` tracks the URL that this URL is (possibly) partial to.
     */
    public readonly _base: string;

    public readonly _value: string;

    /**
     * `_parsed` is an internal cache. It holds the result of calling
     * `this.parse()`, so that we don't have to calculate it a second
     * time.
     */
    private _parsed?: ParsedURL;

    /**
     * As of TypeScript 4.0, we can no longer extend Node's built-in
     * URL class. Instead, we must act as a wrapper instead.
     */
    private _wrapped: NodeURL;

    /**
     * `constructor()` is a smart constructor.
     *
     * @param input
     * The HRef to build this URL from. If it isn't an absolute URL, then
     * you need to pass an absolute URL in as the `base` parameter.
     * @param onError
     * If your `input` is rejected, we'll call this `onError` handler with
     * an {@link AppError} to explain why.
     * @param path
     * Where are you in the nested data structure that you are creating?
     * Use {@link DEFAULT_DATA_PATH} if you're not in a nested data structure.
     * @param base
     * We pass this as the `base` parameter to NodeJS's URL constructor.
     * We also keep track of it, and pass it on to any URLs created using
     * this URL.
     */
    public constructor(
        input: string,
        {
            onError = THROW_THE_ERROR,
            path = DEFAULT_DATA_PATH,
            base = input,
        }: {
            base?: string,
            onError?: OnError,
            path?: DataPath
        } = {}
    ) {
        // this is a bit different, because we're wrapping a built-in
        // NodeJS class
        try {
            // keep the base class happy
            this._wrapped = new NodeURL(input, base);
        } catch (e) {
            throw onError(new InvalidURLDataError({
                public: {
                    dataPath: path,
                    input: base + input
                }
            }));
        }

        // As far as I can tell, there's no way to get the `base` value
        // our of our wrapped class. We have to track it ourselves.
        //
        // If no `base` has been provided, we use the `input`. That way,
        // we have something to track at all times.
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
        if (this.username.length > 0) {
            retval.username = this.username;
        }
        if (this.password.length > 0) {
            retval.password = this.password;
        }
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

    /**
     * `toNodeUrl()` returns this URL in a form that's compatible with
     * NodeJS's `URL` object.
     */
    public toNodeUrl(): NodeURL {
        return this._wrapped;
    }

    // =======================================================================
    //
    // JSON protocol
    //
    // -----------------------------------------------------------------------

    /**
     * `toJSON()` returns this URL as a JSON-encoded string
     */
    public toJSON(): string {
        return this._wrapped.toJSON();
    }

    // =======================================================================
    //
    // ToString protocol
    //
    // -----------------------------------------------------------------------

    /**
     * `toString()` returns this URL as a string, suitable for use in
     * HTTP requests
     */
    public toString(): string {
        return this._wrapped.toString();
    }

    // =======================================================================
    //
    // URL protocol
    //
    // A readonly equivalent of the NodeJS URL type.
    //
    // -----------------------------------------------------------------------

    /**
     * `hash` is the `#fragment` section of this URL. May be an empty string.
     *
     * Unlike the built-in NodeJS URL, this is readonly.
     */
    get hash(): string {
        return this._wrapped.hash;
    }

    /**
     * `host` is the `hostname:port` section of the URL.
     *
     * Unlike the built-in NodeJS URL, this is readonly.
     */
    get host() {
        return this._wrapped.host;
    }

    /**
     * `hostname` is the `hostname` section of the URL. Guaranteed not
     * to be an empty string.
     *
     * Unlike the built-in NodeJS URL, this is readonly.
     */
    get hostname() {
        return this._wrapped.hostname;
    }

    /**
     * `href` is the full, normalised URL string. It is the same value
     * returned by {@link URL.toString}.
     *
     * Unlike the built-in NodeJS URL, this is readonly.
     */
    get href() {
        return this._wrapped.href;
    }

    /**
     * `origin` is the `protocol://hostname:port` portion of this URL.
     *
     * Unlike the built-in NodeJS URL, this is readonly.
     */
    get origin() {
        return this._wrapped.origin;
    }

    /**
     * `password` is the `password` section of this URL. May be an empty
     * string.
     *
     * Unlike the built-in NodeJS URL, this is readonly.
     */
    get password() {
        return this._wrapped.password;
    }

    /**
     * `pathname` is the query path section of this URL. Defaults to `/`
     * if there is no path provided to the constructor.
     *
     * Unlike the built-in NodeJS URL, this is readonly.
     */
    get pathname() {
        return this._wrapped.pathname;
    }

    /**
     * `port` is the port number section of this URL. May be an empty
     * string.
     *
     * Unlike the built-in NodeJS URL, this is readonly.
     */
    get port() {
        return this._wrapped.port;
    }

    /**
     * `protocol` is the `protocol` section of this URL (e.g. `https:`).
     * The returned string always ends with `:`.
     *
     * Unlike the built-in NodeJS URL, this is readonly.
     */
    get protocol() {
        return this._wrapped.protocol;
    }

    /**
     * `search` is the query string section of this URL. May be an empty
     * string.
     *
     * Unlike the built-in NodeJS URL, this is readonly.
     */
    get search() {
        return this._wrapped.search;
    }

    /**
     * `searchParams` is a getter. It returns a list of the query string
     * parameters for this object.
     *
     * NOTE: unlike NodeJS's built-in URL class, changes made to the search
     * parameters we return don't affect this URL's value at all.
     */
    get searchParams(): URLSearchParams {
        return new URLSearchParams(this._wrapped.searchParams);
    }

    /**
     * `username` is the username section of this URL. May be an empty string.
     *
     * Unlike the built-in NodeJS URL, this is readonly.
     */
    get username() {
        return this._wrapped.username;
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

    /**
     * `dirname()` builds a new URL that points to the parent folder
     * of the current URL.
     *
     * The new URL:
     * - has the same `base` as this URL
     * - has no `search` terms
     * - has no `#fragment`
     */
    public dirname() {
        const parts = this.parse();
        parts.pathname = posix.dirname(parts.pathname);

        parts.search = undefined;
        parts.hash = undefined;

        const href = makeHRef(parts);
        return new URL(href, { base: this.base });
    }

    /**
     * `join()` builds a new URL by combining the current URL's query string
     * (aka pathname) with the given path segments.
     *
     * The new URL:
     * - has the same `base` as this URL
     * - has no `search` terms
     * - has no `#fragment`
     *
     * @param paths
     * the path segment(s) to apply to this URL's query string
     */
    public join(...paths: string[]): URL {
        const parts = this.parse();
        parts.pathname = posix.join(parts.pathname, ...paths);

        parts.search = undefined;
        parts.hash = undefined;

        const href = makeHRef(parts);
        return new URL(href, { base: this.base });
    }

    /**
     * `resolve()` builds a new URL by combining this URL with the given
     * parts.
     *
     * It works right-to-left (from the last given part backwards), and
     * it stops when:
     *
     * a) it comes across a new absolute URL (e.g. https://example.com), or
     * b) when it runs out of parts to apply.
     *
     * Zero-length parts are ignored.
     *
     * If no parts are passed in, `resolve()` creates a clone of the
     * current URL.
     *
     * Some basic rules:
     * - if you replace the `#fragment`, the `?search` string and `/pathname`
     *   are left untouched
     * - if you replace the `?search` string, we drop any `#fragment` that
     *   might be there
     * - if you replace or modify the `/pathname`, we drop any `?search` and
     *   and `#fragment` that might be in the URL
     *
     * The returned URL will have:
     * - the same `base` value that this URL does, if you haven't passed in
     *   a full HRef, or
     * - `base` will be the same value as the new URL
     */
    public resolve(...hrefsOrParts: string[]): URL {
        const parts = this.parse();

        // apply each of the changes we've been given
        //
        // our challenge here is that the caller can provide pretty
        // much any kind of part they want
        for (const hrefOrPart of hrefsOrParts.reverse()) {
            // special case: we ignore zero-length parts
            if (hrefOrPart.length === 0) {
                continue;
            }

            // special case: we've been given a replacement URL
            if (isAbsoluteHRefData(hrefOrPart)) {
                // a full URL replaces our existing URL,
                // and brings our journey to an end
                return new URL(hrefOrPart);
            }

            // general cases: we're going to mod the parts we've
            // already got ... even though we might end up throwing
            // it all away
            if (isHRefSearchData(hrefOrPart)) {
                // a query string replaces any existing query string we have
                parts.search = hrefOrPart;

                // drop everything that comes after the search segment
                parts.hash = undefined;
            } else if (isHRefHashData(hrefOrPart)) {
                // a #fragment replaces any existing fragment we have
                parts.hash = hrefOrPart;

                // the hash is the last segment of a URL, so we don't
                // need to drop anything else
            } else {
                // a path gets merged into our existing URL's parts
                parts.pathname = posix.join(parts.pathname, hrefOrPart);

                // drop everything that comes after the pathname segment
                parts.search = undefined;
                parts.hash = undefined;
            }
        }

        // all done
        const href = makeHRef(parts);
        return new URL(href, { base: this.base });
    }
}