import React from 'react';
import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import { colors } from '../designTokens';
import { useTheme } from '../context/ThemeContext';

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

const RadarChart: React.FC<RadarChartProps> = ({ data, width = '100%', height = '100%', aspect }) => {
  const { theme: themeMode } = useTheme();
  const currentTheme = themeMode === 'light' ? colors.light : colors.dark;
  // Use devicePixelRatio to adjust styling for high resolution screens.
  const scaleFactor = window.devicePixelRatio || 1;
  const tickFontSize = scaleFactor > 1.5 ? 16 : 12;
  const radarStrokeWidth = scaleFactor > 1.5 ? 3 : 2;

  const renderTick = (props: any) => {
    const { payload, x, y, textAnchor } = props;
    const value = payload.value;
    let lines = [value];
    // For left- and right-most ticks (textAnchor "start" or "end"), split into two lines if necessary.
    if ((textAnchor === 'start' || textAnchor === 'end') && value.length > 5) {
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
      <text x={x} y={y} textAnchor={textAnchor} fill={currentTheme.text} fontSize={tickFontSize}>
        {lines.map((line, index) => (
          <tspan key={index} x={x} dy={index === 0 ? 0 : "1.2em"}>{line}</tspan>
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
            backgroundColor: currentTheme.background,
            border: `1px solid ${colors.neutral[400]}`,
            padding: 10,
            color: currentTheme.text
          }}
        >
          <p><strong>{label}</strong></p>
          <p>Importance: {dataPoint.importance}</p>
          <p>Satisfaction: {dataPoint.satisfaction}</p>
          <p>Description: {dataPoint.description}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width={width} {...(aspect ? { aspect } : { height })}>
      <RechartsRadarChart outerRadius="70%" data={data}>
        <PolarGrid stroke={colors.neutral[300]} />
        <PolarAngleAxis dataKey="area" tick={renderTick} />
        <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
        <Radar 
          name="Importance" 
          dataKey="importance" 
          stroke={colors.primary} 
          fill={colors.primary} 
          fillOpacity={0.6}
          strokeWidth={radarStrokeWidth} 
        />
        <Radar 
          name="Satisfaction" 
          dataKey="satisfaction" 
          stroke={colors.accent} 
          fill={colors.accent} 
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
