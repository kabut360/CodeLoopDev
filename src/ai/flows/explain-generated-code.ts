'use server';

/**
 * @fileOverview This file defines a Genkit flow for explaining generated code snippets based on the user's experience level.
 *
 * - explainGeneratedCode - A function that takes generated code and returns an explanation of the code for a junior developer.
 * - ExplainGeneratedCodeInput - The input type for the explainGeneratedCode function.
 * - ExplainGeneratedCodeOutput - The return type for the explainGeneratedCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainGeneratedCodeInputSchema = z.object({
  code: z.string().describe('The code snippet to be explained.'),
});
export type ExplainGeneratedCodeInput = z.infer<
  typeof ExplainGeneratedCodeInputSchema
>;

const ExplainGeneratedCodeOutputSchema = z.object({
  explanation: z.string().describe('The AI-powered explanation of the code.'),
});
export type ExplainGeneratedCodeOutput = z.infer<
  typeof ExplainGeneratedCodeOutputSchema
>;

export async function explainGeneratedCode(
  input: ExplainGeneratedCodeInput
): Promise<ExplainGeneratedCodeOutput> {
  return explainGeneratedCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainGeneratedCodePrompt',
  input: {schema: ExplainGeneratedCodeInputSchema},
  output: {schema: ExplainGeneratedCodeOutputSchema},
  prompt: `You are an AI expert in explaining code to developers of varying experience levels.

You will receive a code snippet. Your goal is to provide a clear, concise, and helpful explanation of the code tailored to a junior developer.

Code Snippet:
\`\`\`
{{{code}}}
\`\`\`

Explanation:`,
});

const explainGeneratedCodeFlow = ai.defineFlow(
  {
    name: 'explainGeneratedCodeFlow',
    inputSchema: ExplainGeneratedCodeInputSchema,
    outputSchema: ExplainGeneratedCodeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
