const unwrap = (parts) =>
  parts
    .join('')
    // // Atom doesn't wrap first line in <p> and actively suppress them if we
    // // manually do it ourselves (?)
    // .replace('\n\n', '<br><br>\n\n')
    .split(/\n{2,}/)
    .map((s) => s.replace(/\s+/g, ' ').replace(/^\s+|\s+$/g, ''))
    .join('\n\n')

let lastOrder = 0

const order = () => ({ order: ++lastOrder })

module.exports = {
  nodePath: {
    ...order(),
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
  enableSvelteDiagnostics: {
    ...order(),
    type: 'boolean',
    default: true,
    title: 'Enable Svelte compiler diagnostics',
    description: unwrap`
      Enable diagnostics emitted by the language server with "svelte" source
      (the source appears as "provider" in Atom's linter UI).
      You might want to disable those if they are also reported by the ESLint
      provider (when using the ESLint Svelte plugin), and you get all warnings
      in double.
    `,
  },
  enableTsDiagnostics: {
    ...order(),
    type: 'boolean',
    default: true,
    title: 'Enable TypeScript diagnostics',
    description: unwrap`
      Enable diagnostics emitted by the language server with "ts" source
      (the source appears as "provider" in Atom's linter UI).
    `,
  },
  enableJsDiagnostics: {
    ...order(),
    type: 'boolean',
    default: false,
    title: 'Enable Javascript diagnostics',
    description: unwrap`
      Enable diagnostics emitted by the language server with "js" source
      (the source appears as "provider" in Atom's linter UI).
      Note that this linting is done in the language server with TypeScript
      (even if your components don't have lang="ts"). This means you'll most
      likely get type errors/warnings that you'll only be able to fix with
      [JSDoc comments](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html)
      (short of fully switching your components to lang="ts"...).
    `,
  },
}
