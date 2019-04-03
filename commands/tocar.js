const Discord = require("discord.js");
const YouTube = require('simple-youtube-api');
const ytdl = require("ytdl-core-discord");
const cmdEntrar = require('./entrar.js');
const queue = new Map();
const youtube = new YouTube(process.env.YTB_API_KEY);

// Procura a musica no youtube e devolve uma lista de musicas para selecionar
async function cmdTocar(message, args, queue) {
    // Verificar se o usuario esta em um canal de voz
    if (!message.member.voiceChannel)
        return message.channel.send(`${message.author}\nVocê precisa estar em um canal de voz para usar este comando`);

    // Verificar se foi passado argumento(s)
    if (!args)
        return message.channel.send(`${message.author}\nVocê precisa passar o nome ou url da musica`);

    // Verificar se o bot ja esta em um canal de voz
    if (!message.guild.voiceConnection)
        // Caso nao esteja, entrar no canal de voz
        await cmdEntrar(message);

    // Verificar se eh link do youtube
    const ytbReg = /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    var ytbMatch = args.match(ytbReg);
    if (!ytbMatch) {
        // Pesquisar no youtube
        var videos = await youtube.searchVideos(args, 10, {
            regionCode: 'BR'
        });

        // Verificar se teve resultado
        if (!videos[0])
            return message.channel.send(`${message.author}\nNão encontrei resultados`);

        // Listar opcoes
        const embed = new Discord.RichEmbed().setTitle("**Selecione uma opção de 1 a 10**");
        for (var i = 0; i < videos.length; i++)
            embed.addField(`**${i + 1} - ** ${videos[i].title}`, `${videos[i].url}`);
        message.channel.send({
            embed
        });

        // Aguardar a resposta do usuario
        const filter = msg => msg.author.id == message.author.id;
        var response = await message.channel.awaitMessages(filter, {
            max: 1,
            time: 10000,
            errors: ["time"]
        });

        // Verificar resposta do usuario
        const option = response.first().content - 1;
        if (option < 0 || option > videos.length)
            return message.channel.send("Opção inválida");

        // Passar musica para lista
        await addMusic(videos[option], message, message.guild.voiceConnection);
        return;
    }

    // Verificar se eh playlist
    const playlistReg = /^.*(list=)([^#\&\?]*).*/;
    var playlistMatch = args.match(playlistReg);
    if (playlistMatch) {
        // TODO: ADICIONAR A PLAYLIST NA LISTA DE REPRODUCAO
        return console.log('url playlist');

    } else {
        // TODO: ADICIONAR A LISTA DE REPRODUCAO
        return console.log('url musica unica');
    }
}

async function playMusic(guild, music) {
    const serverQueue = queue.get(guild.id);
    // Verificar se tem musica na fila
    if (!music) {
        serverQueue.connection.channel.leave();
        queue.delete(guild.id);
        return;
    }

    // Tocar musica
    const dispatcher = serverQueue.connection.playOpusStream(await ytdl(music.url))
        .on('end', reason => {
            serverQueue.musics.shift();
            playMusic(guild, serverQueue.musics[0]);
        })
        .on('error', error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`Tocando: **${music.title}**`);
};

async function addMusic(video, message, connection) {
    const music = {
        title: video.title,
        url: video.url
    };

    const serverQueue = queue.get(message.guild.id);

    // Verificar se tem fila
    if (!serverQueue) {
        const queueConstruct = {
            textChannel: message.channel,
            connection: connection,
            musics: [],
            volume: 10,
            playing: true
        };
        queue.set(message.guild.id, queueConstruct);
        queueConstruct.musics.push(music);
        // Ja que eh o primeiro da fila tocar
        playMusic(message.guild, queueConstruct.musics[0]);
    }

    // Caso contrario colocar na lista de reproducao
    else {
        serverQueue.musics.push(music);
        return message.channel.send(`A musica **${music.title}** foi adicionada a lista de reproducao.`);
    }
    return;
}

module.exports = cmdTocar;