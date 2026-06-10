import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Save,
  Send,
  Eye,
  Plus,
  ChevronDown,
  ChevronUp,
  Trash2,
  GripVertical,
  TextCursorInput as FormInput,
  Heading,
  AlignLeft,
  Calendar,
  SquareCheck as CheckSquare,
  Circle,
  ListOrdered,
  Image as ImageIcon,
  MousePointerClick,
  Type as TypeIcon,
} from "lucide-react";
import { COMPONENT_CATALOG, COMPONENT_KIND } from "./mock-data.js";

// Full-screen visual builder for a single WhatsApp Flow.
// - LEFT (240px): grouped components palette
// - CENTER     : vertical screen cards with components
// - RIGHT (300px): selected component property editor w/ Style/Logic/Data tabs
// - BOTTOM     : screen tabs (Screen 1, Screen 2, +Add screen)
export default function FlowBuilder({ flow, onBack }) {
  const [name, setName] = useState(flow?.name ?? "Untitled Flow");
  const [screens, setScreens] = useState(
    () =>
      flow?.screens?.length
        ? deepCloneScreens(flow.screens)
        : [
            {
              id: "s1",
              title: "Screen 1",
              components: [
                { id: "c1", type: "TextHeading", label: "Welcome" },
                { id: "c2", type: "TextBody",    label: "Tell us a bit about you." },
              ],
            },
          ],
  );
  const [activeScreenId, setActiveScreenId] = useState(screens[0]?.id);
  const [selectedComponentId, setSelectedComponentId] = useState(null);

  const activeScreen = screens.find((s) => s.id === activeScreenId) ?? screens[0];
  const selectedComponent =
    activeScreen?.components.find((c) => c.id === selectedComponentId) ?? null;

  /* ------- screen-level handlers ------- */
  const handleAddScreen = () => {
    const id = `s${Date.now()}`;
    const next = {
      id,
      title: `Screen ${screens.length + 1}`,
      components: [],
    };
    setScreens([...screens, next]);
    setActiveScreenId(id);
  };

  const handleRenameScreen = (screenId, title) => {
    setScreens(screens.map((s) => (s.id === screenId ? { ...s, title } : s)));
  };

  const handleDeleteScreen = (screenId) => {
    if (screens.length <= 1) return;
    const next = screens.filter((s) => s.id !== screenId);
    setScreens(next);
    if (activeScreenId === screenId) setActiveScreenId(next[0].id);
  };

  /* ------- component-level handlers ------- */
  const updateActiveScreen = (mutator) => {
    setScreens(
      screens.map((s) => (s.id === activeScreen.id ? mutator(s) : s)),
    );
  };

  const handleAddComponent = (type) => {
    const id = `c${Date.now()}`;
    const fresh = {
      id,
      type,
      label: defaultLabelFor(type),
      required: false,
      placeholder: "",
    };
    if (type === "Dropdown" || type === "RadioGroup" || type === "Checkbox") {
      fresh.options = ["Option 1", "Option 2"];
    }
    updateActiveScreen((s) => ({ ...s, components: [...s.components, fresh] }));
    setSelectedComponentId(id);
  };

  const handleMoveComponent = (componentId, dir) => {
    updateActiveScreen((s) => {
      const list = [...s.components];
      const i = list.findIndex((c) => c.id === componentId);
      const j = dir === "up" ? i - 1 : i + 1;
      if (i < 0 || j < 0 || j >= list.length) return s;
      [list[i], list[j]] = [list[j], list[i]];
      return { ...s, components: list };
    });
  };

  const handleDeleteComponent = (componentId) => {
    updateActiveScreen((s) => ({
      ...s,
      components: s.components.filter((c) => c.id !== componentId),
    }));
    if (selectedComponentId === componentId) setSelectedComponentId(null);
  };

  const handleUpdateComponent = (componentId, patch) => {
    updateActiveScreen((s) => ({
      ...s,
      components: s.components.map((c) =>
        c.id === componentId ? { ...c, ...patch } : c,
      ),
    }));
  };

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-canvas">
      {/* Top bar */}
      <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-[#E5E7EB] bg-white px-4">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-9 items-center gap-1.5 rounded-sm border border-line bg-white px-3 text-[13px] font-medium text-ink-body hover:bg-surface-subtle"
          >
            <ArrowLeft size={14} strokeWidth={1.75} />
            Back
          </button>
          <div className="flex min-w-0 flex-col gap-0.5">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="min-w-0 truncate bg-transparent text-[15px] font-semibold text-ink-heading focus:outline-none"
            />
            <span className="text-[11px] font-medium text-ink-muted">
              {screens.length} screen{screens.length === 1 ? "" : "s"} ·{" "}
              {screens.reduce((acc, s) => acc + s.components.length, 0)} components
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => alert(`Preview of "${name}" (mock)`)}
            className="inline-flex h-9 items-center gap-1.5 rounded-sm border border-line bg-white px-3 text-[13px] font-medium text-ink-body hover:bg-surface-subtle"
          >
            <Eye size={14} strokeWidth={1.75} />
            Test
          </button>
          <button
            type="button"
            onClick={() => alert(`Saved "${name}" (mock)`)}
            className="inline-flex h-9 items-center gap-1.5 rounded-sm border border-line bg-white px-3 text-[13px] font-medium text-ink-body hover:bg-surface-subtle"
          >
            <Save size={14} strokeWidth={1.75} />
            Save draft
          </button>
          <button
            type="button"
            onClick={() => alert(`Submitted "${name}" for review (mock)`)}
            className="inline-flex h-9 items-center gap-1.5 rounded-button bg-cta-gradient px-4 text-[13px] font-medium text-white shadow-[0_0_10px_rgba(1,170,154,0.3)]"
          >
            <Send size={14} strokeWidth={2} />
            Publish
          </button>
        </div>
      </header>

      {/* 3-column body */}
      <div className="flex min-h-0 flex-1">
        {/* LEFT — components palette */}
        <aside className="flex w-[240px] shrink-0 flex-col gap-4 overflow-y-auto border-r border-[#E5E7EB] bg-white p-4">
          <div className="flex flex-col gap-1">
            <span className="text-[12px] font-semibold text-ink-heading">
              Components
            </span>
            <p className="text-[11px] font-medium text-ink-muted">
              Click to add to the active screen
            </p>
          </div>
          {COMPONENT_CATALOG.map((group) => (
            <div key={group.id} className="flex flex-col gap-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
                {group.label}
              </span>
              <div className="flex flex-col gap-1">
                {group.items.map((it) => (
                  <PaletteItem
                    key={it.type}
                    type={it.type}
                    label={it.label}
                    description={it.description}
                    onClick={() => handleAddComponent(it.type)}
                  />
                ))}
              </div>
            </div>
          ))}
        </aside>

        {/* CENTER — canvas */}
        <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6">
            <div className="mx-auto flex w-full max-w-[640px] flex-col gap-4">
              <ScreenCard
                screen={activeScreen}
                selectedId={selectedComponentId}
                onSelect={setSelectedComponentId}
                onRename={(title) => handleRenameScreen(activeScreen.id, title)}
                onMove={handleMoveComponent}
                onDelete={handleDeleteComponent}
                onAddComponent={handleAddComponent}
              />

              <button
                type="button"
                onClick={handleAddScreen}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-[12px] border border-dashed border-line bg-white text-[13px] font-medium text-ink-muted hover:border-brand-600 hover:text-brand-600"
              >
                <Plus size={14} strokeWidth={1.75} />
                Add screen
              </button>
            </div>
          </div>

          {/* Bottom toolbar — screen tabs */}
          <div className="flex h-12 shrink-0 items-center gap-1 overflow-x-auto border-t border-[#E5E7EB] bg-white px-3">
            {screens.map((s, i) => {
              const isActive = s.id === activeScreenId;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setActiveScreenId(s.id);
                    setSelectedComponentId(null);
                  }}
                  className={[
                    "inline-flex h-8 items-center gap-1.5 rounded-pill border px-3 text-[12px] font-medium",
                    isActive
                      ? "border-brand-600 bg-brand-50 text-brand-600"
                      : "border-line bg-canvas text-ink-muted hover:bg-surface-subtle",
                  ].join(" ")}
                >
                  Screen {i + 1}
                  {screens.length > 1 && (
                    <span
                      role="button"
                      tabIndex={-1}
                      aria-label="Delete screen"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteScreen(s.id);
                      }}
                      className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full text-ink-muted hover:bg-surface-muted"
                    >
                      <Trash2 size={10} strokeWidth={1.75} />
                    </span>
                  )}
                </button>
              );
            })}
            <button
              type="button"
              onClick={handleAddScreen}
              className="ml-1 inline-flex h-8 items-center gap-1.5 rounded-pill border border-dashed border-line bg-white px-3 text-[12px] font-medium text-ink-muted hover:bg-surface-subtle"
            >
              <Plus size={12} strokeWidth={1.75} />
              Add screen
            </button>
          </div>
        </main>

        {/* RIGHT — settings rail */}
        <aside className="flex w-[300px] shrink-0 flex-col border-l border-[#E5E7EB] bg-white">
          <SettingsRail
            component={selectedComponent}
            onUpdate={(patch) =>
              selectedComponent &&
              handleUpdateComponent(selectedComponent.id, patch)
            }
          />
        </aside>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------- */
