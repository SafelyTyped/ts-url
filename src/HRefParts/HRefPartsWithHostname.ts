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
import type { IpPort } from "@safelytyped/ip-port";

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

