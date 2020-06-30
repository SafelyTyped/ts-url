# ParsedURL

```typescript
import { IpPort } from "@safelytyped/ip-port";
import url from "url";

/**
 * `ParsedURL` holds a breakdown of a URL, using terms from the WHATWG
 * specification.
 *
 * NOTE that we do support the `username` and `password` fields, but
 * you shouldn't use them in new code. These are deprecated by RFC 3986,
 * and may not be supported by your choice of browser AND/OR your destination.
 *
 * NOTE that we do *NOT support protocol-relative URLs here, because
 * the underlying NodeJS URL doesn't support them.
 *
 * @category ParsedURL
 */
export interface ParsedURL {
    /**
     * `protocol` holds the network scheme to use (eg 'http' or 'https').
     */
    protocol: string;

    /**
     * `username` holds the username to authenticate as (eg `git`).
     */
    username?: string;

    /**
     * `password` holds the password to authenticate with.
     */
    password?: string;

    /**
     * `hostname` is the server where the remote data is hosted.
     */
    hostname: string;

    /**
     * `port` is the IP port number to connect to on the remote hostname.
     *
     * A value of `undefined` means to use the default IP port number
     * for the given `protocol`.
     */
    port?: IpPort;

    /**
     * `pathname` is the query path portion of the URL.
     */
    pathname: string;

    /**
     * `search` holds the query string portion of the URL.
     */
    search?: string;

    /**
     * `searchParams` holds the query string portion of the URL,
     * as a data bag.
     */
    searchParams?: url.URLSearchParams;

    /**
     * `hash` holds the #fragment section of the URL, if present.
     */
    hash?: string;
}