/* Palette                                                                */
/* --------------------------------------------------------------------- */

const COMPONENT_ICON = {
  TextHeading:    Heading,
  TextSubheading: Heading,
  TextBody:       AlignLeft,
  TextCaption:    TypeIcon,
  TextInput:      FormInput,
  TextArea:       AlignLeft,
  DatePicker:     Calendar,
  Dropdown:       ListOrdered,
  RadioGroup:     Circle,
  Checkbox:       CheckSquare,
  OptIn:          CheckSquare,
  Image:          ImageIcon,
  EmbeddedFooter: MousePointerClick,
  FooterButton:   MousePointerClick,
};

function PaletteItem({ type, label, description, onClick }) {
  const Icon = COMPONENT_ICON[type] ?? FormInput;
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-start gap-2 rounded-[10px] border border-transparent bg-canvas px-2.5 py-2 text-left hover:border-line hover:bg-surface-subtle"
    >
      <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-sm bg-white text-ink-muted group-hover:text-brand-600">
        <Icon size={13} strokeWidth={1.75} />
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="truncate text-[12px] font-semibold text-ink-heading">
          {label}
        </span>
        <span className="truncate text-[10px] font-medium text-ink-muted">
          {description}
        </span>
      </span>
    </button>
  );
}

/* --------------------------------------------------------------------- */
/* Screen card                                                            */
/* --------------------------------------------------------------------- */

