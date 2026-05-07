import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  MiniMap,
  Position,
  ReactFlowProvider,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import {
  AlertTriangle,
  ChevronDown,
  ChevronLeft,
  GripVertical,
  HelpCircle,
  Play,
  Plus,
  Search,
  X,
} from "lucide-react";
import {
  ACTIONS,
  LOGIC,
  NODE_KINDS,
  PALETTE_SECTIONS,
  TRIGGERS,
  findExampleById,
  findTriggerById,
  kindForLogicId,
} from "./data.js";
import TestModePanel from "./TestModePanel.jsx";
import NodeSettingsRail from "./NodeSettingsRail.jsx";

const TYPE_CATALOG = {
  ...Object.fromEntries(TRIGGERS.map((t) => [t.id, { ...t, kind: "trigger" }])),
  ...Object.fromEntries(ACTIONS.map((a) => [a.id, { ...a, kind: "action" }])),
  ...Object.fromEntries(LOGIC.map((l) => [l.id, { ...l, kind: l.id === "wait" ? "wait" : l.id === "branch" ? "branch" : "goal" }])),
};

const NODE_TYPES = {
  flowNode: FlowNode,
};

export default function AutomationBuilder({ presetExampleId, presetAutomation, onCancel, onSaveDraft, onActivate }) {
  return (
    <ReactFlowProvider>
      <BuilderInner presetExampleId={presetExampleId} presetAutomation={presetAutomation} onCancel={onCancel} onSaveDraft={onSaveDraft} onActivate={onActivate} />
    </ReactFlowProvider>
  );
}

