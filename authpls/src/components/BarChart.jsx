import React, { useState, useEffect } from 'react';

export default function BarChart({
  data,
  barHeight = 37,   
  barGap = 12,      
}) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [mounted, setMounted] = useState(false);


  const maxValue = data.length ? Math.max(...data) : 1;
  const svgHeight =
    data.length * barHeight + (data.length - 1) * barGap;

  useEffect(() => {
  
    requestAnimationFrame(() => setMounted(true));
  }, []);

  return (
    <svg
      width="100%"
      height={svgHeight}
      viewBox={`0 0 100 ${svgHeight}`}  
      xmlns="http://www.w3.org/2000/svg"
    >
    
      <rect x={0} y={0} width="100%" height={svgHeight} fill="transparent" />

      {data.map((value, idx) => {
        const percent = mounted ? (value / maxValue) * 100 : 0;
        const y = idx * (barHeight + barGap);

      
        const fillColor = idx === 0 ? '#FF3366' : '#5FFBF1';

        return (
          <g key={idx}>
            <rect
              x={0}
              y={y}
              width={`${isNaN(percent) ? 0 : percent}%`}
              height={barHeight}
              fill={fillColor}
              rx={8}
              style={{
                transition: 'width 0.8s ease-out',
                cursor: 'pointer',
              }}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            />


            {hoveredIndex === idx && (
              <text
                x={`${percent + 1}%`}      
                y={y + barHeight / 2}
                fill="#FFFFFF"
                fontSize={barHeight * 0.5}  
                fontFamily="JetBrains Mono, monospace"
                alignmentBaseline="middle"
                textAnchor="start"
              >
                {value}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
