import React from 'react';
import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

interface RadarChartData {
  area: string;
  importance: number;
  satisfaction: number;
  description: string;
}

interface RadarChartProps {
  data: RadarChartData[];
  width?: number | string;
  height?: number | string;
  aspect?: number;
}

const RadarChart: React.FC<RadarChartProps> = ({
  data,
  width = '100%',
  height = '100%',
  aspect,
}) => {
  // Use devicePixelRatio to adjust styling for high resolution screens.
  const scaleFactor = window.devicePixelRatio || 1;
  const isMobile = window.innerWidth < 768;
  const tickFontSize = !isMobile
    ? scaleFactor > 1.5
      ? 20
      : 18
    : scaleFactor > 1.5
      ? 16
      : 12;
  const radarStrokeWidth = !isMobile
    ? scaleFactor > 1.5
      ? 4
      : 3
    : scaleFactor > 1.5
      ? 3
      : 2;
  const axisStrokeWidth = !isMobile ? 2 : 1;

  // Arrange the data so that the four longest area names are spread evenly along the circle.
  const arrangedData = React.useMemo(() => {
    const n = data.length;
    if (n < 4) {
      // If less than 4 areas, no special arrangement.
      return data;
    }
    // Sort data descending by area name length.
    const sorted = [...data].sort((a, b) => b.area.length - a.area.length);
    const longestFour = sorted.slice(0, 4);
    const others = sorted.slice(4);
    // Determine evenly spaced positions: positions at 0, n/4, n/2, and 3n/4.
    const pos0 = 0;
    const pos1 = Math.floor(n / 4);
    const pos2 = Math.floor(n / 2);
    const pos3 = Math.floor((3 * n) / 4);
    const result = new Array(n);
    // Place the four longest in descending order at these positions.
    result[pos0] = longestFour[0];
    result[pos1] = longestFour[1];
    result[pos2] = longestFour[2];
    result[pos3] = longestFour[3];
    // Fill in remaining positions with the others in their original sorted order.
    let otherIndex = 0;
    for (let i = 0; i < n; i++) {
      if (result[i] === undefined) {
        if (otherIndex < others.length) {
          result[i] = others[otherIndex];
          otherIndex++;
        } else {
          // If no more others left, fill with remaining longestFour.
          result[i] = longestFour[0];
        }
      }
    }
    return result;
  }, [data]);

  const renderTick = (props: any) => {
    const { payload, x, y, textAnchor } = props;
    const value = payload.value;
    let lines = [value];
    // For left- and right-most ticks (textAnchor "start" or "end"), split into two lines if necessary.
    if ((textAnchor === 'start' || textAnchor === 'end') && value.length > 10) {
      const mid = Math.floor(value.length / 2);
      let breakIndex = value.lastIndexOf(' ', mid);
      if (breakIndex === -1) {
        breakIndex = mid;
      }
      const firstLine = value.substring(0, breakIndex).trim();
      const secondLine = value.substring(breakIndex).trim();
      lines = [firstLine, secondLine];
    }
    return (
      <text
        x={x}
        y={y}
        textAnchor={textAnchor}
        fill="var(--text)"
        fontSize={tickFontSize}
      >
        {lines.map((line, index) => (
          <tspan key={index} x={x} dy={index === 0 ? 0 : '1.2em'}>
            {line}
          </tspan>
        ))}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div
          style={{
            backgroundColor: 'var(--bg)',
            border: `1px solid var(--border)`,
            padding: 10,
            color: 'var(--text)',
          }}
        >
          <p>
            <strong>{label}</strong>
          </p>
          <p>Betydelse: {dataPoint.importance}</p>
          <p>Tillfredsställelse: {dataPoint.satisfaction}</p>
          <p>Beskrivning: {dataPoint.description}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width={width} {...(aspect ? { aspect } : { height })}>
      <RechartsRadarChart
        outerRadius="70%"
        data={arrangedData}
        startAngle={90}
        endAngle={-270}
      >
        <PolarGrid stroke="var(--border)" strokeWidth={axisStrokeWidth} />
        <PolarAngleAxis dataKey="area" tick={renderTick} />
        <PolarRadiusAxis
          angle={30}
          domain={[0, 10]}
          tick={false}
          axisLine={{
            stroke: 'var(--border)',
            strokeWidth: axisStrokeWidth,
          }}
        />
        <Radar
          name="Betydelse"
          dataKey="importance"
          stroke="var(--chart-series-1)"
          fill="var(--chart-series-1)"
          fillOpacity={0.6}
          strokeWidth={radarStrokeWidth}
        />
        <Radar
          name="Tillfredsställelse"
          dataKey="satisfaction"
          stroke="var(--chart-series-2)"
          fill="var(--chart-series-2)"
          fillOpacity={0.6}
          strokeWidth={radarStrokeWidth}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
      </RechartsRadarChart>
    </ResponsiveContainer>
  );
};

export default RadarChart;
