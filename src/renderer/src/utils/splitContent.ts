import { MAX_CHARS_PER_COPY } from 'src/constants/LLM.constants'


/**
 * Splits the given content into smaller sections based on the specified maximum section length.
 * Attempts to split at line breaks to preserve whole lines. If a line exceeds the maximum length,
 * it splits the line into smaller chunks.
 *
 * @param content - The string content to be split into sections.
 * @param maxSectionLength - The maximum length of each section. Defaults to MAX_CHARS_PER_COPY from config.
 * @returns An array of string sections.
 */
export function splitContent(content: string, maxSectionLength = MAX_CHARS_PER_COPY): string[] {
  if (!content) {
    return [];
  }

  const sections: string[] = [];
  const lines = content.split('\n');
  let currentSection = '';

  for (const line of lines) {
    // If adding the current line exceeds the max length
    if ((currentSection + '\n' + line).length > maxSectionLength) {
      if (currentSection) {
        sections.push(currentSection);
        currentSection = '';
      }

      // If the line itself exceeds the max length, split it further
      if (line.length > maxSectionLength) {
        const splitLines = splitLongLine(line, maxSectionLength);
        sections.push(...splitLines.slice(0, -1));
        currentSection = splitLines[splitLines.length - 1];
      } else {
        currentSection = line;
      }
    } else {
      currentSection += (currentSection ? '\n' : '') + line;
    }
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  return sections;
}

/**
 * Splits a single long line into smaller chunks without exceeding the maximum section length.
 * Splitting is done at word boundaries to maintain readability. If a word itself exceeds the
 * maximum length, it is split at the character level.
 *
 * @param line - The long line to be split.
 * @param maxLength - The maximum length for each split chunk.
 * @returns An array of split line chunks.
 */
function splitLongLine(line: string, maxLength: number): string[] {
  const words = line.split(' ');
  const splitLines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if ((currentLine + ' ' + word).trim().length > maxLength) {
      if (currentLine) {
        splitLines.push(currentLine);
        currentLine = '';
      }

      if (word.length > maxLength) {
        // Split the word itself if it's too long
        const splitWords = splitWord(word, maxLength);
        splitLines.push(...splitWords.slice(0, -1));
        currentLine = splitWords[splitWords.length - 1];
      } else {
        currentLine = word;
      }
    } else {
      currentLine += (currentLine ? ' ' : '') + word;
    }
  }

  if (currentLine) {
    splitLines.push(currentLine);
  }

  return splitLines;
}

/**
 * Splits a single word into smaller chunks without exceeding the maximum length.
 *
 * @param word - The word to be split.
 * @param maxLength - The maximum length for each split chunk.
 * @returns An array of split word chunks.
 */
function splitWord(word: string, maxLength: number): string[] {
  const splitWords: string[] = [];
  let index = 0;

  while (index < word.length) {
    const end = Math.min(index + maxLength, word.length);
    splitWords.push(word.slice(index, end));
    index = end;
  }

  return splitWords;
}
