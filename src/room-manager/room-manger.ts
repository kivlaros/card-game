import { Room } from "../types/types";
import { createNewPlayer } from "../engine/utilities/player-creator";
import { Engine } from "../engine/engine";
import { EventEmitter } from 'events';
import { eventBus } from "../engine/utilities/event-bus";


export interface GameState {
  // поля игры (зависят от конкретной игры)
}

// ======================================================
// 2. Интерфейс WebSocket-соединения (минимальный, нужный нам)
// ======================================================

/**
 * Описывает объект WebSocket-соединения, с которым работает менеджер.
 * Мы ожидаем, что у соединения есть метод send (для отправки сообщений)
 * и поле data для хранения временных данных (playerId, roomId).
 */
interface WSConnection {
  send(message: string): void;
  data: {
    playerId?: string;  // ID игрока, связанного с этим соединением
    roomId?: string;    // ID комнаты, в которой находится игрок
  };
}

// ======================================================
// 3. Класс RoomManager — основная логика
// ======================================================

export class RoomManager {
  // Все созданные комнаты: roomId -> Room
  private rooms = new Map<string, Room>();

  // Связь между playerId и активным WebSocket-соединением
  // Нужна для быстрой отправки сообщений конкретному игроку
  private playerToConnection = new Map<string, WSConnection>();

  private observer:WSConnection|null = null;

  // Генератор уникальных идентификаторов (можно использовать crypto.randomUUID)
  private generateId(): string {
    return crypto.randomUUID();
  }

  // ======================================================
  // Публичные методы для работы с комнатами
  // ======================================================

  /**
   * Создаёт новую комнату.
   * @param ws - WebSocket-соединение создателя
   * @param roomName - название комнаты (если не указано, генерируется)
   * @param playerName - имя игрока-создателя
   * @param maxPlayers - максимальное количество игроков
   * @returns созданная комната
   * @throws Error, если соединение уже связано с игроком
   */
  createRoom(ws: WSConnection, roomName: string, playerName: string, maxPlayers: number): Room {
    // Проверяем, не привязано ли уже соединение к другому игроку
    if (ws.data.playerId) {
      throw new Error('Connection already has a player');
    }

    const roomId = this.generateId();
    const playerId = this.generateId();

    // Создаём объект комнаты
    const room: Room = {
      roomId,
      name: roomName || `Room ${roomId.slice(0, 4)}`, // если имя не передано, генерируем
      hostId: playerId,
      players: [
        {
          playerId,
          name: playerName,
          ready: true,
        },
      ],
      maxPlayers,
      status: 'waiting',
    };

    // Сохраняем
    this.rooms.set(roomId, room);
    this.playerToConnection.set(playerId, ws);

    // Привязываем данные к соединению
    ws.data.playerId = playerId;
    ws.data.roomId = roomId;

    return room;
  }

  /**
   * Присоединяет игрока к существующей комнате.
   * @param ws - WebSocket-соединение игрока
   * @param roomId - ID комнаты
   * @param playerName - имя игрока
   * @returns обновлённая комната или null, если присоединение невозможно
   */
  joinRoom(ws: WSConnection, roomId: string, playerName: string): Room | null {
    if (ws.data.playerId) {
      console.log('Connection already has a player');
      throw new Error('Connection already has a player');
    }

    const room = this.rooms.get(roomId);
    if (!room) return null;

    // Проверяем, можно ли присоединиться
    if (room.status !== 'waiting') return null;
    if (room.players.length >= room.maxPlayers) return null;

    // Создаём нового игрока
    const playerId = this.generateId();
    const newPlayer = {
      playerId,
      name: playerName,
      ready: true,
    };

    room.players.push(newPlayer);
    this.playerToConnection.set(playerId, ws);

    ws.data.playerId = playerId;
    ws.data.roomId = roomId;

    return room;
  }
  becomeObserver(ws: WSConnection){
    this.observer = ws;
    console.log("ОБОЗРЕВАТЕЛЬ ПОДКЛЮЧЕН")
  }

