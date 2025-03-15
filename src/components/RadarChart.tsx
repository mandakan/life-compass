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
}

const RadarChart: React.FC<RadarChartProps> = ({ data, width = '100%', height = '100%' }) => {
  const { theme: themeMode } = useTheme();
  const currentTheme = themeMode === 'light' ? colors.light : colors.dark;

  const renderTick = (props: any) => {
    const { payload, x, y, textAnchor } = props;
    return (
      <text
        x={x}
        y={y}
        textAnchor={textAnchor}
        fill={currentTheme.text}
        fontSize={12}
      >
        {payload.value}
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
    <ResponsiveContainer width={width} height={height}>
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
        />
        <Radar 
          name="Satisfaction" 
          dataKey="satisfaction" 
          stroke={colors.accent} 
          fill={colors.accent} 
          fillOpacity={0.6} 
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
      </RechartsRadarChart>
    </ResponsiveContainer>
  );
};

export default RadarChart;
