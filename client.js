const { Client, Collection } = require("discord.js");
const fs = require("fs");
require("dotenv").config();
const mongoose = require("mongoose");
const getprefix = require("./util/getprefix");

class client extends Client {
  constructor() {
    super({ disableMentions: "everyone" });
    this.commands = new Collection();

    this.on("ready", () => {
      console.log("Ready");
    });

    this.on("message", async (message) => {
      const prefix = await getprefix(message.guild.id);
      if (!message.content.startsWith(prefix) || message.author.bot) return;
      const args = message.content.slice(prefix.length).split(/ +/);
      const command = args.shift().toLowerCase();

      if (!this.commands.has(command)) return;

      try {
        this.commands.get(command).execute(this, message, args);
      } catch (error) {
        message.channel.send(
          `An error occured while executing that command Error: ${error}`
        );
      }
    });
  }

  loadCommands() {
    const commandFiles = fs
      .readdirSync("./commands")
      .filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
      const command = require(`./commands/${file}`);
      this.commands.set(command.name, command);
    }
  }

  run() {
    super.login(process.env.TOKEN);
    this.loadCommands();
    mongoose
      .connect("mongodb://10.0.0.146:27017/prefixbot", {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      })
      .then(() => console.log("connected to mongodb"));
  }
}

module.exports = client;
