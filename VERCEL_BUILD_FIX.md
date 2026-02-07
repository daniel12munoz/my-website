# Vercel build warnings – fix steps

## 1. Browserslist DB (run locally, then commit)

```bash
npm run update-browserslist
```

This runs `npx update-browserslist-db@latest` and updates `package-lock.json`.  
**Commit the updated `package-lock.json`** so Vercel uses the same lockfile.

## 2. Apply overrides (if lockfile not already updated)

```bash
npm install
```

The `overrides` in `package.json` force a newer `caniuse-lite` for the whole tree.  
If `package-lock.json` changes, commit it.

## 3. Node deprecation warning (fs.F_OK)

- **react-scripts** is pinned at **5.0.1** (latest CRA 5). Upgrading would require leaving Create React App.
- The warning usually comes from a transitive dependency (e.g. inside webpack/workbox). It does not fail the build.
- To reduce or hide it on Vercel you can pin the Node version (e.g. Node 20 LTS) in Project Settings → General → Node.js Version, or add an `engines` field in `package.json` (e.g. `"node": "20.x"`).

## 4. Verify build

```bash
npm run build
```

Confirm the build completes and the app behavior is unchanged.
