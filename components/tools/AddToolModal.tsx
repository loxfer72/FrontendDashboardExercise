"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useAppDispatch } from "@/hooks/useRedux";
import { addTool } from "@/store/toolsSlice";
import type { Tool } from "@/types";

interface Props { categories: string[], onClose: () => void }
type Step = 0 | 1 | 2;
const STEP_LABELS = ["Basic Info", "Details", "Confirm"] as const;

const EMPTY_FORM = {
  name: "", vendor: "", website_url: "",
  category: "", owner_department: "",
  monthly_cost: "", description: "",
  status: "active" as Tool["status"],
};

export function AddToolModal({ categories,onClose }: Props) {
  const dispatch = useAppDispatch();
  const [step, setStep] = useState<Step>(0);
  const [form, setForm] = useState(EMPTY_FORM);

  const update = (key: keyof typeof EMPTY_FORM, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = () => {
    dispatch(addTool({
      id: Date.now(), ...form,
      monthly_cost:        parseFloat(form.monthly_cost) || 0,
      previous_month_cost: 0,
      active_users_count:  0,
      icon_url:            "",
      created_at:          new Date().toISOString(),
      updated_at:          new Date().toISOString(),
    }));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-ui-card rounded-2xl border border-ui-border shadow-2xl animate-slide-up">

        <div className="flex items-center justify-between p-6 border-b border-ui-border">
          <div>
            <h2 className="font-semibold">Add New Tool</h2>
            <p className="text-xs text-ui-muted mt-0.5">
              Step {step + 1} of {STEP_LABELS.length} — {STEP_LABELS[step]}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-ui-border">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex px-6 pt-5 gap-2">
          {STEP_LABELS.map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
              i <= step ? "bg-brand-purple" : "bg-ui-border"
            }`} />
          ))}
        </div>

        <div className="p-6 space-y-4">
          {step === 0 && (
            <>
              <Field label="Tool Name"   value={form.name}        onChange={(v) => update("name", v)}        placeholder="e.g. Slack" />
              <Field label="Vendor"      value={form.vendor}      onChange={(v) => update("vendor", v)}      placeholder="e.g. Slack Inc." />
              <Field label="Website URL" value={form.website_url} onChange={(v) => update("website_url", v)} placeholder="https://..." />
            </>
          )}
          {step === 1 && (
            <>
              <div>
                <label className="block text-xs font-medium mb-1.5 text-ui-muted">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => update("category", e.target.value)}
                  className="w-full text-sm rounded-xl px-3 py-2 bg-ui-bg border border-ui-border focus:outline-none focus:ring-2 focus:ring-brand-purple/40"
                >
                  <option value="">Select a category</option>
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <Field label="Department"       value={form.owner_department} onChange={(v) => update("owner_department", v)} placeholder="e.g. Engineering" />
              <Field label="Monthly Cost (€)" value={form.monthly_cost}    onChange={(v) => update("monthly_cost", v)}     placeholder="0" type="number" />
              <div>
                <label className="block text-xs font-medium mb-1.5 text-ui-muted">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  rows={3}
                  placeholder="Short description..."
                  className="w-full text-sm rounded-xl px-3 py-2 bg-ui-bg border border-ui-border focus:outline-none focus:ring-2 focus:ring-brand-purple/40 resize-none"
                />
              </div>
            </>
          )}
          {step === 2 && (
            <div className="space-y-2.5 text-sm">
              {(Object.entries(form) as [keyof typeof EMPTY_FORM, string][])
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k} className="flex justify-between items-center py-1 border-b border-ui-border last:border-0">
                    <span className="text-ui-muted text-xs capitalize">{k.replace(/_/g, " ")}</span>
                    <span className="font-medium text-sm">{v}</span>
                  </div>
                ))}
            </div>
          )}
        </div>

        <div className="flex justify-between px-6 pb-6">
          <button
            onClick={() => step > 0 ? setStep((step - 1) as Step) : onClose()}
            className="px-4 py-2 rounded-xl text-sm hover:bg-ui-border transition-colors"
          >
            {step === 0 ? "Cancel" : "Back"}
          </button>
          <button
            onClick={() => step < 2 ? setStep((step + 1) as Step) : handleSubmit()}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-brand-purple text-white hover:bg-brand-purple/90 transition-colors"
          >
            {step === 2 ? "Add Tool" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5 text-ui-muted">{label}</label>
      <input
        type={type} value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full text-sm rounded-xl px-3 py-2 bg-ui-bg border border-ui-border focus:outline-none focus:ring-2 focus:ring-brand-purple/40 transition-all"
      />
    </div>
  );
}