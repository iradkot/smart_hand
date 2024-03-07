import {config} from "../../../../renderer/src/config";

const MAX_SECTION_LENGTH = config.maxSectionLength

export function splitContent(content: string, maxSectionLength = MAX_SECTION_LENGTH) {
  const sections = []
  let index = 0

  while (index < content.length) {
    let endIndex = Math.min(index + maxSectionLength, content.length)
    const lineBreakIndex = content.lastIndexOf('\n', endIndex)

    if (lineBreakIndex > index) {
      endIndex = lineBreakIndex
    }

    sections.push(content.slice(index, endIndex))
    index = endIndex
  }

  return sections
}
