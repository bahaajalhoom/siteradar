"use client";
import { UiText, useUiLanguage } from '@/components/ui-language';
import { useState, type FormEvent } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  X,
  ArrowRight,
  GlobeHemisphereWest,
  ShieldCheck,
  SpinnerGap,
  Info,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import type { Audit, AuditConfig } from "@/lib/types";
import {apiFetch} from "@/lib/api";
export function NewAudit({
  open,
  onOpenChange,
  onCreated,
  initialConfig,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreated: (a: Audit) => void;
  initialConfig?: AuditConfig;
}) {
  const { t } = useUiLanguage();
  const [pending, setPending] = useState(false),
    [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    const fd = new FormData(event.currentTarget);
    try {
      const raw = String(fd.get("url")).trim();
      const url = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
      const response = await apiFetch("/api/audits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          country: fd.get("country"),
          language: fd.get("language"),
          device: fd.get("device"),
          maxPages: Number(fd.get("maxPages")),
          keywords: String(fd.get("keywords"))
            .split(/[\n,]/)
            .map((x) => x.trim())
            .filter(Boolean),
          authorized: fd.get("authorized") === "on",
        }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error ?? "Could not start scan.");
      onCreated(result.data);
      onOpenChange(false);
      toast.success(
        "Scan queued. Your report will update as pages are checked.",
      );
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Could not reach the server. Try again.",
      );
    } finally {
      setPending(false);
    }
  }
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog-content scan-dialog">
          <Dialog.Close className="icon-btn modal-close" aria-label="Close">
            <X size={20} />
          </Dialog.Close>
          <div className="dialog-icon">
            <GlobeHemisphereWest size={26} />
          </div>
          <Dialog.Title>
            {initialConfig ? <UiText text={"Project scan settings"} /> : <UiText text={"See what search sees."} />}
          </Dialog.Title>
          <Dialog.Description>
            <UiText text={"Start with your website. We’ll turn the evidence into a clear plan."} />
          </Dialog.Description>
          <form onSubmit={submit}>
            <label>
              <UiText text={"Website URL"} />
              <input
                name="url"
                required
                placeholder="https://your-website.com"
                autoFocus
                maxLength={2048}
                defaultValue={initialConfig?.url ?? ""}
                readOnly={!!initialConfig}
              />
            </label>
            <div className="form-grid">
              <label>
                <UiText text={"Target country"} />
                <select
                  name="country"
                  defaultValue={initialConfig?.country ?? "United States"}
                >
                  <option value={"United States"}><UiText text={"United States"} /></option>
                  <option value={"United Kingdom"}><UiText text={"United Kingdom"} /></option>
                  <option value={"Israel"}><UiText text={"Israel"} /></option>
                  <option value={"Saudi Arabia"}><UiText text={"Saudi Arabia"} /></option>
                  <option value={"United Arab Emirates"}><UiText text={"United Arab Emirates"} /></option>
                  <option value={"Germany"}><UiText text={"Germany"} /></option>
                </select>
              </label>
              <label>
                <UiText text={"Content language"} />
                <select
                  name="language"
                  defaultValue={initialConfig?.language ?? "English"}
                >
                  <option value={"English"}><UiText text={"English"} /></option>
                  <option value={"Arabic"}><UiText text={"Arabic"} /></option>
                  <option value={"Hebrew"}><UiText text={"Hebrew"} /></option>
                  <option value={"German"}><UiText text={"German"} /></option>
                </select>
              </label>
            </div>
            <div className="form-grid">
              <label>
                <UiText text={"Device context"} />
                <select
                  name="device"
                  defaultValue={initialConfig?.device ?? "Mobile"}
                >
                  <option value={"Mobile"}><UiText text={"Mobile"} /></option>
                  <option value={"Desktop"}><UiText text={"Desktop"} /></option>
                </select>
              </label>
              <label>
                <UiText text={"Crawl limit"} />
                <select
                  name="maxPages"
                  defaultValue={initialConfig?.maxPages ?? 5}
                >
                  <option value="5"><UiText text={"5 pages · quick check"} /></option>
                  <option value="10"><UiText text={"10 pages"} /></option>
                  <option value="25"><UiText text={"25 pages · full crawl"} /></option>
                  <option value="0"><UiText text={"All discoverable pages"} /></option>
                </select>
              </label>
            </div>
            <label>
              <UiText text={"Keywords"} />{" "}
              <span className="optional">
                <UiText text={"optional · suggested from your pages when empty"} />
              </span>
              <textarea
                name="keywords"
                rows={2}
                placeholder={t("desk accessories, home office essentials")}
                defaultValue={initialConfig?.keywords.join("\n") ?? ""}
              />
            </label>
            <div className="notice">
              <Info size={18} />
              <p>
                Includes rendered-page checks, Lighthouse performance, and
                automated accessibility. Check saved keywords directly on Google.
                Automatic position checks are available when a search service is configured.
                Crawl time
                and resource safeguards still apply.
              </p>
            </div>
            <label className="check-label">
              <input
                type="checkbox"
                name="authorized"
                required
                defaultChecked={initialConfig?.authorized ?? false}
              />
              <span><UiText text={"I own this website or have permission to audit it."} /></span>
            </label>
            {error && (
              <p role="alert" className="form-error">
                {error}
              </p>
            )}
            <button
              className="btn primary full"
              disabled={pending}
              type="submit"
            >
              {pending ? (
                <>
                  <SpinnerGap className="spin" size={18} />
                  <UiText text={"Starting scan…"} />
                </>
              ) : (
                <>
                  <UiText text={"Start website audit"} />
                  <ArrowRight size={18} />
                </>
              )}
            </button>
            <p className="form-foot">
              <ShieldCheck size={14} />
              <UiText text={"Public pages only. Respects robots.txt."} />
            </p>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
