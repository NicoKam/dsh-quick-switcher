window.__ModuleLoader__.load({
  id: '@local/dsh-quick-switcher',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    const NS = 'dsh-quick-switcher';
    const WORKSPACE_COMMAND = 'session.workspacePick';
    const MODEL_COMMAND = 'session.modelPick';
    const CLAIM_KEY = 'dsh.quick-switcher.claimed.v1';

    const DICT = {
      en: {
        'settings.group.general': 'General',
        'settings.group.workspace': 'Workspace selector',
        'settings.group.model': 'Model selector',
        'settings.group.recent': 'Recent conversation switcher',
        'settings.recentDays': 'Last modified within',
        'settings.recentDaysDescription': 'Filter by last modification time; always keep the current conversation.',
        'settings.days.1': '1 days',
        'settings.days.3': '3 days',
        'settings.days.7': '7 days',
        'settings.days.14': '14 days',
        'settings.days.30': '30 days',
        'settings.days.90': '90 days',
        'settings.days.0': 'Unlimited',
        'settings.title': 'Quick switcher',
        'settings.description': 'Changes apply immediately and are saved on this device.',
        'settings.recentLimit': 'Recent conversations',
        'settings.recentLimitDescription': 'Maximum number of conversations in the switcher (2–50).',
        'settings.providerLayout': 'Model provider filter',
        'settings.providerLayoutDescription': 'Show provider filters beside the model list.',
        'settings.workspaceFocusComposer': 'Focus composer after project selection',
        'settings.workspaceFocusComposerDescription': 'Focus the input after the selected workspace conversation opens.',
        'settings.focusComposer': 'Focus composer after model selection',
        'settings.focusComposerDescription': 'Return to the current conversation input after a successful selection.',
        'settings.animations': 'Animations',
        'settings.animationsDescription': 'Animate all three selectors and the running-session indicator.',
        'settings.layout.auto': 'Automatic',
        'settings.layout.always': 'Always show',
        'settings.layout.hidden': 'Hide',
        'settings.limitError': 'Enter an integer from 2 to 50.',
        'settings.readError': 'Preferences could not be read. Existing data has not been overwritten.',
        'settings.saveError': 'Could not save. The previous setting remains active.',
        'title.workspace': 'Choose workspace',
        'recent.title': 'Recent conversations',
        'recent.untitled': 'New conversation',
        'recent.current': 'Current',
        'recent.running': 'Running',
        'recent.unread': 'Completed, unread',
        'recent.idle': 'Idle',
        'recent.footer': 'Tab next · Shift+Tab previous · release Ctrl to switch · Esc cancel',
        'title.model': 'Switch model',
        'provider.all': 'All providers',
        'provider.title': 'Providers',
        'footer.columns': '← providers · → models',
        'hint.workspace': 'New sessions only',
        'hint.model': 'This session',
        'search.workspace': 'Search workspaces…',
        'search.model': 'Search models…',
        'empty.workspace': 'No workspaces yet. Add one from the sidebar first.',
        'empty.model': 'No available models.',
        'loading': 'Loading…',
        'selecting': 'Switching…',
        'unnamedWorkspace': 'Untitled workspace',
        'footer.move': '↑↓ move',
        'footer.confirm': 'Enter select',
        'footer.close': 'Esc close',
        'shortcut.workspace': 'Choose workspace',
        'shortcut.model': 'Switch model',
        'blocked.notNewSession': 'The workspace picker is only available on a new-session screen.',
        'blocked.noSession': 'Choose a workspace first.',
        'blocked.subagent': 'Model switching is unavailable in subagent sessions.',
        'blocked.panel': 'Return to the conversation first.',
        'blocked.loading': 'The interface is still loading. Try again in a moment.',
        'blocked.noModels': 'Model selection is unavailable in this profile.',
        'error.loadModels': 'Could not load the model list.',
        'error.selectModel': 'Could not switch the model.',
        'error.openWorkspace': 'Could not open that workspace.',
      },
      zh: {
        'settings.group.general': '通用',
        'settings.group.workspace': '工作区选择器',
        'settings.group.model': '模型选择器',
        'settings.group.recent': '最近会话切换器',
        'settings.recentDays': '最近修改时间',
        'settings.recentDaysDescription': '只显示此时间范围内修改过的会话；当前打开的会话始终保留。',
        'settings.days.1': '1 天内',
        'settings.days.3': '3 天内',
        'settings.days.7': '7 天内',
        'settings.days.14': '14 天内',
        'settings.days.30': '30 天内',
        'settings.days.90': '90 天内',
        'settings.days.0': '不限制',
        'settings.title': '快捷切换器',
        'settings.description': '修改后立即生效，并保存在当前设备上。',
        'settings.recentLimit': '最近会话数量',
        'settings.recentLimitDescription': '切换列表最多显示的会话数（2–50）。',
        'settings.providerLayout': '模型提供方筛选栏',
        'settings.providerLayoutDescription': '在模型列表左侧显示 Provider 筛选栏。',
        'settings.workspaceFocusComposer': '选择项目后聚焦输入框',
        'settings.workspaceFocusComposerDescription': '项目会话打开成功后，自动聚焦输入框。',
        'settings.focusComposer': '选择模型后聚焦输入框',
        'settings.focusComposerDescription': '成功选择模型后，回到当前会话输入框。',
        'settings.animations': '动画',
        'settings.animationsDescription': '统一控制三个选择器的弹出动画和运行中会话的 loading 动画。',
        'settings.layout.auto': '自动',
        'settings.layout.always': '始终显示',
        'settings.layout.hidden': '隐藏',
        'settings.limitError': '请输入 2–50 的整数。',
        'settings.readError': '无法读取设置，原有数据未被覆盖。',
        'settings.saveError': '保存失败，仍使用修改前的设置。',
        'title.workspace': '选择工作区',
        'recent.title': '最近会话',
        'recent.untitled': '新会话',
        'recent.current': '当前',
        'recent.running': '运行中',
        'recent.unread': '已完成，未读',
        'recent.idle': '空闲',
        'recent.footer': 'Tab 下一个 · Shift+Tab 上一个 · 松开 Ctrl 切换 · Esc 取消',
        'title.model': '切换模型',
        'provider.all': '全部 Provider',
        'provider.title': 'Provider',
        'footer.columns': '← Provider · → 模型',
        'hint.workspace': '仅新会话可用',
        'hint.model': '当前会话',
        'search.workspace': '搜索工作区…',
        'search.model': '搜索模型…',
        'empty.workspace': '还没有工作区，请先在侧边栏添加一个。',
        'empty.model': '没有可用的模型。',
        'loading': '正在加载…',
        'selecting': '正在切换…',
        'unnamedWorkspace': '未命名工作区',
        'footer.move': '↑↓ 选择',
        'footer.confirm': 'Enter 确认',
        'footer.close': 'Esc 关闭',
        'shortcut.workspace': '选择工作区',
        'shortcut.model': '切换模型',
        'blocked.notNewSession': '工作区选择器只在新会话页面可用。',
        'blocked.noSession': '请先选择一个工作区。',
        'blocked.subagent': '子会话不支持切换模型。',
        'blocked.panel': '请先回到会话页面。',
        'blocked.loading': '界面还在加载，请稍后再试。',
        'blocked.noModels': '当前配置无法切换模型。',
        'error.loadModels': '无法加载模型列表。',
        'error.selectModel': '切换模型失败。',
        'error.openWorkspace': '无法打开该工作区。',
      },
    };

    const CSS = `
.dqs-scrim{position:absolute;inset:0;z-index:1200;pointer-events:auto;display:flex;align-items:flex-start;justify-content:center;padding:11vh 16px 24px;background:rgb(0 0 0 / .2);animation:dqs-fade .1s ease-out}
.dqs-card{box-sizing:border-box;display:flex;flex-direction:column;width:540px;max-width:100%;max-height:min(580px,76vh);border-radius:14px;border:.5px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-overlay);color:var(--dsw-alias-label-primary);font-family:inherit;overflow:hidden;box-shadow:0 24px 60px rgb(0 0 0 / .3),0 2px 8px rgb(0 0 0 / .16);animation:dqs-rise .12s ease-out}
.dqs-head{display:flex;align-items:baseline;gap:8px;flex:none;padding:13px 15px 9px}
.dqs-title{font-size:13px;line-height:18px;font-weight:600}
.dqs-hint{margin-left:auto;font-size:11px;line-height:16px;color:var(--dsw-alias-label-secondary);white-space:nowrap}
.dqs-search{flex:none;display:flex;align-items:center;gap:8px;height:34px;margin:0 12px 8px;padding:0 10px;border-radius:9px;background:var(--dsw-alias-bg-layer-2);border:.5px solid transparent}
.dqs-search:focus-within{border-color:var(--dsw-alias-brand-primary)}
.dqs-search input{flex:1;min-width:0;border:0;outline:0;background:transparent;color:inherit;font:inherit;font-size:13px;line-height:18px}
.dqs-search input::placeholder{color:var(--dsw-alias-label-secondary)}
.dqs-list{flex:1;min-height:0;overflow-y:auto;padding:2px 8px 8px;scrollbar-gutter:stable}
.dqs-row{display:flex;align-items:center;gap:10px;min-height:44px;padding:6px 10px;border-radius:9px;cursor:pointer;user-select:none}
.dqs-row[data-active="true"]{background:var(--dsw-alias-bg-layer-2)}
.dqs-copy{display:flex;flex-direction:column;gap:1px;flex:1;min-width:0}
.dqs-row-title{font-size:13.5px;line-height:19px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dqs-row-meta{font-size:11px;line-height:16px;color:var(--dsw-alias-label-secondary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dqs-check{flex:none;width:16px;height:16px;display:grid;place-items:center;color:var(--dsw-alias-brand-primary)}
.dqs-check svg{width:15px;height:15px}
.dqs-badge{flex:none;font-size:10px;line-height:16px;padding:0 6px;border-radius:999px;border:.5px solid var(--dsw-alias-border-l1);color:var(--dsw-alias-label-secondary)}
.dqs-empty{padding:16px 8px;font-size:12px;line-height:18px;color:var(--dsw-alias-label-secondary)}
.dqs-error{margin:0 12px 8px;padding:7px 9px;border-radius:8px;font-size:11px;line-height:16px;color:var(--dsw-alias-state-error-primary);background:var(--dsw-alias-bg-layer-2)}
.dqs-foot{flex:none;display:flex;gap:14px;padding:8px 15px 9px;border-top:.5px solid var(--dsw-alias-border-l1);font-size:11px;line-height:16px;color:var(--dsw-alias-label-secondary)}
.dqs-card[data-dual="true"]{width:740px}
.dqs-columns{display:flex;flex:1;min-height:0;overflow:hidden}
.dqs-providers{flex:0 0 180px;min-width:0;overflow-y:auto;padding:2px 8px 8px;border-right:.5px solid var(--dsw-alias-border-l1)}
.dqs-provider{display:flex;align-items:center;gap:8px;padding:10px 8px;border-radius:8px;cursor:pointer;font-size:12px;line-height:18px}
.dqs-provider[data-selected="true"]{background:var(--dsw-alias-bg-layer-2)}
.dqs-provider[data-active="true"]{box-shadow:inset 0 0 0 1px var(--dsw-alias-brand-primary)}
.dqs-provider-name{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis}
.dqs-count{color:var(--dsw-alias-label-secondary);font-size:11px}
@media(max-width:520px){.dqs-providers{flex-basis:120px}.dqs-foot{gap:8px;flex-wrap:wrap}}
.dqs-card[data-busy="true"] .dqs-list{opacity:.55;pointer-events:none}

.dqs-scrim[data-animations="false"],.dqs-card[data-animations="false"],.dqs-card[data-animations="false"] .qsr-spinner{animation:none!important}
.dqs-settings{max-width:760px;color:var(--dsw-alias-label-primary)}
.dqs-settings h2{font-size:16px;line-height:24px;margin:0 0 8px;font-weight:600}
.dqs-setting-group{margin:24px 0 0;padding:0;border:0}
.dqs-setting-group + .dqs-setting-group{margin-top:28px;padding-top:24px;border-top:1px solid var(--dsw-alias-border-l2)}
.dqs-setting-group h3{margin:0 0 4px;padding:0;font-size:14px;line-height:22px;font-weight:600;color:var(--dsw-alias-label-primary)}
.dqs-setting-group > .dqs-setting-row:last-child{border-bottom:0}
.dqs-setting-row{display:flex;align-items:center;justify-content:space-between;gap:24px;padding:18px 0;border-bottom:.5px solid var(--dsw-alias-border-l1)}
.dqs-setting-copy{flex:1;min-width:0}
.dqs-setting-label{display:block;font-size:14px;line-height:22px}
.dqs-setting-description{font-size:12px;line-height:18px;color:var(--dsw-alias-label-secondary);margin:4px 0 0}
.dqs-setting-input{box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;padding:8px 10px;font:inherit;font-size:13px;color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-1);max-width:180px}
.dqs-limit-control input{width:90px}.dqs-setting-input:focus-visible,.dqs-toggle:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:2px}
.dqs-toggle{position:relative;width:36px;height:22px;flex:0 0 36px;border:0;border-radius:11px;padding:3px;cursor:pointer;background:var(--dsw-alias-border-l2)}
.dqs-toggle span{display:block;width:16px;height:16px;border-radius:50%;background:var(--dsw-alias-bg-base)}
.dqs-toggle[aria-checked="true"]{background:var(--dsw-alias-brand-primary)}.dqs-toggle[aria-checked="true"] span{transform:translateX(14px)}
.dqs-toggle:disabled,.dqs-setting-input:disabled{opacity:.5;cursor:not-allowed}
.dqs-setting-error{font-size:12px;color:var(--dsw-alias-state-error-primary);margin:8px 0}

@keyframes dqs-fade{from{opacity:0}to{opacity:1}}
@keyframes dqs-rise{from{transform:translateY(-4px) scale(.995)}to{transform:none}}
@media (prefers-reduced-motion:reduce){.dqs-scrim,.dqs-card{animation:none}}
`;

    function createStore(initial) {
      let state = initial;
      const listeners = new Set();
      return {
        getSnapshot: () => state,
        subscribe(listener) {
          listeners.add(listener);
          return () => { listeners.delete(listener); };
        },
        set(next) {
          state = next;
          for (const listener of Array.from(listeners)) listener();
        },
      };
    }

    const PREFERENCE_DEFAULTS = Object.freeze({ recentLimit: 12, recentDays: 7, providerLayout: 'auto', focusComposer: true, workspaceFocusComposer: true, animations: true });
    function normalizePreferences(value) {
      return {
        recentLimit: Number.isInteger(value?.recentLimit) && value.recentLimit >= 2 && value.recentLimit <= 50 ? value.recentLimit : 12,
        providerLayout: ['auto', 'always', 'hidden'].includes(value?.providerLayout) ? value.providerLayout : 'auto',
        focusComposer: typeof value?.focusComposer === 'boolean' ? value.focusComposer : true,
        workspaceFocusComposer: typeof value?.workspaceFocusComposer === 'boolean' ? value.workspaceFocusComposer : true,
        recentDays: [0,1,3,7,14,30,90].includes(value?.recentDays) ? value.recentDays : 7,
        // Any previously disabled group migrates to disabled unless an explicit unified value exists.
        animations: typeof value?.animations === 'boolean' ? value.animations
          : !['workspaceAnimations', 'modelAnimations', 'recentAnimations'].some(key => value?.[key] === false),
      };
    }
    function createPreferences() {
      const key = 'dsh.quick-switcher.preferences.v1';
      let error = null;
      let initial = PREFERENCE_DEFAULTS;
      let writable = true;
      try {
        const raw = window.localStorage.getItem(key);
        if (raw) {
          const doc = JSON.parse(raw);
          if (doc.version !== 1 || !doc.values || typeof doc.values !== 'object') throw new Error('Unsupported preferences');
          initial = normalizePreferences(doc.values);
        }
      } catch { error = 'settings.readError'; writable = false; }
      const store = createStore({ ...initial, error, writable });
      const update = (field, value) => {
        const current = store.getSnapshot();
        if (!current.writable || !Object.hasOwn(PREFERENCE_DEFAULTS, field)) return false;
        if (field === 'recentLimit' && (!Number.isInteger(value) || value < 2 || value > 50)) return false;
        if (field === 'recentDays' && ![0,1,3,7,14,30,90].includes(value)) return false;
        if (field === 'providerLayout' && !['auto', 'always', 'hidden'].includes(value)) return false;
        if (['focusComposer', 'workspaceFocusComposer', 'animations'].includes(field) && typeof value !== 'boolean') return false;
        const next = normalizePreferences({ ...current, [field]: value });
        try {
          window.localStorage.setItem(key, JSON.stringify({ version: 1, values: next }));
          store.set({ ...next, writable: true, error: null });
          return true;
        } catch {
          store.set({ ...current, error: 'settings.saveError' });
          return false;
        }
      };
      const onStorage = event => {
        if (event.key !== key) return;
        try {
          const doc = event.newValue ? JSON.parse(event.newValue) : { version: 1, values: PREFERENCE_DEFAULTS };
          if (doc.version !== 1 || !doc.values || typeof doc.values !== 'object') throw new Error('Unsupported preferences');
          store.set({ ...normalizePreferences(doc.values), writable: true, error: null });
        } catch { store.set({ ...store.getSnapshot(), writable: false, error: 'settings.readError' }); }
      };
      window.addEventListener('storage', onStorage);
      return { store, update, dispose: () => window.removeEventListener('storage', onStorage) };
    }

    function SwitcherSettings(props) {
      const preferences = props.usePreferences(value => value);
      const { t, updatePreference } = props;
      const [limitDraft, setLimitDraft] = React.useState(String(preferences.recentLimit));
      const [invalid, setInvalid] = React.useState(false);
      React.useEffect(() => { setLimitDraft(String(preferences.recentLimit)); }, [preferences.recentLimit]);
      const saveLimit = () => {
        const number = Number(limitDraft);
        if (!Number.isInteger(number) || number < 2 || number > 50) { setInvalid(true); return; }
        setInvalid(false); updatePreference('recentLimit', number);
      };
      const row = (id, control) => h('div', { className: 'dqs-setting-row', key: id },
        h('div', { className: 'dqs-setting-copy' },
          h('label', { htmlFor: `dqs-setting-${id}`, className: 'dqs-setting-label' }, t(`settings.${id}`)),
          h('div', { className: 'dqs-setting-description' }, t(`settings.${id}Description`))), control);
      const toggle = id => h('button', { id: `dqs-setting-${id}`, type: 'button', role: 'switch',
        'aria-checked': preferences[id], 'aria-label': t(`settings.${id}`), className: 'dqs-toggle',
        disabled: !preferences.writable, onClick: () => updatePreference(id, !preferences[id]) }, h('span', null));
      const group = (id, ...children) => h('section', { className: 'dqs-setting-group', 'aria-labelledby': `dqs-group-${id}` },
        h('h3', { id: `dqs-group-${id}` }, t(`settings.group.${id}`)), ...children);
      return h('section', { className: 'dqs-settings' },
        h('h2', null, t('settings.title')), h('p', { className: 'dqs-setting-description' }, t('settings.description')),
        group('general', row('animations', toggle('animations'))),
        group('workspace', row('workspaceFocusComposer', toggle('workspaceFocusComposer'))),
        group('model',
          row('providerLayout', h('select', { id: 'dqs-setting-providerLayout', value: preferences.providerLayout,
            className: 'dqs-setting-input', disabled: !preferences.writable,
            onChange: event => updatePreference('providerLayout', event.currentTarget.value) },
            ['auto', 'always', 'hidden'].map(value => h('option', { key: value, value }, t(`settings.layout.${value}`))))),
          row('focusComposer', toggle('focusComposer'))),
        group('recent',
          row('recentLimit', h('div', { className: 'dqs-limit-control' }, h('input', {
            id: 'dqs-setting-recentLimit', type: 'number', min: 2, max: 50, step: 1, value: limitDraft,
            className: 'dqs-setting-input', disabled: !preferences.writable, 'aria-invalid': invalid,
            onChange: event => { setLimitDraft(event.currentTarget.value); setInvalid(false); }, onBlur: saveLimit,
            onKeyDown: event => { if (event.key === 'Enter') { event.preventDefault(); saveLimit(); } } }))),
          invalid ? h('div', { role: 'alert', className: 'dqs-setting-error' }, t('settings.limitError')) : null,
          row('recentDays', h('select', { id: 'dqs-setting-recentDays', value: preferences.recentDays,
            className: 'dqs-setting-input', disabled: !preferences.writable,
            onChange: event => updatePreference('recentDays', Number(event.currentTarget.value)) },
            [1,3,7,14,30,90,0].map(days => h('option', { key:days, value:days }, t(`settings.days.${days}`)))))),
        preferences.error ? h('div', { role: 'alert', className: 'dqs-setting-error' }, t(preferences.error)) : null);
    }

    const picker = createStore({
      open: false,
      kind: null,
      rows: [],
      status: 'idle',
      error: null,
      current: null,
    });

    const CHECK_ICON = h('svg', {
      viewBox: '0 0 16 16',
      fill: 'none',
      'aria-hidden': true,
    }, h('path', {
      d: 'M3 8.5l3.2 3.2L13 5',
      stroke: 'currentColor',
      strokeWidth: 1.8,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    }));

    const rowMatchers = new WeakMap();
    function matchesQuery(row, query) {
      let matchers = rowMatchers.get(row);
      if (!matchers) {
        // Candidate objects are stable across queries: segmentation/pinyin are reused, not recomputed per keystroke.
        const names = [row.title, row.providerName, row.provider, row.model]
          .filter(value => value != null).map(value => StringMatch.genChineseMatchFn(String(value)));
        const contents = [row.meta, row.path].filter(value => value != null)
          .map(value => StringMatch.genContentMatchFn(String(value)));
        matchers = [...names, ...contents];
        rowMatchers.set(row, matchers);
      }
      return matchers.some(match => match(query) !== null);
    }

    function providerChoices(rows, t) {
      const providers = new Map();
      for (const row of rows) {
        if (row.kind !== 'model') continue;
        const item = providers.get(row.provider);
        if (item) item.count += 1;
        else providers.set(row.provider, { id: row.provider, title: row.providerName || row.provider, count: 1 });
      }
      return [{ id: null, title: t('provider.all'), count: rows.length }, ...providers.values()];
    }

    function pickerRows(rows, query, providerId) {
      return rows.filter(row => (providerId === null || row.kind !== 'model' || row.provider === providerId)
        && matchesQuery(row, query));
    }

    function QuickSwitcher(props) {
      const state = props.usePicker(value => value);
      const { choose, cancel } = props;
      const preferences = typeof props.usePreferences === 'function' ? props.usePreferences(value => value) : PREFERENCE_DEFAULTS;
      const t = typeof props.t === 'function' ? props.t : key => key;
      const [query, setQuery] = React.useState('');
      const [index, setIndex] = React.useState(0);
      const [providerId, setProviderId] = React.useState(null);
      const [column, setColumn] = React.useState('models');
      const inputRef = React.useRef(null);
      const listRef = React.useRef(null);
      const providerRef = React.useRef(null);
      const positioned = React.useRef(false);
      const providers = React.useMemo(() => providerChoices(state.rows, t), [state.rows, t]);
      const dual = state.kind === 'model' && preferences.providerLayout !== 'hidden'
        && (preferences.providerLayout === 'always' || providers.length > 2);
      const rows = React.useMemo(() => pickerRows(state.rows, query, providerId), [state.rows, query, providerId]);
      const activeIndex = Math.min(index, Math.max(0, rows.length - 1));
      const providerIndex = Math.max(0, providers.findIndex(item => item.id === providerId));
      const animations = preferences.animations;
      const busy = state.status === 'selecting' || state.status === 'loading';

      React.useEffect(() => {
        if (!state.open) return;
        setQuery(''); setProviderId(null); setColumn('models'); setIndex(0);
        const previousFocus = document.activeElement;
        inputRef.current?.focus();
        return () => {
          if (previousFocus?.isConnected && typeof previousFocus.focus === 'function') previousFocus.focus();
        };
      }, [state.open, state.kind]);
      React.useEffect(() => {
        if (!state.open) { positioned.current = false; return; }
        if (positioned.current || state.status !== 'ready') return;
        positioned.current = true;
        // Clear filters from the previous opening before selecting the current model.
        setQuery(''); setProviderId(null); setColumn('models');
        const at = state.rows.findIndex(row => row.current);
        setIndex(at >= 0 ? at : 0);
      }, [state.open, state.status, state.rows]);
      React.useEffect(() => {
        if (!state.open && state.focusSessionId && preferences.focusComposer) props.focusComposer?.(state.focusSessionId);
      }, [state.open, state.focusSessionId, props.focusComposer]);

      React.useEffect(() => {
        if (!dual) { setProviderId(null); setColumn('models'); }
      }, [dual]);

      React.useEffect(() => {
        if (!state.open) return;
        const onKeyDown = event => {
          if (event.isComposing || event.keyCode === 229) return;
          const key = event.key;
          const consume = () => { event.preventDefault(); event.stopPropagation(); };
          if (key === 'Escape') { consume(); cancel(); return; }
          if (key === 'Tab') { consume(); if (dual) setColumn(value => value === 'models' ? 'providers' : 'models'); inputRef.current?.focus(); return; }
          if (dual && key === 'ArrowLeft') { consume(); setColumn('providers'); return; }
          if (dual && key === 'ArrowRight') { consume(); setColumn('models'); return; }
          if (key === 'ArrowDown' || key === 'ArrowUp') {
            consume();
            if (busy) return;
            const delta = key === 'ArrowDown' ? 1 : -1;
            if (dual && column === 'providers') {
              setProviderId(providers[(providerIndex + delta + providers.length) % providers.length].id);
              setIndex(0);
            } else if (rows.length) setIndex((activeIndex + delta + rows.length) % rows.length);
            return;
          }
          if (key === 'Enter') {
            consume();
            if (busy) return;
            if (dual && column === 'providers') { setColumn('models'); return; }
            if (rows[activeIndex]) choose(rows[activeIndex].key);
          }
        };
        window.addEventListener('keydown', onKeyDown, true);
        return () => window.removeEventListener('keydown', onKeyDown, true);
      }, [state.open, busy, dual, column, providers, providerIndex, rows, activeIndex, choose, cancel]);
      React.useEffect(() => {
        const node = column === 'providers' ? providerRef.current?.children[providerIndex] : listRef.current?.children[activeIndex];
        node?.scrollIntoView?.({ block: 'nearest' });
      }, [state.open, column, providerIndex, activeIndex, rows]);
      if (!state.open) return null;
      const title = t(state.kind === 'model' ? 'title.model' : 'title.workspace');
      const empty = t(state.status === 'loading' ? 'loading' : state.kind === 'model' ? 'empty.model' : 'empty.workspace');
      return h('div', { className: 'dqs-scrim', 'data-animations': animations, onMouseDown: event => { if (event.target === event.currentTarget) cancel(); } },
        h('div', { className: 'dqs-card', 'data-animations': animations, role: 'dialog', 'aria-modal': 'true', 'aria-label': title, 'data-dual': dual, 'data-busy': busy,
          onMouseDown: event => event.stopPropagation() },
          h('div', { className: 'dqs-head' }, h('div', { className: 'dqs-title' }, title),
            h('div', { className: 'dqs-hint' }, t(state.status === 'selecting' ? 'selecting' : state.kind === 'model' ? 'hint.model' : 'hint.workspace'))),
          h('div', { className: 'dqs-search' }, h('input', { ref: inputRef, type: 'text', value: query,
            placeholder: t(state.kind === 'model' ? 'search.model' : 'search.workspace'), autoComplete: 'off', spellCheck: false,
            role: 'combobox', 'aria-expanded': true, 'aria-controls': column === 'providers' ? 'dqs-providers' : 'dqs-models',
            'aria-activedescendant': column === 'providers' && dual ? `dqs-provider-${providerIndex}` : rows.length ? `dqs-model-${activeIndex}` : undefined,
            onChange: event => { setQuery(event.currentTarget.value); setIndex(0); setColumn('models'); } })),
          state.error !== null ? h('div', { className: 'dqs-error', role: 'alert' }, state.error) : null,
          h('div', { className: 'dqs-columns' },
            dual ? h('div', { className: 'dqs-providers', ref: providerRef, id: 'dqs-providers', role: 'listbox', 'aria-label': t('provider.title') },
              providers.map((item, at) => h('div', { key: item.id ?? 'all', id: `dqs-provider-${at}`, role: 'option',
                className: 'dqs-provider', 'aria-selected': at === providerIndex, 'data-selected': at === providerIndex,
                'data-active': at === providerIndex && column === 'providers', onMouseDown: event => event.preventDefault(),
                onClick: () => { if (!busy) { setProviderId(item.id); setIndex(0); setColumn('providers'); } } },
                h('span', { className: 'dqs-provider-name' }, item.title), h('span', { className: 'dqs-count' }, item.count)))) : null,
            h('div', { className: 'dqs-list', ref: listRef, id: 'dqs-models', role: 'listbox', 'aria-label': title },
              rows.length === 0 ? h('div', { className: 'dqs-empty' }, empty) : rows.map((row, at) => h('div', {
                key: row.key, id: `dqs-model-${at}`, role: 'option', 'aria-selected': at === activeIndex,
                'data-active': at === activeIndex && column === 'models', 'data-current': row.current, className: 'dqs-row',
                // Filtering may move a row under a stationary pointer; hover must not steal provider navigation.
                onMouseEnter: () => { if (column === 'models') setIndex(at); }, onMouseDown: event => event.preventDefault(),
                onClick: () => { if (!busy) choose(row.key); } },
                h('div', { className: 'dqs-copy' }, h('div', { className: 'dqs-row-title' }, row.title), h('div', { className: 'dqs-row-meta' }, row.meta)),
                row.current ? h('span', { className: 'dqs-check', 'aria-hidden': true }, CHECK_ICON) : null)))),
          h('div', { className: 'dqs-foot' }, h('span', null, t('footer.move')), dual ? h('span', null, t('footer.columns')) : null,
            h('span', null, t('footer.confirm')), h('span', null, t('footer.close')))));
    }

    function baseName(path) {
      if (typeof path !== 'string' || path === '') return '';
      const parts = path.replace(/[\\/]+$/, '').split(/[\\/]/);
      return parts[parts.length - 1] || path;
    }

// Plain-JavaScript helpers to embed inside the client factory (React in scope).
// No imports or dependencies on third-party workspace-category UI.
function createRecentSessions(ctx, t, onOpen, preferences) {
  const KEY = 'dsh.quick-switcher.recent-sessions.v1';
  const limit = () => preferences?.getSnapshot().recentLimit ?? 12;
  const sourceListeners = new Set();
  let state = { open: false, rows: [], index: 0, currentId: null };
  const source = {
    getSnapshot: () => state,
    subscribe(listener) { sourceListeners.add(listener); return () => sourceListeners.delete(listener); },
  };
  const publish = (next) => { state = next; for (const listener of sourceListeners) listener(); };
  let mru = [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(KEY) || '[]');
    if (Array.isArray(parsed)) mru = [...new Set(parsed.filter((id) => typeof id === 'string' && id))].slice(0, limit());
  } catch { /* Storage is optional. */ }
  const save = () => { try { window.localStorage.setItem(KEY, JSON.stringify(mru)); } catch { /* page-only history */ } };
  const touch = (id) => {
    if (!id) return;
    mru = [id, ...mru.filter((item) => item !== id)].slice(0, limit());
    save();
  };
  let sessions = null;
  try { sessions = ctx.sessions || ctx.get('sessions'); } catch { /* unavailable */ }
  const catalog = () => { try { return sessions.list.getSnapshot() || {}; } catch { return {}; } };
  const workspaceCatalog = () => { try { return ctx.workspaces.list.getSnapshot() || {}; } catch { return {}; } };
  const currentOf = (byId) => Object.keys(byId).find((id) => byId[id]?.retainedBy?.mainView > 0) || null;
  const tr = (key, fallback) => {
    try { const value = t(key); return typeof value === 'string' && value && value !== key ? value : fallback; }
    catch { return fallback; }
  };
  const withinRecentWindow = (summary, id, currentId) => {
    if (id === currentId) return true; // Keep the navigation anchor, including the current blank.
    const days = preferences?.getSnapshot().recentDays ?? 0;
    if (!days) return true;
    const updatedAt = summary?.updatedAt;
    return typeof updatedAt === 'number' && Number.isFinite(updatedAt)
      && updatedAt >= Date.now() - days * 86400000;
  };
  const build = () => {
    const snapshot = catalog();
    const byId = snapshot.byId || {};
    const currentId = currentOf(byId);
    const workspace = workspaceCatalog();
    const items = Array.isArray(workspace.items) ? workspace.items : [];
    const members = items.length ? new Set(items.flatMap((item) => item.sessionIds || [])) : null;
    const archived = new Set(workspace.archivedSessionIds || []);
    const currentBlank = currentId !== null && byId[currentId]?.blank === true;
    const ids = currentBlank ? [currentId, ...mru.filter((id) => id !== currentId)] : mru;
    const rows = [];
    for (const id of ids) {
      const summary = byId[id];
      if (!summary || archived.has(id) || (summary.blank === true && id !== currentId)) continue;
      if (!withinRecentWindow(summary, id, currentId)) continue;
      if (members && !members.has(id) && !(currentBlank && id === currentId)) continue;
      const owner = items.find((item) => (item.sessionIds || []).includes(id));
      rows.push({
        id,
        title: summary.title && String(summary.title).trim() ? summary.title : tr('recent.untitled', '新对话'),
        workspace: owner?.title || String(owner?.path || '').split(/[\\/]/).filter(Boolean).pop() || '',
        updatedAt: summary.updatedAt,
        running: summary.running === true,
      });
    }
    return { rows, currentId };
  };
  const cancel = () => {
    if (state.open) publish({ open: false, rows: [], index: 0, currentId: null });
  };
  const activate = (id) => {
    const byId = catalog().byId || {};
    const summary = byId[id];
    if (!summary || (summary.blank === true && id !== currentOf(byId))) return;
    // Also reject stale archived or workspace-detached ordinary targets.
    if (!build().rows.some((row) => row.id === id)) return;
    touch(id);
    try { ctx.layout.selectPanel(null); } catch { /* layout unavailable */ }
    try {
      const pending = ctx.uiWorkspace.openSession(id);
      if (pending && typeof pending.catch === 'function') pending.catch(() => {});
    } catch { /* navigation unavailable */ }
  };
  const choose = (id) => {
    if (!state.open || !state.rows.some((row) => row.id === id)) return;
    cancel();
    activate(id);
  };
  const commit = () => { if (state.open) { const id = state.rows[state.index]?.id; cancel(); if (id) activate(id); } };
  const focusRow = (index) => {
    if (state.open && Number.isInteger(index) && index >= 0 && index < state.rows.length && state.index !== index) {
      publish({ ...state, index });
    }
  };
  const move = (delta) => { if (state.rows.length) focusRow((state.index + delta + state.rows.length) % state.rows.length); };
  const open = (backwards = false) => {
    sync(); // Re-evaluate the rolling cutoff even if no status updates occurred.
    const { rows, currentId } = build();
    if (rows.length < 2) return false;
    const at = rows.findIndex((row) => row.id === currentId);
    const index = ((at < 0 ? 0 : at) + (backwards ? -1 : 1) + rows.length) % rows.length;
    publish({ open: true, rows, index, currentId });
    if (typeof onOpen === 'function') onOpen();
    return true;
  };
  let lastActive = null;
  const sync = () => {
    const snapshot = catalog();
    const byId = snapshot.byId || {};
    const active = currentOf(byId);
    if (active && active !== lastActive) touch(active);
    lastActive = active;
    // Prune ineligible history before filling slots, so abandoned blanks do not exhaust the cap.
    const validHistory = mru.filter(id => byId[id] && (byId[id].blank !== true || id === active)
      && withinRecentWindow(byId[id], id, active)).slice(0, limit());
    if (validHistory.length !== mru.length) { mru = validHistory; save(); }
    if (mru.length < limit()) {
      const workspace = workspaceCatalog();
      const items = Array.isArray(workspace.items) ? workspace.items : [];
      const members = items.length ? new Set(items.flatMap((item) => item.sessionIds || [])) : null;
      const archived = new Set(workspace.archivedSessionIds || []);
      const ids = Array.isArray(snapshot.ids) ? snapshot.ids : Object.keys(byId);
      const recent = ids.filter((id) => byId[id] && byId[id].blank !== true && !archived.has(id) && (!members || members.has(id)) && withinRecentWindow(byId[id], id, active))
        .sort((a, b) => (byId[b].updatedAt || 0) - (byId[a].updatedAt || 0));
      const next = [...new Set([...mru, ...recent])].slice(0, limit());
      if (next.length !== mru.length) { mru = next; save(); }
    }
    if (state.open) {
      const selected = state.rows[state.index]?.id;
      const { rows, currentId } = build();
      if (!rows.length) cancel();
      else {
        const at = rows.findIndex((row) => row.id === selected);
        publish({ open: true, rows, currentId, index: at >= 0 ? at : Math.min(state.index, rows.length - 1) });
      }
    }
  };
  const keydown = (event) => {
    if (event.altKey || event.metaKey || event.isComposing || event.keyCode === 229 || event.defaultPrevented) return;
    if (!state.open) {
      try {
        if (ctx.layout.panelInfo?.getSnapshot().activePanelId != null) return;
        if (typeof document !== 'undefined' && document.querySelector('[role="dialog"], [aria-modal="true"]')) return;
      } catch { /* optional shell capabilities */ }
    }
    if (event.key === 'Tab' && (event.ctrlKey || state.open)) {
      event.preventDefault(); event.stopPropagation();
      if (state.open) move(event.shiftKey ? -1 : 1); else open(event.shiftKey === true);
    } else if (state.open && ['Escape', 'Enter', 'ArrowDown', 'ArrowUp', 'PageDown', 'PageUp'].includes(event.key)) {
      event.preventDefault(); event.stopPropagation();
      if (event.key === 'Escape') cancel();
      else if (event.key === 'Enter') commit();
      else move(event.key === 'ArrowUp' || event.key === 'PageUp' ? -1 : 1);
    }
  };
  const keyup = (event) => { if (event.key === 'Control') commit(); };
  const detachPreferences = preferences?.subscribe ? preferences.subscribe(sync) : () => {};
  const detach = sessions?.list?.subscribe ? sessions.list.subscribe(sync) : () => {};
  const detachWorkspaces = ctx.workspaces?.list?.subscribe ? ctx.workspaces.list.subscribe(sync) : () => {};
  sync();
  window.addEventListener('keydown', keydown, true);
  window.addEventListener('keyup', keyup, true);
  window.addEventListener('blur', cancel);
  return {
    source, choose, cancel, focusRow, open,
    dispose() {
      cancel(); detach(); detachWorkspaces(); detachPreferences();
      window.removeEventListener('keydown', keydown, true);
      window.removeEventListener('keyup', keyup, true);
      window.removeEventListener('blur', cancel);
    },
  };
}

// All three pickers share dqs-* layout, theme and animations. Only session-specific details live here.
const RECENT_SESSIONS_CSS = `
.qsr-row{box-sizing:border-box;width:100%;text-align:left;border:0;background:transparent;color:inherit;font:inherit}
/* Hover is presentation only; data-active remains owned by keyboard navigation. */
@media(hover:hover){.qsr-row:hover:not([data-active="true"]){background:var(--dsw-alias-bg-layer-1);box-shadow:inset 0 0 0 1px var(--dsw-alias-border-l2)}}
.qsr-dot{display:inline-flex;align-items:center;justify-content:center;width:14px;height:14px;min-width:14px;min-height:14px;flex:0 0 14px;background:none;border:0;padding:0}
.qsr-dot svg{display:block;width:14px;height:14px;flex:none}
.qsr-spinner{transform-origin:center;animation:qsr-spin .8s linear infinite}
@keyframes qsr-spin{to{transform:rotate(360deg)}}
@media(prefers-reduced-motion:reduce){.qsr-spinner{animation:none}}
`;

function RecentSessions(props) {
  const h = React.createElement;
  const state = props.useRecent((value) => value);
  const preferences = typeof props.usePreferences === 'function' ? props.usePreferences(value => value) : { animations: true };
  // Same root selector as DSH's sidebar: unread completion is viewer-owned, not a SessionSummary field.
  const statuses = typeof props.useSessionStatus === 'function'
    ? props.useSessionStatus(value => value) : null;
  const list = React.useRef(null);
  React.useEffect(() => {
    list.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [state.open, state.index]);
  if (!state.open) return null;
  const tr = (key, fallback) => {
    try { const value = props.t?.(key); return value && value !== key ? value : fallback; } catch { return fallback; }
  };
  return h('div', { className: 'dqs-scrim', 'data-animations': preferences.animations, onMouseDown: (event) => { if (event.target === event.currentTarget) props.cancel(); } },
    h('style', null, RECENT_SESSIONS_CSS),
    h('section', { className: 'dqs-card', 'data-animations': preferences.animations, role: 'dialog', 'aria-modal': 'true', 'aria-label': tr('recent.title', '最近会话') },
      h('header', { className: 'dqs-head' }, h('div', { className: 'dqs-title' }, tr('recent.title', '最近会话')), h('div', { className: 'dqs-hint' }, 'Ctrl+Tab')),
      h('div', { className: 'dqs-list', role: 'listbox', ref: list }, state.rows.map((row, index) => h('button', {
        key: row.id, type: 'button', className: 'dqs-row qsr-row', role: 'option', 'aria-selected': index === state.index, 'data-active': index === state.index,
        onMouseDown: event => {
          if (event.button !== 0 && !(event.button === 2 && event.ctrlKey)) return;
          event.preventDefault(); event.stopPropagation();
          // Close before navigation: releasing Ctrl after this cannot commit again.
          props.choose(row.id);
        },
        onContextMenu: event => {
          event.preventDefault(); event.stopPropagation();
          // macOS may translate Control-click directly into a context-menu gesture.
          if (event.ctrlKey) props.choose(row.id);
        },
        onClick: event => { event.preventDefault(); event.stopPropagation(); props.choose(row.id); },
      },
        h('span', { className: 'qsr-dot',
          'data-state': (statuses?.get(row.id)?.running ?? row.running) ? 'running'
            : statuses?.get(row.id)?.completionUnread === true ? 'unread' : 'idle',
          role: 'img',
          'aria-label': (statuses?.get(row.id)?.running ?? row.running) ? tr('recent.running', '运行中')
            : statuses?.get(row.id)?.completionUnread === true ? tr('recent.unread', '已完成，未读') : tr('recent.idle', '空闲'),
          title: (statuses?.get(row.id)?.running ?? row.running) ? tr('recent.running', '运行中')
            : statuses?.get(row.id)?.completionUnread === true ? tr('recent.unread', '已完成，未读') : tr('recent.idle', '空闲'),
        }, h('svg', { viewBox: '0 0 16 16', width: 14, height: 14, fill: 'none', 'aria-hidden': true,
          className: (statuses?.get(row.id)?.running ?? row.running) ? 'qsr-spinner' : undefined },
          (statuses?.get(row.id)?.running ?? row.running)
            ? [h('circle', { key: 'track', cx: 8, cy: 8, r: 6, stroke: 'var(--dsw-alias-border-l2)', strokeWidth: 1.5 }),
               h('circle', { key: 'arc', cx: 8, cy: 8, r: 6, stroke: 'var(--dsw-alias-brand-primary)', strokeWidth: 1.5,
                 strokeDasharray: '25 38', strokeLinecap: 'round' })]
            : h('circle', { cx: 8, cy: 8, r: 3.5,
                fill: statuses?.get(row.id)?.completionUnread === true ? 'var(--dsw-alias-state-success-primary)' : 'var(--dsw-alias-border-l2)' }))),
        h('span', { className: 'dqs-copy' }, h('div', { className: 'dqs-row-title' }, row.title),
          h('div', { className: 'dqs-row-meta' }, [row.workspace, typeof row.updatedAt === 'number' ? new Date(row.updatedAt).toLocaleString() : ''].filter(Boolean).join(' · '))),
        row.id === state.currentId ? h('span', { className: 'dqs-badge' }, tr('recent.current', '当前')) : null))),
      h('footer', { className: 'dqs-foot' }, tr('recent.footer', 'Tab 下一个 · Shift+Tab 上一个 · 松开 Ctrl 切换 · Esc 取消'))));
}

    function apply(ctx) {
      ctx.effect(() => ctx.locale.register(NS, DICT), 'quick-switcher: dictionaries');
      const t = ctx.locale.bind(NS);
      const preferences = createPreferences();
      ctx.effect(() => () => preferences.dispose(), 'quick-switcher: preferences');
      ctx.effect(() => ctx.slots.inject('settings.section', () => ctx.slots.register({
        name: 'settings.section', id: 'quick-switcher', order: 30, locale: NS, label: () => t('settings.title'),
        inject: () => ({ hooks: { preferences: preferences.store }, updatePreference: preferences.update }),
      }, SwitcherSettings)), 'quick-switcher: settings');
      const recent = createRecentSessions(ctx, t, () => closePicker(), preferences.store);
      ctx.effect(() => () => recent.dispose(), 'quick-switcher: recent sessions');
      ctx.effect(() => ctx.slots.inject('shell.overlay', () => ctx.slots.register({
        name: 'shell.overlay', id: 'quick-switcher.recent', locale: NS,
        inject: () => ({ hooks: { recent: recent.source, preferences: preferences.store }, choose: recent.choose,
          cancel: recent.cancel, focusRow: recent.focusRow }),
      }, RecentSessions)), 'quick-switcher: recent overlay');
      ctx.effect(() => {
        const tag = document.createElement('style');
        tag.dataset.quickSwitcher = 'overlay';
        tag.textContent = CSS;
        document.head.appendChild(tag);
        return () => {
          tag.remove();
        };
      }, 'quick-switcher: styles');

      const sessionsSnapshot = () => {
        try {
          return ctx.sessions.list.getSnapshot();
        } catch {
          return null;
        }
      };

      const sessionsReady = () => {
        const snapshot = sessionsSnapshot();
        return snapshot !== null && snapshot.phase === 'ready';
      };

      const activeSession = () => {
        const snapshot = sessionsSnapshot();
        const byId = (snapshot && snapshot.byId) || {};
        for (const id of Object.keys(byId)) {
          const row = byId[id];
          if (row && (row.retainedBy?.mainView ?? 0) > 0) return { ...row, sessionId: row.sessionId ?? row.id ?? id };
        }
        return undefined;
      };

      const conversationVisible = () => {
        try {
          return ctx.layout.panelInfo.getSnapshot().activePanelId === null;
        } catch {
          return true;
        }
      };

      const workspaceIdOf = (sessionId) => {
        try {
          const snapshot = ctx.workspaces.list.getSnapshot();
          const items = Array.isArray(snapshot.items) ? snapshot.items : [];
          const item = items.find((row) => Array.isArray(row.sessionIds) && row.sessionIds.includes(sessionId));
          return item === undefined ? undefined : item.workspaceId;
        } catch {
          return undefined;
        }
      };

      let pickerGeneration = 0;
      const focusComposer = (sessionId, selector = 'model') => {
        // Use the same editor facade as the composer; no DOM selector or caret reset.
        const enabled = preferences.store.getSnapshot()[selector === 'workspace' ? 'workspaceFocusComposer' : 'focusComposer'];
        if (!enabled || activeSession()?.sessionId !== sessionId || !conversationVisible()) return;
        try {
          const input = ctx.get('conversation')?.input;
          const shell = input?.shell?.(sessionId);
          if (typeof shell?.focus === 'function') shell.focus();
        } catch (error) { console.warn('[quick-switcher] composer focus failed:', error); }
      };
      const closePicker = (focusSessionId) => {
        pickerGeneration += 1;
        picker.set({
          open: false,
          kind: null,
          rows: [],
          status: 'idle',
          error: null,
          current: null,
          focusSessionId: typeof focusSessionId === 'string' ? focusSessionId : null,
        });
      };

      const openWorkspacePicker = () => {
        ++pickerGeneration;
        let snapshot;
        try {
          snapshot = ctx.workspaces.list.getSnapshot();
        } catch {
          snapshot = null;
        }
        const items = snapshot !== null && Array.isArray(snapshot.items) ? snapshot.items : [];
        const active = activeSession();
        const currentWorkspaceId = active === undefined ? undefined : workspaceIdOf(active.sessionId);
        const rows = items.map((item) => ({
          key: `ws:${item.workspaceId}`,
          kind: 'workspace',
          workspaceId: item.workspaceId,
          title: String(item.title || '').trim() || baseName(item.path) || t('unnamedWorkspace'),
          meta: item.path || '',
          current: item.workspaceId === currentWorkspaceId,
        }));
        picker.set({
          open: true,
          kind: 'workspace',
          rows,
          status: snapshot !== null && snapshot.phase === 'ready' ? 'ready' : 'loading',
          error: null,
          current: currentWorkspaceId ?? null,
        });
      };

      const migrateDraft = (fromSessionId, nextSessionId) => {
        if (fromSessionId === undefined || fromSessionId === nextSessionId) return;
        try {
          const conversation = ctx.get('conversation');
          const input = conversation && conversation.input;
          if (!input || typeof input.shell !== 'function') return;
          const from = input.shell(fromSessionId);
          const snapshot = from.snapshot || {};
          if (snapshot.phase !== 'plain' && snapshot.phase !== 'claimed') return;
          const draft = from.draftSnapshot;
          const attachmentIds = Array.isArray(snapshot.attachmentIds) ? snapshot.attachmentIds.slice() : [];
          const next = input.shell(nextSessionId);
          if (attachmentIds.length > 0 && !next.addAttachments(attachmentIds)) return;
          if (draft && typeof draft.text === 'string' && draft.text !== '') {
            next.setDraft(draft);
            from.setDraft('');
          }
          if (attachmentIds.length > 0) {
            for (const id of attachmentIds) from.removeAttachment(id);
          }
        } catch (error) {
          console.warn('[quick-switcher] draft migration skipped:', error);
        }
      };

      const chooseWorkspace = (row) => {
        const active = activeSession();
        const fromSessionId = active === undefined ? undefined : active.sessionId;
        const previous = picker.getSnapshot();
        closePicker();
        const generation = pickerGeneration;
        let selectedSessionId;
        ctx.uiWorkspace.openWorkspace(row.workspaceId, (nextSessionId) => {
          selectedSessionId = nextSessionId;
          migrateDraft(fromSessionId, nextSessionId);
        }).then(() => {
          // Navigation must finish first; never focus a different or superseding conversation.
          if (generation === pickerGeneration && selectedSessionId) focusComposer(selectedSessionId, 'workspace');
        }).catch((error) => {
          console.warn('[quick-switcher] open workspace failed:', error);
          if (generation !== pickerGeneration) return;
          picker.set({
            open: true,
            kind: 'workspace',
            rows: previous.rows,
            status: 'ready',
            error: t('error.openWorkspace'),
            current: previous.current,
          });
        });
      };

      let modelDirectory = null;
      let modelSessionId = null;

      const flatModelRows = (groups, current) => {
        const rows = [];
        for (const group of Array.isArray(groups) ? groups : []) {
          for (const model of Array.isArray(group.models) ? group.models : []) {
            const provider = group.id;
            const modelId = model.id;
            rows.push({
              key: `model:${provider}/${modelId}`,
              kind: 'model',
              provider,
              providerName: group.name || provider,
              model: modelId,
              title: model.name || modelId,
              meta: `${group.name || provider} · ${modelId}`,
              current: current !== null && current !== undefined
                && current.provider === provider && current.model === modelId,
            });
          }
        }
        return rows;
      };

      const loadModelRows = async (sessionId) => {
        const directory = ctx.get('modelDirectories');
        if (directory && typeof directory.directoryFor === 'function') {
          try {
            modelDirectory = directory.directoryFor(sessionId);
            await modelDirectory.load();
            const snapshot = modelDirectory.store.getSnapshot();
            const rows = flatModelRows(snapshot.groups, snapshot.current);
            return {
              rows,
              current: snapshot.current ?? null,
              error: rows.length === 0 && Array.isArray(snapshot.failures) && snapshot.failures.length > 0
                ? t('error.loadModels')
                : null,
            };
          } catch (error) {
            console.warn('[quick-switcher] model directory unavailable, falling back:', error);
            modelDirectory = null;
          }
        }
        const remote = ctx.get('remote.session');
        if (!remote || typeof remote.modelCatalog !== 'function') {
          return { rows: [], current: null, error: t('blocked.noModels') };
        }
        const response = await remote.modelCatalog();
        if (!response || response.ok !== true) {
          return { rows: [], current: null, error: t('error.loadModels') };
        }
        const catalog = response.value;
        const rows = flatModelRows(catalog.groups, catalog.default);
        return {
          rows,
          current: catalog.default ?? null,
          error: rows.length === 0 ? t('empty.model') : null,
        };
      };

      const openModelPicker = () => {
        const active = activeSession();
        if (active === undefined) return;
        const generation = ++pickerGeneration;
        modelDirectory = null;
        modelSessionId = active.sessionId;
        picker.set({
          open: true,
          kind: 'model',
          rows: [],
          status: 'loading',
          error: null,
          current: null,
        });
        loadModelRows(active.sessionId).then((result) => {
          const state = picker.getSnapshot();
          if (generation !== pickerGeneration || !state.open || state.kind !== 'model') return;
          picker.set({
            open: true,
            kind: 'model',
            rows: result.rows,
            status: 'ready',
            error: result.error,
            current: result.current,
          });
        }).catch((error) => {
          console.warn('[quick-switcher] model catalog failed:', error);
          const state = picker.getSnapshot();
          if (generation !== pickerGeneration || !state.open || state.kind !== 'model') return;
          picker.set({
            open: true,
            kind: 'model',
            rows: [],
            status: 'ready',
            error: t('error.loadModels'),
            current: null,
          });
        });
      };

      const chooseModel = (row) => {
        const sessionId = modelSessionId;
        if (sessionId === null) return;
        const state = picker.getSnapshot();
        if (!state.open || state.status === 'selecting') return;
        const generation = pickerGeneration;
        picker.set({ ...state, status: 'selecting', error: null });
        const select = async () => {
          if (modelDirectory !== null) {
            return modelDirectory.select({ provider: row.provider, model: row.model });
          }
          const remote = ctx.get('remote.session');
          if (!remote || typeof remote.selectModel !== 'function') throw new Error('model selection unavailable');
          return remote.selectModel({ sessionId, provider: row.provider, model: row.model });
        };
        select().then((result) => {
          if (generation !== pickerGeneration) return;
          if (result && result.ok === false) {
            const message = result.error && result.error.message ? result.error.message : t('error.selectModel');
            const latest = picker.getSnapshot();
            picker.set({ ...latest, status: 'ready', error: `${t('error.selectModel')} ${message}` });
            return;
          }
          closePicker(sessionId);
        }).catch((error) => {
          console.warn('[quick-switcher] model switch failed:', error);
          if (generation !== pickerGeneration) return;
          const latest = picker.getSnapshot();
          picker.set({ ...latest, status: 'ready', error: t('error.selectModel') });
        });
      };

      const choose = (key) => {
        const state = picker.getSnapshot();
        const row = state.rows.find((item) => item.key === key);
        if (row === undefined) return;
        if (row.kind === 'workspace') chooseWorkspace(row);
        else chooseModel(row);
      };

      ctx.effect(() => ctx.slots.inject('shell.overlay', () => ctx.slots.register({
        name: 'shell.overlay',
        id: 'quick-switcher.overlay',
        locale: NS,
        inject: () => ({ hooks: { picker, preferences: preferences.store }, choose, cancel: closePicker, focusComposer }),
      }, QuickSwitcher)), 'quick-switcher: overlay');

      const registerCommand = (id, labelKey, aliases, defaults, resolve) => {
        ctx.effect(() => {
          try {
            return ctx.shortcuts.register({
              id,
              label: () => t(labelKey),
              aliases,
              defaults,
              regions: ['page', 'editable'],
              modals: ['sidebar'],
              resolve,
            });
          } catch (error) {
            console.warn(`[quick-switcher] shortcut ${id} was not registered:`, error);
            return () => {};
          }
        }, `quick-switcher: ${id}`);
      };

      const workspaceFallback = [
        { code: 'KeyR', modifiers: ['primary', 'shift'] },
        { code: 'KeyR', modifiers: ['primary', 'alt'] },
      ];
      const modelBinding = { code: 'KeyM', modifiers: ['primary'] };
      const modelWebBinding = { code: 'KeyM', modifiers: ['primary', 'alt'] };

      registerCommand(
        WORKSPACE_COMMAND,
        'shortcut.workspace',
        ['workspace', 'choose workspace', 'switch workspace'],
        {
          'desktop:macos': workspaceFallback[0],
          'desktop:windows': workspaceFallback[0],
          'desktop:linux': workspaceFallback[0],
        },
        () => {
          if (!conversationVisible()) return { status: 'blocked', reason: t('blocked.panel') };
          if (!sessionsReady()) return { status: 'blocked', reason: t('blocked.loading') };
          const active = activeSession();
          if (active !== undefined && active.blank !== true) {
            return { status: 'blocked', reason: t('blocked.notNewSession') };
          }
          return { status: 'handled', run: openWorkspacePicker };
        },
      );

      registerCommand(
        MODEL_COMMAND,
        'shortcut.model',
        ['model', 'switch model', 'choose model'],
        {
          'desktop:macos': modelBinding,
          'desktop:windows': modelBinding,
          'desktop:linux': modelBinding,
          'web:macos': modelWebBinding,
          'web:windows': modelWebBinding,
        },
        () => {
          if (!conversationVisible()) return { status: 'blocked', reason: t('blocked.panel') };
          if (!sessionsReady()) return { status: 'blocked', reason: t('blocked.loading') };
          const active = activeSession();
          if (active === undefined) return { status: 'blocked', reason: t('blocked.noSession') };
          try {
            if (typeof ctx.sessions.subagentAddress === 'function'
              && ctx.sessions.subagentAddress(active.sessionId) !== undefined) {
              return { status: 'blocked', reason: t('blocked.subagent') };
            }
          } catch {
            /* a missing helper means ordinary sessions */
          }
          if (!ctx.get('modelDirectories') && !ctx.get('remote.session')) {
            return { status: 'blocked', reason: t('blocked.noModels') };
          }
          return { status: 'handled', run: openModelPicker };
        },
      );

      /**
       * Cmd/Ctrl+R already belongs to the shipped "Refresh current page"
       * command on Desktop, so it cannot be declared as our default. This
       * one-time claim moves the saved binding to the workspace picker, which
       * disables that refresh default through the shortcut service's normal
       * override-precedence rule. The saved preference stays editable and
       * "Restore all" remains the way to undo it; we do not claim twice.
       */
      let claimAttempted = false;

      const claimWorkspaceShortcut = () => {
        try {
          if (claimAttempted) return true;
          if (ctx.shortcuts.runtime !== 'desktop') return true;
          let stored = false;
          try {
            stored = window.localStorage.getItem(CLAIM_KEY) === '1';
          } catch {
            /* storage may be unavailable on a custom scheme; the saved override is the real guard */
          }
          if (stored) return true;
          const config = ctx.shortcuts.config.getSnapshot();
          if (!config || config.status !== 'ready') return false;
          const catalog = ctx.shortcuts.catalog.getSnapshot();
          if (!Array.isArray(catalog) || catalog.length === 0) return false;
          const ours = catalog.find((row) => row.id === WORKSPACE_COMMAND);
          if (ours === undefined) return false;
          if (ours.modified) {
            claimAttempted = true;
            try {
              window.localStorage.setItem(CLAIM_KEY, '1');
            } catch {
              /* nothing else to persist */
            }
            return true;
          }
          const target = { code: 'KeyR', modifiers: ['primary'] };
          if (typeof ctx.shortcuts.describeBinding !== 'function' || typeof ctx.shortcuts.edit !== 'function') return true;
          const described = ctx.shortcuts.describeBinding(target);
          if (!described || described.issue !== null) return true;
          const refresh = catalog.find((row) => row.id === 'page.refresh');
          const conflicts = (described.conflicts || []).filter((id) => id !== WORKSPACE_COMMAND);
          for (const id of conflicts) {
            if (id === 'page.refresh' && refresh !== undefined && refresh.modified !== true) continue;
            return true;
          }
          claimAttempted = true;
          const claim = async () => {
            let revision = config.revision;
            // The editor refuses even default displacement: clear Refresh first.
            if (conflicts.includes('page.refresh')) {
              const cleared = await ctx.shortcuts.edit({ type: 'set', id: 'page.refresh', binding: null }, revision);
              if (cleared.status !== 'saved') return cleared;
              revision = cleared.snapshot.revision;
            }
            let result;
            try {
              result = await ctx.shortcuts.edit({ type: 'set', id: WORKSPACE_COMMAND, binding: target }, revision);
            } catch (error) {
              result = { status: 'write-failed', error };
            }
            if (result?.status !== 'saved' && conflicts.includes('page.refresh')) {
              // Restore only our own unchanged edit; never overwrite a concurrent user edit.
              const latest = ctx.shortcuts.config.getSnapshot();
              if (latest.revision === revision) {
                const restored = await ctx.shortcuts.edit({ type: 'reset', id: 'page.refresh' }, revision);
                if (restored.status !== 'saved') console.warn('[quick-switcher] Refresh shortcut restoration failed:', restored.status);
              }
            }
            return result;
          };
          Promise.resolve(claim()).then((result) => {
            if (result && result.status === 'saved') {
              try { window.localStorage.setItem(CLAIM_KEY, '1'); } catch { /* optional marker */ }
            }
            if (!result || result.status !== 'saved') {
              claimAttempted = false;
              try {
                window.localStorage.removeItem(CLAIM_KEY);
              } catch {
                /* nothing else to persist */
              }
              console.warn('[quick-switcher] Cmd/Ctrl+R claim was not saved:', result && result.status);
            }
          }, (error) => {
            claimAttempted = false;
            try {
              window.localStorage.removeItem(CLAIM_KEY);
            } catch {
              /* nothing else to persist */
            }
            console.warn('[quick-switcher] Cmd/Ctrl+R claim failed:', error);
          });
          return true;
        } catch (error) {
          console.warn('[quick-switcher] Cmd/Ctrl+R claim errored:', error);
          return true;
        }
      };

      ctx.effect(() => {
        let done = false;
        const attempt = () => {
          if (done) return;
          if (claimWorkspaceShortcut()) done = true;
        };
        const offConfig = ctx.shortcuts.config.subscribe(attempt);
        const offCatalog = ctx.shortcuts.catalog.subscribe(attempt);
        attempt();
        return () => {
          offConfig();
          offCatalog();
        };
      }, 'quick-switcher: claim desktop shortcut');
    }

    return {
      inject: ['slots', 'locale', 'shortcuts', 'sessions', 'workspaces', 'uiWorkspace', 'layout'],
      apply,
    };
  },
});
