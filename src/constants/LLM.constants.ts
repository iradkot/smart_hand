/*
We set max chars per copy due to token limitation for when working with llm models
 */
import { config } from 'src/renderer/src/config'

export const MAX_CHARS_PER_COPY = config.maxSectionLength
