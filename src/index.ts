import { Elysia } from 'elysia';
import { RoomManager } from './room-manager/room-manger';

const roomManager = new RoomManager();

const app = new Elysia()
  .ws('/chat', {
    open(ws) {
      // Можно ничего не делать, либо отправить приветствие
      ws.send(JSON.stringify({ type: 'system', text: 'Добро пожаловать!' }));
    },
    message(ws, message:any) {
      // Предполагаем, что message — строка JSON
      let data;
      try {
        data = JSON.parse(message.toString());
      } catch {
        return; // игнорируем невалидный JSON
      }

      switch (data.type) {
        case 'join':
          roomManager.join(ws, data.room);
          // Оповещаем всех в комнате (включая нового участника)
          roomManager.broadcast(data.room, {
            type: 'system',
            text: 'Новый участник вошёл'
          });
          break;

        case 'message':
          const currentRoom = roomManager.getRoomOf(ws);
          if (currentRoom) {
            roomManager.broadcast(currentRoom, {
              type: 'chat',
              user: data.user,
              text: data.text
            }, ws); // исключаем отправителя, если хотим
          }
          break;
      }
    },
    close(ws) {
      roomManager.leave(ws); // автоматически удаляем из комнаты
    }
  })
  .listen(3000);

console.log('Сервер запущен на http://localhost:3000');