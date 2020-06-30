# HRef

## makeHRef()

```typescript
/**
 * `makeHRef()` assembles a URL string from a list of given parts.
 *
 * @category HRef
 */
export function makeHRef(parts: HRefParts): string;
```

## HRefParts

```typescript
/**
 * `HRefParts` holds the parts of a URL, using terms from the WHATWG
 * specification.
 *
 * `HRefParts` is designed so that you can't compile a data structure
 * containing unsupported combinations of parts.
 *
 * @category HRefParts
 */
export type HRefParts =
    HRefPartsWithHostname
    | PRHRefParts
    | HRefPartsWithPathname
    | HRefPartsWithSearch
    | HRefPartsWithHash;
```

### HRefPartsWithHash

```typescript
/**
 * `HRefPartsWithHash` holds the parts of a URL, using terms from the WHATWG
 *  specification.
 *
 * This interface is built for URLs that contain a '#fragment' of some kind,
 * called the 'hash' in the WHATWG specification.
 *
 * You shouldn't need to explicitly assign this type to a value. Use
 * {@link HRefParts} instead.
 *
 * @category HRefParts
 */
export interface HRefPartsWithHash {
    /**
     * `protocol` holds the network scheme to use (eg 'http' or 'https').
     */
    protocol?: string;

    /**
     * `pathname` is the query path portion of the URL.
     */
    pathname?: string;

    /**
     * `search` holds the query string portion of the URL.
     */
    search?: string;

    /**
     * `hash` holds the #fragment section of the URL, if present.
     */
    hash: string;
}
```

### HRefPartsWithHostname

```typescript
/**
 * `HRefPartsWithHostname` holds the parts of a URL, using terms from the
 * WHATWG specification.
 *
 * This interface is built for URLs that definitely contain a hostname.
 *
 * You shouldn't need to explicitly assign this type to a value. Use
 * {@link HRefParts} instead.
 *
 * @category HRefParts
 */
export interface HRefPartsWithHostname {
    /**
     * `protocol` holds the network scheme to use (eg 'http' or 'https').
     */
    protocol?: string;

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
    pathname?: string;

    /**
     * `search` holds the query string portion of the URL.
     */
    search?: string;

    /**
     * `hash` holds the #fragment section of the URL, if present.
     */
    hash?: string;
}
```

### HRefPartsWithPathname

```typescript
/**
 * `HRefPartsWithPathname` holds the parts of a URL, using terms from
 * the WHATWG specification.
 *
 * This interface is built for relative URLs that contain a query path
 * of some kind.
 *
 * You shouldn't need to explicitly assign this type to a value. Use
 * {@link HRefParts} instead.
 *
 * @category HRefParts
 */
export interface HRefPartsWithPathname {
    /**
     * `protocol` holds the network scheme to use (eg 'http' or 'https').
     */
    protocol?: string;

    /**
     * `pathname` is the query path portion of the URL.
     */
    pathname: string;

    /**
     * `search` holds the query string portion of the URL.
     */
    search?: string;

    /**
     * `hash` holds the #fragment section of the URL, if present.
     */
    hash?: string;
}
```

### HRefPartsWithSearch

```typescript
/**
 * `HRefPartsWithSearch` holds the parts of a URL, using terms from the
 * WHATWG specification.
 *
 * This interface is built for relative URLs that contain a query string
 * of some kind.
 *
 * You shouldn't need to explicitly assign this type to a value. Use
 * {@link HRefParts} instead.
 *
 * @category HRefParts
 */
export interface HRefPartsWithSearch {
    /**
     * `protocol` holds the network scheme to use (eg 'http' or 'https').
     */
    protocol?: string;

    /**
     * `pathname` is the query path portion of the URL.
     */
    pathname?: string;

    /**
     * `search` holds the query string portion of the URL.
     */
    search: string;

    /**
     * `hash` holds the #fragment section of the URL, if present.
     */
    hash?: string;
}
```

### PRHRefParts

```typescript
/**
 * `PRHRefParts` holds the parts of a URL, using terms from the
 * WHATWG specification.
 *
 * This interface is built for URLs that take advantage of a feature called
 * 'protocol-relative'.
 *
 * You shouldn't need to explicitly assign this type to a value. Use
 * {@link HRefParts} instead.
 *
 * @category HRefParts
 */
export interface PRHRefParts {
    /**
     * `protocolRelative` is a flag.
     *
     * - Set to `true` if you want a protocol-relative URL to be generated.
     * - Set to `false` if you don't want a protocol specified at the front
     *   of this URL.
     */
    protocolRelative: boolean;

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
    pathname?: string;

    /**
     * `search` holds the query string portion of the URL.
     */
    search?: string;

    /**
     * `hash` holds the #fragment section of the URL, if present.
     */
    hash?: string;
}
```