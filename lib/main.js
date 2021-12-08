const cp = require('child_process')

const { AutoLanguageClient } = require('atom-languageclient')

const languageServerPath = require.resolve('svelte-language-server/bin/server.js')

const shouldSpawnRealNode = () => true

const suppressSvelteConfigDiagnostics = connection => {
  const { onPublishDiagnostics } = connection

  const isNotSvelteConfigDiag = ({ source, message }) =>
    source !== 'svelte' || !message.startsWith('Error in svelte.config.js')

  connection.onPublishDiagnostics = function(callback) {
    return onPublishDiagnostics.call(this, diag => {
      if (diag.diagnostics) {
        diag.diagnostics = diag.diagnostics.filter(isNotSvelteConfigDiag)
      }
      return callback(diag)
    })
  }
}

// NOTE Language server uses workspaceFolders as project root(s) if present,
// but Atom's implementation provides (or may provide?) an empty value. In this
// case, language server won't find tsconfig.json, and we won't have propper TS
// support (aliases...). On the other hand, if workspaceFolders is not present,
// language server fallbacks on rootUri that is correctly populated by our class.
const ensureNonEmptyWorkspaceFolders = params => {
  if (params.workspaceFolders && params.workspaceFolders.length < 1) {
    delete params.workspaceFolders
  }
  return params
}

class SvelteLanguageClient extends AutoLanguageClient {
  suppressSvelteConfigDiagnostic = false

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
  _startServerWithNode() {
    const args = [languageServerPath]
    this.logger.debug(`starting Node process "${args.join(' ')}"`)
    return cp.spawn('node', args, {
      env: Object.create(process.env), // hopefully node in in PATH
      stdio: [null, null, null, 'ipc'],
    })
  }

  startServerProcess() {
    try {
      return this._startServerWithNode()
    } catch (err) {
      console.error('Failed to start Svelte Language Server on external Node process', err)
      atom.notifications.addError(
        'Failed to start Svelte Language Server on external Node process' +
          ' (trying Electron embeded Node, but losing support of svelte.config.js)',
      )
      this.suppressSvelteConfigDiagnostic = true
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
    if (this.suppressSvelteConfigDiagnostic) {
      suppressSvelteConfigDiagnostics(connection)
    }
  }
}

module.exports = new SvelteLanguageClient()
