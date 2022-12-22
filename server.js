const io = require('socket.io')(5000,{
	cors: {
		origin: '*',
	}
})

io.on('connection', socket => {
	const id = socket.handshake.query.id
	socket.join(id)
	socket.on('send-message', ({ recipients, text }) => {
		console.log('send-message',recipients,text)
		if (recipients !== undefined) recipients.forEach(recipient => {
			const newRecipients = recipients.filter(r => r !== recipient)
			newRecipients.push(id)
			socket.broadcast.to(recipient).emit('receive-message', {
				recipients: newRecipients, sender: id, text
			})
		})
	})
	socket.on('send-game', ({ recipients, text }) => {
		console.log('send-game',recipients, id, text)
		if (recipients !== undefined) {
			socket.broadcast.to(recipients).emit('receive-game', {
				sender: id, text
			})
		}
	})
})
