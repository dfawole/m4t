import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ComposedChart,
  ScatterChart,
  Scatter,
  PieChart,
  Pie,
  RadarChart,
  Radar,
  RadialBarChart,
  RadialBar,
  Treemap,
  ResponsiveContainer,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  Sector,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Brush,
  ReferenceLine,
  ReferenceArea,
  ErrorBar,
  LabelList
} from 'recharts';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { 
  Tooltip as TooltipUI,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  BarChart2,
  BarChart4,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  ScatterChart as ScatterChartIcon,
  Activity,
  Layers,
  Download,
  Share2,
  Maximize2,
  Eye,
  EyeOff,
  Filter,
  RefreshCw,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Calendar
} from 'lucide-react';

// List of chart types supported by the component
export type ChartType = 
  | 'line' 
  | 'area' 
  | 'bar' 
  | 'composed' 
  | 'scatter' 
  | 'pie' 
  | 'radar' 
  | 'radialBar'
  | 'treemap';

// Chart color themes
export type ColorTheme = 
  | 'default' 
  | 'blue' 
  | 'green' 
  | 'purple' 
  | 'rainbow'
  | 'pastel'
  | 'monochrome'
  | 'diverging';

// Chart theme (visual style)
export type ChartTheme = 
  | 'light' 
  | 'dark' 
  | 'system';

// Animation types
export type AnimationType = 
  | 'normal'
  | 'gentle'
  | 'wobbly'
  | 'stiff'
  | 'slow'
  | 'none';

// Interface for the component props
interface DynamicChartProps {
  // Data and structure
  data: any[];
  title?: string;
  description?: string;
  dataKeys?: string[];
  xAxisKey?: string;
  yAxisKeys?: string[];
  zAxisKey?: string;
  categoryKey?: string;
  valueKey?: string;
  nameKey?: string;
  
  // Chart configuration
  defaultChartType?: ChartType;
  availableChartTypes?: ChartType[];
  stacked?: boolean;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  className?: string;
  
  // Styling
  colorTheme?: ColorTheme;
  chartTheme?: ChartTheme;
  animationType?: AnimationType;
  animationDuration?: number;
  
  // Interactivity
  allowChartTypeChange?: boolean;
  allowColorThemeChange?: boolean;
  allowDataFilter?: boolean;
  allowTimeRangeSelection?: boolean;
  timeRangeKey?: string;
  timeRanges?: { label: string; value: string; filter: (item: any) => boolean }[];
  
  // Chart components
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  showBrush?: boolean;
  showAxis?: boolean;
  
  // Special features
  referenceLines?: { dataKey: string; value: number; label: string; color: string }[];
  referenceAreas?: { x1: number; x2: number; y1: number; y2: number; label: string; color: string }[];
  annotations?: { x: number; y: number; value: string }[];
  
  // Callbacks
  onChartTypeChange?: (chartType: ChartType) => void;
  onDataPointClick?: (data: any, index: number) => void;
  onExport?: (format: 'png' | 'svg' | 'csv' | 'json') => void;
  onFilterChange?: (filters: any) => void;
}

// Default color schemes
const colorSchemes: Record<ColorTheme, string[]> = {
  default: ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#00c49f'],
  blue: ['#003f5c', '#2f4b7c', '#665191', '#a05195', '#d45087', '#f95d6a', '#ff7c43', '#ffa600'],
  green: ['#38571a', '#437b18', '#59a80f', '#78d103', '#99e62a', '#baef5e', '#d8f79d', '#f2fcd3'],
  purple: ['#4b0082', '#6a0dad', '#8a2be2', '#9370db', '#ba55d3', '#dda0dd', '#ee82ee', '#da70d6'],
  rainbow: ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3'],
  pastel: ['#a8e6cf', '#dcedc1', '#ffd3b6', '#ffaaa5', '#ff8b94', '#cddafd', '#a3c4f3'],
  monochrome: ['#000000', '#333333', '#666666', '#999999', '#cccccc', '#eeeeee'],
  diverging: ['#d8365e', '#e66b8c', '#f1a3b9', '#f9d6e2', '#e2f1f8', '#b0ddf2', '#78c6e9', '#408fd4']
};

