require('dotenv').config();

const Discord = require('discord.js');
const onMessage = require('./events/message.js');
const onReady = require('./events/ready.js');
const client = new Discord.Client();
global.CODE_PULAR = 109;

// Carregar eventos
client.on('ready', () => onReady(client));
client.on('disconnect', () => console.log('Desconectado, tentando reconectar'));
client.on('reconnecting', () => console.log('Reconectando'));
client.on('message', async message => onMessage(client, message));
client.on('error', console.error);
client.on('warn', console.warn);

client.login(process.env.AUTH_TOKEN);