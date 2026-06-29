// Application environment configuration.
//
// `primeNgLicense` holds the PrimeUI Community license token required by
// PrimeNG 22+. It is intentionally committed EMPTY: the token does ship in the
// client bundle (so it is not a true secret), but this is a public repository,
// so the personal key is kept out of version control as hygiene.
//
// To use your key locally WITHOUT committing it:
//   1. Paste your token into `primeNgLicense` below.
//   2. Tell git to ignore your local edit to this file:
//        git update-index --skip-worktree frontend/src/environments/environment.ts
//      (Undo later with: git update-index --no-skip-worktree frontend/src/environments/environment.ts)
export const environment = {
  primeNgLicense: '',
};