function BuilderInner({ presetExampleId, presetAutomation, onCancel, onSaveDraft, onActivate }) {
  const initialBuild = useMemo(() => {
    if (presetAutomation) {
      return { name: presetAutomation.name, flow: presetAutomation.flow ?? [], automation: presetAutomation };
    }
    if (presetExampleId) {
      const e = findExampleById(presetExampleId);
      if (e) return { name: e.name, flow: e.flow, automation: null };
    }
    return { name: "Untitled automation", flow: [], automation: null };
  }, [presetExampleId, presetAutomation]);

  const isActive = initialBuild.automation?.status === "active";
  const isUnstable = initialBuild.automation?.status === "error";

  const [name, setName] = useState(initialBuild.name);
  const [data, setData] = useState(() => initialBuild.flow.map((n, i) => ({ ...n, position: { x: 200, y: 80 + i * 160 } })));
  const [nodes, setNodes] = useState(() => buildRfNodes(data));
  const [edges, setEdges] = useState(() => buildRfEdges(data));
  const [selectedId, setSelectedId] = useState(null);
  const [confirmActivate, setConfirmActivate] = useState(false);
  const [testOpen, setTestOpen] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [pendingDrop, setPendingDrop] = useState(null);
  const [toast, setToast] = useState(null);
  const wrapperRef = useRef(null);
  const rf = useReactFlow();

  // Sync model → reactflow
  useEffect(() => {
    setNodes((prev) => buildRfNodes(data, prev, selectedId, initialBuild.automation));
    setEdges(buildRfEdges(data));
  }, [data, selectedId, initialBuild.automation]);

  // Auto-save indicator (debounce visual)
  useEffect(() => {
    const t = setTimeout(() => setSavedAt(Date.now()), 600);
    return () => clearTimeout(t);
  }, [data, name]);

  const updateNode = useCallback((id, patch) => {
    setData((prev) => prev.map((n) => (n.id === id ? { ...n, ...patch } : n)));
  }, []);

  const removeNode = useCallback((id) => {
    setData((prev) => prev.filter((n) => n.id !== id));
    if (selectedId === id) setSelectedId(null);
  }, [selectedId]);

  const flashToast = useCallback((text) => {
    setToast(text);
    window.clearTimeout(flashToast._t);
    flashToast._t = window.setTimeout(() => setToast(null), 1500);
  }, []);

  const addNode = useCallback(({ kind, type, position }) => {
    if (kind === "trigger" && data.some((n) => n.kind === "trigger")) {
      flashToast("Only one trigger allowed");
      return;
    }
    if (kind !== "trigger" && !data.some((n) => n.kind === "trigger")) {
      flashToast("Add a trigger first");
      return;
    }
    if (data.some((n) => n.kind === "goal")) {
      flashToast("Goal is terminal — remove it first");
      return;
    }
    const id = `n-${Math.random().toString(36).slice(2, 8)}`;
    const fallbackY = data.length === 0 ? 80 : Math.max(...data.map((n) => n.position?.y ?? 0)) + 160;
    const pos = position ?? { x: 200, y: fallbackY };
    setData((prev) => [...prev, { id, kind, type, position: pos }]);
    setSelectedId(id);
    flashToast("Node added");
  }, [data, flashToast]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback((event) => {
    event.preventDefault();
    const raw = event.dataTransfer.getData("application/reactflow");
    if (!raw) return;
    let payload;
    try { payload = JSON.parse(raw); } catch { return; }
    if (!payload?.kind || !payload?.type) return;
    if (!wrapperRef.current) return;
    const bounds = wrapperRef.current.getBoundingClientRect();
    const position = rf.screenToFlowPosition
      ? rf.screenToFlowPosition({ x: event.clientX, y: event.clientY })
      : rf.project({ x: event.clientX - bounds.left, y: event.clientY - bounds.top });
    addNode({ kind: payload.kind, type: payload.type, position });
  }, [rf, addNode]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setSelectedId(null);
        setHelpOpen(false);
        setTestOpen(false);
      }
      if ((e.key === "Delete" || e.key === "Backspace") && selectedId) {
        const target = e.target;
        const isEditable = target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable;
        if (isEditable) return;
        const sel = data.find((n) => n.id === selectedId);
        if (!sel || sel.kind === "trigger") return;
        setData((prev) => prev.filter((n) => n.id !== selectedId));
        setSelectedId(null);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "0") {
        e.preventDefault();
        rf.fitView?.({ padding: 0.3 });
      }
      if ((e.metaKey || e.ctrlKey) && (e.key === "=" || e.key === "+")) {
        e.preventDefault();
        rf.zoomIn?.();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "-") {
        e.preventDefault();
        rf.zoomOut?.();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId, data, rf]);

  const onNodesChange = useCallback((changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
    // Sync position back to model
    changes.forEach((c) => {
      if (c.type === "position" && c.position) {
        setData((prev) => prev.map((n) => (n.id === c.id ? { ...n, position: c.position } : n)));
      }
    });
  }, []);
  const onEdgesChange = useCallback((changes) => setEdges((es) => applyEdgeChanges(changes, es)), []);
  const onConnect = useCallback((conn) => setEdges((es) => addEdge({ ...conn, animated: false, style: { stroke: "#6A6A6A", strokeWidth: 1.5 } }, es)), []);
  const onNodeClick = useCallback((_, node) => setSelectedId(node.id), []);
  const onPaneClick = useCallback(() => setSelectedId(null), []);

  const selected = data.find((n) => n.id === selectedId) ?? null;
  const canActivate = data.some((n) => n.kind === "trigger") && data.some((n) => n.kind !== "trigger");

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-[#FBFAF8]">
      <TopBar
        name={name} onNameChange={setName}
        onCancel={onCancel}
        onSaveDraft={() => onSaveDraft?.({ name, flow: data })}
        onActivate={() => canActivate && setConfirmActivate(true)}
        onTest={() => setTestOpen(true)}
        canActivate={canActivate}
        savedAt={savedAt}
        status={initialBuild.automation?.status ?? "draft"}
      />

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <Palette flow={data} onAdd={addNode} />
        <div ref={wrapperRef} className="relative flex min-w-0 flex-1" onDragOver={onDragOver} onDrop={onDrop}>
          <CanvasOverlays
            automation={initialBuild.automation}
            name={name}
          />
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={NODE_TYPES}
            fitView
            fitViewOptions={{ padding: 0.3, maxZoom: 1.1 }}
            proOptions={{ hideAttribution: true }}
            defaultEdgeOptions={{ style: { stroke: "#CBD5E1", strokeWidth: 1.5 } }}
            style={{ background: "#FBFAF8" }}
          >
            <Background variant={BackgroundVariant.Dots} gap={24} size={1.5} color="#D4D0C8" />
            <Controls position="bottom-right" showInteractive={false} />
            <MiniMap pannable zoomable position="bottom-left" maskColor="rgba(0,0,0,0.04)" style={{ width: 120, height: 80, border: "1px solid #EBEEF2", borderRadius: 8 }} />
          </ReactFlow>
          {data.length === 0 && <EmptyCanvas onAdd={addNode} />}
          <button
            type="button" onClick={() => setHelpOpen(true)} aria-label="Keyboard shortcuts"
            className="absolute bottom-4 right-[120px] z-20 inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#EBEEF2] bg-white text-[#45556C] shadow-chip hover:bg-[#F7F8F8]"
          >
            <HelpCircle size={14} />
          </button>
        </div>
        {selected && (
          <NodeSettingsRail
            node={selected}
            onChange={(patch) => updateNode(selected.id, patch)}
            onClose={() => setSelectedId(null)}
            onRemove={() => removeNode(selected.id)}
          />
        )}
      </div>

      {confirmActivate && (
        <ActivateConfirm
          name={name} flow={data}
          onCancel={() => setConfirmActivate(false)}
          onConfirm={() => { setConfirmActivate(false); onActivate?.({ name, flow: data }); }}
        />
      )}
      {testOpen && (
        <TestModePanel
          name={name} flow={data}
          onClose={() => setTestOpen(false)}
        />
      )}
      {helpOpen && <ShortcutsModal onClose={() => setHelpOpen(false)} />}
      {toast && (
        <div role="status" className="pointer-events-none fixed bottom-6 left-1/2 z-[80] -translate-x-1/2 rounded-md bg-[#101828] px-4 py-2 text-[12px] font-medium text-white shadow-card">
          {toast}
        </div>
      )}
    </div>
  );
}