// Default chart type icons
const chartTypeIcons: Record<ChartType, React.ReactNode> = {
  line: <LineChartIcon className="h-4 w-4" />,
  area: <Activity className="h-4 w-4" />,
  bar: <BarChart2 className="h-4 w-4" />,
  composed: <Layers className="h-4 w-4" />,
  scatter: <ScatterChartIcon className="h-4 w-4" />,
  pie: <PieChartIcon className="h-4 w-4" />,
  radar: <Activity className="h-4 w-4" />,
  radialBar: <BarChart4 className="h-4 w-4" />,
  treemap: <Layers className="h-4 w-4" />
};

// Default time ranges
const defaultTimeRanges = [
  { label: 'Last 24 Hours', value: '24h', filter: (item: any) => true },
  { label: 'Last 7 Days', value: '7d', filter: (item: any) => true },
  { label: 'Last 30 Days', value: '30d', filter: (item: any) => true },
  { label: 'Last Quarter', value: 'quarter', filter: (item: any) => true },
  { label: 'Last Year', value: 'year', filter: (item: any) => true },
  { label: 'All Time', value: 'all', filter: (item: any) => true }
];

// Custom render active shape for pie chart
const renderActiveShape = (props: any) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-midAngle * Math.PI / 180);
  const cos = Math.cos(-midAngle * Math.PI / 180);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="text-sm font-medium">
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333" className="text-xs">{value}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999" className="text-xs">
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

// Get animation settings based on type and duration
const getAnimationConfig = (type: AnimationType, duration: number) => {
  switch (type) {
    case 'gentle':
      return { animationEasing: 'ease-in-out', animationDuration: duration };
    case 'wobbly':
      return { animationEasing: 'ease-in-out-back', animationDuration: duration };
    case 'stiff':
      return { animationEasing: 'ease-out-circ', animationDuration: duration };
    case 'slow':
      return { animationEasing: 'ease', animationDuration: duration * 2 };
    case 'none':
      return { animationEasing: 'ease', animationDuration: 0 };
    default:
      return { animationEasing: 'ease', animationDuration: duration };
  }
};

