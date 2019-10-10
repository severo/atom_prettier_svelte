# Why is prettier-atom so slow on large .svelte files?

Install the npm packages

```bash
yarn
```

Install [Atom](https://atom.io/) and
[Prettier for Atom](https://atom.io/packages/prettier-atom).

Open each of the [src/](./src/) files in Atom, and try to save them:

- [block.js](./src/block.js) - instantaneous
- [Short.svelte](./src/Short.svelte) - quick
- [Long.svelte](./src/Large.svelte) - very slow (~30s on my machine)

Note that the CLI is instantaneous:

```
npx prettier --write src/*
```
