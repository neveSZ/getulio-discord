// cmd = 0 ainda estao sem funcao
const cmdAjuda = 0;
const cmdContinuar = require('../commands/continuar.js');
const cmdConvite = require('../commands/convite.js');
const cmdEntrar = require('../commands/entrar.js');
const cmdInformacoes = require('../commands/informacoes.js');
const cmdLista = require('../commands/lista.js');
const cmdMisturar = require('../commands/misturar.js');
const cmdParar = require('../commands/parar.js');
const cmdPausar = require('../commands/pausar.js');
const cmdPing = require('../commands/ping.js');
const cmdPular = require('../commands/pular.js');
const cmdRepetir = require('../commands/repetir.js');
const cmdSair = require('../commands/sair.js');
const cmdTocar = require('../commands/tocar.js');
const cmdVolume = require('../commands/volume.js');

var queues = new Map();

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
  const args = message.content.slice(command.length + process.env.PREFIX.length + 1);
  var serverQueue = queues.get(message.guild.id);
  // Verificar se o comando esta disponivel
  switch (command) {
    case 'convite':
      cmdConvite(message);
      break;
    case 'continuar':
      cmdContinuar(message, serverQueue);
      break;
    case 'entrar':
      cmdEntrar(message, queues);
      break;
    case 'informacoes':
      cmdInformacoes(message);
      break;
    case 'lista':
      cmdLista(message, serverQueue);
      break;
    case 'misturar':
      cmdMisturar(message, serverQueue);
      break;
    case 'parar':
      cmdParar(message, serverQueue);
      break;
    case 'pausar':
      cmdPausar(message, serverQueue);
      break;
    case 'ping':
      cmdPing(message);
      break;
    case 'pular':
      cmdPular(message, serverQueue);
      break;
    case 'repetir':
      cmdRepetir(message, serverQueue);
      break;
    case 'sair':
      cmdSair(message, queues);
      break;
    case 'tocar':
      cmdTocar(message, args, queues);
      break;
    case 'volume':
      cmdVolume(message, args, serverQueue);
      break;
    default:
      return message.channel.send(`${message.author}\nComando não disponível. Digite ${process.env.PREFIX}ajuda para ver a lista de comandos.`);
      break;
  }
  console.log(`O usuario ${message.author.username}(${message.author.id}) executou o comando ${command}`);
}


module.exports = onMessage;