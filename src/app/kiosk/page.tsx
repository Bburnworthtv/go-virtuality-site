"use client";

import { FormEvent, useEffect, useState } from "react";

type SessionResolveResponse = {
  success?: boolean;
  patient_name?: string;
  session_token?: string;
  error?: string;
};

type KioskResult = {
  success?: boolean;
  matched?: boolean;
  error?: string;
};

const initialForm = {
  rideName: "",
  ridePhone: "",
  relationship: "Guardian",
  consent: false
};

export default function KioskPage() {
  const [sessionCode, setSessionCode] = useState("");
  const [resolvedSessionCode, setResolvedSessionCode] = useState("");
  const [patientName, setPatientName] = useState("");
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("session");

    if (token) {
      setSessionCode(token.toUpperCase());
      void resolveSession(token);
    }
  }, []);

  async function resolveSession(tokenValue?: string) {
    const token = (tokenValue || sessionCode).trim().toUpperCase();

    if (!token) {
      setError("Enter the discharge code from the nurse station.");
      return;
    }

    setResolving(true);
    setError("");

    try {
      const response = await fetch("/api/kiosk/session/resolve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          session_token: token
        })
      });

      const data = (await response.json()) as SessionResolveResponse;

      if (!response.ok) {
        throw new Error(data.error || "Invalid discharge code");
      }

      setResolvedSessionCode(data.session_token || token);
      setPatientName(data.patient_name || "your patient");
    } catch (resolveError) {
      setPatientName("");
      setResolvedSessionCode("");
      setError(
        resolveError instanceof Error
          ? resolveError.message
          : "Could not verify discharge code"
      );
    } finally {
      setResolving(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!resolvedSessionCode) {
      setError("Enter the discharge code first.");
      return;
    }

    if (!form.rideName.trim() || !form.ridePhone.trim() || !form.consent) {
      setError("Complete the ride details and consent first.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/kiosk/register-ride", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          session_token: resolvedSessionCode,
          guardian_name: form.rideName,
          guardian_phone: form.ridePhone,
          guardian_relationship: form.relationship,
          consent_confirmed: form.consent
        })
      });

      const data = (await response.json()) as KioskResult;

      if (!response.ok) {
        throw new Error(data.error || "Could not submit pickup request");
      }

      setForm(initialForm);
      setSessionCode("");
      setResolvedSessionCode("");
      setPatientName("");
      setSuccessMessage("Pickup request sent.");

      setTimeout(() => {
        setSuccessMessage("");
      }, 4000);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Could not submit pickup request"
      );
    } finally {
      setSubmitting(false);
    }
  }

  const sessionReady = Boolean(resolvedSessionCode && patientName);

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-2xl border border-line bg-surface p-6 shadow-soft md:p-8">
        <div className="border-b border-line pb-6">
          <p className="eyebrow">Kiosk</p>
          <h1 className="display-title mt-3 text-3xl leading-tight md:text-4xl">
            Request pickup
          </h1>
          <p className="shell-copy mt-3 max-w-lg">
            Enter the discharge code from the nurse station and submit the pickup contact.
          </p>
        </div>

        {successMessage ? (
          <div className="mt-5 border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-text">
            {successMessage}
          </div>
        ) : null}

        {!sessionReady ? (
          <div className="mt-6">
            <p className="text-[0.68rem] uppercase tracking-[0.18em] text-muted">
              Discharge code
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">
              <input
                value={sessionCode}
                onChange={(event) =>
                  setSessionCode(
                    event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10)
                  )
                }
                className="border border-line bg-background px-4 py-4 text-center text-xl font-medium uppercase tracking-[0.3em] outline-none"
                placeholder="ABC1234DEF"
              />
              <button
                type="button"
                onClick={() => void resolveSession()}
                disabled={resolving}
                className="btn-primary min-w-[10rem]"
              >
                {resolving ? "Checking" : "Continue"}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={(event) => void handleSubmit(event)} className="mt-6 space-y-5">
            <div className="border border-line bg-background px-4 py-4 text-sm text-text">
              Pickup request for <span className="font-medium">{patientName}</span>
            </div>

            <label className="grid gap-2 text-sm">
              <span>Pickup contact *</span>
              <input
                value={form.rideName}
                onChange={(event) =>
                  setForm((current) => ({ ...current, rideName: event.target.value }))
                }
                className="border border-line bg-background px-4 py-3 outline-none"
                placeholder="Full name"
              />
            </label>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2 text-sm">
                <span>Mobile number *</span>
                <input
                  value={form.ridePhone}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, ridePhone: event.target.value }))
                  }
                  className="border border-line bg-background px-4 py-3 outline-none"
                  placeholder="+27 82 123 4567"
                />
              </label>
              <label className="grid gap-2 text-sm">
                <span>Relationship</span>
                <select
                  value={form.relationship}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      relationship: event.target.value
                    }))
                  }
                  className="border border-line bg-background px-4 py-3 outline-none"
                >
                  <option>Guardian</option>
                  <option>Parent</option>
                  <option>Sibling</option>
                  <option>Ride Driver</option>
                  <option>Other</option>
                </select>
              </label>
            </div>

            <label className="flex items-start gap-3 text-sm leading-6 text-muted">
              <input
                type="checkbox"
                checked={form.consent}
                onChange={(event) =>
                  setForm((current) => ({ ...current, consent: event.target.checked }))
                }
                className="mt-1"
              />
              <span>I consent to discharge pickup updates by SMS or WhatsApp.</span>
            </label>

            <button type="submit" disabled={submitting} className="btn-primary w-full md:w-auto">
              {submitting ? "Sending" : "Request Pickup"}
            </button>
          </form>
        )}

        {error ? (
          <div className="mt-5 border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}
      </div>
    </div>
  );
}
