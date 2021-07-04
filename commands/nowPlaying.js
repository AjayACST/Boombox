"use strict";
const Discord = require("discord.js");
const { getRedis } = require("../utils/redis");

module.exports = {
  name: "nowplaying",
  description: "Shows the media that is currently playing.",
  args: false,
  guildOnly: true,
  voice: true,
  async execute(interaction) {
    const manager = interaction.client.manager;
    const player = manager.get(interaction.guildID);

    if (!player) {
      return interaction.reply("There is currently no songs playing!");
    }

    await getRedis(`guild_${interaction.guildID}`, function (err, reply) {
      if (err) {
        throw new Error("Error with redis");
      }

      const serverQueue = JSON.parse(reply);

      const npEmbed = new Discord.MessageEmbed()
        .setColor("#ed1c24")
        .setAuthor(
          interaction.client.user.username,
          interaction.client.user.avatarURL()
        )
        .setTitle(`${serverQueue.songs[0].title} Is Now Playing!`)
        .setURL(serverQueue.songs[0].url)
        .setThumbnail(serverQueue.songs[0].thumbnail);

      return interaction.reply({ embeds: [npEmbed] });
    });
  },
};
