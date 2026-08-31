import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { FileOperationProposalCard } from './FileOperationProposalCard';
import { JarvisMap } from '../maps/JarvisMap';
import { RouteCard } from '../maps/RouteCard';
import { LocationPermissionCard } from '../maps/LocationPermissionCard';
import { LocationStatusCard } from '../maps/LocationStatusCard';
import { useJarvisStream } from '../../hooks/useJarvisStream';

interface MarkdownContentProps {
  content: string;
}

export const MarkdownContent: React.FC<MarkdownContentProps> = ({ content }) => {
  const { sendMessage } = useJarvisStream();

  if (!content) return null;

  // Handle Location Permission Prompt (checks for marker or text state)
  if (content.includes('[LOCATION ACCESS REQUIRED]') || content.includes('Location access is required')) {
    const textPart = content.replace('[LOCATION ACCESS REQUIRED]', '').trim();
    return (
      <div className="space-y-2">
        {textPart && <FormattedContentChunk content={textPart} />}
        <LocationPermissionCard
          onGranted={(loc) => {
            console.log(`[LOCATION DEBUG] Sending coordinates\nlat=${loc.latitude}\nlng=${loc.longitude}\naccuracy=${loc.accuracy}`);
            sendMessage(`latitude: ${loc.latitude}, longitude: ${loc.longitude}, accuracy: ${loc.accuracy || 0}`);
          }}
        />
      </div>
    );
  }

  // Handle Location Status Card
  if (content.includes('[LOCATION TRACKING ACTIVE]')) {
    return <LocationStatusCard initialArea="Current Area" />;
  }

  // Handle Tool Confirmation Block Parsing
  if (content.includes('[TOOL CONFIRMATION REQUIRED]')) {
    const parts = content.split(/(\[TOOL CONFIRMATION REQUIRED\][\s\S]*?\[\/TOOL CONFIRMATION REQUIRED\])/g);
    return (
      <div className="space-y-2 max-w-full min-w-0">
        {parts.map((part, index) => {
          if (part.startsWith('[TOOL CONFIRMATION REQUIRED]') && part.endsWith('[/TOOL CONFIRMATION REQUIRED]')) {
            const opIdMatch = part.match(/Operation ID:\s*([a-f0-9-]+)/i);
            const toolMatch = part.match(/Tool:\s*([a-zA-Z0-9_]+)/i);
            const pathMatch = part.match(/Path:\s*([^\n]+)/i);
            const msgMatch = part.match(/Message:\s*([^\n]+)/i);
            const diffMatch = part.match(/Proposed Unified Diff:\s*\n([\s\S]*?)\[\/TOOL CONFIRMATION REQUIRED\]/i);

            const operationId = opIdMatch ? opIdMatch[1].trim() : '';
            const toolName = toolMatch ? toolMatch[1].trim() : 'edit_file';
            const path = pathMatch ? pathMatch[1].trim() : '';
            const message = msgMatch ? msgMatch[1].trim() : undefined;
            const diff = diffMatch ? diffMatch[1].trim() : '';

            if (operationId) {
              return (
                <FileOperationProposalCard
                  key={index}
                  operationId={operationId}
                  toolName={toolName}
                  path={path}
                  diff={diff}
                  message={message}
                />
              );
            }
          }
          return <FormattedContentChunk key={index} content={part} />;
        })}
      </div>
    );
  }

  // Handle Route Result Cards
  if (content.includes('Tool: calculate_route') || content.includes('Distance Km:')) {
    const distMatch = content.match(/Distance Km:\s*([0-9\.]+)/i);
    const durMatch = content.match(/Duration Minutes:\s*([0-9\.]+)/i);
    const destMatch = content.match(/Destination Name:\s*([^\n]+)/i);

    const dist = distMatch ? parseFloat(distMatch[1]) : 12.4;
    const dur = durMatch ? parseFloat(durMatch[1]) : 18.0;
    const dest = destMatch ? destMatch[1].trim() : 'Destination';

    return (
      <div className="space-y-2 max-w-full min-w-0">
        <FormattedContentChunk content={content} />
        <RouteCard destinationName={dest} distanceKm={dist} durationMinutes={dur} />
        <JarvisMap destination={{ lat: 11.03, lng: 77.04, name: dest }} distanceKm={dist} durationMinutes={dur} />
      </div>
    );
  }

  return <FormattedContentChunk content={content} />;
};

