'use server';

/**
 * @fileOverview This file defines a Genkit flow for explaining generated code snippets based on the user's experience level.
 *
 * - explainGeneratedCode - A function that takes generated code and an experience level, and returns an explanation of the code.
 * - ExplainGeneratedCodeInput - The input type for the explainGeneratedCode function.
 * - ExplainGeneratedCodeOutput - The return type for the explainGeneratedCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainGeneratedCodeInputSchema = z.object({
  code: z.string().describe('The code snippet to be explained.'),
  experienceLevel: z
    .enum(['junior', 'mid', 'senior'])
    .describe('The experience level of the user.'),
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

You will receive a code snippet and the experience level of the developer.
Your goal is to provide a clear, concise, and helpful explanation of the code tailored to their experience level.

Code Snippet:
\`\`\`
{{{code}}}
\`\`\`

Experience Level: {{{experienceLevel}}}

Explanation:`, // Removed line break to avoid excessive spacing
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