  /**
   * Игрок покидает комнату (по собственному желанию или из-за разрыва соединения).
   * Если после ухода комната пуста — удаляем её.
   * Если уходит хост — назначаем нового хоста (первого в списке).
   * @param ws - соединение игрока
   */
  leaveRoom(ws: WSConnection): void {
    const playerId = ws.data.playerId;
    const roomId = ws.data.roomId;

    if (!playerId || !roomId) return; // игрок не в комнате

    const room = this.rooms.get(roomId);
    if (!room) {
      // Комнаты уже нет — просто чистим данные
      this.cleanupConnection(ws);
      return;
    }

    // Удаляем игрока из списка
    const playerIndex = room.players.findIndex(p => p.playerId === playerId);
    if (playerIndex !== -1) {
      room.players.splice(playerIndex, 1);

      // Если игрок был хостом, назначаем нового (первого оставшегося)
      if (room.hostId === playerId && room.players.length > 0) {
        room.hostId = room.players[0].playerId;
      }

      // Если комната опустела — удаляем её
      if (room.players.length === 0) {
        this.rooms.delete(roomId);
      }
    }

    // Удаляем связь player -> connection
    this.playerToConnection.delete(playerId);

    // Очищаем данные соединения
    this.cleanupConnection(ws);
  }

  /**
   * Устанавливает флаг готовности игрока.
   * @param ws - соединение игрока
   * @param ready - true/false
   * @returns обновлённая комната или null, если игрок не в комнате
   */
  setReady(ws: WSConnection, ready: boolean): Room | null {
    const playerId = ws.data.playerId;
    const roomId = ws.data.roomId;

    if (!playerId || !roomId) return null;

    const room = this.rooms.get(roomId);
    if (!room) return null;

    const player = room.players.find(p => p.playerId === playerId);
    if (player) {
      player.ready = ready;
    }

    return room;
  }

  /**
   * Запускает игру в комнате, если все игроки готовы.
   * @param roomId - ID комнаты
   * @param initialGameState - начальное состояние игры (опционально)
   * @returns обновлённая комната или null, если запуск невозможен
   */
  startGame(roomId: string, initialGameState?: GameState): Room | null {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    // Проверяем условия старта
    if (room.status !== 'waiting') return null;
    if (room.players.length < 2) return null; // минимум 2 игрока
    if (!room.players.every(p => p.ready)) return null; // не все готовы

    // Меняем статус
    room.status = 'playing';
    //room.gameState = initialGameState || {};
    console.log('Игра Началась')
    if (room && room.status == 'playing'){
      console.log('Движок Игры Создан')
      new Engine(room,this)
    }
    return room;
  }

  /**
   * Завершает игру в комнате (переводит в статус finished).
   * @param roomId - ID комнаты
   */
  finishGame(roomId: string): void {
    const room = this.rooms.get(roomId);
    if (room) {
      room.status = 'finished';
    }
  }

  /**
   * Возвращает комнату по ID.
   */
  getRoom(roomId: string): Room | undefined {
    return this.rooms.get(roomId);
  }

  /**
   * Возвращает комнату, в которой находится игрок (по его соединению).
   */
  getRoomByConnection(ws: WSConnection): Room | undefined {
    const roomId = ws.data.roomId;
    if (!roomId) return undefined;
    return this.rooms.get(roomId);
  }

  /**
   * Отправляет сообщение всем игрокам в комнате, кроме указанного.
   * @param roomId - ID комнаты
   * @param message - объект, который будет сериализован в JSON
   * @param excludePlayerId - игрок, которому не отправлять (опционально)
   */
  broadcastToRoom(roomId: string, message: object, excludePlayerId?: string): void {

    const room = this.rooms.get(roomId);
    if (!room) return;

    const messageStr = JSON.stringify(message);
    //тестовое условиие
    if(this.observer){
      // @ts-ignore
      if(message.type == 'gamestate'){
        this.observer.send(messageStr)
      }
    }
     // @ts-ignore
    if(message.type == 'message'){
      eventBus.emit('comand', message);
    }
    //конец тестового условия

    for (const player of room.players) {
      if (player.playerId === excludePlayerId) continue;
      const conn = this.playerToConnection.get(player.playerId);
      if (conn) {
        try {
          conn.send(messageStr);
        } catch (err) {
          console.error(`Failed to send message to player ${player.playerId}:`, err);
        }
      }
    }
  }

  // ======================================================
  // Вспомогательные методы (для внутреннего использования)
  // ======================================================

  /**
   * Очищает данные соединения: удаляет playerId и roomId.
   * @param ws - соединение
   */
  private cleanupConnection(ws: WSConnection): void {
    delete ws.data.playerId;
    delete ws.data.roomId;
  }

  /**
   * Возвращает playerId по соединению (из ws.data).
   */
  getPlayerId(ws: WSConnection): string | undefined {
    return ws.data.playerId;
  }

  /**
   * Проверяет, находится ли соединение в какой-либо комнате.
   */
  isInRoom(ws: WSConnection): boolean {
    return !!ws.data.roomId && !!ws.data.playerId;
  }
}