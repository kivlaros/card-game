import { Elysia } from "elysia";
import { RoomManager } from "./room-manager/room-manger";
import { Engine } from "./engine/engine";
import { ReqTypes } from "./types/types";

const roomManager = new RoomManager();

const app = new Elysia()
  .ws("/game", {
    open(ws) {
      // Можно отправить приветствие или ничего
    },
    message(ws, message: unknown) {
      // Преобразуем сообщение в строку (защита от разных типов)
      let str: string;
      if (typeof message === "string") str = message;
      else if (message instanceof Buffer) str = message.toString("utf-8");
      else if (message instanceof ArrayBuffer)
        str = new TextDecoder().decode(message);
      else str = String(message);

      let data: any = message;
      try {
        //data = JSON.parse(str);
      } catch {
        console.log(message);
        return; // игнорируем невалидный JSON
      }

      // Обрабатываем команды
      switch (data.type) {
        case "create": {
          const { roomName, playerName, maxPlayers } = data;
          try {
            const room = roomManager.createRoom(
              // @ts-ignore
              ws,
              roomName,
              playerName,
              maxPlayers,
            );
            ws.send(JSON.stringify({ type: "roomCreated", room }));
          } catch (err) {
            // @ts-ignore
            ws.send(JSON.stringify({ type: "error", message: err.message }));
          }
          break;
        }

        case "join": {
          const { roomId, playerName } = data;
          // @ts-ignore
          const room = roomManager.joinRoom(ws, roomId, playerName);
          if (room) {
            // Уведомить всех в комнате о новом игроке
            roomManager.broadcastToRoom(roomId, {
              type: "playerJoined",
              players: room.players,
            });
            // Отправить подтверждение присоединившемуся
            ws.send(JSON.stringify({ type: "joined", room }));
          } else {
            ws.send(
              JSON.stringify({ type: "error", message: "Cannot join room" }),
            );
          }
          break;
        }

        case "obs": {
          // @ts-ignore
          roomManager.becomeObserver(ws);
          ws.send({ type: "message", st: "OK" });
          break;
        }

        case "ready": {
          const { ready } = data;
          // @ts-ignore
          const room = roomManager.setReady(ws, ready);
          if (room) {
            roomManager.broadcastToRoom(room.roomId, {
              type: "playerReady",
              players: room.players,
            });
          }
          break;
        }

        case "start": {
          // @ts-ignore
          const room = roomManager.getRoomByConnection(ws);
          // @ts-ignore
          if (room && room.hostId === roomManager.getPlayerId(ws)) {
            const started = roomManager.startGame(room.roomId);
            if (started) {
              roomManager.broadcastToRoom(room.roomId, {
                type: "gameStarted",
                gameState: started.gameState,
              });
            } else {
              ws.send(
                JSON.stringify({ type: "error", message: "Cannot start game" }),
              );
            }
          }
          break;
        }

        case "message": {
          
          break;
        }
        default:
          if (Object.values(ReqTypes).includes(data.type)) {
            // @ts-ignore
            const playerId = roomManager.getPlayerId(ws);
            // @ts-ignore
            const room = roomManager.getRoomByConnection(ws);
            if (room) {
              roomManager.broadcastToRoom(
                room.roomId,
                {
                  ...data,
                },
                playerId,
              );
            }
          }
          break;
      }
    },
    close(ws) {
      // При отключении клиента автоматически покидаем комнату
      // @ts-ignore
      roomManager.leaveRoom(ws);
      // Можно оповестить остальных в комнате, если нужно
      // Для этого нужно получить комнату до выхода, но у нас leaveRoom уже удалил данные
      // Лучше сделать так: сначала получить комнату, потом вызвать leave и отправить обновление
      // Для простоты оставим так.
    },
  })
  .listen(3000);
