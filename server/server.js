import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_SECRET_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello my chatting buddy',
  });
});

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;
    console.log('prompt', prompt);
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `${prompt}`,
      temperature: 0.5,
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      // stop: ["\"\"\""],
    });
    console.log('res', response.data.choices[0].text);
    res.status(200).send({
      bot: response?.data?.choices[0]?.text,
    });
  } catch (error) {
    console.log('error', error);
    res.status(500).send({ error });
  }
});

app.listen(5000, () =>
  console.log('server is running on http://localhost:5000 port')
);
