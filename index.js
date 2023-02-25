const { Client, GatewayIntentBits } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
})

// Prepare connection to OpenAI API
const configuration = new Configuration({
  apiKey: process.env.OPEN_AI,
});
const openai = new OpenAIApi(configuration);

// Check for when a message on discord is sent
client.on('messageCreate', async function(message) {
  try {
    // Dont respond to yourself or other bots
    if (message.author.bot) return;
    // only send message in given channel
    if (message.channel.id !== process.env.CHANNEL_ID) return;

    const gptResponse = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: `ChatGPT is a freindly chatbot.\n\
ChatGPT: Hello, how are you?\n\
${message.author.username}: ${message.content}\n\`,
ChatGPT: `,
      temperature: 0.9,
      max_tokens: 100,
      stop: ["ChatGPT:", "Uo:"],
    })

    message.reply(`${gptResponse.data.choices[0].text}`);
    return;

  } catch (err) {
    console.log(err)
  }
});

//Log the bot into Discord 
client.login(process.env.TOKEN);


client.on("ready", () => {
  console.log(`logged as ${client.user.username}!`);
})

const http = require("http");
http.createServer((_, res) => res.end("server probably working")).listen(8080)

setInterval(() => {
  if (!client || !client.user) {
    console.log("Bot/client login fail. Process Ended, refer to 56.")
    process.kill(1);
  }
}, 5000);
