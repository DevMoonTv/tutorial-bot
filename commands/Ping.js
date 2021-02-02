module.exports = {
  name: "ping",
  description: "check the latency of the bot",

  async execute(client, message, args) {
    const m = await message.channel.send("Pinging...");
    m.edit(`Pong! ${client.ws.ping}ms`);
  },
};
