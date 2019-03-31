require('dotenv').config();
const Discord = require('discord.js');
const {readdirSync} = require('fs');
const Enmap = require('enmap');
const client = new Discord.Client();
client.commands = new Enmap();
const cmdFiles = readdirSync('./commands/');

// Carregar comandos
cmdFiles.forEach(f => {
  try {
    const props = require(`./commands/${f}`);
    if (f.split('.').slice(-1)[0] !== 'js') return;
    console.log('[LOG]', `Carregando o comando: ${props.help.name}`);
    if (props.init) {
      props.init(client);
    }
    client.commands.set(props.help.name, props);
  } catch (e) {
    console.log('[LOG]', `Falha ao carregar o comando ${f}: ${e}`);
  }
})

// Carregar eventos
const evtFiles = readdirSync('./events/')
console.log('[LOG]', `Carregando ${evtFiles.length} eventos`);
evtFiles.forEach(f => {
  const eventName = f.split('.')[0];
  const event = require(`./events/${f}`);
  console.log('[LOG]', `Carregando o evento: ${eventName}`);
  client.on(eventName, event.bind(null, client));
})

client.on('[ERRO]', (err) => {console.log('[ERRO]', err)});

client.login(process.env.AUTH_TOKEN);
