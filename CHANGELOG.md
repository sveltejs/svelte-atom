# Atom IDE Svelte changelog

## next

- Change embed grammar to TS in every case because it has less issues (fixes [#18](https://github.com/sveltejs/svelte-atom/issues/18))

## v1.1.0

- Add options to enable diagnostics by source (ts: true, svelte: true, js: false), fixes [#6](https://github.com/sveltejs/svelte-atom/issues/6)
- Changing Node executable doesn't require to restart Atom anymore
- Fixed detection of external Node failure and fallback on internal Electron's Node

## v1.0.0

- Upgrade language server ([#10](https://github.com/sveltejs/svelte-atom/pull/10))
- Replace legacy grammar with up to date one copied from the VSCode extension ([#15](https://github.com/sveltejs/svelte-atom/pull/15), fixes [#8](https://github.com/sveltejs/svelte-atom/issues/8))