/* ──────────── Shortcuts modal ──────────── */

function ShortcutsModal({ onClose }) {
  const rows = [
    { keys: "Esc",                  label: "Deselect node / close panel" },
    { keys: "Delete / Backspace",   label: "Delete selected node" },
    { keys: "⌘/Ctrl + 0",           label: "Fit to screen" },
    { keys: "⌘/Ctrl + +",           label: "Zoom in" },
    { keys: "⌘/Ctrl + -",           label: "Zoom out" },
    { keys: "Drag from palette",    label: "Add node at drop position" },
    { keys: "Click in palette",     label: "Add node at end of flow" },
  ];
  return (
    <div role="dialog" aria-modal="true" onClick={onClose} className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 px-6">
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-[440px] rounded-md border border-[#EBEEF2] bg-white p-6 shadow-card">
        <header className="mb-4 flex items-center justify-between">
          <h3 className="text-[15px] font-semibold text-[#101828]">Keyboard shortcuts</h3>
          <button type="button" onClick={onClose} aria-label="Close" className="inline-flex h-7 w-7 items-center justify-center rounded-xs text-[#9CA3AF] hover:bg-[#F7F8F8]">
            <X size={14} />
          </button>
        </header>
        <ul className="flex flex-col gap-2 text-[12px]">
          {rows.map((r) => (
            <li key={r.keys} className="flex items-center justify-between">
              <span className="text-[#45556C]">{r.label}</span>
              <kbd className="rounded-[4px] border border-[#EBEEF2] bg-[#F7F8F8] px-2 py-1 font-mono text-[11px] text-[#101828]">{r.keys}</kbd>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ──────────── Reactflow node + edge builders ──────────── */

function buildRfNodes(data, prev = [], selectedId = null, automation = null) {
  const isActive = automation?.status === "active";
  const isUnstable = automation?.status === "error";
  // Match builder nodes to automation flow nodes by index for live metrics.
  const liveByIndex = automation?.flow ?? [];
  return data.map((n, i) => ({
    id: n.id,
    type: "flowNode",
    position: n.position ?? { x: 200, y: 100 },
    data: {
      node: n,
      selected: selectedId === n.id,
      live: isActive ? liveByIndex[i] : null,
      unstable: isUnstable && i === 0,
    },
    draggable: true,
    selectable: true,
  }));
}

function buildRfEdges(data) {
  const edges = [];
  for (let i = 0; i < data.length - 1; i += 1) {
    const a = data[i];
    const b = data[i + 1];
    const fromBranch = a.kind === "branch";
    const labelText = fromBranch ? (i === 0 || data[i - 1]?.kind !== "branch" ? "True" : "False") : null;
    edges.push({
      id: `e-${a.id}-${b.id}`,
      source: a.id,
      target: b.id,
      type: "smoothstep",
      style: { stroke: "#CBD5E1", strokeWidth: 1.5 },
      markerEnd: { type: "arrowclosed", color: "#CBD5E1", width: 14, height: 14 },
      label: labelText,
      labelStyle: labelText === "True"
        ? { fill: "#1EB677", fontWeight: 600, fontSize: 11 }
        : { fill: "#EF4444", fontWeight: 600, fontSize: 11 },
      labelBgStyle: labelText === "True"
        ? { fill: "rgba(30,182,119,0.10)" }
        : { fill: "rgba(239,68,68,0.10)" },
      labelBgPadding: [6, 4],
      labelBgBorderRadius: 3,
      labelShowBg: !!labelText,
    });
  }
  return edges;
}

/* ──────────── Top bar ──────────── */

function TopBar({ name, onNameChange, onCancel, onSaveDraft, onActivate, onTest, canActivate, savedAt, status }) {
  const savedLabel = savedAt ? "Saved" : "Unsaved";
  const statusLabel = status === "active" ? "Active" : status === "error" ? "Needs attention" : status === "paused" ? "Paused" : "Draft";
  const statusDot = status === "active" ? "bg-success" : status === "error" ? "bg-danger" : "bg-ink-subtle";
  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-[#EBEEF2] bg-[rgba(255,255,255,0.85)] px-6 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onCancel} className="inline-flex h-9 items-center gap-2 rounded-button border border-[#EBEEF2] bg-white px-3 text-[13px] font-medium text-[#45556C] hover:bg-[#F7F8F8]">
          <ChevronLeft size={14} /> Back to Automations
        </button>
        <input
          type="text" value={name} onChange={(e) => onNameChange(e.target.value)}
          className="h-9 w-[280px] rounded-sm border border-transparent bg-transparent px-2 text-[16px] font-semibold text-[#101828] focus:border-[#EBEEF2] focus:bg-white focus:outline-none"
        />
      </div>
      <div className="flex items-center gap-2">
        <span className="inline-flex h-7 items-center text-[11px] font-medium text-[#9CA3AF]">{savedLabel}</span>
        <span className="inline-flex h-8 items-center gap-1.5 rounded-[6px] border border-[#EBEEF2] bg-white px-2.5 text-[12px] font-semibold text-[#45556C]">
          <span aria-hidden className={["h-1.5 w-1.5 rounded-full", statusDot].join(" ")} />
          {statusLabel}
          <ChevronDown size={11} className="text-[#9CA3AF]" />
        </span>
        <button type="button" onClick={onTest} className="inline-flex h-9 items-center gap-1 rounded-button border border-[#EBEEF2] bg-white px-3 text-[12px] font-medium text-[#45556C] hover:bg-[#F7F8F8]">
          <Play size={12} /> Test
        </button>
        <button type="button" onClick={onSaveDraft} className="inline-flex h-9 items-center rounded-button border border-[#EBEEF2] bg-white px-4 text-[12px] font-medium text-[#45556C] hover:bg-[#F7F8F8]">
          Save
        </button>
        <button
          type="button" onClick={onActivate} disabled={!canActivate}
          className={["inline-flex h-9 items-center rounded-button px-5 text-[12px] font-semibold text-white transition-opacity", canActivate ? "bg-cta-gradient hover:opacity-90" : "bg-cta-gradient opacity-40 cursor-not-allowed"].join(" ")}
        >
          Activate
        </button>
      </div>
    </header>
  );
}

/* ──────────── Canvas overlays (breadcrumb + chips + trigger capsule) ──────────── */

function CanvasOverlays({ automation, name }) {
  const status = automation?.status ?? "draft";
  const statusChip =
    status === "active" ? { dot: "bg-success", label: "● Active" } :
    status === "error"  ? { dot: "bg-danger",  label: "⚠ Needs attention" } :
    status === "paused" ? { dot: "bg-ink-subtle", label: "○ Paused" } :
    { dot: "bg-ink-subtle", label: "○ Draft" };
  const lastEdited = automation ? "edited 2h ago" : "just now";
  const runs = automation ? `${automation.runsThisMonth ?? 0} runs this month` : "no runs yet";

  return (
    <div className="pointer-events-none absolute left-0 top-0 z-10 flex w-full flex-col gap-3 px-6 py-4">
      {/* Breadcrumb */}
      <div className="pointer-events-auto flex items-center gap-2 text-[13px] font-medium">
        <span className="inline-flex items-center gap-1 text-[#45556C]">⚡ Automations</span>
        <span className="text-[#CBD5E1]">/</span>
        <span className="inline-flex items-center gap-1 text-[#45556C]">📁 Marketing</span>
        <span className="text-[#CBD5E1]">/</span>
        <span className="inline-flex items-center gap-1 text-[#101828] font-semibold">{name}</span>
      </div>

      {/* Metadata chips */}
      <div className="pointer-events-auto flex items-center gap-2">
        <Chip3 icon="●" label={statusChip.label} />
        <Chip3 icon="✎" label={lastEdited} />
        <Chip3 icon="⇣" label={runs} />
      </div>

    </div>
  );
}

function Chip3({ icon, label }) {
  return (
    <span className="inline-flex h-7 items-center gap-1.5 rounded-[6px] border border-[#EBEEF2] bg-white px-2.5 text-[12px] font-medium text-[#45556C]">
      <span aria-hidden className="text-[#9CA3AF]">{icon}</span>
      {label}
    </span>
  );
}


/* ──────────── Palette ──────────── */

function Palette({ flow, onAdd }) {
  const [query, setQuery] = useState("");
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof localStorage === "undefined") return {};
    try { return JSON.parse(localStorage.getItem("automations.paletteCollapsed") ?? "{}"); }
    catch { return {}; }
  });
  const toggleCollapsed = (id) => {
    setCollapsed((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try { localStorage.setItem("automations.paletteCollapsed", JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const hasTrigger = flow.some((n) => n.kind === "trigger");
  const hasGoal = flow.some((n) => n.kind === "goal");
  const q = query.trim().toLowerCase();
  const matches = (it) => !q || it.label.toLowerCase().includes(q) || (it.hint ?? "").toLowerCase().includes(q);

  return (
    <aside className="flex w-[240px] shrink-0 flex-col gap-3 overflow-y-auto border-r border-[#EBEEF2] bg-white p-4">
      <label className="flex h-9 items-center gap-2 rounded-[6px] border border-[#EBEEF2] bg-white px-2">
        <Search size={12} className="text-[#9CA3AF]" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search nodes…"
          className="min-w-0 flex-1 bg-transparent text-[12px] text-[#101828] placeholder:text-[#9CA3AF] focus:outline-none" />
      </label>

      {PALETTE_SECTIONS.map((section) => {
        const items = section.items.filter(matches);
        const isCollapsed = !!collapsed[section.id];
        return (
          <Group
            key={section.id}
            label={section.label}
            count={section.items.length}
            collapsed={isCollapsed}
            onToggle={() => toggleCollapsed(section.id)}
          >
            {!isCollapsed && items.map((it) => {
              const k = section.kind === "logic" ? kindForLogicId(it.id) : section.kind;
              const disabled = section.kind === "trigger"
                ? hasTrigger
                : (!hasTrigger || hasGoal);
              return (
                <PaletteRow
                  key={it.id} icon={it.icon} label={it.label} hint={it.hint} tone={it.tone}
                  kind={k} type={it.id}
                  disabled={disabled}
                  onClick={() => onAdd({ kind: k, type: it.id })}
                />
              );
            })}
            {!isCollapsed && items.length === 0 && q && (
              <span className="px-1 py-1.5 text-[11px] font-medium text-[#9CA3AF]">No matches</span>
            )}
          </Group>
        );
      })}
    </aside>
  );
}

function Group({ label, count, collapsed, onToggle, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <button
        type="button" onClick={onToggle}
        className="flex w-full items-center justify-between px-1 text-[11px] font-semibold uppercase tracking-wide text-[#6A6A6A] hover:text-[#101828]"
      >
        <span>{label} {typeof count === "number" && <span className="text-[#9CA3AF]">· {count}</span>}</span>
        <ChevronDown size={11} className={["text-[#9CA3AF] transition-transform", collapsed ? "-rotate-90" : ""].join(" ")} />
      </button>
      <div className="flex flex-col gap-1.5">{children}</div>
    </div>
  );
}

function PaletteRow({ icon, label, hint, tone, disabled, kind, type, onClick }) {
  const onDragStart = (event) => {
    if (disabled) { event.preventDefault(); return; }
    event.dataTransfer.setData("application/reactflow", JSON.stringify({ kind, type }));
    event.dataTransfer.effectAllowed = "move";
  };
  return (
    <div
      role="button" tabIndex={disabled ? -1 : 0}
      onClick={() => !disabled && onClick?.()}
      onKeyDown={(e) => !disabled && (e.key === "Enter" || e.key === " ") && onClick?.()}
      draggable={!disabled}
      onDragStart={onDragStart}
      title={hint}
      className={[
        "group flex w-full items-center gap-2 rounded-sm border border-[#EBEEF2] bg-white px-2 py-2 text-left transition-colors",
        disabled ? "cursor-not-allowed opacity-50" : "cursor-grab hover:bg-[#F7F8F8] hover:shadow-[0_1px_3px_rgba(0,0,0,0.06)] active:cursor-grabbing",
      ].join(" ")}
    >
      <span
        className={["inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] text-[14px]", tone ?? "bg-[#94A3B8] text-white"].join(" ")}
        style={{ filter: tone ? "none" : undefined }}
      >
        <span style={{ filter: "brightness(0) invert(1)" }}>{icon}</span>
      </span>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="text-[13px] font-semibold leading-tight text-[#101828]">{label}</span>
        <span className="line-clamp-1 text-[11px] font-medium leading-tight text-[#9CA3AF]">{hint}</span>
      </div>
      <span className="flex items-center text-[#9CA3AF] opacity-0 transition-opacity group-hover:opacity-30">
        <GripVertical size={12} />
      </span>
    </div>
  );
}

/* ──────────── Custom reactflow node ──────────── */

function FlowNode({ data: { node, selected, live, unstable } }) {
  const def = TYPE_CATALOG[node.type] ?? {};
  const invalid = isNodeInvalid(node);
  const isTrigger = node.kind === "trigger";
  const isGoal = node.kind === "goal";
  const isUnconfigured = isTrigger && (node.type === "form_submit" && !node.formName);
  const iconBg = iconBgFor(node);
  const subtitle = subtitleFor(node);
  const width = node.kind === "wait" ? "w-[180px]" : "w-[210px]";
  const borderClass = isUnconfigured
    ? "border-dashed border-[#EBEEF2]"
    : invalid
      ? "border-warning"
      : "border-[#EBEEF2]";

  return (
    <div className="relative">
      {unstable && (
        <div className="absolute -top-9 left-0 right-0 flex items-center gap-1 rounded-[6px] border border-warning bg-[#FFF4E6] px-2.5 py-1.5 text-[11px] font-medium text-[#92400E]">
          <AlertTriangle size={12} className="text-warning" />
          Unstable — health check failures
        </div>
      )}
      <article
        className={[
          "relative rounded-[6px] border bg-white transition-all",
          borderClass, width,
          isGoal ? "border-dashed border-brand-emerald bg-brand-50/30" : "",
          selected ? "shadow-[0_0_0_4px_rgba(30,182,119,0.08)]" : "shadow-[0_1px_2px_rgba(0,0,0,0.04)]",
        ].join(" ")}
      >
        {invalid && (
          <span aria-hidden className="absolute right-2 top-2">
            <AlertTriangle size={12} className="text-warning" />
          </span>
        )}
        <div className="px-5 py-2.5">
        <header className="flex items-center gap-2">
          <span
            aria-hidden
            className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[4px]"
            style={{ backgroundColor: iconBg }}
          >
            <span className="text-[16px]" style={{ filter: "brightness(0) invert(1)" }}>{def.icon}</span>
          </span>
          <div className="flex min-w-0 flex-col gap-[5px]">
            <span className="text-[14px] font-semibold leading-none text-[#101828]">{def.label ?? node.type}</span>
            <span className="line-clamp-1 text-[12px] font-medium leading-none text-[#9CA3AF]">
              {isUnconfigured ? "Click to configure" : subtitle}
            </span>
          </div>
        </header>
        <NodeBody node={node} />
        </div>
        {live && (
          <div className="flex items-center gap-3 border-t border-[#EBEEF2] bg-[#FBFAF8] px-3 py-1.5 text-[11px] font-medium text-[#45556C]">
            {typeof live.count === "number" && (
              <span className="inline-flex items-center gap-1">
                <span aria-hidden className="text-[#9CA3AF]">⇣</span>
                {live.count.toLocaleString()} runs
              </span>
            )}
            {live.secondaryStat && (
              <span className="inline-flex items-center gap-1">
                <span aria-hidden className="text-[#9CA3AF]">✓</span>
                {live.secondaryStat}
              </span>
            )}
          </div>
        )}
      </article>

      {!isTrigger && (
        <Handle
          type="target" position={Position.Top}
          style={{ background: "#CBD5E1", width: 9, height: 9, border: "1.5px solid #FFFFFF", top: -5 }}
        />
      )}
      {!isGoal && (
        <Handle
          type="source" position={Position.Bottom}
          style={{ background: "#CBD5E1", width: 9, height: 9, border: "1.5px solid #FFFFFF", bottom: -5 }}
        />
      )}
    </div>
  );
}

function iconBgFor(node) {
  if (node.kind === "trigger") {
    switch (node.type) {
      case "contact_added":  return "#6366F1";
      case "form_submit":    return "#3B82F6";
      case "cart_abandoned": return "#F97316";
      case "wa_keyword":     return "#1EB677";
      case "date_based":     return "#A855F7";
      case "manual":         return "#64748B";
      default:               return "#64748B";
    }
  }
  if (node.kind === "wait")    return "#94A3B8";
  if (node.kind === "branch")  return "#873EFF";
  if (node.kind === "goal")    return "#1EB677";
  switch (node.type) {
    case "send_wa":      return "#1EB677";
    case "add_tag":
    case "remove_tag":   return "#F59E0B";
    case "change_stage":
    case "update_field": return "#6366F1";
    default:             return "#94A3B8";
  }
}

function subtitleFor(node) {
  if (node.kind === "trigger") {
    if (node.type === "form_submit") return node.formName ?? "Select a form";
    if (node.type === "wa_keyword")  return node.matchType === "contains" ? "Contains keyword" : node.matchType === "starts" ? "Starts with" : "Exact match";
    if (node.type === "date_based")  return node.dateField === "signup_date" ? "Anniversary" : node.dateField === "custom" ? "Custom date" : "Birthday";
    if (node.type === "cart_abandoned") return `After ${node.afterMinutes ?? 30} min`;
    if (node.type === "contact_added")  return node.source === "any" || !node.source ? "Any source" : node.source;
    if (node.type === "manual")          return "Manual run";
    return "Trigger";
  }
  if (node.kind === "wait")    return node.waitType === "time_of_day" ? `Until ${node.untilTime ?? "9:00 AM"}` : `${node.value ?? 5} ${node.unit ?? "minutes"}`;
  if (node.kind === "branch")  return "Condition";
  if (node.kind === "goal")    return "End of flow";
  if (node.type === "send_wa")     return node.messageType === "custom" ? "Custom message" : "Template";
  if (node.type === "add_tag")     return "Tag";
  if (node.type === "remove_tag")  return "Untag";
  if (node.type === "change_stage")return "Update stage";
  if (node.type === "update_field")return "Update field";
  return "Action";
}

function NodeBody({ node }) {
  // Tag chip variant — keyword trigger + tag actions
  if (node.kind === "trigger" && node.type === "wa_keyword") {
    const keywords = (node.keyword || "").split(",").map((s) => s.trim()).filter(Boolean);
    if (keywords.length === 0) return null;
    return (
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {keywords.slice(0, 4).map((k, i) => <Chip key={i} label={k} />)}
        {keywords.length > 4 && <Chip label={`+${keywords.length - 4} more`} />}
      </div>
    );
  }
  if (node.type === "add_tag" || node.type === "remove_tag") {
    const tags = node.tags ?? [];
    if (tags.length === 0) return null;
    return (
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {tags.slice(0, 4).map((t, i) => <Chip key={i} label={t} />)}
        {tags.length > 4 && <Chip label={`+${tags.length - 4} more`} />}
      </div>
    );
  }
  // Condition preview
  if (node.kind === "branch") {
    if (!node.condition) return null;
    return (
      <div className="mt-2.5">
        <Chip label={node.condition} fullWidth />
      </div>
    );
  }
  // Send WhatsApp message preview
  if (node.type === "send_wa") {
    const text = node.template || node.customBody;
    if (!text) return null;
    return (
      <div className="mt-2.5 rounded-[2px] border border-[#EBEEF2] bg-[#F7F8F8] p-1">
        <p className="px-1 py-0.5 text-[12px] leading-[1.3] text-[#45556C]">
          <PreviewText text={text} />
        </p>
      </div>
    );
  }
  // Field update inline value
  if (node.type === "update_field" && node.field) {
    return (
      <div className="mt-2.5">
        <Chip label={`${node.field} = ${node.value || "—"}`} fullWidth />
      </div>
    );
  }
  if (node.type === "change_stage" && node.toStage) {
    return (
      <div className="mt-2.5">
        <Chip label={`${node.fromStage ?? "Any"} → ${node.toStage}`} fullWidth />
      </div>
    );
  }
  return null;
}

function Chip({ label, fullWidth }) {
  return (
    <span
      className={[
        "inline-flex h-[20px] items-center rounded-[2px] border border-[#EBEEF2] bg-[rgba(11,18,32,0.03)] px-1.5 text-[12px] font-medium text-[#45556C]",
        fullWidth ? "w-full" : "",
      ].join(" ")}
      style={{ borderRadius: 2 }}
    >
      <span className={fullWidth ? "truncate" : ""}>{label}</span>
    </span>
  );
}

function PreviewText({ text }) {
  const PARTS = String(text).split(/(\{\{[^}]+\}\})/g);
  return (
    <>
      {PARTS.map((part, i) => /^\{\{.*\}\}$/.test(part)
        ? <span key={i} className="font-semibold text-[#101828]">{part}</span>
        : <span key={i}>{part}</span>
      )}
    </>
  );
}

function NodePreview({ node }) {
  if (node.kind === "wait") return <span className="text-[11px] text-ink-muted">Wait {node.value ?? 5} {node.unit ?? "minutes"}</span>;
  if (node.kind === "branch") return <span className="line-clamp-2 text-[11px] text-ink-muted">If {node.condition ?? "set a condition…"}</span>;
  if (node.kind === "trigger") {
    if (node.type === "form_submit") return <span className="text-[11px] text-ink-muted">{node.formName ?? "Select a form"}</span>;
    if (node.type === "wa_keyword") return <span className="text-[11px] text-ink-muted">Keyword: "{node.keyword ?? "—"}"</span>;
    if (node.type === "date_based") return <span className="text-[11px] text-ink-muted">{node.dateField ?? "Birthday"}{node.offsetDays ? ` + ${node.offsetDays}d` : ""}</span>;
    if (node.type === "cart_abandoned") return <span className="text-[11px] text-ink-muted">After {node.afterMinutes ?? 30} min</span>;
    return null;
  }
  if (node.kind === "goal") return <span className="text-[11px] text-ink-muted">{node.title ?? "Mark contact as completed"}</span>;
  if (node.type === "send_wa") return <span className="line-clamp-1 text-[11px] text-ink-muted">{node.template ?? node.customBody ?? "Configure message…"}</span>;
  if (node.type === "add_tag" || node.type === "remove_tag") return <span className="text-[11px] text-ink-muted">{Array.isArray(node.tags) ? node.tags.join(", ") : "Pick tags…"}</span>;
  if (node.type === "change_stage") return <span className="text-[11px] text-ink-muted">{node.fromStage ?? "Any"} → {node.toStage ?? "Pick stage"}</span>;
  if (node.type === "update_field") return <span className="text-[11px] text-ink-muted">{node.field ?? "Pick field"} = {node.value ?? "—"}</span>;
  return null;
}

function isNodeInvalid(node) {
  if (node.kind === "trigger") {
    if (node.type === "form_submit" && !node.formName) return true;
    if (node.type === "wa_keyword" && !node.keyword) return true;
  }
  if (node.type === "send_wa" && !node.template && !node.customBody) return true;
  if (node.type === "add_tag" && (!node.tags || node.tags.length === 0)) return true;
  if (node.type === "branch" && !node.condition) return true;
  return false;
}

/* ──────────── Empty canvas ──────────── */

function EmptyCanvas({ onAdd }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
      <div className="pointer-events-auto flex max-w-[420px] flex-col items-center gap-4 rounded-md border-2 border-dashed border-line bg-white/90 p-8 text-center shadow-chip">
        <span className="text-[24px]">⚡</span>
        <h3 className="text-[14px] font-semibold text-ink-heading">Start with a trigger</h3>
        <p className="text-[12px] font-medium text-ink-muted">Drag a trigger from the left, or pick one below.</p>
        <div className="grid grid-cols-3 gap-2">
          {TRIGGERS.map((t) => (
            <button
              key={t.id} type="button"
              onClick={() => onAdd({ kind: "trigger", type: t.id })}
              className="flex flex-col items-center gap-1 rounded-sm border border-line bg-white p-2 hover:border-brand-emerald hover:bg-brand-50/30"
            >
              <span className={["inline-flex h-7 w-7 items-center justify-center rounded-full text-[14px]", t.tone].join(" ")}>{t.icon}</span>
              <span className="text-[10px] font-semibold text-ink-heading">{t.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ──────────── Activate confirm ──────────── */

function ActivateConfirm({ name, flow, onCancel, onConfirm }) {
  const trigger = flow.find((n) => n.kind === "trigger");
  const triggerDef = trigger ? findTriggerById(trigger.type) : null;
  const messageSteps = flow.filter((n) => n.type === "send_wa").length;
  const actionSteps = flow.filter((n) => n.kind !== "trigger").length;
  return (
    <div role="dialog" aria-modal="true" onClick={onCancel} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-[480px] rounded-md border border-line bg-white p-6 shadow-card">
        <h3 className="text-[16px] font-semibold text-ink-heading">Activate "{name}"?</h3>
        <p className="mt-2 text-[13px] font-medium text-ink-body">
          This automation will trigger when: <span className="font-semibold">{triggerDef?.label ?? "—"}</span>
        </p>
        <p className="mt-1 text-[13px] text-ink-body">
          It will: send {messageSteps} WhatsApp message{messageSteps === 1 ? "" : "s"} + {actionSteps - messageSteps} other step{actionSteps - messageSteps === 1 ? "" : "s"}.
        </p>
        <p className="mt-1 text-[13px] text-ink-muted">
          Estimated impact: similar SMBs see 100-300 runs/month for this trigger.
        </p>
        <div className="mt-3 flex items-start gap-2 rounded-sm border-l-4 border-warning bg-warning-bg/40 p-3">
          <AlertTriangle size={14} className="mt-0.5 text-warning" />
          <p className="text-[12px] font-medium text-ink-body">
            Active automations can't be paused mid-flow for contacts already running.
          </p>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="inline-flex h-10 items-center rounded-button border border-line bg-white px-4 text-[12px] font-medium text-ink-body">Cancel</button>
          <button type="button" onClick={onConfirm} className="inline-flex h-10 items-center rounded-button bg-cta-gradient px-5 text-[12px] font-semibold text-white">Activate</button>
        </div>
      </div>
    </div>
  );
}
