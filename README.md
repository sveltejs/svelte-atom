# Svelte for Atom

Provides syntax highlighting and intellisense for Svelte components in Atom, utilising the [svelte language server](https://github.com/sveltejs/language-tools/tree/master/packages/language-server).

## Features

- Syntax highlighting (with TextMate grammar)

Language server feature (that rely on other packages for UI):

- Autocomplete
- TypeScript support in .svelte components
- Diagnostic messages for warnings and errors
- Datatips
- References & definitions
- Code formatting

## Setup

### Configure Node executable

The Svelte Language Server that powers most of this plugins features uses some JS features that are not supported by the Node version embedded with Atom. That's why, to benefit from all features from the language server (loading of your project's `svelte.config.js` notably), the plugin tries to run the language server on your system's Node.

The default command the plugin uses to run Node is `node`, which will work if the Node.js executable is in your PATH and your PATH is visible to Atom. Otherwise you might need to customize this setting to provide the full path to a recent Node executable to be used to run the language server.

If no such Node executable can be found by the plugin, then it will fallback on using the Node embedded with Atom. But this will incurs feature loss and/or erratic behaviour of the language server.

### Ensure you have supporting Atom packages

This package mainly only _exposes_ language features to be consumed by other plugins. It doesn't come with the supporting UI features that are expected to be provided by other "consumer" plugins.

Initial work on IDE oriented UIs and LSP integration has been done by the [Atom IDE](https://ide.atom.io/) initiative, and all their work was published as the monolithic [atom-ide-ui](https://atom.io/packages/atom-ide-ui) package, but the project has now been retired and is not maintained anymore.

This line of work is now being continued by the atom-community initiative. Their stated objective is to release each UI feature as its own standalone and composable package, but they also offer a meta package that includes all of them: [atom-ide-base](https://atom.io/packages/atom-ide-base).

You can use this all-inclusive package and/or pick just what you need. While assuming no endorsement, the following Atom packages have been used with some satisfaction for Svelte development in Atom by some of the authors of this plugin.

#### Autocomplete

- [autocomplete-plus](https://atom.io/packages/autocomplete-plus) (Bundled with Atom)

#### Linting / diagnostic

- [linter](https://atom.io/packages/linter)
- [linter-ui-default](https://atom.io/packages/linter-ui-default)

#### Datatips

- [atom-ide-datatip](https://atom.io/packages/atom-ide-datatip)

#### Code formatting

The Svelte language server provides formatting capabilities for Svelte components (via internal Prettier). This can be consumed by a formatting package like the following:

- [atom-ide-code-format](https://github.com/atom-community/atom-ide-code-format)

Alternatively, if your project is correctly setup for [Svelte with Prettier](https://github.com/sveltejs/prettier-plugin-svelte), you might prefer to use a Prettier extension for formatting of all your files (`.svelte`, `.js`, `.ts`, etc.):

- [prettier-atom](https://atom.io/packages/prettier-atom) Maintained by Prettier, but has a tendency of freezing my editor with Svelte components
- [mprettier](https://atom.io/packages/mprettier) A bare alternative that works better for me with Svelte

#### Highlights / navigating references

There doesn't appear to be some established package for code highlights / navigating references in Atom currently, but I have personally been using a hacked together plugin you might have some luck with.

- [atom-refs](https://atom.io/packages/atom-refs) Highlights references, and jump to definition or import, in JS, TS and Svelte. (Also compatible with (atom-ide-hyperclick)[https://atom.io/packages/atom-ide-hyperclick] for mouse support.)
