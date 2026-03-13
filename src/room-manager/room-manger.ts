// Используем `any` для ws, потому что нам нужны только методы send и свойство data (если используем)
// Но можно определить минимальный интерфейс:
interface WSConnection {
  send(data: string): void;
  data?: Record<string, unknown>; // если всё же хотим использовать ws.data
}

export class RoomManager {
  private rooms = new Map<string, Set<WSConnection>>();
  private userRoom = new Map<WSConnection, string>(); // обратная связь: соединение -> комната

  // Присоединить соединение к комнате
  join(ws: WSConnection, roomName: string): void {
    // Если уже в какой-то комнате, сначала покидаем её
    if (this.userRoom.has(ws)) {
      this.leave(ws);
    }

    // Получаем или создаём комнату
    let room = this.rooms.get(roomName);
    if (!room) {
      room = new Set();
      this.rooms.set(roomName, room);
    }

    room.add(ws);
    this.userRoom.set(ws, roomName);
  }

  // Удалить соединение из текущей комнаты
  leave(ws: WSConnection): void {
    const roomName = this.userRoom.get(ws);
    if (!roomName) return;

    const room = this.rooms.get(roomName);
    if (room) {
      room.delete(ws);
      if (room.size === 0) {
        this.rooms.delete(roomName); // очищаем пустую комнату
      }
    }
    this.userRoom.delete(ws);
  }

  // Отправить сообщение всем в комнате (кроме отправителя, если нужно)
  broadcast(roomName: string, message: object, excludeSender?: WSConnection): void {
    const room = this.rooms.get(roomName);
    if (!room) return;

    const messageStr = JSON.stringify(message);
    for (const client of room) {
      if (client !== excludeSender) {
        client.send(messageStr);
      }
    }
  }

  // Получить комнату соединения (если нужно)
  getRoomOf(ws: WSConnection): string | undefined {
    return this.userRoom.get(ws);
  }
}