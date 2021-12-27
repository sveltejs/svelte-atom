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
      Path to the Node executable used to run the language server.


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
}
