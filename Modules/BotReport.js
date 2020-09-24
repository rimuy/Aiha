
module.exports = (Bot, Message) => {
    Bot.client.users.fetch(process.env.OWNER_ID)
        .then(async user => (await user.fetch()).send(Message))
        .catch(console.log);
};