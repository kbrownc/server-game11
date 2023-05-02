const port = process.env.PORT || 5000;
const io = require('socket.io')(port,{
	cors: {
		origin: '*',
	}
})

io.on('connection', socket => {
	const id = socket.handshake.query.id
	socket.join(id)
	socket.on('send-message', ({ recipients, text }) => {
		if (recipients !== undefined) recipients.forEach(recipient => {
			const newRecipients = recipients.filter(r => r !== recipient)
			newRecipients.push(id)
			socket.broadcast.to(recipient).emit('receive-message', {
				recipients: newRecipients, sender: id, text
			})
		})
	})
	socket.on('send-game', ({ player1, player2, workMsgOn, game }) => {
		if (player2 !== undefined) {
			Object.assign(game, { handtemp: game.hand })['hand'];
			Object.assign(game, { hand: game.hand2 })['hand2'];
			Object.assign(game, { hand2: game.handtemp })['handtemp'];
			delete game['handtemp'];
			Object.assign(game, { handtemp: game.handDiscard })['handDiscard'];
			Object.assign(game, { handDiscard: game.hand2Discard })['hand2Discard'];
			Object.assign(game, { hand2Discard: game.handtemp })['handtemp'];
			delete game['handtemp'];
			socket.broadcast.to(player2).emit('receive-game', {
				player1: id, player2, workMsgOn, game
			})
		}
	})
})
