import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
const client = readFileSync(new URL('./client.js', import.meta.url), 'utf8');
const code = client.slice(client.indexOf('function createRecentSessions('), client.indexOf('    function apply(ctx) {'));
const row = (id, blank = false) => ({ id, title: id, blank, updatedAt: 100 });
function setup(rows, active, history = [], members = rows.map((r) => r.id)) {
  let snapshot;
  let workspace = { items: [{ title: 'Workspace', sessionIds: members }], archivedSessionIds: [] };
  const listeners = new Set();
  const workspaceListeners = new Set();
  const preferenceListeners = new Set();
  let preferences = { recentLimit:12 };
  const events = new Map();
  const storage = new Map([['dsh.quick-switcher.recent-sessions.v1', JSON.stringify(history)]]);
  const update = (next, current, notify = true) => {
    snapshot = { ids: next.map((r) => r.id), byId: Object.fromEntries(next.map((r) => [r.id, { ...r, retainedBy: { mainView: r.id === current ? 1 : 0 } }])) };
    if (notify) for (const fn of listeners) fn();
  };
  update(rows, active, false);
  const context = vm.createContext({ window: {
    localStorage: { getItem: (key) => storage.get(key), setItem: (key, value) => storage.set(key, value) },
    addEventListener: (name, fn) => events.set(name, fn), removeEventListener: (name) => events.delete(name),
  } });
  vm.runInContext(code + '\nglobalThis.create = createRecentSessions;', context);
  const opened = [];
  const subscribe = (set) => (fn) => { set.add(fn); return () => set.delete(fn); };
  const controller = context.create({
    sessions: { list: { getSnapshot: () => snapshot, subscribe: subscribe(listeners) } },
    workspaces: { list: { getSnapshot: () => workspace, subscribe: subscribe(workspaceListeners) } },
    uiWorkspace: { openSession: (id) => opened.push(id) }, layout: { selectPanel: () => {} },
  }, (key) => key, undefined, { getSnapshot: () => preferences, subscribe: subscribe(preferenceListeners) });
  const key = (name, type = 'keydown', extra = {}) => events.get(type)?.({ key: name, preventDefault() {}, stopPropagation() {}, ...extra });
  return { controller, update, opened, key,
    days(value) { preferences = { ...preferences, recentDays:value }; for (const fn of preferenceListeners) fn(); },
    limit(value) { preferences = { ...preferences, recentLimit:value }; for (const fn of preferenceListeners) fn(); },
    ids: () => Array.from(controller.source.getSnapshot().rows, (r) => r.id),
    selected: () => controller.source.getSnapshot().rows[controller.source.getSnapshot().index]?.id,
    workspace(next) { workspace = next; for (const fn of workspaceListeners) fn(); },
  };
}

test('current blank first even outside workspace; old MRU blanks filtered', () => {
  const app = setup([row('blank', true), row('old1', true), row('old2', true), row('a'), row('b')], 'blank', ['old1', 'old2', 'b', 'a'], ['a', 'b', 'old1', 'old2']);
  app.controller.open();
  assert.deepEqual(app.ids(), ['blank', 'b', 'a']);
  assert.equal(app.selected(), 'b');
});

test('build does not require current blank in stored MRU after silent main-view change', () => {
  const rows = [row('blank', true), row('a'), row('b')];
  const app = setup(rows, 'a', ['a', 'b']);
  app.update(rows, 'blank', false);
  app.controller.open();
  assert.deepEqual(app.ids(), ['blank', 'a', 'b']);
});

test('leaving blank removes row immediately and keeps selected id after sync', () => {
  const rows = [row('blank', true), row('a'), row('b')];
  const app = setup(rows, 'blank', ['blank', 'a', 'b']);
  app.controller.open(); app.controller.focusRow(2);
  app.update(rows, 'a');
  assert.deepEqual(app.ids(), ['a', 'b']); assert.equal(app.selected(), 'b');
  app.controller.choose('blank'); assert.deepEqual(app.opened, []);
});

test('stale mouse and Control-release activation cannot reopen non-current blank', () => {
  const rows = [row('blank', true), row('a')];
  const app = setup(rows, 'blank', ['blank', 'a']);
  app.controller.open(); app.update(rows, 'a', false);
  app.controller.choose('blank'); assert.deepEqual(app.opened, []);
  const second = setup([row('a'), row('b')], 'a', ['a', 'b']);
  second.controller.open(); second.update([row('a'), row('b', true)], 'a', false);
  second.key('Control', 'keyup'); assert.deepEqual(second.opened, []);
});

