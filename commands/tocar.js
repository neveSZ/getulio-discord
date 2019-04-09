const Discord = require("discord.js");
const YouTube = require('simple-youtube-api');
const ytdl = require("ytdl-core-discord");
const cmdEntrar = require('./entrar.js');
const youtube = new YouTube(process.env.YTB_API_KEY);
const prism = require('prism-media');

// Procura a musica no youtube e devolve uma lista de musicas para selecionar
async function cmdTocar(message, args) {
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
    const ytbMatch = args.match(ytbReg);
    if (!ytbMatch) {
        // Pesquisar no youtube
        const videos = await youtube.searchVideos(args, 10, {
            regionCode: 'BR'
        });

        // Verificar se teve resultado
        if (!videos[0])
            return message.channel.send(`${message.author}\nNão encontrei resultados`);

        // Listar opcoes
        const embed = new Discord.RichEmbed().setTitle("**Selecione uma opção de 1 a 10**");
        videos.forEach((video, i) => embed.addField(`**${i + 1} - ** ${video.title}`, `${video.url}`));
        message.channel.send({
            embed
        });

        // Aguardar a resposta do usuario
        const filter = msg => msg.author.id == message.author.id;
        const response = await message.channel.awaitMessages(filter, {
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

    // Adicionar https caso nao tenha
    if (!ytbMatch[1])
        args = 'https://' + args;

    // Verificar se eh playlist
    const playlistReg = /^.*(list=)([^#\&\?]*).*/;
    const playlistMatch = args.match(playlistReg);
    if (playlistMatch) {
        const playlist = await youtube.getPlaylist(args);
        // Verificar se teve resultados
        if (!playlist)
            return message.channel.send(`${message.author}\nNão encontrei esta playlist`);

        const videos = await playlist.getVideos();
        // Verificar se teve resultados
        if (!videos)
            return message.channel.send(`${message.author}\nPlaylist vazia`);

        await addPlaylist(videos, message, message.guild.voiceConnection);
    } else {
        // Pesquisar link no youtube para pegar informacoes
        const video = await youtube.getVideo(args);

        // Verificar se teve resultado
        if (!video)
            return message.channel.send(`${message.author}\nNão encontrei resultado`);

        await addMusic(video, message, message.guild.voiceConnection);
    }
}

async function playMusic(guild, music) {
    const serverQueue = global.queue.get(guild.id);

    // Verificar se tem musica na fila
    if (!music) {
        serverQueue.connection.channel.leave();
        global.queue.delete(guild.id);
        return;
    }

    // Tocar musica
    const input = await ytdl(music.url);
    const pcm = input.pipe(new prism.opus.Decoder({
        rate: 48000,
        channels: 2,
        frameSize: 960
    }));
    const dispatcher = serverQueue.connection.playConvertedStream(pcm)
        .on('end', pular => {
            // Verificar se eh para repetir a musica atual
            if (!serverQueue.repeat)
                serverQueue.musics.shift();
            else if (pular)
                serverQueue.musics.shift();
            playMusic(guild, serverQueue.musics[0]);
        })
        .on('error', error => console.error(error));
    dispatcher.setVolume(serverQueue.volume / 100);
    serverQueue.textChannel.send(`Tocando: **${music.title}**`);
};

async function addMusic(video, message, connection) {

    const serverQueue = global.queue.get(message.guild.id);

    // Verificar se tem fila
    if (!serverQueue) {
        const queueConstruct = {
            textChannel: message.channel,
            connection: connection,
            musics: [video],
            volume: 50,
            repeat: false,
            playing: true
        };
        global.queue.set(message.guild.id, queueConstruct);
        // Ja que eh o primeiro da fila tocar
        playMusic(message.guild, queueConstruct.musics[0]);
    }

    // Caso contrario colocar na lista de reproducao
    else {
        serverQueue.musics.push(video);
        return message.channel.send(`A musica **${video.title}** foi adicionada a lista de reproducao.`);
    }
    return;
}

async function addPlaylist(videos, message, connection) {

    const serverQueue = global.queue.get(message.guild.id);

    // Verificar se tem fila
    if (!serverQueue) {
        const queueConstruct = {
            textChannel: message.channel,
            connection: connection,
            musics: videos,
            volume: 50,
            repeat: false,
            playing: true
        };
        global.queue.set(message.guild.id, queueConstruct);
        playMusic(message.guild, queueConstruct.musics[0]);
    } else {
        videos.forEach(video => serverQueue.musics.push(video));
    }
    return message.channel.send(`Foram adicionadas **${videos.length}** musicas na fila`);
}

module.exports = cmdTocar;