# Svelte for Atom

Provides syntax highlighting and intellisense for Svelte components in Atom, utilising the [svelte language server](https://github.com/sveltejs/language-tools/tree/master/packages/language-server).

## Features

- TypeScript support in .svelte components
- Diagnostic messages for warnings and errors
- References & definitions provider

## Setup

### Configure Node executable

The Svelte Language Server that powers most of this plugins features uses some JS features that are not supported by the Node version embedded with Atom. That's why, to benefit from all features from the language server (loading of your project's `svelte.config.js` notably), the plugin tries to run the language server on your system's Node.

The default command the plugin uses to run Node is `node`, which will work if the Node.js executable is in your PATH and your PATH is visible to Atom. Otherwise you might need to customize this setting to provide the full path to a recent Node executable to be used to run the language server.

If no such Node executable can be found by the plugin, then it will fallback on using the Node embedded with Atom. But this will incurs feature loss and/or erratic behaviour of the language server.
