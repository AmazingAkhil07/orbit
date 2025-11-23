import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
    try {
        const { messages, context, foundPropertiesCount } = await req.json();
        console.log('Received messages:', messages);
        console.log('Context:', context);
        console.log('Found properties:', foundPropertiesCount);

        const systemPrompt = `You are Orbit Assistant, a helpful AI assistant for a student housing platform called Orbit.
You help students find properties, check their booking status, understand amenities, and learn about student housing options.

${context ? `CURRENT CONTEXT: The user is viewing a property: ${context}` : ''}

${foundPropertiesCount && foundPropertiesCount > 0 ? `NOTE: You found ${foundPropertiesCount} properties matching the user's criteria. The properties will be displayed to the user separately below your response. You can reference them in your response, like "I found X properties matching your criteria" or "Here are the top ${Math.min(5, foundPropertiesCount)} options for you."` : ''}

Guidelines:
- Be friendly, professional, and concise.
- When discussing the property they're viewing, provide specific insights about amenities, location benefits, and booking information.
- For general queries, provide helpful information about student housing.
- When users ask to find properties or see recommendations, mention the properties that were found.
- If properties are found, tell them to look at the property cards below for details like price, location, and amenities.
- Always be honest and helpful.
- If you don't know something, say so.

IMPORTANT FORMATTING:
- Write in natural, conversational language
- Do NOT use markdown formatting like asterisks (*), bold (**), underscores (_), or special symbols
- Do NOT use bullet points or numbered lists with symbols
- Write paragraphs naturally, like you're talking to a friend
- When listing things, mention them in sentences naturally
- Keep responses clear but without forcing visual formatting

Keep responses clear and conversational.`;

        const result = await generateText({
            model: google('gemini-2.0-flash'),
            messages,
            system: systemPrompt,
            temperature: 0.7,
            // maxTokens: 500,
        });

        return Response.json({ content: result.text });
    } catch (error) {
        console.error('Error in POST /api/chat:', error);
        return Response.json({ error: 'Internal Server Error', details: String(error) }, { status: 500 });
    }
}
