import React from 'react';
import { summaryBoxStyle } from '../utils/styles';
import { MAX_CHARS_PER_COPY } from 'src/constants/LLM.constants'

interface SelectedSummaryProps {
  totalItems: number;
  totalChars: number;
}
const getTextColorByTextSize = (textSize) => {
  const maxGreen = 255
  const maxRed = 255
  const redSizeRatio = Math.max(textSize / MAX_CHARS_PER_COPY, 0)
  const greenSizeRatio = Math.min(textSize / MAX_CHARS_PER_COPY, 1)
  const redAmount =  redSizeRatio * maxRed;
  const greenAmount =  maxRed - (greenSizeRatio * maxGreen);
  const blueAmount = 0;
  return `rgb(${redAmount}, ${greenAmount}, ${blueAmount}`;


}

const TotalCharsDisplay = ({totalChars}: {totalChars: number}) => {
  const isAboveMaxChars = totalChars > MAX_CHARS_PER_COPY
  let displayedText = `Chars: ${totalChars}`
  const maxCharsStyle = {}
  if (isAboveMaxChars) {
    displayedText += ` !above max chars per copy! max is ${MAX_CHARS_PER_COPY}`
    maxCharsStyle['color'] = 'red'
  } else {
    maxCharsStyle['color'] = getTextColorByTextSize(totalChars)
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
