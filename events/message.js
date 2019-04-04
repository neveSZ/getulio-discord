// cmd = 0 ainda estao sem funcao
const cmdAjuda = 0;
const cmdContinuar = require('../commands/continuar.js');
const cmdConvite = require('../commands/convite.js');
const cmdEntrar = require('../commands/entrar.js');
const cmdInformacoes = require('../commands/informacoes.js');
const cmdLista = 0;
const cmdMisturar = 0;
const cmdParar = require('../commands/parar.js');
const cmdPausar = require('../commands/pausar.js');
const cmdPing = require('../commands/ping.js');
const cmdPular = 0;
const cmdRepetir = 0;
const cmdSair = require('../commands/sair.js');
const cmdTocar = require('../commands/tocar.js');
const cmdVolume = 0;
global.queue = new Map();

async function onMessage(client, message) {
  // Verificar se eh bot
  if (message.author.bot) return;

  // Verificar se foi mensagem privada
  if (!message.guild)
    return message.channel.send('Ainda não funciono no privado');

  // Verificar se possui o prefixo
  if (message.content.indexOf(process.env.PREFIX) !== 0) return;

  // Separar argumentos e comando
  const command = message.content.toLowerCase().split(' ')[0].slice(process.env.PREFIX.length);
  const args = message.content.toLowerCase().slice(command.length + process.env.PREFIX.length + 1);
  
  // Verificar se o comando esta disponivel
  switch (command) {
    case 'convite':
      cmdConvite(message);
      break;
    case 'continuar':
      cmdContinuar(message);
      break;
    case 'entrar':
      cmdEntrar(message);
      break;
    case 'informacoes':
      cmdInformacoes(message);
      break;
    case 'parar':
      cmdParar(message);
      break;
    case 'pausar':
      cmdPausar(message);
      break;
    case 'ping':
      cmdPing(message);
      break;
    case 'sair':
      cmdSair(message);
      break;
    case 'tocar':
      cmdTocar(message, args);
      break;
    default:
      return message.channel.send(`${message.author}\nComando não disponível. Digite ${process.env.PREFIX}ajuda para ver a lista de comandos.`);
      break;
  }
  console.log(`O usuario ${message.author.username}(${message.author.id}) executou o comando ${command}`);
}


module.exports = onMessage;
