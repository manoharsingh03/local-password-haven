import React from 'react';

// This function creates a formatter for recharts that properly handles formatting
// It returns a ReactNode that recharts can use as content in tooltips or labels
export const createFormatter = (prefix: string = '', suffix: string = '') => {
  return (value: any) => {
    // If value is already a string or number, return it formatted
    if (typeof value === 'string' || typeof value === 'number') {
      return `${prefix}${value}${suffix}`;
    }
    // Otherwise return a string representation
    return `${prefix}${value?.toString()}${suffix}`;
  };
};

// Currency formatter for financial values
export const currencyFormatter = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Custom tooltip content that returns a ReactNode instead of a string
export const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/90 p-2 border border-border rounded-md shadow-md">
        <p className="font-medium">{`${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p 
            key={`item-${index}`} 
            style={{ color: entry.color }}
            className="text-sm"
          >
            {`${entry.name}: ${currencyFormatter(entry.value)}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const percentFormatter = (value: number) => {
  return `${value.toFixed(0)}%`;
};
