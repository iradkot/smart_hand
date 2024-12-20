import React from 'react';
import { summaryBoxStyle } from '../utils/styles';
import { MAX_CHARS_PER_COPY } from 'src/constants/LLM.constants'

interface SelectedSummaryProps {
  totalItems: number;
  totalChars: number;
}

const TotalCharsDisplay = ({totalChars}: {totalChars: number}) => {
  const isAboveMaxChars = totalChars > MAX_CHARS_PER_COPY
  let displayedText = `Chars: ${totalChars}`
  const maxCharsStyle = {}
  if (isAboveMaxChars) {
    displayedText += ` !above max chars per copy! max is ${MAX_CHARS_PER_COPY}`
    maxCharsStyle['color'] = 'red'
  }
  return (
    <div style={maxCharsStyle}>
      {displayedText}
    </div>
  )

}
export const SelectedSummary: React.FC<SelectedSummaryProps> = ({ totalItems, totalChars }) => {
  return (
    <div style={summaryBoxStyle}>
      <strong>Selected Summary:</strong><br />
      Items: {totalItems}<br />
      <TotalCharsDisplay totalChars={totalChars} />
    </div>
  );
};
