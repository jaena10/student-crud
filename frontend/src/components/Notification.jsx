import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function Notification({ notification, onDismiss }) {
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 4500);
    return () => clearTimeout(timer);
  }, [notification, onDismiss]);

  if (!notification) return null;

  const isSuccess = notification.type === 'success';

  return (
    <div
      className={`rounded-xl border p-4 shadow-sm flex items-start justify-between gap-3 transition-all ${
        isSuccess
          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
          : 'bg-rose-50 border-rose-200 text-rose-900'
      }`}
    >
      <div className="flex items-center gap-2.5">
        {isSuccess ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
        ) : (
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
        )}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider">
            {isSuccess ? 'Success' : 'Notice'}
          </h4>
          <p className="text-sm font-medium mt-0.5">{notification.message}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onDismiss}
        className={`p-1 rounded-md transition ${
          isSuccess
            ? 'hover:bg-emerald-100 text-emerald-700'
            : 'hover:bg-rose-100 text-rose-700'
        }`}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
