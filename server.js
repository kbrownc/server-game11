const io = require('socket.io')(5000,{
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
	socket.on('send-game', ({ player1, player2, text }) => {
		if (player2 !== undefined) {
			//console.log('server receive-game', 'id', id, 'player2',player2, 'text',text)
			socket.broadcast.to(player2).emit('receive-game', {
				sender: id, player2, text
			})
		}
	})
})
