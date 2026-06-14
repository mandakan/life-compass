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
import type { TFunction } from 'i18next';

type CustomTickProps = {
  x?: number;
  y?: number;
  payload: {
    value: string;
  };
  textAnchor?: 'start' | 'middle' | 'end';
};

type TooltipPayloadItem = {
  payload: {
    importance: number;
    satisfaction: number;
    description: string;
  };
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
};

interface RadarChartData {
  area: string;
  importance: number;
  satisfaction: number;
  description: string;
}

// recharts 3 narrowed ResponsiveContainer's width/height to a number or a
// `${number}%` string.
type ChartDimension = number | `${number}%`;

interface RadarChartProps {
  data: RadarChartData[];
  width?: ChartDimension;
  height?: ChartDimension;
  aspect?: number;
}

// Defined at module scope (not inside RadarChart) so they are stable component
// identities. recharts clones these elements with the tick/tooltip props it
// computes; the extra props below are supplied by RadarChart.
const RadarTick = ({
  x,
  y,
  textAnchor,
  payload,
  tickFontSize,
  isMobile,
}: CustomTickProps & { tickFontSize?: number; isMobile?: boolean }) => (
  <text
    x={x}
    y={y}
    textAnchor={textAnchor}
    fill="var(--color-text)"
    fontSize={tickFontSize}
  >
    <tspan x={x} dy={0}>
      {isMobile ? '' : payload.value}
    </tspan>
  </text>
);

const RadarTooltip = ({
  active,
  payload,
  label,
  t,
}: CustomTooltipProps & { t: TFunction }) => {
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
    return data;
  }, [data]);

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
          <PolarAngleAxis
            dataKey="area"
            tick={
              (
                <RadarTick tickFontSize={tickFontSize} isMobile={isMobile} />
              ) as React.ComponentProps<typeof PolarAngleAxis>['tick']
            }
          />
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
          <Tooltip content={<RadarTooltip t={t} />} />
          <Legend />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RadarChart;
