import React from 'react';
import { summaryBoxStyle } from '../utils/styles';

interface SelectedSummaryProps {
  totalItems: number;
  totalChars: number;
}

export const SelectedSummary: React.FC<SelectedSummaryProps> = ({ totalItems, totalChars }) => {
  return (
    <div style={summaryBoxStyle}>
      <strong>Selected Summary:</strong><br />
      Items: {totalItems}<br />
      Chars: {totalChars}
    </div>
  );
};
