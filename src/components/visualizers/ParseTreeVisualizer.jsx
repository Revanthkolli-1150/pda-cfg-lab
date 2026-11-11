import React, { useState } from 'react';
import { GitFork, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { ParseTree } from '../../core/cfg/ParseTree.js';

export const ParseTreeVisualizer = ({
  tree = null,
  title = 'Context-Free Grammar Parse Tree',
  highlightYield = true
}) => {
  const [scale, setScale] = useState(1);
  const [hoveredNode, setHoveredNode] = useState(null);

  if (!tree || !tree.root) {
    return (
      <div className="bg-dark-900 border border-dark-750/70 rounded-xl p-6 flex flex-col items-center justify-center min-h-[300px] text-slate-500">
        <GitFork className="w-8 h-8 mb-2 opacity-50" />
        <p className="text-sm font-mono">No parse tree available. Input must be syntactically valid.</p>
      </div>
    );
  }

  // Calculate layout coordinates
  const { root, width, height, maxDepth } = tree.layout(700, 75);
  const nodes = tree.getNodes();
  const edges = tree.getEdges();
  const terminalYield = tree.getYield();

  const handleZoomIn = () => setScale(s => Math.min(s + 0.15, 2.0));
  const handleZoomOut = () => setScale(s => Math.max(s - 0.15, 0.6));
  const handleResetZoom = () => setScale(1);

  return (
    <div className="bg-dark-900 border border-dark-750/70 rounded-xl p-4 flex flex-col h-full shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-dark-750/70 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <GitFork className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-slate-200 tracking-wide">
            {title}
          </h3>
        </div>

        {/* Zoom controls & info */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-dark-950 p-1 rounded-lg border border-dark-800 text-xs">
            <button
              onClick={handleZoomOut}
              className="p-1 hover:bg-dark-800 rounded text-slate-400 hover:text-white"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono px-1.5 text-slate-300 text-[11px]">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1 hover:bg-dark-800 rounded text-slate-400 hover:text-white"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1 hover:bg-dark-800 rounded text-slate-400 hover:text-white ml-1 border-l border-dark-800"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Yield Banner */}
      {highlightYield && (
        <div className="bg-dark-950 px-3 py-1.5 rounded-lg border border-dark-800 text-xs font-mono flex items-center justify-between mb-3">
          <span className="text-slate-400">Terminal Yield w:</span>
          <span className="text-emerald-400 font-bold tracking-wider">
            {terminalYield}
          </span>
        </div>
      )}

      {/* SVG Canvas Area */}
      <div className="flex-1 w-full min-h-[340px] max-h-[460px] overflow-auto bg-dark-950/70 rounded-xl border border-dark-800 p-4 flex items-center justify-center relative">
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease-out'
          }}
        >
          <svg
            width={width}
            height={height}
            className="overflow-visible"
          >
            {/* Edges (Curves) */}
            {edges.map((edge, i) => {
              const { parent, child } = edge;
              // Bezier curve from parent to child
              const pathD = `M ${parent.x} ${parent.y + 12} C ${parent.x} ${(parent.y + child.y) / 2}, ${child.x} ${(parent.y + child.y) / 2}, ${child.x} ${child.y - 12}`;

              return (
                <path
                  key={`edge-${i}`}
                  d={pathD}
                  fill="none"
                  stroke="#334155"
                  strokeWidth="2"
                  className="hover:stroke-cyan-500 transition-colors"
                />
              );
            })}

            {/* Nodes */}
            {nodes.map(node => {
              const isNonTerminal = node.type === 'nonterminal';
              const isEpsilon = node.type === 'epsilon';
              const isHovered = hoveredNode === node.id;

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className="cursor-pointer group"
                >
                  {isNonTerminal ? (
                    // Capsule for Nonterminals (E, T, F, S)
                    <>
                      <rect
                        x="-18"
                        y="-14"
                        width="36"
                        height="28"
                        rx="8"
                        className={`transition-all duration-200 ${
                          isHovered
                            ? 'fill-cyan-950 stroke-cyan-400 stroke-2 filter drop-shadow(0 0 6px rgba(6,182,212,0.6))'
                            : 'fill-dark-800 stroke-cyan-600/70 stroke-[1.5]'
                        }`}
                      />
                      <text
                        x="0"
                        y="4"
                        textAnchor="middle"
                        className="font-mono text-xs font-bold fill-cyan-300"
                      >
                        {node.label}
                      </text>
                    </>
                  ) : isEpsilon ? (
                    // Muted Circle for Epsilon
                    <>
                      <circle
                        cx="0"
                        cy="0"
                        r="12"
                        className={`transition-all duration-200 ${
                          isHovered
                            ? 'fill-dark-700 stroke-slate-300 stroke-2'
                            : 'fill-dark-900 stroke-slate-600 stroke-[1.5]'
                        }`}
                      />
                      <text
                        x="0"
                        y="4"
                        textAnchor="middle"
                        className="font-mono text-xs italic fill-slate-400"
                      >
                        ε
                      </text>
                    </>
                  ) : (
                    // Terminal Node (tokens like id, +, *, num, a, b, parentheses)
                    <>
                      <rect
                        x="-16"
                        y="-12"
                        width="32"
                        height="24"
                        rx="6"
                        className={`transition-all duration-200 ${
                          isHovered
                            ? 'fill-emerald-950 stroke-emerald-300 stroke-2 filter drop-shadow(0 0 6px rgba(16,185,129,0.6))'
                            : 'fill-dark-850 stroke-emerald-500/70 stroke-[1.5]'
                        }`}
                      />
                      <text
                        x="0"
                        y="4"
                        textAnchor="middle"
                        className="font-mono text-xs font-semibold fill-emerald-300"
                      >
                        {node.label}
                      </text>
                    </>
                  )}

                  {/* Production rule tooltip on hover */}
                  {isHovered && node.metadata?.rule && (
                    <g transform="translate(0, -22)">
                      <rect
                        x="-50"
                        y="-18"
                        width="100"
                        height="18"
                        rx="4"
                        fill="#0b0f17"
                        stroke="#06b6d4"
                        strokeWidth="1"
                      />
                      <text
                        x="0"
                        y="-6"
                        textAnchor="middle"
                        className="font-mono text-[9px] fill-cyan-300 font-bold"
                      >
                        {node.metadata.rule}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
};
