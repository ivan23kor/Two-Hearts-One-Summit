class EventEmitter {
    constructor() {
        this.events = {};
    }

    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }

    emit(event, ...args) {
        if (this.events[event]) {
            this.events[event].forEach(callback => callback(...args));
        }
    }
}

export class ConnectionManager extends EventEmitter {
    constructor() {
        super();
        this.isConnected = false;
        this.roomCode = null;
        this.playerId = null;
        this.partnerId = null;

        // For demo purposes, we'll use a simple peer-to-peer mock
        // In production, this would use Socket.io
        this.mockConnection = new Map();
        this.setupMockConnection();
    }

    setupMockConnection() {
        // Generate a unique player ID
        this.playerId = 'player_' + Math.random().toString(36).substr(2, 9);

        // Listen for storage events to simulate real-time communication
        window.addEventListener('storage', (e) => {
            if (e.key?.startsWith('room_')) {
                this.handleRoomUpdate(e);
            }
        });
    }

    generateRoomCode() {
        return Math.random().toString(36).substr(2, 6).toUpperCase();
    }

    createRoom() {
        this.roomCode = this.generateRoomCode();

        const roomData = {
            creator: this.playerId,
            partner: null,
            createdAt: Date.now()
        };

        localStorage.setItem(`room_${this.roomCode}`, JSON.stringify(roomData));
        this.emit('roomCreated', this.roomCode);

        this.startWaitingForPartner();
    }

    joinRoom(roomCode) {
        const roomKey = `room_${roomCode}`;
        const roomDataStr = localStorage.getItem(roomKey);

        if (!roomDataStr) {
            this.emit('error', 'Room not found');
            return;
        }

        const roomData = JSON.parse(roomDataStr);

        if (roomData.partner) {
            this.emit('error', 'Room is full');
            return;
        }

        if (roomData.creator === this.playerId) {
            this.emit('error', 'Cannot join your own room');
            return;
        }

        // Join the room
        roomData.partner = this.playerId;
        localStorage.setItem(roomKey, JSON.stringify(roomData));

        this.roomCode = roomCode;
        this.partnerId = roomData.creator;
        this.isConnected = true;

        this.emit('connected', this.roomCode);
    }

    startWaitingForPartner() {
        const checkForPartner = () => {
            if (!this.roomCode) return;

            const roomData = JSON.parse(localStorage.getItem(`room_${this.roomCode}`) || '{}');

            if (roomData.partner) {
                this.partnerId = roomData.partner;
                this.isConnected = true;
                this.emit('connected', this.roomCode);
            } else {
                setTimeout(checkForPartner, 1000);
            }
        };

        setTimeout(checkForPartner, 1000);
    }

    handleRoomUpdate(storageEvent) {
        if (!this.roomCode) return;

        const expectedKey = `room_${this.roomCode}`;
        if (storageEvent.key !== expectedKey) return;

        const roomData = JSON.parse(storageEvent.newValue || '{}');

        // Check if partner joined
        if (!this.isConnected && roomData.partner && roomData.creator === this.playerId) {
            this.partnerId = roomData.partner;
            this.isConnected = true;
            this.emit('connected', this.roomCode);
        }
    }

    sendMessage(type, data) {
        if (!this.isConnected || !this.roomCode) return;

        const message = {
            type,
            data,
            from: this.playerId,
            timestamp: Date.now()
        };

        const messagesKey = `messages_${this.roomCode}`;
        const messages = JSON.parse(localStorage.getItem(messagesKey) || '[]');
        messages.push(message);

        // Keep only last 100 messages
        if (messages.length > 100) {
            messages.splice(0, messages.length - 100);
        }

        localStorage.setItem(messagesKey, JSON.stringify(messages));
    }

    onMessage(callback) {
        if (!this.isConnected || !this.roomCode) return;

        let lastMessageIndex = 0;

        const checkMessages = () => {
            const messagesKey = `messages_${this.roomCode}`;
            const messages = JSON.parse(localStorage.getItem(messagesKey) || '[]');

            // Process new messages
            for (let i = lastMessageIndex; i < messages.length; i++) {
                const message = messages[i];
                if (message.from !== this.playerId) {
                    callback(message.type, message.data);
                }
            }

            lastMessageIndex = messages.length;
            setTimeout(checkMessages, 100);
        };

        checkMessages();
    }

    disconnect() {
        if (this.roomCode) {
            // Clean up room data
            localStorage.removeItem(`room_${this.roomCode}`);
            localStorage.removeItem(`messages_${this.roomCode}`);
        }

        this.isConnected = false;
        this.roomCode = null;
        this.partnerId = null;

        this.emit('disconnected');
    }
}