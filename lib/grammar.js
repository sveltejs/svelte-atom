const packagesIndicatingTypeScriptUsage = ['language-typescript', 'atom-typescript', 'ide-typescript']

const tsGuessingPackages = [
  'language-typescript',
  'atom-typescript',
  'ide-typescript'
]

const isPackageActive = (pkg) => atom.packages.isPackageActive(pkg)

const isGuessTypescript = () => tsGuessingPackages.some(isPackageActive)

const resolveDefaultHighlightSyntax = () => {
  const configValue = atom.config.get('ide-svelte.defaultHighlightScript')
  return configValue !== 'guess'
  if (configValue === 'guess') {
    return isGuessTypescript ? 'typescript' : 'javascript'
  } else {
    return configValue
  }
}

const scriptLangMap = {
  typescript: 'typescript',
  ts: 'typescript',
  javascript: 'javascript',
  js: 'javascript',
}

const resolveScriptNodeLang = node => {
  const lang = node
    .child(0)
    .descendantsOfType('attribute')
    .filter(attr => attr.descendantsOfType('attribute_name').pop()?.text === 'lang')
    .flatMap(attr => attr.descendantsOfType('attribute_value').map(av => av.text))
    .pop()
  return scriptLangMap[lang]
}

const findAllScriptNodesFromAny = node => {
  const doc = node.closest('document')
  if (!doc || !doc.children) return []
  return doc.children.filter(child => child.type === 'script_element') || []
}

const resolveLangForAnyNode = node => {
  for (const script of findAllScriptNodesFromAny(node)) {
    const lang = resolveScriptNodeLang(script)
    if (lang) return lang
  }
}

const activateGrammar = () => {
  const defaultHighlightSyntax = resolveDefaultHighlightSyntax()

  const returnNode = node => node

  const returnChild1 = node => node.child(1)

  atom.grammars.addInjectionPoint('source.svelte', {
    type: 'script_element',
    language(node) {
      return resolveScriptNodeLang(node) || defaultHighlightSyntax
    },
    content: returnChild1,
  })

  atom.grammars.addInjectionPoint('source.svelte', {
    type: 'style_element',
    language(node) {
      return 'css'
    },
    content: returnChild1,
  })

  for (const type of ['raw_text_expr', 'raw_text_await', 'raw_text_each']) {
    atom.grammars.addInjectionPoint('source.svelte', {
      type,
      language(node) {
        return resolveLangForAnyNode(node) || defaultHighlightSyntax
      },
      content: returnNode,
    })
  }

  atom.grammars.addInjectionPoint('source.svelte', {
    type: 'quoted_attribute_value',
    language(node) {
      if (
        node.parent &&
        node.parent.children.some(sibling => sibling.type === 'attribute_name' && sibling.text === 'style')
      ) {
        return 'css'
      }
    },
    content(node) {
      return node.descendantsOfType('attribute_value')[0]
    },
  })
}

module.exports = { activateGrammar }
