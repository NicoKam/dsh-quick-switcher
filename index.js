/**
 * Host half of the quick switcher.
 *
 * All behavior lives in the Client half: workspace snapshots, the model
 * directory, shortcut registration and the picker overlay are browser-side
 * services. The Host row exists so the bundle has an installable entry and so
 * the Client artifact is served with the package.
 */
export function apply() {}
