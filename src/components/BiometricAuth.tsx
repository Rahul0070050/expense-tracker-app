"use client";

import { motion } from "framer-motion";
import { Fingerprint, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { registerBiometrics, authenticateBiometrics, isWebAuthnSupported } from "@/lib/webauthn";

interface BiometricAuthProps {
  username: string;
  onAuthenticated: () => void;
}

export function BiometricAuth({ username, onAuthenticated }: BiometricAuthProps) {
  const [hasCredential, setHasCredential] = useState<boolean | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [isFallbackMode, setIsFallbackMode] = useState(false);
  const [fallbackUsername, setFallbackUsername] = useState("");

  useEffect(() => {
    // Check if webauthn is supported and credential exists
    setIsSupported(isWebAuthnSupported());
    const cred = localStorage.getItem("expense_auth_credential");
    setHasCredential(!!cred);
  }, []);

  // Auto-start scan
  useEffect(() => {
    if (isSupported && hasCredential !== null && !isFallbackMode && status === "idle") {
      if (hasCredential) {
        handleUnlock();
      } else {
        handleSetup();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSupported, hasCredential, isFallbackMode, status]);

  const handleSetup = async () => {
    setStatus("loading");
    setErrorMsg("");
    try {
      if (!isSupported) {
        throw new Error("Your browser or device doesn't support biometric authentication.");
      }
      const success = await registerBiometrics(username);
      if (success) {
        setStatus("success");
        setTimeout(() => {
          onAuthenticated();
        }, 1000);
      } else {
        setStatus("error");
        setErrorMsg("Failed to setup biometrics.");
      }
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message || "An error occurred during setup.");
    }
  };

  const handleUnlock = async () => {
    setStatus("loading");
    setErrorMsg("");
    try {
      const success = await authenticateBiometrics();
      if (success) {
        setStatus("success");
        setTimeout(() => {
          onAuthenticated();
        }, 500);
      } else {
        setStatus("error");
        setErrorMsg("Authentication failed.");
      }
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message || "An error occurred during authentication.");
    }
  };

  const skipAuthIfUnsupported = () => {
      // If WebAuthn isn't supported, provide a bypass so user isn't locked out.
      onAuthenticated();
  }

  const handleFallbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fallbackUsername.trim().toLowerCase() === username.toLowerCase()) {
      setStatus("success");
      setTimeout(() => {
        onAuthenticated();
      }, 500);
    } else {
      setStatus("error");
      setErrorMsg("Incorrect username. Please try again.");
    }
  };

  if (hasCredential === null || isSupported === null) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0f1c]/95 backdrop-blur-md">
            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        </div>
    ); // Initial checking state
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0f1c]/95 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col items-center relative overflow-hidden shadow-2xl"
      >
        <div className="w-20 h-20 mb-6 rounded-full bg-blue-500/10 flex items-center justify-center relative">
          {status === "success" ? (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </motion.div>
          ) : status === "error" ? (
            <AlertCircle className="w-10 h-10 text-rose-400" />
          ) : hasCredential ? (
            <Lock className="w-10 h-10 text-blue-400" />
          ) : (
            <Fingerprint className="w-10 h-10 text-blue-400" />
          )}

          {status === "loading" && (
            <div className="absolute inset-0 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
          )}
        </div>

        <h2 className="text-2xl font-bold text-white mb-2 text-center">
          {!isSupported ? "Biometrics Unsupported" : hasCredential ? "Welcome Back" : "Secure Your App"}
        </h2>
        <p className="text-slate-400 text-center mb-8 text-sm">
          {!isSupported ? 
            "Your device does not support fingerprint login. You can skip this step." :
             hasCredential
            ? `Unlock Expense Tracker to access your finances, ${username}.`
            : "Set up fingerprint or Face ID to securely access your data without a password."}
        </p>

        {status === "error" && (
          <div className="w-full p-3 mb-6 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400 text-center">
            {errorMsg}
          </div>
        )}

        {!isFallbackMode ? (
          <>
            <button
              onClick={!isSupported ? skipAuthIfUnsupported : (hasCredential ? handleUnlock : handleSetup)}
              disabled={status === "loading" || status === "success"}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-medium shadow-lg shadow-blue-500/25 transition-all outline-none disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {status === "loading" ? (
                "Processing..."
              ) : status === "success" ? (
                hasCredential ? "Unlocked!" : "Setup Complete!"
              ) : (
                <>
                  {!isSupported ? null : <Fingerprint className="w-5 h-5" />}
                  {!isSupported ? "Skip Security" : (hasCredential ? "Unlock with Biometrics" : "Set up Biometrics")}
                </>
              )}
            </button>

            {isSupported && (
              <button
                onClick={() => hasCredential ? setIsFallbackMode(true) : onAuthenticated()}
                className="mt-6 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
              >
                {hasCredential ? "Or login with Username instead" : "Skip and continue with Username"}
              </button>
            )}

            {/* Option to clear name and reset if someone else is using the device or auth fails consistently */}
            <button
              onClick={() => {
                localStorage.removeItem("expense_user_name");
                localStorage.removeItem("expense_auth_credential");
                window.location.reload();
              }}
              className="mt-6 text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Switch User / Reset Configuration
            </button>
          </>
        ) : (
          <form onSubmit={handleFallbackSubmit} className="w-full space-y-4">
            <div className="relative">
              <input
                autoFocus
                type="text"
                required
                value={fallbackUsername}
                onChange={(e) => {
                  setFallbackUsername(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                placeholder="Enter your username to unlock"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={status === "success" || !fallbackUsername.trim()}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-medium shadow-lg shadow-blue-500/25 transition-all outline-none disabled:opacity-50"
            >
              {status === "success" ? "Unlocked!" : "Unlock"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsFallbackMode(false);
                setStatus("idle");
                setErrorMsg("");
              }}
              className="w-full mt-4 text-sm font-medium text-slate-400 hover:text-slate-300 transition-colors"
            >
              Back to Biometrics
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
