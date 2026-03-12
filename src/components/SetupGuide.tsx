"use client";

import { motion } from "framer-motion";
import {
  Columns,
  Database,
  ExternalLink,
  Layout,
  Link2,
  Settings,
} from "lucide-react";

export function SetupGuide() {
  const steps = [
    {
      title: "Google Sheet Headers",
      description:
        "EnsureRow 1 has these headers: id, userEmail, type, amount, category, description, date",
      icon: <Columns className="w-5 h-5 text-indigo-400" />,
    },
    {
      title: "Create SheetDB API",
      description:
        "Go to sheetdb.io and create a new API using your Google Sheet URL.",
      icon: <Database className="w-5 h-5 text-emerald-400" />,
    },
    {
      title: "Copy API URL",
      description: "Copy your API URL (e.g., https://sheetdb.io/api/v1/xyz).",
      icon: <Link2 className="w-5 h-5 text-blue-400" />,
    },
    {
      title: "Env Configuration",
      description:
        "Paste it into '.env.local' as SHEETDB_API_URL and restart the server.",
      icon: <Layout className="w-5 h-5 text-purple-400" />,
    },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-[#0a0f1c]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full rounded-2xl border border-white/10 bg-slate-900/40 p-8 backdrop-blur-xl shadow-2xl"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 rounded-2xl bg-indigo-500/20 border border-indigo-500/20">
            <Settings className="w-8 h-8 text-indigo-400 animate-spin-slow" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              SheetDB.io Setup Required
            </h1>
            <p className="text-slate-400 mt-1">
              Connect your Google Sheet via SheetDB to start tracking.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                {step.icon}
                <h3 className="font-semibold text-slate-200">{step.title}</h3>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <a
            href="https://sheetdb.io/"
            target="_blank"
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-indigo-500 active:scale-95 w-full"
          >
            Open SheetDB.io <ExternalLink className="w-4 h-4" />
          </a>
          <button
            onClick={() => window.location.reload()}
            className="flex-1 rounded-xl bg-slate-800 px-6 py-3.5 text-sm font-semibold text-white border border-white/5 transition-all hover:bg-slate-700 w-full"
          >
            I've set it up, Reload
          </button>
        </div>
      </motion.div>
    </div>
  );
}
