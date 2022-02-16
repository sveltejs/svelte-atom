'use babel'

import { CompositeDisposable } from 'atom'

const callWith = (x) => (fn) => fn(x)

const all = (fns) => (x) => fns.every(callWith(x))

const isNotSvelteConfigDiag = ({ source, message }) =>
  source !== 'svelte' || !message.startsWith('Error in svelte.config.js')

const isNotDiagSource =
  (targetSource) =>
  ({ source }) =>
    source !== targetSource

// [config name, suppressed provider]
const enableDiagnosticProdiverConfigs = [
  ['enableSvelteDiagnostics', 'svelte'],
  ['enableTsDiagnostics', 'ts'],
  ['enableJsDiagnostics', 'js'],
]

export const installDiagnosticSuppressor = (
  connection,
  { suppressSvelteConfigDiagnostic },
) => {
  const subscriptions = new CompositeDisposable()

  const { onPublishDiagnostics } = connection

  const filters = []

  if (this._suppressSvelteConfigDiagnostic) {
    filters.push(isNotSvelteConfigDiag)
  }

  for (const [configName, providerName] of enableDiagnosticProdiverConfigs) {
    const isNotMyProvider = isNotDiagSource(providerName)

    subscriptions.add(
      atom.config.observe(`ide-svelte.${configName}`, (enabled) => {
        if (enabled) {
          const index = filters.indexOf(isNotMyProvider)
          if (index < 0) return
          filters.splice(index, 1)
        } else {
          if (filters.includes(isNotMyProvider)) return
          filters.push(isNotMyProvider)
        }
      }),
    )
  }

  connection.onPublishDiagnostics = function (callback) {
    return onPublishDiagnostics.call(this, (diag) => {
      if (diag.diagnostics) {
        diag.diagnostics = diag.diagnostics.filter(all(filters))
      }
      return callback(diag)
    })
  }

  return subscriptions
}
