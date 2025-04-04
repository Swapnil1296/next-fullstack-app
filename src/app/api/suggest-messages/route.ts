import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { NextResponse } from 'next/server';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;
export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    // Instead of using messages from the request, we'll use our predefined prompt
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    // Using the new streamText function with the gpt-3.5-turbo-instruct model
    const result = streamText({
      model: openai('gpt-3.5-turbo-instruct'),
      // For completions models, use 'prompt' instead of 'messages'
      prompt,
      maxTokens: 400,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    if (error instanceof Error) {
      console.error('An unexpected error occurred:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error('An unknown error occurred');
      return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
  }
}