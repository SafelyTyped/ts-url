//
// Copyright (c) 2020-present Ganbaro Digital Ltd
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions
// are met:
//
//   * Re-distributions of source code must retain the above copyright
//     notice, this list of conditions and the following disclaimer.
//
//   * Redistributions in binary form must reproduce the above copyright
//     notice, this list of conditions and the following disclaimer in
//     the documentation and/or other materials provided with the
//     distribution.
//
//   * Neither the names of the copyright holders nor the names of his
//     contributors may be used to endorse or promote products derived
//     from this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS
// FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
// COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
// INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
// BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
// LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
// CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
// LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
// ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.
//
import { resolveIpPortToString } from "@safelytyped/ip-port";

import {
    type HRefParts,
    type HRefPartsWithHostname,
    isHRefPartsWithHostname,
    isPRHRefParts,
    type PRHRefParts,
} from "../HRefParts";

/**
 * `makeHRef()` assembles a URL string from a list of given parts.
 *
 * @category HRef
 */
export function makeHRef(parts: HRefParts): string {
    // special case
    if (isPRHRefParts(parts)) {
        return makePRHRef(parts);
    }

    // another special case
    if (isHRefPartsWithHostname(parts)) {
        return makeHRefWithHostname(parts);
    }

    // general case
    return getHRefCommonElements(parts);
}

/**
 * `makePRHRef()` assembles a protocol-relative HRef, using the given
 * set of parts.
 *
 * @category HRef
 */
function makePRHRef(parts: PRHRefParts): string {
    // this will hold the return value that we're building
    let href: string = "";

    // someone *could* set this to be `false`
    if (parts.protocolRelative) {
        href = "//";
    }

    // all done
    return href + getAbsoluteHRefElements(parts);
}

/**
 * `makeHRefWithHostname()` assembles a HRef that definitely includes
 * a hostname, using the given set of parts.
 *
 * @category HRef
 */
function makeHRefWithHostname(parts: HRefPartsWithHostname): string {
    // this will hold the return value that we're building
    let href: string = "";

    // the protocol is optional, because we have a hostname
    if (parts.protocol) {
        // special case - if the protocol came from an existing URL
        // object, it might already have a ':' on the end of it (sigh)
        if (parts.protocol.endsWith(":")) {
            href = parts.protocol + "//";
        } else {
            href = parts.protocol + "://";
        }
    }

    // all done
    return href + getAbsoluteHRefElements(parts);
}

/**
 * `getAbsoluteHRefElements()` builds a string that contains everything
 * that goes into an absolute HRef after the initial protocol section.
 *
 * @category HRefParts
 */
function getAbsoluteHRefElements(parts: HRefPartsWithHostname | PRHRefParts): string {
    // add in the hostname and (optional) port number
    return getHRefHostnameAndPort(parts)
        // do we need a separator after the host and port?
        + getHRefAuthoritySeparator(parts)
        // now add in the common elements
        + getHRefCommonElements(parts);
}

/**
 * `getHRefHostnameAndPort()` builds a string that contains the hostname
 * and the (optional) port number. The returned string is formatted
 * for use in a HRef.
 *
 * @category HRef
 */
function getHRefHostnameAndPort(parts: HRefPartsWithHostname | PRHRefParts): string {
    let href = parts.hostname;

    // ports are optional
    if (parts.port) {
        href = href + ":" + resolveIpPortToString(parts.port);
    }

    return href;
}

/**
 * `getHRefAuthoritySeparator()` returns the correct separator between
 * the hostname and port (on the left) and the rest of the HRef (on the
 * right).
 *
 * @category HRef
 */
function getHRefAuthoritySeparator(parts: HRefPartsWithHostname | PRHRefParts): string {
    // if we have a query path, it will contain the required separator
    // for us
    if (parts.pathname) {
        return "";
    }

    // no query path? then we'll need a separator if any of these parts
    // are present.
    if (parts.hash || parts.search) {
        return "/";
    }

    // all done
    return "";
}

/**
 * `getHRefCommonElements()` assembles everything in a HRef that comes after
 * the authority separator.
 *
 * This serves two purposes:
 *
 * 1. add in the common elements to protocol-relative URLs, and URLs that
 *    contain a hostname, and
 * 2. build a relative URL
 *
 * @category HRef
 */
function getHRefCommonElements(parts: HRefParts): string {
    // this will hold the return value that we're building
    let href = "";

    // do we have a query path to add?
    if (parts.pathname) {
        href = href + parts.pathname;
    }

    return href + getHRefSearch(parts) + getHRefHash(parts);
}

/**
 * `getHRefSearch()` assembles the search portion of a HRef, from
 * the given set of parts.
 *
 * It ensures that the returned string always starts with the `?`
 * separator.
 *
 * @category HRef
 */
function getHRefSearch(parts: HRefParts): string {
    // this will hold the return value that we're building
    let href = "";

    if (parts.search) {
        // the search may already start with a '?' character
        if (!parts.search.startsWith("?")) {
            href = href + "?";
        }
        href = href + parts.search;
    }

    // all done
    return href;
}

/**
 * `getHRefHash()` assembles the has portion of a HRef, from
 * the given set of parts.
 *
 * It ensures that the returned string always starts with the
 * `#` separator.
 *
 * @category HRef
 */
function getHRefHash(parts: HRefParts): string {
    // this will hold the return value that we're building
    let href = "";

    if (parts.hash) {
        // the hash may already start with a '#' character
        if (!parts.hash.startsWith("#")) {
            href = href + "#";
        }
        href = href + parts.hash;
    }

    // all done
    return href;
}