function ScreenCard({
  screen,
  selectedId,
  onSelect,
  onRename,
  onMove,
  onDelete,
  onAddComponent,
}) {
  if (!screen) return null;
  return (
    <section className="flex flex-col gap-3 rounded-[12px] border border-[#E5E7EB] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <header className="flex items-center justify-between gap-3 border-b border-line pb-3">
        <input
          type="text"
          value={screen.title}
          onChange={(e) => onRename(e.target.value)}
          className="min-w-0 flex-1 bg-transparent text-[14px] font-semibold text-ink-heading focus:outline-none"
        />
        <span className="text-[11px] font-medium text-ink-muted">
          {screen.components.length} components
        </span>
      </header>

      {screen.components.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-1.5 rounded-[10px] border border-dashed border-line bg-canvas py-10 text-center">
          <span className="text-[13px] font-semibold text-ink-heading">
            Empty screen
          </span>
          <span className="text-[11px] font-medium text-ink-muted">
            Add components from the left palette
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {screen.components.map((c, i) => (
            <ComponentRow
              key={c.id}
              component={c}
              index={i}
              total={screen.components.length}
              selected={c.id === selectedId}
              onSelect={() => onSelect(c.id)}
              onMoveUp={() => onMove(c.id, "up")}
              onMoveDown={() => onMove(c.id, "down")}
              onDelete={() => onDelete(c.id)}
            />
          ))}
        </div>
      )}

      <QuickAdd onAdd={onAddComponent} />
    </section>
  );
}

