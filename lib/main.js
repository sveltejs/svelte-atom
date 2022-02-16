const cp = require('child_process')

const { AutoLanguageClient } = require('atom-languageclient')

const config = require('./config.js')
const { installDiagnosticSuppressor } = require('./diagnostic')

const languageServerPath = require.resolve(
  'svelte-language-server/bin/server.js',
)

// NOTE Language server uses workspaceFolders as project root(s) if present,
// but Atom's implementation provides (or may provide?) an empty value. In this
// case, language server won't find tsconfig.json, and we won't have propper TS
// support (aliases...). On the other hand, if workspaceFolders is not present,
// language server fallbacks on rootUri that is correctly populated by our class.
//
// NOTE Apparently this is fixed in newest versions of atom-languageclient \o/
//
const ensureNonEmptyWorkspaceFolders = (params) => {
  if (params.workspaceFolders && params.workspaceFolders.length < 1) {
    delete params.workspaceFolders
  }
  return params
}

class SvelteLanguageClient extends AutoLanguageClient {
  config = config
  _suppressSvelteConfigDiagnostic = false

  getGrammarScopes() {
    return ['source.svelte']
  }
  getLanguageName() {
    return 'Svelte'
  }
  getServerName() {
    return 'Svelte Language Server'
  }
  getConnectionType() {
    return 'ipc'
  }

  // NOTE spawning real Node process to work around dynamic import / ESM
  // issues with Electron's Node
  _startServerWithNode(nodePath) {
    const args = [languageServerPath]
    this.logger.debug(`starting Node process "${args.join(' ')}"`)
    return cp.spawn(nodePath, args, {
      env: Object.create(process.env), // hopefully node in in PATH
      stdio: [null, null, null, 'ipc'],
    })
  }

  startServerProcess() {
    try {
      const nodePath = atom.config.get('ide-svelte.nodePath')
      if (nodePath) {
        return this._startServerWithNode(nodePath)
      }
    } catch (err) {
      console.error(
        'Failed to start Svelte Language Server on external Node process',
        err,
      )
      atom.notifications.addError(
        'Failed to start Svelte Language Server on external Node process' +
          ' (trying Electron embeded Node, but losing support of svelte.config.js)',
      )
      this._suppressSvelteConfigDiagnostic = true
    }
    return this.spawnChildNode([languageServerPath], {
      stdio: [null, null, null, 'ipc'],
    })
  }

  getInitializeParams(...args) {
    const params = super.getInitializeParams(...args)
    ensureNonEmptyWorkspaceFolders(params)
    return params
  }

  preInitialization(connection) {
    super.preInitialization(connection)
    this._disposable.add(
      installDiagnosticSuppressor(connection, {
        suppressSvelteConfigDiagnostic: this._suppressSvelteConfigDiagnostic,
      }),
    )
  }
}

module.exports = new SvelteLanguageClient()
