import React, { useState } from 'react';
import { 
  SlidersHorizontal, 
  Database, 
  ListOrdered, 
  Download, 
  Search, 
  CheckCircle2, 
  Plus, 
  ShieldCheck, 
  FileText,
  RotateCcw
} from 'lucide-react';
import { AuditLog, LanguageCode, Scheme } from '../types';
import { LocalDatabase } from '../services/localDatabase';

interface AdminConsoleViewProps {
  schemes: Scheme[];
  currentLanguage: LanguageCode;
}

export const AdminConsoleView: React.FC<AdminConsoleViewProps> = ({
  schemes,
  currentLanguage
}) => {
  const [activeTab, setActiveTab] = useState<'schemes' | 'audit'>('schemes');
  const [schemeSearch, setSchemeSearch] = useState('');
  const [auditFilter, setAuditFilter] = useState<string>('ALL');

  const auditLogs: AuditLog[] = LocalDatabase.getAuditLogs();

  const filteredSchemes = schemes.filter(s => 
    s.name.toLowerCase().includes(schemeSearch.toLowerCase()) || 
    s.ministry.toLowerCase().includes(schemeSearch.toLowerCase())
  );

  const filteredLogs = auditLogs.filter(log => {
    if (auditFilter === 'ALL') return true;
    return log.category === auditFilter;
  });

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(schemes, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `govmitra_schemes_export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div id="admin-console-view" className="max-w-5xl mx-auto space-y-6 animate-in fade-in">
      {/* Header Banner */}
      <div className="p-4 sm:p-6 bg-white rounded-3xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-stone-100 border border-stone-300 text-stone-900 flex items-center justify-center font-bold text-lg">
            <SlidersHorizontal className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-900 tracking-tight">
              Admin & Data Operations Console
            </h2>
            <p className="text-xs text-stone-500">
              Manage verified scheme catalogues, audit trail records, and offline sync exports
            </p>
          </div>
        </div>

        <button
          onClick={handleExportJson}
          className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs"
        >
          <Download className="w-4 h-4" />
          <span>Export Schemes JSON</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200 gap-2">
        <button
          onClick={() => setActiveTab('schemes')}
          className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'schemes' ? 'border-amber-700 text-amber-900' : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Scheme Repository ({schemes.length})
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'audit' ? 'border-amber-700 text-amber-900' : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          System Audit Trail ({auditLogs.length})
        </button>
      </div>

      {/* Schemes Tab */}
      {activeTab === 'schemes' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={schemeSearch}
                onChange={(e) => setSchemeSearch(e.target.value)}
                placeholder="Search scheme records by name or ministry..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            {filteredSchemes.map((s) => (
              <div key={s.id} className="p-4 bg-white rounded-2xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-100 text-stone-700">
                      {s.category}
                    </span>
                    <span className="text-[11px] text-stone-500">{s.ministry}</span>
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-stone-900">{s.name}</h4>
                  <p className="text-xs text-stone-600 mt-0.5 font-medium">🎁 {s.benefit}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-2 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-[11px] font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified
                  </span>
                  <span className="text-xs text-stone-500 font-mono">
                    {s.eligibilityRules.length} Rules
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Audit Trail Tab */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            {['ALL', 'APPLICATION', 'PROFILE', 'AI_QUERY', 'SYNC', 'SIMULATION'].map(cat => (
              <button
                key={cat}
                onClick={() => setAuditFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  auditFilter === cat ? 'bg-amber-700 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 divide-y divide-stone-100 overflow-hidden">
            {filteredLogs.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-500">
                No audit trail logs match the selected filter.
              </div>
            ) : (
              filteredLogs.map(log => (
                <div key={log.id} className="p-3.5 text-xs flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="px-1.5 py-0.2 rounded font-mono text-[9px] font-bold bg-stone-100 text-stone-800">
                        {log.category}
                      </span>
                      <span className="font-bold text-stone-900">{log.action}</span>
                    </div>
                    {log.details && log.details !== log.action && (
                      <p className="text-stone-500 text-[11px]">{log.details}</p>
                    )}
                  </div>
                  <span className="text-[10px] text-stone-400 font-mono shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
