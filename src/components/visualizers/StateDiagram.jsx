import React from 'react';
import { Activity } from 'lucide-react';

export const StateDiagram = ({
  title = 'PDA State Transition Diagram',
  states = [],
  currentState = 'q0',
  transitions = [],
  layoutType = 'parentheses' // 'parentheses' | 'palindrome' | 'arithmetic'
}) => {
  // Coordinates configurations for different automata
  const layouts = {
    parentheses: {
      nodes: [
        { id: 'q0', label: 'q0', x: 120, y: 120, type: 'start', desc: 'Scan & Stack Match' },
        { id: 'q_acc', label: 'q_acc', x: 340, y: 80, type: 'accept', desc: 'Accept (Balanced)' },
        { id: 'q_rej', label: 'q_rej', x: 340, y: 180, type: 'reject', desc: 'Reject (Imbalance)' },
      ],
      edges: [
        { from: 'q0', to: 'q0', label: '(, Z0 → (Z0\n(, ( → ((\n), ( → ε', curve: 'self-top' },
        { from: 'q0', to: 'q_acc', label: 'ε, Z0 → Z0', curve: 'top-arc' },
        { from: 'q0', to: 'q_rej', label: '), Z0 → Z0\nε, ( → (', curve: 'bottom-arc' },
      ]
    },
    palindrome: {
      nodes: [
        { id: 'q0', label: 'q0', x: 70, y: 110, type: 'start', desc: 'Start' },
        { id: 'q_push', label: 'q_push', x: 210, y: 110, type: 'normal', desc: 'Push 1st Half' },
        { id: 'q_comp', label: 'q_comp', x: 380, y: 110, type: 'normal', desc: 'Compare & Pop 2nd' },
        { id: 'q_acc', label: 'q_acc', x: 520, y: 110, type: 'accept', desc: 'Accept' },
      ],
      edges: [
        { from: 'q0', to: 'q_push', label: 'ε, Z0 → Z0', curve: 'straight' },
        { from: 'q_push', to: 'q_push', label: 'a, X → aX\nb, X → bX', curve: 'self-top' },
        { from: 'q_push', to: 'q_comp', label: 'ε, X → X (even)\na, X → X (odd)\nb, X → X (odd)', curve: 'straight' },
        { from: 'q_comp', to: 'q_comp', label: 'a, a → ε\nb, b → ε', curve: 'self-top' },
        { from: 'q_comp', to: 'q_acc', label: 'ε, Z0 → Z0', curve: 'straight' },
      ]
    },
    arithmetic: {
      nodes: [
        { id: 'q_start', label: 'q_init', x: 90, y: 110, type: 'start', desc: 'Init Stack' },
        { id: 'q_loop', label: 'q_parse', x: 260, y: 110, type: 'normal', desc: 'Expand E/T/F & Match' },
        { id: 'q_acc', label: 'q_acc', x: 440, y: 110, type: 'accept', desc: 'Accept' },
      ],
      edges: [
        { from: 'q_start', to: 'q_loop', label: 'ε, Z0 → EZ0', curve: 'straight' },
        { from: 'q_loop', to: 'q_loop', label: 'Expand: E → E+T, T → T*F\nMatch: +, -, *, /, (, ), id, num', curve: 'self-top' },
        { from: 'q_loop', to: 'q_acc', label: 'ε, Z0 → Z0', curve: 'straight' },
      ]
    }
  };

  const currentLayout = layouts[layoutType] || layouts.parentheses;
  const nodes = currentLayout.nodes;
  const edges = currentLayout.edges;

  return (
    <div className="bg-dark-900 border border-dark-750/70 rounded-xl p-4 flex flex-col h-full shadow-lg">
      <div className="flex items-center justify-between border-b border-dark-750/70 pb-3 mb-2">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-slate-200 tracking-wide">
            {title}
          </h3>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">Current State:</span>
          <span className="px-2 py-0.5 rounded-full font-bold bg-cyan-950 border border-cyan-400 text-cyan-300 animate-pulse">
            {currentState}
          </span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="flex-1 w-full min-h-[220px] flex items-center justify-center bg-dark-950/60 rounded-xl p-2 relative overflow-hidden">
        <svg
          viewBox={layoutType === 'palindrome' ? '0 0 580 220' : '0 0 460 230'}
          className="w-full h-full max-h-[280px]"
        >
          <defs>
            {/* Arrow marker */}
            <marker
              id="arrowhead"
              markerWidth="8"
              markerHeight="6"
              refX="7"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 8 3, 0 6" fill="#06b6d4" />
            </marker>
            <marker
              id="arrowhead-slate"
              markerWidth="8"
              markerHeight="6"
              refX="7"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 8 3, 0 6" fill="#64748b" />
            </marker>
          </defs>

          {/* Render Edges */}
          {edges.map((edge, i) => {
            const fromNode = nodes.find(n => n.id === edge.from);
            const toNode = nodes.find(n => n.id === edge.to);
            if (!fromNode || !toNode) return null;

            const isSelf = edge.from === edge.to;
            let pathD = '';
            let labelX = 0;
            let labelY = 0;

            if (isSelf) {
              // Self loop arc above node
              pathD = `M ${fromNode.x - 14} ${fromNode.y - 18} C ${fromNode.x - 30} ${fromNode.y - 65}, ${fromNode.x + 30} ${fromNode.y - 65}, ${fromNode.x + 14} ${fromNode.y - 18}`;
              labelX = fromNode.x;
              labelY = fromNode.y - 68;
            } else if (edge.curve === 'top-arc') {
              pathD = `M ${fromNode.x + 22} ${fromNode.y - 10} Q ${(fromNode.x + toNode.x) / 2} ${toNode.y - 5} ${toNode.x - 24} ${toNode.y - 4}`;
              labelX = (fromNode.x + toNode.x) / 2;
              labelY = (fromNode.y + toNode.y) / 2 - 18;
            } else if (edge.curve === 'bottom-arc') {
              pathD = `M ${fromNode.x + 22} ${fromNode.y + 10} Q ${(fromNode.x + toNode.x) / 2} ${toNode.y + 5} ${toNode.x - 24} ${toNode.y + 4}`;
              labelX = (fromNode.x + toNode.x) / 2;
              labelY = (fromNode.y + toNode.y) / 2 + 20;
            } else {
              // Straight
              pathD = `M ${fromNode.x + 25} ${fromNode.y} L ${toNode.x - 25} ${toNode.y}`;
              labelX = (fromNode.x + toNode.x) / 2;
              labelY = (fromNode.y + toNode.y) / 2 - 12;
            }

            const lines = edge.label.split('\n');

            return (
              <g key={`edge-${i}`}>
                <path
                  d={pathD}
                  fill="none"
                  stroke="#475569"
                  strokeWidth="1.8"
                  markerEnd="url(#arrowhead-slate)"
                  strokeDasharray="2,2"
                />
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor="middle"
                  className="fill-cyan-300 font-mono text-[9px]"
                  style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
                >
                  {lines.map((line, lIdx) => (
                    <tspan key={lIdx} x={labelX} dy={lIdx === 0 ? 0 : 10}>
                      {line}
                    </tspan>
                  ))}
                </text>
              </g>
            );
          })}

          {/* Start state incoming pointer */}
          <line
            x1="20"
            y1={nodes[0]?.y || 110}
            x2={nodes[0]?.x - 26 || 45}
            y2={nodes[0]?.y || 110}
            stroke="#06b6d4"
            strokeWidth="2.5"
            markerEnd="url(#arrowhead)"
          />

          {/* Render Nodes */}
          {nodes.map(node => {
            const isActive = currentState === node.id;
            const isAccept = node.type === 'accept';
            const isReject = node.type === 'reject';

            return (
              <g key={node.id} className="cursor-pointer">
                {/* Active glow halo */}
                {isActive && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="32"
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="2.5"
                    opacity="0.4"
                    className="animate-ping"
                  />
                )}

                {/* Outer circle for accepting state */}
                {isAccept && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="28"
                    fill="none"
                    stroke={isActive ? '#10b981' : '#059669'}
                    strokeWidth="2"
                  />
                )}

                {/* Main state circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="23"
                  className={`transition-all duration-300 ${
                    isActive
                      ? isReject
                        ? 'fill-rose-950 stroke-rose-400 stroke-[3]'
                        : isAccept
                        ? 'fill-emerald-950 stroke-emerald-400 stroke-[3]'
                        : 'fill-cyan-950 stroke-cyan-400 stroke-[3]'
                      : isReject
                      ? 'fill-dark-900 stroke-rose-600/70 stroke-[1.8]'
                      : isAccept
                      ? 'fill-dark-900 stroke-emerald-600/70 stroke-[1.8]'
                      : 'fill-dark-900 stroke-dark-700 stroke-[1.8]'
                  }`}
                />

                {/* State label */}
                <text
                  x={node.x}
                  y={node.y + 4}
                  textAnchor="middle"
                  className={`font-mono text-xs font-bold ${
                    isActive ? 'fill-white' : 'fill-slate-300'
                  }`}
                >
                  {node.label}
                </text>

                {/* Description label below */}
                <text
                  x={node.x}
                  y={node.y + 38}
                  textAnchor="middle"
                  className="fill-slate-400 text-[10px] font-sans"
                >
                  {node.desc}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
