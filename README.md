# Svelte for Atom

Provides syntax highlighting and intellisense for Svelte components in Atom, utilising the [svelte language server](https://github.com/sveltejs/language-tools/tree/master/packages/language-server).

## Features

- Syntax highlighting with tree-sitter
- TypeScript support in .svelte components
- Diagnostic messages for warnings and errors
- References & definitions provider

## Setup

### Configure Node executable

The Svelte Language Server that powers most of this plugins features uses some JS features that are not supported by the Node version embedded with Atom. That's why, to benefit from all features from the language server (loading of your project's `svelte.config.js` notably), the plugin tries to run the language server on your system's Node.

The default command the plugin uses to run Node is `node`, which will work if the Node.js executable is in your PATH and your PATH is visible to Atom. Otherwise you might need to customize this setting to provide the full path to a recent Node executable to be used to run the language server.

If no such Node executable can be found by the plugin, then it will fallback on using the Node embedded with Atom. But this will incurs feature loss and/or erratic behaviour of the language server.

### Syntax highlighting / grammar

This plugin only ships with a tree-sitter grammar. The legacy TextMate grammar has failed to keep up with Svelte's evolutions ([#8](https://github.com/sveltejs/svelte-atom/issues/8)...), and fixing it is beyond the current maintainer's means.

This means that, in order to benefit from syntax highlighting of `.svelte` files from this plugin, you need to enable "Use Tree Sitter Parsers" in Atom's "Settings > Core". Unfortunately, this can affect the syntax highlighting of the other languages you use (presumably for the best!). If enabling tree-sitter grammars is not an option for you, you can try to use [language-svelte](https://atom.io/packages/language-svelte) that provides a TextMate grammar.

Future plans: the VSCode plugin features a very good and well maintained TextMate grammar for Svelte. Unfortunately, this grammar uses regular expressions features that are not currently by Atom... So the long term hope would be to reintegrate and share the language-tools / VSCode TextMate grammar once the required features becomes supported by Atom. In any event, the tree-sitter grammar should continue to be provided by this plugin.

### Ensure you have supporting plugins

Appart from grammar, this packages mainly only _exposes_ language features to be consumed by other plugins. It doesn't come with the supporting UI features that are expected to be provided by other "consumer" plugins.

Depending on your tastes, you can try the all inclusive [Atom IDE](https://ide.atom.io/) package, or try to compose for yourself a more personalized experience by hand picking and configuring a bunch of specialized plugins (Atom is all about hacking your IDE after all, isn't it?).

While assuming no endorsement, the following Atom packages have been used with some satisfaction for Svelte development in Atom by some of the authors of this plugin:

- **Linting**
  - [linter](https://atom.io/packages/linter)
  - [linter-ui-default](https://atom.io/packages/linter-ui-default)
- **TypeScript** While not strictly needed for TS support in Svelte components... Well, Svelte components are probably not going to make 100% of your app, and on the TS road, the more the better!
  - [atom-typescript](https://atom.io/packages/atom-typescript)
  - [language-typescript](https://atom.io/packages/language-typescript)
- **Info tooltips**
  - [atom-ide-datatip](https://atom.io/packages/atom-ide-datatip)
- **Navigate references/definitions**
  - [atom-refs](https://atom.io/packages/atom-refs) Still, no endorsment, but I can vouch for the author ^^ (full disclaimer: it's me).
- **Prettier**
  - [mprettier](https://atom.io/packages/mprettier) Hard & fast alternative to the official [prettier-atom](https://atom.io/packages/prettier-atom) plugin.
- **Emmet snippets**
  - [emmet](https://atom.io/packages/emmet)