const FormattedContentChunk: React.FC<{ content: string }> = ({ content }) => {
  if (!content) return null;

  if (content.includes('```')) {
    const parts = content.split(/(```[\s\S]*?```)/g);
    return (
      <div className="space-y-2 max-w-full min-w-0">
        {parts.map((part, index) => {
          if (part.startsWith('```') && part.endsWith('```')) {
            const lines = part.slice(3, -3).trim().split('\n');
            const language = lines[0].match(/^[a-zA-Z0-9_-]+$/) ? lines[0] : '';
            const codeText = language ? lines.slice(1).join('\n') : lines.join('\n');

            return (
              <CodeBlock key={index} language={language} codeText={codeText} />
            );
          }
          return <FormattedText key={index} text={part} />;
        })}
      </div>
    );
  }

  return <FormattedText text={content} />;
};

const CodeBlock: React.FC<{ language: string; codeText: string }> = ({ language, codeText }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-2 rounded-lg bg-[#070d18] border border-[#00f0ff]/25 overflow-hidden max-w-full min-w-0">
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#0e182d] border-b border-[#00f0ff]/15 text-[10px] font-mono text-gray-400">
        <span className="uppercase text-[#00f0ff] font-hud tracking-wider">{language || 'CODE'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 hover:text-[#00f0ff] transition-colors"
          title="Copy Code"
        >
          {copied ? <Check className="w-3 h-3 text-[#00ffaa]" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <div className="p-3 overflow-x-auto max-w-full text-xs font-mono leading-relaxed text-gray-200 selection:bg-[#00f0ff]/30">
        <pre className="m-0 whitespace-pre">{codeText}</pre>
      </div>
    </div>
  );
};

const FormattedText: React.FC<{ text: string }> = ({ text }) => {
  if (!text.trim()) return null;

  if (text.includes('|')) {
    const lines = text.split('\n');
    let inTable = false;
    const elements: React.ReactNode[] = [];
    let tableRows: string[][] = [];

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        if (!inTable) inTable = true;
        if (trimmed.includes('---')) return;

        const cells = trimmed
          .split('|')
          .slice(1, -1)
          .map((c) => c.trim());
        tableRows.push(cells);
      } else {
        if (inTable && tableRows.length > 0) {
          elements.push(renderTable(tableRows, `table-${index}`));
          tableRows = [];
          inTable = false;
        }
        if (trimmed) {
          elements.push(
            <p key={`p-${index}`} className="my-1 whitespace-pre-wrap leading-relaxed max-w-full break-words [overflow-wrap:anywhere]">
              {trimmed}
            </p>
          );
        }
      }
    });

    if (inTable && tableRows.length > 0) {
      elements.push(renderTable(tableRows, `table-last`));
    }

    return <div className="space-y-1.5 max-w-full min-w-0">{elements}</div>;
  }

  return (
    <div className="whitespace-pre-wrap leading-relaxed max-w-full min-w-0 break-words [overflow-wrap:anywhere]">
      {text}
    </div>
  );
};

function renderTable(rows: string[][], key: string) {
  if (rows.length === 0) return null;
  const header = rows[0];
  const body = rows.slice(1);

  return (
    <div key={key} className="overflow-x-auto max-w-full my-2.5 rounded border border-[#00f0ff]/20">
      <table className="w-full text-[#00f0ff] border-collapse min-w-max text-xs">
        <thead>
          <tr className="bg-[#00f0ff]/10 text-[#00f0ff] font-hud border-b border-[#00f0ff]/30">
            {header.map((cell, idx) => (
              <th key={idx} className="p-2 text-left font-semibold">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, rIdx) => (
            <tr
              key={rIdx}
              className={rIdx % 2 === 0 ? 'bg-white/[0.02]' : 'bg-transparent'}
            >
              {row.map((cell, cIdx) => (
                <td key={cIdx} className="p-2 border-b border-white/5 text-gray-200">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
