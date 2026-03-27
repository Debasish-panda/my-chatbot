const express = require('express');
const  OpenAI  = require('openai');
// const Anthropic = require('@anthropic-ai/sdk');
const app = express();
app.use(express.json());
require('dotenv').config();

const openai = new OpenAI({ apiKey: process.env.GROK_API_KEY,
  baseURL: "https://api.x.ai/v1" });
// const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

app.post('/api/chat', async (req, res) => {
//   const { messages, model = 'gpt-4o-mini' } = req.body;
  const { messages, model = 'grok-2-latest' } = req.body;

  // Route to different LLMs based on model name
//   if (model.startsWith('claude')) {
//     const response = await anthropic.messages.create({
//       model: 'claude-sonnet-4-6',
//       max_tokens: 1024,
//       messages
//     });
//     return res.json({ message: response.content[0].text });
//   }

  // Default: OpenAI
  const response = await openai.chat.completions.create({
    model, messages
  });
  res.json({ message: response.choices[0].message.content });
});

app.listen(process.env.PORT, () => console.log('AI server running'));