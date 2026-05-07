import { Check, Info, X } from "lucide-react";
import { InstagramLogo, LinkedinLogo } from "../BrandLogos.jsx";
import { FacebookLogo } from "./SocialLogos.jsx";
import { PLATFORMS } from "./data.js";

const LOGO_BY_ID = { linkedin: LinkedinLogo, facebook: FacebookLogo, instagram: InstagramLogo };

export default function ConnectModal({ accounts, onToggle, onClose }) {
  return (
    <div role="dialog" aria-modal="true" onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
      <div onClick={(e) => e.stopPropagation()} className="flex w-full max-w-[560px] flex-col gap-4 rounded-md border border-line bg-white p-6 shadow-card">
        <header className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h3 className="text-[18px] font-semibold text-ink-heading">Connect your social accounts</h3>
            <p className="text-[13px] font-medium text-ink-muted">Link your accounts to publish posts and track performance.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="inline-flex h-8 w-8 items-center justify-center rounded-xs text-ink-muted hover:bg-surface-muted">
            <X size={16} />
          </button>
        </header>

        <div className="flex flex-col gap-3">
          {PLATFORMS.map((p) => {
            const state = accounts[p.id] ?? { connected: false };
            const Logo = LOGO_BY_ID[p.id];
            return (
              <article key={p.id} className="flex flex-col gap-2 rounded-md border border-line bg-white p-5">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-sm" style={{ backgroundColor: `${p.color}1A` }}>
                    <Logo size={24} />
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="text-[14px] font-semibold text-ink-heading">{p.name}</span>
                    <span className="text-[12px] font-medium text-ink-muted">{p.description}</span>
                  </div>
                  {state.connected ? (
                    <button type="button" onClick={() => onToggle(p.id)} className="inline-flex h-9 items-center rounded-button px-3 text-[12px] font-semibold text-danger hover:bg-danger-bg">
                      Disconnect
                    </button>
                  ) : (
                    <button type="button" onClick={() => onToggle(p.id)} className="inline-flex h-9 items-center rounded-button border border-ink-heading bg-white px-4 text-[12px] font-semibold text-ink-heading hover:bg-surface-subtle">
                      Connect →
                    </button>
                  )}
                </div>
                {state.connected && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-success">
                    <Check size={12} strokeWidth={2.5} />
                    Connected as {state.name}
                  </span>
                )}
                {p.requiresFacebook && !accounts.facebook?.connected && (
                  <p className="inline-flex items-center gap-1.5 rounded-sm bg-info-bg px-2 py-1.5 text-[11px] font-medium text-info">
                    <Info size={12} />
                    Instagram requires a Facebook Page connection. Connect Facebook first.
                  </p>
                )}
              </article>
            );
          })}
        </div>

        <div className="flex justify-end gap-2 border-t border-line pt-3">
          <button type="button" onClick={onClose} className="inline-flex h-10 items-center rounded-button bg-cta-gradient px-5 text-[13px] font-semibold text-white">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
