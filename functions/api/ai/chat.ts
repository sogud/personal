import { generateText } from 'ai';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';

type Env = Record<string, never>;

type PagesFunction<Env> = (context: {
  request: Request;
  env: Env;
}) => Response | Promise<Response>;

type ChatRequest = {
  message?: string;
  apiKey?: string;
  model?: string;
  provider?: ProviderId;
};

type ProviderId = 'openrouter' | 'openai' | 'deepseek' | 'groq' | 'mistral';

type ProviderConfig = {
  name: string;
  baseURL: string;
  defaultModel: string;
};

const providers: Record<ProviderId, ProviderConfig> = {
  openrouter: {
    name: 'OpenRouter',
    baseURL: 'https://openrouter.ai/api/v1',
    defaultModel: 'openai/gpt-4o-mini',
  },
  openai: {
    name: 'OpenAI',
    baseURL: 'https://api.openai.com/v1',
    defaultModel: 'gpt-4o-mini',
  },
  deepseek: {
    name: 'DeepSeek',
    baseURL: 'https://api.deepseek.com/v1',
    defaultModel: 'deepseek-chat',
  },
  groq: {
    name: 'Groq',
    baseURL: 'https://api.groq.com/openai/v1',
    defaultModel: 'llama-3.1-8b-instant',
  },
  mistral: {
    name: 'Mistral',
    baseURL: 'https://api.mistral.ai/v1',
    defaultModel: 'mistral-small-latest',
  },
};

const systemPrompt = [
  'You are a concise AI terminal inside a personal website.',
  'Answer directly, avoid filler, and keep responses compact.',
].join(' ');

export const onRequestPost: PagesFunction<Env> = async ({ request }) => {
  let body: ChatRequest;
  try {
    body = await request.json();
  } catch (error) {
    return json({ error: 'Invalid JSON request.' }, 400);
  }

  const message = body.message?.trim();
  if (!message) {
    return json({ error: 'Message is required.' }, 400);
  }

  const apiKey = body.apiKey?.trim();
  if (!apiKey) {
    return json({ error: 'User API key is required. This site only proxies user-owned provider keys.' }, 401);
  }

  const providerId = body.provider || 'openrouter';
  const config = getProviderConfig(providerId);
  if (!config) {
    return json({ error: 'Unsupported provider.' }, 400);
  }

  const model = body.model?.trim() || config.defaultModel;
  if (model.length > 120) {
    return json({ error: 'Model name is too long.' }, 400);
  }

  try {
    const provider = createOpenAICompatible({
      name: config.name,
      apiKey,
      baseURL: config.baseURL,
    });

    const { text, usage, finishReason } = await generateText({
      model: provider(model),
      system: systemPrompt,
      prompt: message,
      maxOutputTokens: 500,
      temperature: 0.4,
    });

    return json({
      reply: text,
      usage,
      finishReason,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'AI provider request failed.';
    return json({ error: message }, 502);
  }
};

export const onRequest: PagesFunction<Env> = async () => {
  return json({ error: 'Use POST.' }, 405);
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

function getProviderConfig(provider: ProviderId): ProviderConfig | null {
  return providers[provider] || null;
}