test('ordinary MRU order and activation unaffected; metadata refresh keeps selected id', () => {
  const rows = [row('a'), row('b'), row('c')];
  const app = setup(rows, 'a', ['a', 'b', 'c']);
  app.controller.open(); assert.equal(app.selected(), 'b');
  app.update([row('a'), { ...row('b'), title: 'Renamed' }, row('c')], 'c');
  assert.deepEqual(app.ids(), ['c', 'a', 'b']); assert.equal(app.selected(), 'b');
  assert.equal(app.controller.source.getSnapshot().rows[2].title, 'Renamed');
  app.controller.choose('b'); assert.deepEqual(app.opened, ['b']);
});

test('Ctrl+Tab, reverse, arrows, Enter, Escape and blur gestures', () => {
  const app = setup([row('a'), row('b'), row('c')], 'a', ['a', 'b', 'c']);
  app.key('Tab'); assert.equal(app.controller.source.getSnapshot().open, false);
  app.key('Tab', 'keydown', { ctrlKey: true, shiftKey: true }); assert.equal(app.selected(), 'c');
  app.key('ArrowUp'); assert.equal(app.selected(), 'b');
  app.key('Enter'); assert.deepEqual(app.opened, ['b']);
  app.key('Tab', 'keydown', { ctrlKey: true }); app.key('Escape');
  assert.equal(app.controller.source.getSnapshot().open, false);
  app.controller.open(); app.key('unused', 'blur'); assert.equal(app.controller.source.getSnapshot().open, false);
});

test('held Ctrl+Up/Down moves highlight; only Ctrl release commits', () => {
  const app = setup([row('a'), row('b'), row('c')], 'a', ['a', 'b', 'c']);
  app.key('ArrowDown', 'keydown', { ctrlKey: true });
  assert.equal(app.controller.source.getSnapshot().open, false);
  app.key('Tab', 'keydown', { ctrlKey: true });
  assert.equal(app.selected(), 'b');
  app.key('ArrowDown', 'keydown', { ctrlKey: true });
  assert.equal(app.selected(), 'c');
  app.key('ArrowUp', 'keydown', { ctrlKey: true });
  assert.equal(app.selected(), 'b');
  app.key('ArrowUp', 'keyup', { ctrlKey: true });
  assert.deepEqual(app.opened, []);
  app.key('Control', 'keyup');
  assert.deepEqual(app.opened, ['b']);
});

test('workspace subscription removes archived rows; single eligible row does not open', () => {
  const app = setup([row('a'), row('b'), row('outside')], 'a', ['a', 'b', 'outside'], ['a', 'b']);
  app.controller.open(); assert.deepEqual(app.ids(), ['a', 'b']);
  app.workspace({ items: [{ sessionIds: ['a', 'b'] }], archivedSessionIds: ['b'] });
  assert.deepEqual(app.ids(), ['a']);
  app.controller.cancel(); assert.equal(app.controller.open(), false);
});

test('completion unread uses sidebar status hook, clears when read, running has precedence', () => {
  const React = { createElement: (...args) => ({ args }), useRef: () => ({ current: null }), useEffect() {} };
  const context = vm.createContext({ React });
  vm.runInContext(code + '\nglobalThis.renderRecent = RecentSessions;', context);
  let status = { running: false, completionUnread: true };
  const props = { useRecent: fn => fn({ open: true, rows: [{ id: 'b', title: 'Background task', running: false }], index: 0 }),
    useSessionStatus: fn => fn(new Map([['b', status]])), t: key => key };
  const dot = tree => {
    if (tree?.args?.[1]?.className === 'qsr-dot') return tree.args[1];
    for (const child of Array.isArray(tree) ? tree : tree?.args?.slice(2) || []) { const result = dot(child); if (result) return result; }
  };
  assert.equal(dot(context.renderRecent(props))['data-state'], 'unread');
  assert.equal(dot(context.renderRecent(props))['aria-label'], '已完成，未读');
  status = { running: false, completionUnread: false };
  assert.equal(dot(context.renderRecent(props))['data-state'], 'idle');
  status = { running: true, completionUnread: true };
  assert.equal(dot(context.renderRecent(props))['data-state'], 'running');
});

