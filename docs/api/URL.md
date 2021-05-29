# URL

```typescript
// how to import into your own code
import { URL } from "@safelytyped/url";

// types that we use in our definition
import {
    DataPath,
    DEFAULT_DATA_PATH,
    OnError,
    THROW_THE_ERROR,
    Value,
    ToString,
} from "@safelytyped/core-types";
import { URL as NodeURL, URLSearchParams } from "url";

/**
 * `URL` is a safe type. It is an immutable equivalent of NodeJS's built-in
 * `URL` type.
 *
 * Internally, it uses a wrapped NodeJS `URL` to guarantee the same behaviour.
 */
export class URL implements ToString, Value<string> {
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
    );

    /**
     * `base` is the base URL that was used to build this URL.
     */
    public readonly base: string;

    /**
     * `parse()` returns a breakdown of this URL. This is useful for
     * manipulating the URL.
     */
    public parse(): ParsedURL;

    /**
     * `toNodeUrl()` returns this URL in a form that's compatible with
     * NodeJS's `URL` object.
     */
    public toNodeUrl(): NodeURL;

    // =======================================================================
    //
    // JSON protocol
    //
    // -----------------------------------------------------------------------

    /**
     * `toJSON()` returns this URL as a JSON-encoded string
     */
    public toJSON(): string;

    // =======================================================================
    //
    // ToString protocol
    //
    // -----------------------------------------------------------------------

    /**
     * `toString()` returns this URL as a string, suitable for use in
     * HTTP requests
     */
    public toString(): string;

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
     * Unlike the wrapped NodeJS URL, this is readonly.
     */
    public readonly hash: string;

    /**
     * `host` is the `hostname:port` section of the URL.
     *
     * Unlike the wrapped NodeJS URL, this is readonly.
     */
    public readonly host: string;

    /**
     * `hostname` is the `hostname` section of the URL. Guaranteed not
     * to be an empty string.
     *
     * Unlike the wrapped NodeJS URL, this is readonly.
     */
    public readonly hostname: string;

    /**
     * `href` is the full, normalised URL string. It is the same value
     * returned by {@link URL.toString}.
     *
     * Unlike the wrapped NodeJS URL, this is readonly.
     */
    public readonly href: string;

    /**
     * `origin` is the `protocol://hostname:port` portion of this URL.
     *
     * Unlike the wrapped NodeJS URL, this is readonly.
     */
    public readonly origin: string;

    /**
     * `password` is the `password` section of this URL. May be an empty
     * string.
     *
     * Unlike the wrapped NodeJS URL, this is readonly.
     */
    public readonly password: string;

    /**
     * `pathname` is the query path section of this URL. Defaults to `/`
     * if there is no path provided to the constructor.
     *
     * Unlike the wrapped NodeJS URL, this is readonly.
     */
    public readonly pathname: string;

    /**
     * `port` is the port number section of this URL. May be an empty
     * string.
     *
     * Unlike the wrapped NodeJS URL, this is readonly.
     */
    public readonly port: string;

    /**
     * `protocol` is the `protocol` section of this URL (e.g. `https:`).
     * The returned string always ends with `:`.
     *
     * Unlike the wrapped NodeJS URL, this is readonly.
     */
    public readonly protocol: string;

    /**
     * `search` is the query string section of this URL. May be an empty
     * string.
     *
     * Unlike the wrapped NodeJS URL, this is readonly.
     */
    public readonly search: string;

    /**
     * `searchParams` is a getter. It returns a list of the query string
     * parameters for this object.
     *
     * NOTE: unlike NodeJS's built-in URL class, changes made to the search
     * parameters we return don't affect this URL's value at all.
     */
    public readonly searchParams: URLSearchParams;

    /**
     * `username` is the username section of this URL. May be an empty string.
     *
     * Unlike the wrapped NodeJS URL, this is readonly.
     */
    public readonly username: string;

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
    public valueOf(): string;

    /**
     * `implementsValue()` is a helper method for the {@link isValue}
     * type guard function.
     */
    public implementsValue(): boolean;

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
    public dirname(): URL;

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
    public join(...paths: string[]): URL;

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
    public resolve(...hrefsOrParts: string[]): URL;
}
```