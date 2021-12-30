const unwrap = parts =>
  parts
    .join('')
    .split(/\n{2,}/)
    .map(s => s.replace(/\s+/g, ' ').replace(/^\s+|\s+$/g, ''))
    .join('\n\n')

module.exports = {
  nodePath: {
    order: 1,
    type: 'string',
    default: 'node',
    title: 'Node executable',
    description: unwrap`
      Path to the Node executable used to start the language server.

      This is needed because Electron's native Node currently doesn't have
      enough support for dynamic imports to support loading svelte.config.js in
      Svelte Language Server.

      This is needed because Electron's embedded Node currently doesn't have
      enough support for language features to support loading svelte.config.js
      in Svelte Language Server.

      The default will work if node is in your PATH (and Atom can see this
      PATH). You can specify the full path to a Node executable if the default
      strategy doesn't work.

      If no usable external Node is found, then an Electron child Node will be
      spawned, but that means that your svelte.config.js won't be visible to
      the language server.

      _Atom restart is required to apply this setting._
    `,
  },

  defaultHighlightScript: {
    order: 2,
    type: 'string',
    enum: ['guess', 'javascript', 'typescript'],
    default: 'guess',
    title: 'Default script syntax highlighting',
    description: unwrap`
      Syntax highlighting language to be used in <code>&lt;script;gt;</code>
      blocks and injected template expressions (<code>{...}</code>) when the
      Svelte grammar fails to autodetect it.

      Syntax highlighting of script code is determined by the presence of the
      <code>lang</code> attribute on the <code>&lt;script&gt;</code> tag.
      However there is a number of situations where this detection is not
      possible.

      - In components with no <code>&lt;script;gt;</code> tag, there's no
      <code>lang</code> attribute to detect. Obviously. Keep in mind that
      Atom's grammar and "context free", meaning we can't go out and try to
      infer your project's setup or things like that.

      - If you've setup your project's preprocessors with a default script
      language that is not javascript, then your <code>&lt;script;gt;</code>
      tags won't have the <code>lang</code> attribute, and so the "context free"
      grammar won't know how to infer your script language.

      - Furthermore, Atom's tree-sitter grammar implements incremental parsing.
      This means that "nodes" in your code that don't change won't be updated.
      As a consequence, changing the <code>lang</code> attribute of a
      <code>&lt;script&gt;</code> tag after the file is already opened won't be
      detected and applied right away to existing template expresions in your
      markup. (This is a temporary problem that would get fixed by closing and
      reopening the file, though.)

      In all these situations, the Svelte grammar will fallback to the language
      configured in this setting for highlighting of template expressions or
      script tags.

      The default setting will try to "guess" your usage with a dumb heuristic:
      if any of the following package is active in your Atom, then we'll suppose
      you're an avid TS user and default to <code>'typescript'</code>:
      [language-typescript](https://atom.io/packages/language-typescript),
      [atom-typescript](https://atom.io/packages/atom-typescript),
      [ide-typescript](https://atom.io/packages/ide-typescript).
      Otherwise, we'll default to <code>'javacript'</code>.
    `,
  },
}
