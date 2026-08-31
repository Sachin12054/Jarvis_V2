import React, { useState } from 'react';
import { Check, X, FileText, AlertTriangle, Eye, EyeOff } from 'lucide-react';

interface FileOperationProposalCardProps {
  operationId: string;
  toolName: string;
  path: string;
  diff: string;
  message?: string;
}

export const FileOperationProposalCard: React.FC<FileOperationProposalCardProps> = ({
  operationId,
  toolName,
  path,
  diff,
  message,
}) => {
  const [showDiff, setShowDiff] = useState(true);
  const [status, setStatus] = useState<'pending' | 'applying' | 'applied' | 'cancelling' | 'cancelled' | 'error'>('pending');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleApprove = async () => {
    setStatus('applying');
    setFeedback(null);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/v1/file-operations/${operationId}/approve`, {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus('applied');
        setFeedback(data.message || 'File modification applied successfully.');
      } else {
        setStatus('error');
        setFeedback(data.detail || data.message || 'Failed to apply file modification.');
      }
    } catch (err: any) {
      setStatus('error');
      setFeedback(err?.message || 'Network error while applying file modification.');
    }
  };

  const handleCancel = async () => {
    setStatus('cancelling');
    setFeedback(null);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/v1/file-operations/${operationId}/cancel`, {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus('cancelled');
        setFeedback('Operation cancelled. No changes were made to your file.');
      } else {
        setStatus('error');
        setFeedback(data.detail || data.message || 'Failed to cancel operation.');
      }
    } catch (err: any) {
      setStatus('error');
      setFeedback(err?.message || 'Network error while cancelling operation.');
    }
  };

  return (
    <div className="my-3 border border-[#ffaa00]/40 bg-[#121927]/95 rounded-xl p-3.5 shadow-[0_0_15px_rgba(255,170,0,0.15)] text-xs font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#ffaa00]/20 pb-2 mb-2.5">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#ffaa00]" />
          <span className="font-hud font-bold text-[#ffaa00] tracking-wider uppercase">
            FILE CHANGE PROPOSAL
          </span>
        </div>
        <span className="font-mono text-[10px] text-gray-400 bg-black/40 px-2 py-0.5 rounded border border-gray-700">
          {toolName}
        </span>
      </div>

      {/* Target Path & Status */}
      <div className="mb-2.5">
        <div className="text-gray-300 font-mono text-[11px] bg-black/50 p-2 rounded border border-gray-800 flex items-center justify-between">
          <span className="truncate text-[#00f0ff]">{path}</span>
          <span className="text-[10px] uppercase font-bold text-[#ffaa00] ml-2 shrink-0">
            {status}
          </span>
        </div>
        {message && <p className="text-gray-300 text-[11px] mt-1.5 leading-relaxed">{message}</p>}
      </div>

      {/* Diff Preview */}
      {diff && (
        <div className="mb-3">
          <button
            onClick={() => setShowDiff(!showDiff)}
            className="flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-white transition-colors mb-1.5"
          >
            {showDiff ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showDiff ? 'Hide Diff Preview' : 'Show Unified Diff'}</span>
          </button>

          {showDiff && (
            <pre className="font-mono text-[11px] p-2.5 bg-black/80 text-gray-200 rounded border border-gray-800 overflow-x-auto max-h-48 whitespace-pre leading-relaxed select-text">
              {diff.split('\n').map((line, idx) => {
                let colorClass = 'text-gray-300';
                if (line.startsWith('+')) colorClass = 'text-[#00ffaa] bg-[#00ffaa]/10';
                else if (line.startsWith('-')) colorClass = 'text-[#ff5555] bg-[#ff5555]/10';
                else if (line.startsWith('@')) colorClass = 'text-[#00f0ff]';
                return (
                  <div key={idx} className={colorClass}>
                    {line}
                  </div>
                );
              })}
            </pre>
          )}
        </div>
      )}

      {/* Feedback Message */}
      {feedback && (
        <div
          className={`p-2 rounded mb-2.5 text-[11px] border flex items-center gap-2 ${
            status === 'applied'
              ? 'bg-[#00ffaa]/10 border-[#00ffaa]/30 text-[#00ffaa]'
              : status === 'cancelled'
              ? 'bg-gray-800/80 border-gray-700 text-gray-300'
              : 'bg-[#ff5555]/10 border-[#ff5555]/30 text-[#ff5555]'
          }`}
        >
          {status === 'applied' ? (
            <Check className="w-3.5 h-3.5 shrink-0" />
          ) : status === 'error' ? (
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          ) : (
            <X className="w-3.5 h-3.5 shrink-0" />
          )}
          <span>{feedback}</span>
        </div>
      )}

      {/* Action Confirmation Buttons */}
      {status === 'pending' && (
        <div className="flex items-center gap-2 pt-1 border-t border-gray-800">
          <button
            onClick={handleApprove}
            className="flex-1 bg-[#00ffaa]/20 hover:bg-[#00ffaa] text-[#00ffaa] hover:text-black font-semibold text-xs py-1.5 px-3 rounded border border-[#00ffaa]/40 transition-all flex items-center justify-center gap-1.5 shadow-[0_0_10px_rgba(0,255,170,0.2)]"
          >
            <Check className="w-3.5 h-3.5" />
            <span>APPLY CHANGE</span>
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white font-semibold text-xs py-1.5 px-3 rounded border border-gray-700 transition-all flex items-center justify-center gap-1.5"
          >
            <X className="w-3.5 h-3.5" />
            <span>CANCEL</span>
          </button>
        </div>
      )}
    </div>
  );
};