function ComponentRow({
  component,
  index,
  total,
  selected,
  onSelect,
  onMoveUp,
  onMoveDown,
  onDelete,
}) {
  const Icon = COMPONENT_ICON[component.type] ?? FormInput;
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className={[
        "flex items-center gap-2 rounded-[10px] border bg-white px-3 py-2.5 transition-colors",
        selected
          ? "border-brand-600 shadow-[0_0_0_3px_rgba(30,182,119,0.15)]"
          : "border-[#E5E7EB] hover:border-[#D1D5DB]",
      ].join(" ")}
    >
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-sm bg-surface-subtle text-ink-muted">
        <GripVertical size={12} strokeWidth={1.75} />
      </span>
      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-sm bg-brand-50 text-brand-600">
        <Icon size={13} strokeWidth={1.75} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-[13px] font-semibold text-ink-heading">
          {component.label || component.type}
        </span>
        <span className="truncate text-[11px] font-medium text-ink-muted">
          {humanType(component.type)}
          {component.required ? " · Required" : ""}
        </span>
      </div>
      <button
        type="button"
        aria-label="Move up"
        disabled={index === 0}
        onClick={(e) => {
          e.stopPropagation();
          onMoveUp();
        }}
        className="inline-flex h-7 w-7 items-center justify-center rounded-xs text-ink-muted hover:bg-surface-subtle disabled:opacity-40"
      >
        <ChevronUp size={14} strokeWidth={1.75} />
      </button>
      <button
        type="button"
        aria-label="Move down"
        disabled={index === total - 1}
        onClick={(e) => {
          e.stopPropagation();
          onMoveDown();
        }}
        className="inline-flex h-7 w-7 items-center justify-center rounded-xs text-ink-muted hover:bg-surface-subtle disabled:opacity-40"
      >
        <ChevronDown size={14} strokeWidth={1.75} />
      </button>
      <button
        type="button"
        aria-label="Delete component"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="inline-flex h-7 w-7 items-center justify-center rounded-xs text-ink-muted hover:bg-danger-bg hover:text-danger"
      >
        <Trash2 size={12} strokeWidth={1.75} />
      </button>
    </div>
  );
}

