const cp = require('child_process')

const { AutoLanguageClient } = require('atom-languageclient')

const { debounce } = require('./util.js')
const config = require('./config.js')
const { installDiagnosticSuppressor } = require('./diagnostic.js')

const languageServerPath = require.resolve(
  'svelte-language-server/bin/server.js',
)

const nodePathConfigKey = 'ide-svelte.nodePath'

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

  activate() {
    this._suppressSvelteConfigDiagnostic = false
    this._isDeactivating = false
    super.activate()
    this._restartIfNodePathChange()
  }

  _restartIfNodePathChange() {
    this._disposable.add(
      atom.config.onDidChange(
        nodePathConfigKey,
        debounce(1000, () => {
          if (!atom.packages.isPackageActive('ide-svelte')) return
          if (this._restarting) return

          this._restarting = true

          this.logger.debug(`restarting ide-svelte to apply new Node path`)

          Promise.resolve()
            .then(() => {
              if (!this._isDeactivating) {
                return this.deactivate()
              }
            })
            .catch((err) => {
              console.error(
                'Error while restarting ide-svelte to apply new Node path',
                err,
              )
            })
            .finally(() => {
              this._restarting = false
              this.activate()
            })
        }),
      ),
    )
  }

  // NOTE spawning real Node process to work around dynamic import / ESM
  // issues with Electron's Node
  async _startServerWithNode(nodePath) {
    const args = [languageServerPath]

    this.logger.debug(`starting Node process "${args.join(' ')}"`)

    const child = cp.spawn(nodePath, args, {
      env: Object.create(process.env), // hopefully node in in PATH
      stdio: [null, null, null, 'ipc'],
    })

    // ensure we don't crash immediately (eg. because missing/incorrect Node)
    return new Promise((resolve, reject) => {
      child.on('error', reject)
      setTimeout(() => {
        child.off('error', reject)
        resolve(child)
      }, 500)
    })
  }

  async startServerProcess() {
    try {
      const nodePath = atom.config.get(nodePathConfigKey)
      if (nodePath) {
        const lsProcess = await this._startServerWithNode(nodePath)

        if (this._restarting) {
          atom.notifications.addSuccess(
            `Svelte Language Server sucessfully restarted with ${nodePath}`,
          )
        }

        return lsProcess
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

    // fallback
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
