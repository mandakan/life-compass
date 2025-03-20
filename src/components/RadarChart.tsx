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
import { useTranslation } from 'react-i18next';

/* eslint-disable react/prop-types */

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
  const { t } = useTranslation();
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

  const arrangedData = React.useMemo(() => {
    const n = data.length;
    if (n < 4) {
      return data;
    }
    const sorted = [...data].sort((a, b) => b.area.length - a.area.length);
    const longestFour = sorted.slice(0, 4);
    const others = sorted.slice(4);
    const pos0 = 0;
    const pos1 = Math.floor(n / 4);
    const pos2 = Math.floor(n / 2);
    const pos3 = Math.floor((3 * n) / 4);
    const result = new Array(n);
    result[pos0] = longestFour[0];
    result[pos1] = longestFour[1];
    result[pos2] = longestFour[2];
    result[pos3] = longestFour[3];
    let otherIndex = 0;
    for (let i = 0; i < n; i++) {
      if (result[i] === undefined) {
        if (otherIndex < others.length) {
          result[i] = others[otherIndex];
          otherIndex++;
        } else {
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
    /*if ((textAnchor === 'start' || textAnchor === 'end') && value.length > 10) {
      const mid = Math.floor(value.length / 2);
      let breakIndex = value.lastIndexOf(' ', mid);
      if (breakIndex === -1) {
        breakIndex = mid;
      }
      const firstLine = value.substring(0, breakIndex).trim();
      const secondLine = value.substring(breakIndex).trim();
      lines = [firstLine, secondLine];
    }*/
    return (
      <text
        x={x}
        y={y}
        textAnchor={textAnchor}
        fill="var(--color-text)"
        fontSize={tickFontSize}
      >
        {lines.map((line, index) => (
          <tspan key={index} x={x} dy={index === 0 ? 0 : '1.2em'}>
            {isMobile ? '' : line}
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
            backgroundColor: 'var(--color-bg)',
            border: `1px solid var(--border)`,
            padding: 10,
            color: 'var(--color-text)',
          }}
        >
          <p>
            <strong>{label}</strong>
          </p>
          <p>
            {t('importance')}: {dataPoint.importance}
          </p>
          <p>
            {t('lived_according_to_past_week')}: {dataPoint.satisfaction}
          </p>
          <p>
            {t('description')}: {dataPoint.description}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[var(--bg)]">
      <ResponsiveContainer
        width={width}
        {...(aspect ? { aspect } : { height })}
      >
        <RechartsRadarChart
          outerRadius={isMobile ? '95%' : '70%'}
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
            name={t('importance')}
            dataKey="importance"
            stroke="var(--chart-series-1)"
            fill="var(--chart-series-1)"
            fillOpacity={0.6}
            strokeWidth={radarStrokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Radar
            name={t('lived_according_to_past_week')}
            dataKey="satisfaction"
            stroke="var(--chart-series-2)"
            fill="var(--chart-series-2)"
            fillOpacity={0.6}
            strokeWidth={radarStrokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RadarChart;