test('mouse choice wins over keyboard highlight; later Ctrl release does nothing', () => {
  const app = setup([row('a'), row('b'), row('c')], 'a', ['a', 'b', 'c']);
  app.key('Tab', 'keydown', { ctrlKey: true });
  assert.equal(app.selected(), 'b');
  app.controller.choose('c');
  assert.deepEqual(app.opened, ['c']);
  assert.equal(app.controller.source.getSnapshot().open, false);
  app.controller.choose('c'); // duplicate click/context-menu event
  app.key('Control', 'keyup');
  assert.deepEqual(app.opened, ['c']);
});

test('rendered row handles macOS Ctrl-mousedown and prevents context menu', () => {
  const app = setup([row('a'), row('b')], 'a', ['a', 'b']);
  app.controller.open();
  const React = { createElement: (...args) => ({ args }), useRef: () => ({ current: null }), useEffect() {} };
  const context = vm.createContext({ React });
  vm.runInContext(code + '\nglobalThis.renderRecent = RecentSessions;', context);
  const tree = context.renderRecent({ useRecent: fn => fn(app.controller.source.getSnapshot()),
    choose: app.controller.choose, focusRow: app.controller.focusRow, cancel: app.controller.cancel });
  const buttons = [];
  const walk = tree => {
    if (tree?.args?.[0] === 'button') buttons.push(tree.args[1]);
    for (const child of Array.isArray(tree) ? tree : tree?.args?.slice(2) || []) walk(child);
  };
  walk(tree);
  let prevented = 0;
  const event = { button: 2, ctrlKey: true, preventDefault() { prevented++; }, stopPropagation() {} };
  buttons[1].onMouseDown(event);
  buttons[1].onContextMenu(event);
  buttons[1].onClick(event);
  app.key('Control', 'keyup');
  assert.deepEqual(app.opened, ['b']);
  assert.equal(prevented, 3);
});

test('hover does not change keyboard selection; release commits keyboard target', () => {
  const app = setup([row('a'), row('b'), row('c')], 'a', ['a', 'b', 'c']);
  app.key('Tab', 'keydown', { ctrlKey: true });
  assert.equal(app.selected(), 'b');
  const React = { createElement: (...args) => ({ args }), useRef: () => ({ current: null }), useEffect() {} };
  const context = vm.createContext({ React });
  vm.runInContext(code + '\nglobalThis.renderRecent = RecentSessions;', context);
  const tree = context.renderRecent({ useRecent: fn => fn(app.controller.source.getSnapshot()),
    choose: app.controller.choose, focusRow: app.controller.focusRow, cancel: app.controller.cancel });
  const buttons = [];
  const walk = node => {
    if (node?.args?.[0] === 'button') buttons.push(node.args[1]);
    for (const child of Array.isArray(node) ? node : node?.args?.slice(2) || []) walk(child);
  };
  walk(tree);
  // A real pointer may enter an unselected row; no behavioral handler is allowed.
  buttons[2].onMouseEnter?.();
  buttons[2].onPointerEnter?.();
  assert.equal(app.selected(), 'b');
  assert.equal(buttons[1]['aria-selected'], true);
  assert.equal(buttons[2]['aria-selected'], false);
  app.key('Control', 'keyup');
  assert.deepEqual(app.opened, ['b']);
});

test('recent count changes update open list and allow expanding history', () => {
  const app = setup([row('a'),row('b'),row('c'),row('d')], 'a', ['a','b','c','d']);
  app.controller.open(); assert.equal(app.ids().length, 4);
  app.limit(2); assert.equal(app.ids().length, 2);
  app.limit(4); assert.equal(app.ids().length, 4);
});

test('dispose closes and removes subscriptions and key handlers', () => {
  const app = setup([row('a'), row('b')], 'a', ['a', 'b']);
  app.controller.open(); app.controller.dispose();
  app.update([row('a'), row('b')], 'b'); app.key('Tab', 'keydown', { ctrlKey: true });
  assert.equal(app.controller.source.getSnapshot().open, false);
});

test('last-modified cutoff includes recent rows, excludes old rows, keeps current blank, unlimited restores older rows', () => {
  const now = Date.now();
  const rows = [row('blank',true),{...row('recent'),updatedAt:now-2*86400000},{...row('old'),updatedAt:now-8*86400000}];
  const app = setup(rows,'blank',['blank','recent','old']);
  app.days(7);app.controller.open();assert.deepEqual(app.ids(),['blank','recent']);
  app.days(0);assert.deepEqual(app.ids(),['blank','recent','old']);
  app.days(1);assert.deepEqual(app.ids(),['blank']);
});
