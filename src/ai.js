import { generateText, Output } from 'ai'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'

const model = openai({
    apiKey: process.env.OPENAI_API_KEY,
})