// Main component
export const DynamicChart: React.FC<DynamicChartProps> = ({
  // Data and structure props
  data,
  title = "Chart",
  description,
  dataKeys = ['value'],
  xAxisKey = 'name',
  yAxisKeys,
  zAxisKey,
  categoryKey,
  valueKey = 'value',
  nameKey = 'name',
  className,
  
  // Chart configuration props
  defaultChartType = 'line',
  availableChartTypes = ['line', 'area', 'bar', 'composed', 'pie'],
  stacked = false,
  height = 400,
  margin = { top: 20, right: 30, bottom: 20, left: 30 },
  
  // Styling props
  colorTheme = 'default',
  chartTheme = 'system',
  animationType = 'normal',
  animationDuration = 500,
  
  // Interactivity props
  allowChartTypeChange = true,
  allowColorThemeChange = true,
  allowDataFilter = true,
  allowTimeRangeSelection = false,
  timeRangeKey,
  timeRanges = defaultTimeRanges,
  
  // Chart components props
  showGrid = true,
  showTooltip = true,
  showLegend = true,
  showBrush = false,
  showAxis = true,
  
  // Special features props
  referenceLines = [],
  referenceAreas = [],
  annotations = [],
  
  // Callbacks
  onChartTypeChange,
  onDataPointClick,
  onExport,
  onFilterChange
}) => {
  // State hooks
  const [chartType, setChartType] = useState<ChartType>(defaultChartType);
  const [selectedColorTheme, setSelectedColorTheme] = useState<ColorTheme>(colorTheme);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>(timeRanges[0]?.value || 'all');
  const [filtersExpanded, setFiltersExpanded] = useState<boolean>(false);
  const [visibleDataKeys, setVisibleDataKeys] = useState<string[]>(dataKeys);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Filtered data based on time range and other filters
  const [filteredData, setFilteredData] = useState<any[]>(data);
  
  // Ref for handling fullscreen mode
  const chartContainerRef = React.useRef<HTMLDivElement>(null);
  
  // Derived colors based on theme
  const colors = colorSchemes[selectedColorTheme];
  
  // Animation config based on type and duration
  const animationConfig = getAnimationConfig(animationType, animationDuration);
  
  // Effect to filter data based on selected time range
  useEffect(() => {
    if (allowTimeRangeSelection && timeRangeKey) {
      const selectedRange = timeRanges.find((range) => range.value === selectedTimeRange);
      if (selectedRange) {
        const filtered = data.filter(selectedRange.filter);
        setFilteredData(filtered);
        
        if (onFilterChange) {
          onFilterChange({ timeRange: selectedTimeRange });
        }
      }
    } else {
      setFilteredData(data);
    }
  }, [data, selectedTimeRange, allowTimeRangeSelection, timeRangeKey, timeRanges, onFilterChange]);
  
  // Effect for fullscreen mode
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  // Handle chart type change
  const handleChartTypeChange = (type: ChartType) => {
    setChartType(type);
    if (onChartTypeChange) {
      onChartTypeChange(type);
    }
  };
  
  // Toggle data series visibility
  const toggleDataKeyVisibility = (dataKey: string) => {
    if (visibleDataKeys.includes(dataKey)) {
      setVisibleDataKeys(visibleDataKeys.filter((key) => key !== dataKey));
    } else {
      setVisibleDataKeys([...visibleDataKeys, dataKey]);
    }
  };
  
  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (chartContainerRef.current) {
      if (!document.fullscreenElement) {
        chartContainerRef.current.requestFullscreen().catch((err) => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    }
  };
  
  // Handle pie chart hover
  const handlePieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };
  
  // Handle refresh data
  const handleRefreshData = () => {
    setIsLoading(true);
    
    // Simulate data refresh
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };
  
  // Handle chart export
  const handleExport = (format: 'png' | 'svg' | 'csv' | 'json') => {
    if (onExport) {
      onExport(format);
    } else {
      // Simple CSV export implementation
      if (format === 'csv') {
        // Generate CSV content
        const headers = [nameKey, ...dataKeys].join(',');
        const rows = filteredData.map((item) => {
          const values = [item[nameKey], ...dataKeys.map((key) => item[key])];
          return values.join(',');
        }).join('\n');
        const csvContent = `${headers}\n${rows}`;
        
        // Create download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `${title.toLowerCase().replace(/\s+/g, '-')}-export.csv`);
        link.click();
        URL.revokeObjectURL(url);
      }
      // Implement other export formats as needed
    }
  };
  
  // Render appropriate chart based on selected type
  const renderChart = () => {
    const commonProps = {
      ...animationConfig,
      onClick: onDataPointClick,
      margin
    };
    
    // Helper function to render lines/areas/bars for cartesian charts
    const renderCartesianElements = (type: 'line' | 'area' | 'bar') => {
      return visibleDataKeys.map((dataKey, index) => {
        const color = colors[index % colors.length];
        const props = {
          key: dataKey,
          dataKey,
          name: dataKey,
          stroke: color,
          fill: type === 'line' ? 'none' : color,
          fillOpacity: type === 'area' ? 0.3 : 1,
          stackId: stacked ? 'stack' : undefined,
          activeDot: { r: 6, onClick: (event: any) => onDataPointClick?.(event.payload, event.index) }
        };
        
        if (type === 'line') return <Line {...props} />;
        if (type === 'area') return <Area {...props} />;
        return <Bar {...props} radius={[4, 4, 0, 0]} />;
      });
    };
    
    // Render reference lines if specified
    const renderReferenceLines = () => {
      return referenceLines.map((line, index) => (
        <ReferenceLine
          key={`ref-line-${index}`}
          y={line.value}
          stroke={line.color}
          strokeDasharray="3 3"
          label={{
            position: 'insideBottomRight',
            value: line.label,
            fill: line.color,
            fontSize: 12
          }}
        />
      ));
    };
    
    // Render reference areas if specified
    const renderReferenceAreas = () => {
      return referenceAreas.map((area, index) => (
        <ReferenceArea
          key={`ref-area-${index}`}
          x1={area.x1}
          x2={area.x2}
          y1={area.y1}
          y2={area.y2}
          fill={area.color}
          fillOpacity={0.2}
          label={{
            position: 'insideTopRight',
            value: area.label,
            fill: area.color,
            fontSize: 12
          }}
        />
      ));
    };
    
    // Chart rendering based on type
    switch (chartType) {
      case 'line':
        return (
          <LineChart data={filteredData} {...commonProps}>
            {showAxis && <XAxis dataKey={xAxisKey} />}
            {showAxis && <YAxis />}
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            {showTooltip && 
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--border)',
                  borderRadius: '0.375rem'
                }} 
              />
            }
            {showLegend && <Legend />}
            {showBrush && <Brush dataKey={xAxisKey} height={30} stroke="#8884d8" />}
            {renderCartesianElements('line')}
            {renderReferenceLines()}
            {renderReferenceAreas()}
          </LineChart>
        );
        
      case 'area':
        return (
          <AreaChart data={filteredData} {...commonProps}>
            {showAxis && <XAxis dataKey={xAxisKey} />}
            {showAxis && <YAxis />}
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            {showTooltip && 
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--border)',
                  borderRadius: '0.375rem'
                }} 
              />
            }
            {showLegend && <Legend />}
            {showBrush && <Brush dataKey={xAxisKey} height={30} stroke="#8884d8" />}
            {renderCartesianElements('area')}
            {renderReferenceLines()}
            {renderReferenceAreas()}
          </AreaChart>
        );
        
      case 'bar':
        return (
          <BarChart data={filteredData} {...commonProps}>
            {showAxis && <XAxis dataKey={xAxisKey} />}
            {showAxis && <YAxis />}
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            {showTooltip && 
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--border)',
                  borderRadius: '0.375rem'
                }} 
              />
            }
            {showLegend && <Legend />}
            {showBrush && <Brush dataKey={xAxisKey} height={30} stroke="#8884d8" />}
            {renderCartesianElements('bar')}
            {renderReferenceLines()}
            {renderReferenceAreas()}
          </BarChart>
        );
        
      case 'composed':
        return (
          <ComposedChart data={filteredData} {...commonProps}>
            {showAxis && <XAxis dataKey={xAxisKey} />}
            {showAxis && <YAxis />}
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            {showTooltip && 
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--border)',
                  borderRadius: '0.375rem'
                }} 
              />
            }
            {showLegend && <Legend />}
            {showBrush && <Brush dataKey={xAxisKey} height={30} stroke="#8884d8" />}
            
            {/* We render different chart types based on dataKey position */}
            {visibleDataKeys.map((dataKey, index) => {
              const color = colors[index % colors.length];
              const elementType = index % 3; // Cycle through element types
              
              if (elementType === 0) {
                return (
                  <Bar 
                    key={dataKey} 
                    dataKey={dataKey} 
                    name={dataKey}
                    fill={color} 
                    radius={[4, 4, 0, 0]}
                    onClick={(data) => onDataPointClick?.(data, data.index)} 
                  />
                );
              } else if (elementType === 1) {
                return (
                  <Line
                    key={dataKey}
                    type="monotone"
                    dataKey={dataKey}
                    name={dataKey}
                    stroke={color}
                    activeDot={{ r: 6, onClick: (event: any) => onDataPointClick?.(event.payload, event.index) }}
                  />
                );
              } else {
                return (
                  <Area
                    key={dataKey}
                    type="monotone"
                    dataKey={dataKey}
                    name={dataKey}
                    fill={color}
                    stroke={color}
                    fillOpacity={0.3}
                  />
                );
              }
            })}
            
            {renderReferenceLines()}
            {renderReferenceAreas()}
          </ComposedChart>
        );
        
      case 'scatter':
        return (
          <ScatterChart data={filteredData} {...commonProps}>
            {showAxis && <XAxis dataKey={xAxisKey} type="number" />}
            {showAxis && <YAxis dataKey={yAxisKeys?.[0] || valueKey} type="number" />}
            {zAxisKey && <ZAxis dataKey={zAxisKey} range={[60, 400]} name="value" />}
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            {showTooltip && 
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--border)',
                  borderRadius: '0.375rem'
                }} 
                cursor={{ strokeDasharray: '3 3' }}
              />
            }
            {showLegend && <Legend />}
            {visibleDataKeys.map((dataKey, index) => (
              <Scatter
                key={dataKey}
                name={dataKey}
                data={filteredData}
                fill={colors[index % colors.length]}
                line={{ stroke: colors[index % colors.length], strokeWidth: 1 }}
              />
            ))}
          </ScatterChart>
        );
        
      case 'pie':
        return (
          <PieChart {...commonProps}>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={filteredData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              dataKey={valueKey}
              nameKey={nameKey}
              onMouseEnter={handlePieEnter}
              onClick={(data, index) => onDataPointClick?.(data, index)}
              label
            >
              {filteredData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            {showTooltip && 
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--border)',
                  borderRadius: '0.375rem'
                }} 
              />
            }
            {showLegend && <Legend />}
          </PieChart>
        );
        
      case 'radar':
        return (
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={filteredData} {...commonProps}>
            <PolarGrid />
            <PolarAngleAxis dataKey={categoryKey || nameKey} />
            <PolarRadiusAxis />
            {visibleDataKeys.map((dataKey, index) => (
              <Radar
                key={dataKey}
                name={dataKey}
                dataKey={dataKey}
                stroke={colors[index % colors.length]}
                fill={colors[index % colors.length]}
                fillOpacity={0.6}
              />
            ))}
            {showTooltip && 
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--border)',
                  borderRadius: '0.375rem'
                }} 
              />
            }
            {showLegend && <Legend />}
          </RadarChart>
        );
        
      case 'radialBar':
        return (
          <RadialBarChart 
            cx="50%" 
            cy="50%" 
            innerRadius="10%" 
            outerRadius="80%" 
            barSize={10} 
            data={filteredData} 
            startAngle={180} 
            endAngle={0}
            {...commonProps}
          >
            <RadialBar
              background
              dataKey={valueKey}
              cornerRadius={15}
              label={{
                position: 'insideStart',
                fill: '#fff',
                fontWeight: 600
              }}
            >
              {filteredData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </RadialBar>
            {showTooltip && 
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--border)',
                  borderRadius: '0.375rem'
                }} 
              />
            }
            {showLegend && <Legend iconSize={10} layout="vertical" verticalAlign="middle" wrapperStyle={{ right: 0, top: 0, transform: 'translate(0, 0)' }} />}
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          </RadialBarChart>
        );
        
      case 'treemap':
        return (
          <Treemap
            data={filteredData}
            dataKey={valueKey}
            nameKey={nameKey}
            aspectRatio={4/3}
            stroke="#fff"
            fill="#8884d8"
            
            {...commonProps}
          />
        );
        
      default:
        return (
          <LineChart data={filteredData} {...commonProps}>
            {showAxis && <XAxis dataKey={xAxisKey} />}
            {showAxis && <YAxis />}
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            {showTooltip && 
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--border)',
                  borderRadius: '0.375rem'
                }} 
              />
            }
            {showLegend && <Legend />}
            {renderCartesianElements('line')}
          </LineChart>
        );
    }
  };
  
  return (
    <Card ref={chartContainerRef} className={`${className || ''} ${isFullscreen ? 'fixed inset-0 z-50 m-0 rounded-none' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          
          <div className="flex items-center gap-2 flex-wrap justify-end">
            {/* Chart type selector */}
            {allowChartTypeChange && availableChartTypes.length > 1 && (
              <Select
                value={chartType}
                onValueChange={(value) => handleChartTypeChange(value as ChartType)}
              >
                <SelectTrigger className="w-[130px] h-8">
                  <div className="flex items-center gap-2">
                    {chartTypeIcons[chartType]}
                    <span>{chartType.charAt(0).toUpperCase() + chartType.slice(1)}</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {availableChartTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      <div className="flex items-center gap-2">
                        {chartTypeIcons[type]}
                        <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            {/* Color theme selector */}
            {allowColorThemeChange && (
              <Select
                value={selectedColorTheme}
                onValueChange={(value) => setSelectedColorTheme(value as ColorTheme)}
              >
                <SelectTrigger className="w-[130px] h-8">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {colorSchemes[selectedColorTheme].slice(0, 3).map((color, index) => (
                        <div
                          key={index}
                          className="w-3 h-3 rounded-full border border-border"
                          style={{ backgroundColor: color, marginLeft: index > 0 ? -5 : 0 }}
                        />
                      ))}
                    </div>
                    <span>Colors</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(colorSchemes).map((theme) => (
                    <SelectItem key={theme} value={theme}>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {colorSchemes[theme as ColorTheme].slice(0, 3).map((color, index) => (
                            <div
                              key={index}
                              className="w-3 h-3 rounded-full border border-border"
                              style={{ backgroundColor: color, marginLeft: index > 0 ? -5 : 0 }}
                            />
                          ))}
                        </div>
                        <span>{theme.charAt(0).toUpperCase() + theme.slice(1)}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            {/* Time range selector */}
            {allowTimeRangeSelection && (
              <Select
                value={selectedTimeRange}
                onValueChange={setSelectedTimeRange}
              >
                <SelectTrigger className="w-[130px] h-8">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {timeRanges.find((range) => range.value === selectedTimeRange)?.label || 'Time Range'}
                    </span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {timeRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            {/* Action buttons */}
            <div className="flex gap-1">
              <TooltipProvider>
                <TooltipUI>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => handleRefreshData()}
                      disabled={isLoading}
                    >
                      <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                      <span className="sr-only">Refresh</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Refresh Data</p>
                  </TooltipContent>
                </TooltipUI>
              </TooltipProvider>
              
              <TooltipProvider>
                <TooltipUI>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => setFiltersExpanded(!filtersExpanded)}
                    >
                      <Filter className="h-4 w-4" />
                      <span className="sr-only">Filters</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Toggle Filters</p>
                  </TooltipContent>
                </TooltipUI>
              </TooltipProvider>
              
              <Select onValueChange={(value) => handleExport(value as 'png' | 'svg' | 'csv' | 'json')}>
                <SelectTrigger className="w-8 h-8 p-0 justify-center">
                  <Download className="h-4 w-4" />
                  <span className="sr-only">Export</span>
                </SelectTrigger>
                <SelectContent align="end">
                  <SelectItem value="png">Export as PNG</SelectItem>
                  <SelectItem value="svg">Export as SVG</SelectItem>
                  <SelectItem value="csv">Export as CSV</SelectItem>
                  <SelectItem value="json">Export as JSON</SelectItem>
                </SelectContent>
              </Select>
              
              <TooltipProvider>
                <TooltipUI>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={toggleFullscreen}
                    >
                      <Maximize2 className="h-4 w-4" />
                      <span className="sr-only">Fullscreen</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Toggle Fullscreen</p>
                  </TooltipContent>
                </TooltipUI>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </CardHeader>
      
      {/* Filters panel */}
      {filtersExpanded && allowDataFilter && (
        <div className="px-6 py-2 border-t border-b">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium">Data Series Visibility</h4>
            <Button variant="ghost" size="sm" onClick={() => setVisibleDataKeys([...dataKeys])}>
              Reset
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            {dataKeys.map((dataKey) => (
              <Badge
                key={dataKey}
                variant={visibleDataKeys.includes(dataKey) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleDataKeyVisibility(dataKey)}
              >
                <div className="flex items-center gap-1">
                  {visibleDataKeys.includes(dataKey) ? (
                    <Eye className="h-3 w-3" />
                  ) : (
                    <EyeOff className="h-3 w-3" />
                  )}
                  {dataKey}
                </div>
              </Badge>
            ))}
          </div>
          
          {chartType !== 'pie' && chartType !== 'radar' && chartType !== 'treemap' && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Chart Options</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="showGrid" 
                    checked={showGrid} 
                    onChange={() => ({})} // We're just showing capabilities here, not implementing all functionality
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="showGrid" className="text-sm">Show Grid</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="showLegend" 
                    checked={showLegend} 
                    onChange={() => ({})}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="showLegend" className="text-sm">Show Legend</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="showTooltip" 
                    checked={showTooltip} 
                    onChange={() => ({})}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="showTooltip" className="text-sm">Show Tooltip</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="stacked" 
                    checked={stacked} 
                    onChange={() => ({})}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="stacked" className="text-sm">Stacked</label>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Empty state */}
      {filteredData.length === 0 && (
        <CardContent className="pt-6 flex flex-col items-center justify-center h-[200px]">
          <AlertCircle className="h-10 w-10 text-muted-foreground mb-3" />
          <p className="text-center text-muted-foreground">No data available for the selected filters.</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => setSelectedTimeRange('all')}>
            Reset Filters
          </Button>
        </CardContent>
      )}
      
      {/* Chart container */}
      {filteredData.length > 0 && (
        <CardContent className={isLoading ? 'opacity-50' : ''}>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {renderChart()}
            </ResponsiveContainer>
          </div>
        </CardContent>
      )}
      
      {/* Card footer with insights or additional context */}
      <CardFooter className="pt-2 flex-col items-start sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="text-sm text-muted-foreground">
          {filteredData.length > 0 ? `Showing ${filteredData.length} data points` : 'No data to display'}
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="h-6">
            {isExternalAnalytics ? 'External Analytics' : 'Internal Analytics'}
          </Badge>
        </div>
      </CardFooter>
    </Card>
  );
};

// Flag to determine if analytics are for internal or external use
const isExternalAnalytics = false;

export default DynamicChart;