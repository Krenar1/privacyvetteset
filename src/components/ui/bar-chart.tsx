import * as React from "react";
import {
  Bar,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";

interface BarChartProps {
  data: any[];
  index: string;
  categories: string[];
  colors?: string[];
  valueFormatter?: (value: number) => string;
  yAxisWidth?: number;
  showLegend?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
  className?: string;
}

const defaultColors = ["#0088fe", "#00c49f", "#ffbb28", "#ff8042", "#8884d8"];

export function BarChart({
  data,
  index,
  categories,
  colors = defaultColors,
  valueFormatter = (value) => `${value}`,
  yAxisWidth = 40,
  showLegend = true,
  showXAxis = true,
  showYAxis = true,
  className,
}: BarChartProps) {
  return (
    <div className={cn("w-full h-[350px]", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          {showXAxis && (
            <XAxis
              dataKey={index}
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
          )}
          {showYAxis && (
            <YAxis
              width={yAxisWidth}
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={valueFormatter}
            />
          )}
          <Tooltip
            cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-medium">{payload[0].payload[index]}</div>
                      <div className="font-medium text-right"></div>
                    </div>
                    <div className="mt-2 space-y-1">
                      {payload.map((entry, index) => (
                        <div
                          key={`item-${index}`}
                          className="grid grid-cols-2 items-center gap-2"
                        >
                          <div className="flex items-center gap-1">
                            <div
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: entry.color }}
                            />
                            <span className="text-xs text-muted-foreground capitalize">
                              {entry.dataKey || categories[index]}
                            </span>
                          </div>
                          <span className="text-xs font-medium text-right">
                            {valueFormatter(entry.value as number)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          {categories.map((category, index) => (
            <Bar
              key={category}
              dataKey={category}
              fill={colors[index % colors.length]}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
      {showLegend && (
        <div className="mt-4 flex justify-center gap-4">
          {categories.map((category, index) => (
            <div key={category} className="flex items-center gap-1">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span className="text-xs text-muted-foreground capitalize">
                {category}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}