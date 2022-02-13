# Svelte grammar packages

This plugin does not ship with a Svelte grammar for Atom. In its early versions, it used to, but rapid evolution of Svelte 3 lately had made this grammar [obsolete](https://github.com/sveltejs/svelte-atom/issues/8).

The current situation with grammars in Atom is somewhat complicated. For now, we prefer to have this package focus only on its core mission: that is, integration with the Svelte Language Server. This way, its main benefits won't be held back by complicated grammar considerations. And, on the other hand, having dedicated packages for different grammar approaches will give users a better flexibility in composing the solution that better suits their specific needs.

This document will be updated regularly as new Svelte grammar for Atom are being developed and released.

## Status of Svelte grammars for Atom

### TextMate

The motivation for fixing the legacy TextMate grammar is pretty low, because we now have a much better one in the VSCode Svelte plugin that we'd like to reuse for Atom. Unfortunately, the JS engine in the current version of Atom does not seem to make it possible to port this better grammar currently (or maybe I did not try hard enough -- [feel free](https://github.com/sveltejs/svelte-atom/pulls) if you want to give it a shot and get better success).

Until then, we don't want to include a very outdated TextMate grammar with this package, because it would conflict with other, potentially better, Svelte grammar packages TextMate users might want to use.

### Tree-sitter

That said, TextMate grammar are considered somewhat legacy in Atom, and the new officially recommended grammar format is Tree-sitter.

Initial work have been done to create a Tree-sitter grammar for Svelte that have gone pretty well actually. But this new grammar is still very early and some dependencies issues need to be sorted out before it can be used in every setting (notably, Svelte TS components wouldn't work with the official language-typescript package). You can find more details in [this PR](https://github.com/sveltejs/svelte-atom/pull/12).

We don't want to include this Tree-sitter grammar in this package because it is not considered complete yet, and including it would prevent Tree-sitter users from using either an alternative Tree-sitter or TextMate grammar for Svelte alongside the language server.

## Currently available Svelte grammars for Atom

### TextMate

You can now use [language-svelte](https://atom.io/packages/language-svelte) alongside this package.
