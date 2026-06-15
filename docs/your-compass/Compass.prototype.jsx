// REFERENCE ONLY -- the original design-package prototype (React.createElement).
// Source: Life Compass Design System, templates/your-compass/Compass.jsx.
// Port this faithfully into React 19 + TS + Tailwind 4 + i18next. Do NOT copy
// verbatim: inline styles using var(--token) should become Tailwind utilities
// where a static utility exists (bg-surface, text-text-muted, rounded-xl,
// shadow-warm-md, font-display, etc.); keep inline styles only for COMPUTED
// values (node positions, opacity = 1 - drift*0.1, color-mix tints). All
// user-facing copy must route through i18next (see the spec for the key map).
(function () {
  const React = window.React;
  const DS = window.LifeCompassDesignSystem_6885ab || {};
  const SCALE = ['Far from it', 'A little', 'Some of the time', 'Mostly', 'Fully'];
  const MATTERS = ['A little', 'Somewhat', 'Quite a bit', 'A lot', 'Deeply'];

  const SEED = [
    { id: 'rest', name: 'Rest & recovery', prompt: 'sleep, movement, slowing down', matters: 5, weeks: [2, 2, 3], details: 'Move every day, protect my sleep, and make real space to recover instead of pushing through.' },
    { id: 'close', name: 'People close to me', prompt: 'being present with them', matters: 5, weeks: [3, 4, 4], details: 'Be present at dinner, listen without trying to fix, and plan one proper weekend together each month.' },
    { id: 'friends', name: 'Friendships', prompt: 'reaching out, staying connected', matters: 4, weeks: [2, 2, 2], details: 'Reach out first more often. Friendships fade when I wait to be invited.' },
    { id: 'work', name: 'Work', prompt: 'meaningful, steady, within limits', matters: 3, weeks: [4, 3, 4], details: 'Do work that means something, and be the calm, reliable person on the team.' },
    { id: 'growth', name: 'Learning & growth', prompt: 'curiosity, at your own pace', matters: 4, weeks: [3, 3, 3], details: 'Keep learning for its own sake -- finish what I start instead of chasing the next new thing.' },
    { id: 'self', name: 'Time for myself', prompt: 'play, rest, nothing in particular', matters: 4, weeks: [2, 3, 2], details: 'Protect unstructured time. Not everything has to be productive.' },
  ];

  const SUGGESTIONS = [
    { name: 'Rest & recovery', prompt: 'sleep, movement, slowing down' },
    { name: 'People close to me', prompt: 'being present with them' },
    { name: 'Friendships', prompt: 'reaching out, staying connected' },
    { name: 'Work', prompt: 'meaningful, steady, within limits' },
    { name: 'Learning & growth', prompt: 'curiosity, at your own pace' },
    { name: 'Time for myself', prompt: 'play, rest, nothing in particular' },
    { name: 'Health', prompt: 'caring for my body and mind' },
    { name: 'Community', prompt: 'belonging and contributing' },
    { name: 'Meaning or faith', prompt: 'what gives life weight' },
    { name: 'Home & surroundings', prompt: 'a place that restores you' },
  ];

  const lived = (a) => a.weeks[a.weeks.length - 1];
  const drift = (a) => Math.max(0, a.matters - lived(a));
  const phrase = (a) => SCALE[lived(a) - 1].toLowerCase();
  const h = React.createElement;
  let seq = 0;
  const newArea = (name, prompt) => ({ id: 'a' + (++seq) + '-' + Date.now(), name: name || '', prompt: prompt || '', matters: 3, weeks: [3], details: '', isNew: true });

  function useWidth() {
    const ref = React.useRef(null);
    const [w, setW] = React.useState(0);
    React.useEffect(() => {
      if (!ref.current) return;
      const update = () => setW(ref.current ? ref.current.clientWidth : 0);
      update();
      const ro = new ResizeObserver(update);
      ro.observe(ref.current);
      return () => ro.disconnect();
    }, []);
    return [ref, w];
  }

  // ---- shared small pieces ----
  function Figure({ size = 44, color = 'var(--color-primary)' }) {
    return h('svg', { viewBox: '0 0 24 30', width: size, height: size * 30 / 24, fill: 'none', stroke: color, strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true },
      h('circle', { cx: 12, cy: 5, r: 3.2 }),
      h('path', { d: 'M12 8.5v9' }),
      h('path', { d: 'M12 11l-5 3M12 11l5 3' }),
      h('path', { d: 'M12 17.5l-4 7M12 17.5l4 7' }),
    );
  }

  function Spark({ weeks }) {
    if (weeks.length < 2) return null;
    const W = 64, H = 22, max = 5, min = 1, step = W / (weeks.length - 1);
    const y = (v) => H - 3 - ((v - min) / (max - min)) * (H - 6);
    const d = weeks.map((v, i) => `${i === 0 ? 'M' : 'L'} ${i * step} ${y(v)}`).join(' ');
    return h('svg', { width: W, height: H, style: { flex: 'none' }, 'aria-hidden': true },
      h('path', { d, fill: 'none', stroke: 'var(--color-border)', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }),
      h('circle', { cx: (weeks.length - 1) * step, cy: y(weeks[weeks.length - 1]), r: 3, fill: 'var(--color-primary)' }),
    );
  }

  function CompassMark({ size = 56 }) {
    return h('span', { style: { display: 'inline-flex', width: size, height: size, borderRadius: '50%', border: '2.5px solid var(--color-primary)', position: 'relative', alignItems: 'center', justifyContent: 'center' } },
      h('span', { style: { position: 'absolute', top: '50%', left: '50%', width: 3, height: size * 0.4, background: 'var(--color-secondary)', transform: 'translate(-50%,-50%) rotate(35deg)', borderRadius: 3 } })
    );
  }

  // ---- A . the map (also the empty / building state) ----
  function MapView({ areas, onOpen, onAdd }) {
    const [ref, w] = useWidth();
    const SIZE = Math.max(248, Math.min(380, w || 320));
    const cx = SIZE / 2, cy = SIZE / 2;
    const R = SIZE * 0.33;
    const box = SIZE < 320 ? 88 : 104;
    const empty = areas.length === 0;
    const slots = empty ? 8 : areas.length + 2;
    const nodes = [];
    for (let i = 0; i < slots; i++) {
      const ang = (-90 + i * 360 / slots) * Math.PI / 180;
      const a = areas[i];
      const r = R + (a ? drift(a) * 6 : 0);
      nodes.push({ a, i, x: cx + r * Math.cos(ang), y: cy + r * Math.sin(ang) });
    }
    return h('div', null,
      h('div', { ref, style: { width: '100%', display: 'flex', justifyContent: 'center' } },
        h('div', { style: { position: 'relative', width: SIZE, height: SIZE } },
          h('svg', { width: SIZE, height: SIZE, style: { position: 'absolute', inset: 0 }, 'aria-hidden': true },
            nodes.map((p) => p.a && h('line', { key: p.i, x1: cx, y1: cy, x2: p.x, y2: p.y, stroke: 'var(--color-border)', strokeWidth: 1.5 }))
          ),
          h('div', { style: { position: 'absolute', left: cx, top: cy, transform: 'translate(-50%,-50%)', width: 66, height: 66, borderRadius: '50%', background: 'var(--color-surface)', border: '2px solid var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-warm-sm)' } }, h(Figure, null)),
          nodes.map((p) => {
            if (!p.a) return h('button', { key: p.i, onClick: onAdd, 'aria-label': 'Add something that matters', style: { position: 'absolute', left: p.x, top: p.y, transform: 'translate(-50%,-50%)', width: 48, height: 48, borderRadius: '50%', border: '1.5px dashed var(--color-border)', background: 'transparent', color: 'var(--color-text)', fontSize: 22, cursor: 'pointer' } }, '+');
            return h('button', { key: p.i, onClick: () => onOpen(p.a.id), 'aria-label': 'Open ' + (p.a.name || 'Untitled'), style: { position: 'absolute', left: p.x, top: p.y, transform: 'translate(-50%,-50%)', width: box, minHeight: 44, padding: '8px', borderRadius: 'var(--radius-md)', cursor: 'pointer', textAlign: 'center', lineHeight: 1.15, border: '1.5px solid var(--color-border)', background: 'var(--color-surface)', boxShadow: 'var(--shadow-warm-sm)', opacity: 1 - drift(p.a) * 0.1, fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, color: 'var(--color-text)', transition: 'border-color var(--duration-base) var(--ease-out-soft), background-color var(--duration-base) var(--ease-out-soft)' } }, p.a.name || 'Untitled');
          })
        )
      ),
      h('p', { style: { marginTop: 14, textAlign: 'center', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', lineHeight: 'var(--leading-normal)' } },
        empty
          ? 'Tap a + to name something that matters to you. Add as few or as many as you like.'
          : 'Tap anything to open it and reflect. A faded box means you have drifted a little from what matters there.')
    );
  }

  // ---- B . the list ----
  function ListView({ areas, onOpen }) {
    const tone = (a) => {
      const v = lived(a);
      if (v >= 4) return 'var(--color-secondary)';
      if (v <= 2) return 'var(--color-primary)';
      return 'var(--color-text-muted)';
    };
    return h('div', { style: { maxWidth: 520, margin: '0 auto' } },
      areas.map((a, i) => h('button', { key: a.id, onClick: () => onOpen(a.id), 'aria-label': 'Open ' + a.name, style: { display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left', cursor: 'pointer', background: 'transparent', border: 'none', padding: '15px 4px', borderBottom: i < areas.length - 1 ? '1px solid var(--color-border)' : 'none' } },
        h('div', { style: { flex: 1, minWidth: 0 } },
          h('div', { style: { fontWeight: 600, color: 'var(--color-text)', fontSize: 'var(--text-base)' } }, a.name),
          h('div', { style: { fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginTop: 1 } }, a.prompt)
        ),
        h('span', { style: { flex: 'none', fontSize: 'var(--text-sm)', color: tone(a), whiteSpace: 'nowrap', paddingLeft: 12 } }, phrase(a))
      ))
    );
  }

  // ---- C . today (one gentle focus) ----
  function TodayView({ areas, onOpen }) {
    const DS = window.LifeCompassDesignSystem_6885ab || {};
    const { Button } = DS;
    const [pick, setPick] = React.useState(() => areas.slice().sort((x, y) => drift(y) - drift(x))[0].id);
    const [v, setV] = React.useState(null);
    const a = areas.find((x) => x.id === pick) || areas[0];
    return h('div', { style: { maxWidth: 460, margin: '0 auto' } },
      h('p', { style: { margin: 0, fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', letterSpacing: '0.02em' } }, 'Just one thing today.'),
      h('h3', { style: { fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'var(--text-2xl)', color: 'var(--color-text)', margin: '8px 0 2px', lineHeight: 'var(--leading-snug)' } }, a.name),
      h('p', { style: { margin: '0 0 18px', fontSize: 'var(--text-base)', color: 'var(--color-text-muted)' } }, a.prompt),
      h('div', { style: { fontSize: 'var(--text-base)', color: 'var(--color-text)', marginBottom: 12 } }, 'How close did this past week feel?'),
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: 8 } },
        SCALE.map((label, i) => {
          const n = i + 1, on = v === n;
          return h('button', { key: n, onClick: () => setV(n), 'aria-pressed': on, style: { display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left', cursor: 'pointer', width: '100%', minHeight: 44, padding: '13px 16px', borderRadius: 'var(--radius-lg)', border: '1.5px solid ' + (on ? 'var(--color-primary)' : 'var(--color-border)'), background: on ? 'color-mix(in srgb, var(--color-primary) 12%, var(--color-surface))' : 'var(--color-surface)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-lg)', color: 'var(--color-text)', transition: 'border-color var(--duration-base) var(--ease-out-soft), background-color var(--duration-base) var(--ease-out-soft)' } },
            h('span', { style: { width: 18, height: 18, borderRadius: '50%', flex: 'none', display: 'inline-flex', border: '1.5px solid ' + (on ? 'var(--color-primary)' : 'var(--color-border)'), background: on ? 'var(--color-primary)' : 'transparent' } }),
            label
          );
        })
      ),
      h('div', { style: { display: 'flex', alignItems: 'center', gap: 14, marginTop: 18, flexWrap: 'wrap' } },
        Button ? h(Button, { variant: 'primary', onClick: () => onOpen(a.id) }, 'Open & save') : null,
        h('button', { onClick: () => { const next = areas[(areas.findIndex((x) => x.id === pick) + 1) % areas.length]; setPick(next.id); setV(null); }, style: { minHeight: 44, border: 'none', background: 'transparent', color: 'var(--color-text)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', textDecoration: 'underline', textUnderlineOffset: 3, whiteSpace: 'nowrap' } }, 'Show me another')
      )
    );
  }

  // ---- D . this week (then vs now, kindly) ----
  function WeekView({ areas, onOpen }) {
    const lineFor = (a) => {
      if (a.weeks.length < 2) return 'Newly added -- nothing to compare yet.';
      const prev = a.weeks[a.weeks.length - 2], now = lived(a);
      if (now > prev) return 'A little closer than last week.';
      if (now === prev) return 'About the same as last week.';
      return 'A bit further -- be gentle with yourself.';
    };
    const tender = (a) => lived(a) <= 2 && a.matters >= 4;
    return h('div', { style: { maxWidth: 520, margin: '0 auto' } },
      h('p', { style: { margin: '0 0 18px', fontSize: 'var(--text-lg)', color: 'var(--color-text)', lineHeight: 'var(--leading-relaxed)' } }, 'You showed up and noticed how things are. That matters more than any number.'),
      areas.map((a, i) => h('button', { key: a.id, onClick: () => onOpen(a.id), 'aria-label': 'Open ' + a.name, style: { display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left', cursor: 'pointer', background: 'transparent', border: 'none', padding: '13px 4px', borderBottom: i < areas.length - 1 ? '1px solid var(--color-border)' : 'none' } },
        h('div', { style: { flex: 1, minWidth: 0 } },
          h('div', { style: { fontWeight: 600, color: 'var(--color-text)', fontSize: 'var(--text-base)' } }, a.name),
          h('div', { style: { fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginTop: 1 } }, lineFor(a)),
          tender(a) ? h('div', { style: { fontSize: 'var(--text-sm)', color: 'var(--color-text)', fontWeight: 600, marginTop: 3 } }, 'This one matters to you -- somewhere to be kind to yourself.') : null
        ),
        h(Spark, { weeks: a.weeks })
      ))
    );
  }

  // ---- reusable compact word scale (AAA-safe: tint + ring + bold dark label) ----
  function ScaleChooser({ labels, value, onChange, accent }) {
    const c = accent || 'var(--color-primary)';
    return h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 8 } },
      labels.map((label, i) => {
        const n = i + 1, on = value === n;
        return h('button', { key: n, onClick: () => onChange(n), 'aria-pressed': on, style: { cursor: 'pointer', minHeight: 44, padding: '9px 15px', borderRadius: 'var(--radius-full)', boxSizing: 'border-box', border: '2px solid ' + (on ? c : 'var(--color-border)'), background: on ? 'color-mix(in srgb, ' + c + ' 14%, var(--color-surface))' : 'var(--color-surface)', color: 'var(--color-text)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: on ? 700 : 500, transition: 'border-color var(--duration-base) var(--ease-out-soft), background-color var(--duration-base) var(--ease-out-soft)' } }, label);
      })
    );
  }

  // ---- area detail (editable name + the two dimensions + your words) ----
  function AreaDetail({ area, onClose, onChange, onRemove }) {
    const DS = window.LifeCompassDesignSystem_6885ab || {};
    const { Button } = DS;
    const livedNow = lived(area);
    const d = drift(area);
    const reflection = (() => {
      if (area.matters >= 4 && livedNow <= 2) return 'This matters a lot to you, and lately it has felt far off. Not a failure -- just a gentle signal of where your attention wants to go.';
      if (area.matters >= 4 && livedNow >= 4) return 'This matters to you, and you have been living close to it. Worth noticing what is helping.';
      if (d === 0) return 'What you value here and how you have lived it are close together right now.';
      return 'A small distance between what you value and how the week felt. Nothing to fix -- just something to see.';
    })();

    const set = (patch) => onChange({ ...area, ...patch, isNew: false });
    const setLived = (n) => onChange({ ...area, weeks: area.weeks.slice(0, -1).concat(n), isNew: false });

    React.useEffect(() => {
      const onKey = (e) => { if (e.key === 'Escape') onClose(); };
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }, []);

    const [nameFocus, setNameFocus] = React.useState(false);
    const label = { fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--color-text)', margin: '0 0 4px' };
    const help = { fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', margin: '0 0 12px' };

    return h('div', { role: 'presentation', onClick: onClose, style: { position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' } },
      h('div', { role: 'dialog', 'aria-modal': 'true', 'aria-label': area.name || 'New area', onClick: (e) => e.stopPropagation(), style: { width: '100%', maxWidth: 600, maxHeight: '92vh', overflowY: 'auto', WebkitOverflowScrolling: 'touch', background: 'var(--color-surface)', borderTopLeftRadius: 'var(--radius-xl)', borderTopRightRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-warm-md)', padding: '20px clamp(20px, 5vw, 28px) calc(28px + env(safe-area-inset-bottom))' } },
        h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 } },
          h('div', { style: { width: 40, height: 4, borderRadius: 'var(--radius-full)', background: 'var(--color-border)', margin: '0 auto' } }),
          h('button', { onClick: onClose, 'aria-label': 'Close', style: { flex: 'none', minWidth: 44, minHeight: 44, marginLeft: -44, border: 'none', background: 'transparent', color: 'var(--color-text)', cursor: 'pointer', borderRadius: 'var(--radius-md)', fontSize: 24, lineHeight: 1 } }, 'X')
        ),

        h('input', { value: area.name, onChange: (e) => set({ name: e.target.value }), onFocus: () => setNameFocus(true), onBlur: () => setNameFocus(false), 'aria-label': 'Name this area', placeholder: 'Name this area', autoFocus: area.isNew, style: { width: '100%', boxSizing: 'border-box', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'var(--text-2xl)', color: 'var(--color-primary)', background: 'transparent', border: 'none', borderBottom: '2px solid ' + (nameFocus ? 'var(--color-primary)' : 'transparent'), outline: 'none', padding: '2px 0', marginBottom: 8 } }),
        h('input', { value: area.prompt, onChange: (e) => set({ prompt: e.target.value }), 'aria-label': 'A few words for what this means', placeholder: 'a few words for what this means to you', style: { width: '100%', boxSizing: 'border-box', fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--color-text-muted)', background: 'transparent', border: 'none', outline: 'none', padding: '0 0 18px' } }),

        h('p', { style: label }, 'What you value here'),
        h('p', { style: help }, 'In your own words. There is no right answer.'),
        DS.Textarea
          ? h(DS.Textarea, { rows: 3, value: area.details || '', onChange: (e) => set({ details: e.target.value }), placeholder: 'What does living well in this area look like for you?' })
          : h('textarea', { rows: 3, value: area.details || '', onChange: (e) => set({ details: e.target.value }), style: { width: '100%', fontSize: 16 } }),

        h('div', { style: { height: 24 } }),
        h('p', { style: label }, 'How much does this matter to you?'),
        h('p', { style: help }, 'Your compass needle -- this rarely changes week to week.'),
        h(ScaleChooser, { labels: MATTERS, value: area.matters, onChange: (n) => set({ matters: n }) }),

        h('div', { style: { height: 24 } }),
        h('p', { style: label }, 'How close did you live to it this past week?'),
        h('p', { style: help }, 'Just this week. Be honest and kind -- both at once.'),
        h(ScaleChooser, { labels: SCALE, value: livedNow, onChange: setLived, accent: 'var(--color-secondary)' }),

        h('div', { style: { marginTop: 24, padding: '14px 16px', borderRadius: 'var(--radius-md)', background: 'var(--color-surface-sunken)', fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 'var(--leading-normal)' } }, reflection),

        h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24 } },
          h('button', { onClick: () => onRemove(area.id), style: { minHeight: 44, border: 'none', background: 'transparent', color: 'var(--color-text-muted)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', textDecoration: 'underline', textUnderlineOffset: 3 } }, 'Remove'),
          Button ? h(Button, { variant: 'primary', onClick: onClose }, 'Done') : h('button', { onClick: onClose }, 'Done')
        )
      )
    );
  }

  // ---- first-run: welcome ----
  function Welcome({ onSuggest, onOwn }) {
    const DS = window.LifeCompassDesignSystem_6885ab || {};
    const { Button } = DS;
    return h('div', { style: { maxWidth: 520, margin: '0 auto', padding: 'clamp(40px, 9vw, 80px) clamp(16px, 5vw, 24px) 80px', textAlign: 'center' } },
      h('div', { style: { display: 'flex', justifyContent: 'center', marginBottom: 26 } }, h(CompassMark, { size: 60 })),
      h('h1', { style: { fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'var(--text-3xl)', color: 'var(--color-text)', margin: 0, lineHeight: 'var(--leading-tight)' } }, 'Let us build your compass.'),
      h('p', { style: { margin: '18px auto 0', maxWidth: 430, fontSize: 'var(--text-lg)', lineHeight: 'var(--leading-relaxed)', color: 'var(--color-text-muted)' } },
        'This is the whole idea: you in the middle, and the handful of things that matter most around you. We will add them one at a time. There is no right answer, and you can change anything later.'),
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', marginTop: 34 } },
        Button ? h(Button, { size: 'lg', variant: 'primary', onClick: onSuggest }, 'Start from a few common areas') : null,
        h('button', { onClick: onOwn, style: { minHeight: 44, border: 'none', background: 'transparent', color: 'var(--color-text)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', textDecoration: 'underline', textUnderlineOffset: 3 } }, 'Add my own first')
      ),
      h('p', { style: { margin: '30px auto 0', maxWidth: 420, fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', lineHeight: 'var(--leading-normal)' } },
        'Everything stays on your device. Nothing is tracked or shared.')
    );
  }

  // ---- first-run: optional suggestions ----
  function Suggest({ onContinue, onOwn }) {
    const DS = window.LifeCompassDesignSystem_6885ab || {};
    const { Button } = DS;
    const [picked, setPicked] = React.useState({});
    const count = Object.values(picked).filter(Boolean).length;
    const toggle = (i) => setPicked((p) => ({ ...p, [i]: !p[i] }));
    return h('div', { style: { maxWidth: 560, margin: '0 auto', padding: 'clamp(32px, 7vw, 56px) clamp(16px, 5vw, 24px) 80px' } },
      h('h1', { style: { fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'var(--text-2xl)', color: 'var(--color-text)', margin: 0, lineHeight: 'var(--leading-tight)' } }, 'Which of these matter to you?'),
      h('p', { style: { margin: '10px 0 22px', fontSize: 'var(--text-base)', color: 'var(--color-text-muted)', lineHeight: 'var(--leading-relaxed)' } }, 'Just starting points -- choose any that fit, skip the rest, and add your own later. Nothing here is fixed.'),
      h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 10 } },
        SUGGESTIONS.map((s, i) => {
          const on = !!picked[i];
          return h('button', { key: i, onClick: () => toggle(i), 'aria-pressed': on, style: { cursor: 'pointer', minHeight: 44, padding: '10px 16px', borderRadius: 'var(--radius-full)', boxSizing: 'border-box', border: '2px solid ' + (on ? 'var(--color-primary)' : 'var(--color-border)'), background: on ? 'color-mix(in srgb, var(--color-primary) 14%, var(--color-surface))' : 'var(--color-surface)', color: 'var(--color-text)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', fontWeight: on ? 700 : 500, transition: 'border-color var(--duration-base) var(--ease-out-soft), background-color var(--duration-base) var(--ease-out-soft)' } },
            (on ? 'check ' : '') + s.name);
        })
      ),
      h('div', { style: { display: 'flex', alignItems: 'center', gap: 16, marginTop: 30, flexWrap: 'wrap' } },
        Button ? h(Button, { size: 'lg', variant: 'primary', disabled: count === 0, onClick: () => onContinue(SUGGESTIONS.filter((_, i) => picked[i])) }, count === 0 ? 'Choose a few to continue' : 'Continue with ' + count) : null,
        h('button', { onClick: onOwn, style: { minHeight: 44, border: 'none', background: 'transparent', color: 'var(--color-text)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', textDecoration: 'underline', textUnderlineOffset: 3 } }, 'Add my own instead')
      )
    );
  }

  const VIEWS = [
    { id: 'map', label: 'Map', sub: 'You, and the things that matter around you' },
    { id: 'list', label: 'List', sub: 'What matters, in plain words' },
    { id: 'today', label: 'Today', sub: 'Just one gentle thing' },
    { id: 'week', label: 'This week', sub: 'How the week has felt' },
  ];

  // ---- root: phases + the four switchable views + header ----
  function Compass() {
    const [phase, setPhase] = React.useState('app'); // 'welcome' | 'suggest' | 'app'
    const [view, setView] = React.useState('map');
    const [areas, setAreas] = React.useState(() => SEED.map((a) => ({ ...a, weeks: a.weeks.slice() })));
    const [editing, setEditing] = React.useState(null);
    const [confirmFresh, setConfirmFresh] = React.useState(false);
    const active = VIEWS.find((v) => v.id === view);
    const editArea = editing ? areas.find((a) => a.id === editing) : null;

    const updateArea = (next) => setAreas((prev) => prev.map((a) => a.id === next.id ? next : a));
    const removeArea = (id) => { setAreas((prev) => prev.filter((a) => a.id !== id)); setEditing(null); };
    const addArea = () => { const a = newArea(); setAreas((prev) => [...prev, a]); setEditing(a.id); };

    const startFresh = () => { setConfirmFresh(false); setAreas([]); setView('map'); setPhase('welcome'); };
    const fromSuggestions = (chosen) => { setAreas(chosen.map((s) => newArea(s.name, s.prompt))); setPhase('app'); setView('map'); };
    const buildOwn = () => { setAreas([]); setPhase('app'); setView('map'); };

    // header: eyebrow "Your compass" + h1 "What matters to you, and how this week has felt."
    // + a top-right "Start fresh" text button -> inline "Start over? . Cancel / Yes" confirm.
    // switcher (role=tablist) hidden when areas empty; subtitle under it = active.sub.
    // See spec for the full root layout; this prototype's root is in the design package.
  }

  window.Compass = Compass;
})();