function QuickAdd({ onAdd }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-sm border border-dashed border-line bg-canvas text-[13px] font-medium text-ink-muted hover:border-brand-600 hover:text-brand-600"
      >
        <Plus size={14} strokeWidth={1.75} />
        Add component
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <div className="absolute bottom-full left-0 right-0 z-20 mb-1 max-h-[280px] overflow-y-auto rounded-[10px] border border-[#E5E7EB] bg-white p-1.5 shadow-lg">
            {COMPONENT_CATALOG.map((group) => (
              <div key={group.id} className="flex flex-col gap-0.5 py-1">
                <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
                  {group.label}
                </span>
                {group.items.map((it) => (
                  <button
                    key={it.type}
                    type="button"
                    onClick={() => {
                      onAdd(it.type);
                      setOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-[6px] px-2 py-1.5 text-left text-[12px] font-medium text-ink-body hover:bg-surface-subtle"
                  >
                    {it.label}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* --------------------------------------------------------------------- */
/* Settings rail                                                          */
/* --------------------------------------------------------------------- */

function SettingsRail({ component, onUpdate }) {
  const [tab, setTab] = useState("style");

  if (!component) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 px-5 text-center">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-surface-subtle text-ink-muted">
          <FormInput size={16} strokeWidth={1.75} />
        </span>
        <span className="text-[13px] font-semibold text-ink-heading">
          No component selected
        </span>
        <span className="text-[11px] font-medium text-ink-muted">
          Click a component on the canvas to edit its properties.
        </span>
      </div>
    );
  }

  const kind = COMPONENT_KIND[component.type] ?? "input";

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-col gap-1 border-b border-line px-4 py-3">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
          {humanType(component.type)}
        </span>
        <span className="truncate text-[13px] font-semibold text-ink-heading">
          {component.label || component.type}
        </span>
      </div>

      <div className="flex items-center gap-1 border-b border-line px-3 pt-2">
        {["style", "logic", "data"].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={[
              "h-8 rounded-[8px] px-3 text-[12px] font-semibold capitalize",
              tab === t
                ? "bg-brand-50 text-brand-600"
                : "text-ink-muted hover:bg-surface-subtle",
            ].join(" ")}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
        {tab === "style" && (
          <>
            <Field label="Label">
              <TextField
                value={component.label ?? ""}
                onChange={(v) => onUpdate({ label: v })}
                placeholder="Field label"
              />
            </Field>
            {kind === "input" && component.type !== "OptIn" && (
              <Field label="Placeholder">
                <TextField
                  value={component.placeholder ?? ""}
                  onChange={(v) => onUpdate({ placeholder: v })}
                  placeholder="e.g. Jane Doe"
                />
              </Field>
            )}
            {kind === "input" && (
              <Field label="Default value">
                <TextField
                  value={component.defaultValue ?? ""}
                  onChange={(v) => onUpdate({ defaultValue: v })}
                  placeholder="Optional"
                />
              </Field>
            )}
            {Array.isArray(component.options) && (
              <Field label="Options (one per line)">
                <textarea
                  value={component.options.join("\n")}
                  onChange={(e) =>
                    onUpdate({
                      options: e.target.value
                        .split("\n")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  rows={4}
                  className="rounded-sm border border-line bg-white px-2.5 py-2 text-[12px] font-medium text-ink-heading placeholder:text-ink-subtle focus:border-brand-500 focus:outline-none"
                />
              </Field>
            )}
            {kind === "input" && (
              <Toggle
                checked={!!component.required}
                onChange={(v) => onUpdate({ required: v })}
                label="Required"
              />
            )}
          </>
        )}

        {tab === "logic" && (
          <>
            <Field label="Visibility condition">
              <TextField
                value={component.visibility ?? ""}
                onChange={(v) => onUpdate({ visibility: v })}
                placeholder="e.g. preferred_channel == 'WhatsApp'"
              />
            </Field>
            <Field label="Validation regex">
              <TextField
                value={component.validation ?? ""}
                onChange={(v) => onUpdate({ validation: v })}
                placeholder="^[A-Z][a-z]+$"
              />
            </Field>
            <Field label="Error message">
              <TextField
                value={component.errorMessage ?? ""}
                onChange={(v) => onUpdate({ errorMessage: v })}
                placeholder="Please enter a valid value"
              />
            </Field>
          </>
        )}

        {tab === "data" && (
          <>
            <Field label="Field key">
              <TextField
                value={component.fieldKey ?? toKey(component.label)}
                onChange={(v) => onUpdate({ fieldKey: v })}
                placeholder="full_name"
              />
            </Field>
            <Field label="Map to CRM field">
              <select
                value={component.crmField ?? ""}
                onChange={(e) => onUpdate({ crmField: e.target.value })}
                className="h-9 rounded-sm border border-line bg-white px-2.5 text-[12px] font-medium text-ink-heading focus:border-brand-500 focus:outline-none"
              >
                <option value="">Do not map</option>
                <option value="name">Lead · Name</option>
                <option value="email">Lead · Email</option>
                <option value="phone">Lead · Phone</option>
                <option value="company">Lead · Company</option>
                <option value="source">Lead · Source</option>
                <option value="custom">Custom field…</option>
              </select>
            </Field>
            <Toggle
              checked={!!component.persist}
              onChange={(v) => onUpdate({ persist: v })}
              label="Save to data store"
            />
          </>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
        {label}
      </span>
      {children}
    </label>
  );
}

function TextField({ value, onChange, placeholder }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-9 rounded-sm border border-line bg-white px-2.5 text-[12px] font-medium text-ink-heading placeholder:text-ink-subtle focus:border-brand-500 focus:outline-none"
    />
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-[8px] border border-line bg-canvas px-3 py-2">
      <span className="text-[12px] font-medium text-ink-heading">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={[
          "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
          checked ? "bg-brand-600" : "bg-line-strong",
        ].join(" ")}
      >
        <span
          className={[
            "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform",
            checked ? "translate-x-4" : "translate-x-0.5",
          ].join(" ")}
        />
      </button>
    </label>
  );
}

/* --------------------------------------------------------------------- */
/* helpers                                                                */
/* --------------------------------------------------------------------- */

function defaultLabelFor(type) {
  const map = {
    TextHeading:    "Heading",
    TextSubheading: "Subheading",
    TextBody:       "Some body text",
    TextCaption:    "Caption",
    TextInput:      "New text input",
    TextArea:       "New text area",
    DatePicker:     "Pick a date",
    Dropdown:       "New dropdown",
    RadioGroup:     "New radio group",
    Checkbox:       "New checkbox",
    OptIn:          "I agree to the terms",
    Image:          "Image",
    EmbeddedFooter: "Embedded footer",
    FooterButton:   "Submit",
  };
  return map[type] ?? type;
}

function humanType(type) {
  return type
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}

function toKey(label) {
  return (label ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

function deepCloneScreens(screens) {
  return screens.map((s) => ({
    ...s,
    components: s.components.map((c) => ({
      ...c,
      ...(Array.isArray(c.options) ? { options: [...c.options] } : null),
    })),
  }));
}
