# API Docs

Welcome to `@safelytyped/url`!

- [Introduction](#introduction)
  - [What Is A Safe Type?](#what-is-a-safe-type)
  - [Why Use Safe Types?](#why-use-safe-types)
  - [Why A URL Type?](#why-a-url-type)
- [Our Goals](#our-goals)
  - [Our Design Criteria](#our-design-criteria)

## Introduction

### What Is A Safe Type?

A _safe type_ is a type that can only ever hold legal values.

For example, `URL` is a safe type because it can only ever hold a valid URL (although we don't guarantee that it points to anywhere useful!)

### Why Use Safe Types?

If your function accepts a _safe type_, your function doesn't need to do its own [defensive programming][Defensive Programming] for robustness.

**Safe types do the defensive programming for you.**

On top of that, we build our _safe types_ using [written coding standards][SafelyTyped Coding Standards].

### Why A URL Type?

You might be wondering why you should use our `URL`, instead of the built-in NodeJS `URL`. Here's a few reasons why:

* No side-effects:

    The built-in NodeJS `URL` is a read-write object. When you modify it, you've no idea whether or not other parts of your code hold a reference to it. That can lead to unwanted surprises and side-effects.

    Our `URL` is a read-only object. Yes, even the URL search parameters object is disconnected from the `URL` it came from. This ensures that there are zero surprises, and zero side-effects.

* Extra features:

    Our `URL` includes some extra APIs for making easy modifications to the URL.

    - Use our `URL.resolve()` as an all-in-one URL modder. (It returns a new URL object, so it doesn't violate the first reason to use our `URL`!)
    - Keep track of where your `URL` came from through the handy `URL.base` property. Perfect for working through and resolving reference entries in an OpenAPI spec or JSON schema.

* A means to deliver functionality into business logic:

    If you pass typed values into your business logic, it can call methods on those types without having to know whether it's working with a _Filepath_ or a _URL_.

    _Value objects_ can implement [protocols][Protocol] (interfaces that describe behaviours). And business logic can consume and use objects based solely on their protocols, without caring whether they're a _Filepath_ or a _URL_.

* Runtime extensibility:

    Along with [protocols][Protocol], _value objects_ can be augmented at runtime with [extensions][Extension]. You don't have to submit a pull request to our repo and wait for us to merge it; you can create your own extension and use it locally straight away.

## Our Goals

The purpose of this library is to give us the smallest possible, safest [URL](URL) safe type that adds value to our code.

### Our Design Criteria

There's a couple of things that we wanted out of `URL`.

* [URL][URL] must be a safer version of NodeJS's `URL` class.
* [URL][URL]'s API should be very familiar to anyone who already knows NodeJS's `URL` class, and NodeJS's `path` module.
* [URL][URL] should be useful for tracking a data location: a path that's built from a mix of a base path and a location relative to that base path.

[URL]: ./URL.md
[Branded Type]: https://github.com/SafelyTyped/ts-coding-standards/blob/master/glossary/branded-type.md
[Defensive Programming]: https://github.com/SafelyTyped/ts-coding-standards/blob/master/glossary/defensive-programming.md
[Extension]: https://github.com/SafelyTyped/ts-coding-standards/blob/master/glossary/extension.md
[Protocol]: https://github.com/SafelyTyped/ts-coding-standards/blob/master/glossary/protocol.md
[Refined Type]: https://github.com/SafelyTyped/ts-coding-standards/blob/master/glossary/refined-type.md
[SafelyTyped on GitHub]: https://github.com/SafelyTyped/
[SafelyTyped Coding Standards]: https://github.com/SafelyTyped/ts-coding-standards/