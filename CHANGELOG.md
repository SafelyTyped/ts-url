# CHANGELOG

## Introduction

This CHANGELOG tells you:

* when a release was made
* what is in each release

It also tells you what changes have been completed, and will be included in the next tagged release.

For each release, changes are grouped under these headings:

* _Backwards-Compatibility Breaks_: a list of any backwards-compatibility breaks
* _New_: a list of new features. If the feature came from a contributor via a PR, make sure you link to the PR and give them a mention here.
* _Fixes_: a list of bugs that have been fixed. If there's an issue for the bug, make sure you link to the GitHub issue here.
* _Dependencies_: a list of dependencies that have been added / updated / removed.
* _Tools_: a list of bundled tools that have been added / updated / removed.

## develop branch

The following changes have been completed, and will be included in the next tagged release.

## v0.2.0

Released Saturday, 29th May 2021

### Backwards-Compatibility Breaks

* `URL` is no longer a child class of NodeJS's `URL`
  - caused by [this TypeScript v4.0 compiler change](https://github.com/microsoft/TypeScript/pull/37894)

### Dependencies

* Upgraded all dependencies to their latest version

### New

* Added `URL.toNodeUrl()`

## v0.1.0

Released Tuesday, 30th June 2020.

### New

* Errors
  - added `InvalidURLDataError`
* HRef
  - added `makeHRef()`
  - added `isAbsoluteHRefData()`
  - added `isHRefHashData()`
  - added `isHRefSearchData()`
  - added `isPRHRefData()`
* HRefParts
  - added `HRefParts`
  - added `HRefPartsWithHash`
  - added `HRefPartsWithHostname`
  - added `HRefPartsWithPathname`
  - added `HRefPartsWithSearch`
  - added `PRHRefParts`
  - added `isHRefPartsWithHash()` type guard
  - added `isHRefPartsWithHostname()` type guard
  - added `isHRefPartsWithPathname()` type guard
  - added `isPRHRefParts()` type guard
* ParsedURL
  - added `ParsedURL` interface
* URL
  - added `URL` type
    - added `URL.base`
    - added `URL.dirname()`
    - added `URL.implementsValue()`
    - added `URL.join()`
    - added `URL.parse()`
    - added `URL.resolve()`
    - added `URL.valueOf()`
    - made `URL.hash` read-only
    - made `URL.host` read-only
    - made `URL.hostname` read-only
    - made `URL.href` read-only
    - made `URL.origin` read-only
    - made `URL.password` read-only
    - made `URL.pathname` read-only
    - made `URL.port` read-only
    - made `URL.protocol` read-only
    - made `URL.search` read-only
    - made `URL.searchParams` read-only and side effect-free
    - made `ULR.username` read-only
  - added `isURLData()`
  - added `makeURL()`
  - added `mustBeURLData()`
  - added `validateURLData()`

### Dependencies

* Added `safelytyped/ip-port` as a dependency.
