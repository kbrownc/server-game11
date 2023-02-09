const io = require('socket.io')(5000,{
	cors: {
		origin: '*',
	}
})

io.on('connection', socket => {
	const id = socket.handshake.query.id
	console.log('id=',id)
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
			console.log('player1 player2 workMsgOn game',player1,player2,workMsgOn, game)
			socket.broadcast.to(player2).emit('receive-game', {
				sender: id, player2, workMsgOn, game
			})
		}
	})
})
