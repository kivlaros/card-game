import { Room } from "../types/types";
import { GameState, Card, DeadToken } from "../types/types";
import { RoomManager } from "../room-manager/room-manger";
import { eventBus } from "./utilities/event-bus";
import { Player } from "./player";
import { createMultipleInstances, shuffleArray, generateMainDeckCardList } from './utilities/card-utils';


export class Engine {
  room: Room;
  roomManager: RoomManager;
  state: GameState;
  roomId: string;
  constructor(room: Room, roomManager: RoomManager) {
    this.room = room;
    this.roomManager = roomManager;
    this.roomId = room.roomId;
    const players = room.players.map(p=>new Player(p.playerId,p.name))
    this.state = this.initializeGameState(players, this.roomId);
    eventBus.on('comand', this.handleMessage);
  }
  sendGameState() {
    let message = {
      type: "gamestate",
      gamestate: this.getGameState()
    };
    this.roomManager.broadcastToRoom(this.room.roomId, message);
  }
  private handleMessage = (msg: string) => {
    console.log(`[Receiver] получил: ${msg}`);
    this.sendGameState()
  };

   /**
   * Возвращает текущее состояние игры
   */
  getGameState(): GameState {
    return this.state;
  }

  /**
   * Инициализация начального состояния игры
   */
  private initializeGameState(players: Player[], gameId: string): GameState {
    // Основная колода: по 2 экземпляра каждой не-стартовой карты
    const nonStarterIds = generateMainDeckCardList()
    let mainDeckCards: Card[] = [];
    nonStarterIds.forEach(templateId => {
      const instances = createMultipleInstances(templateId, 2);
      mainDeckCards.push(...instances);
    });
    // Добавляем дополнительные вялые палочки
    const extraLimpWands = createMultipleInstances('limp_wand', 5);
    mainDeckCards.push(...extraLimpWands);
    
    // Перемешиваем основную колоду
    const shuffledMainDeck = shuffleArray(mainDeckCards);

    // Барахолка: первые 5 карт
    const market = shuffledMainDeck.splice(0, 5);

    // Стопка легенд (пока пустая, позже добавим)
    const legendStack: Card[] = [];

    // Стопка шальной магии (отдельно)
    const wildMagicDeck = createMultipleInstances('wild_magic', 5);

    // Стопка вялых палочек (отдельно)
    const limpWandDeck = createMultipleInstances('limp_wand', 10);

    // Пул жетонов дохлых колдунов (пока пустой)
    const deadTokensPool: DeadToken[] = [];

    // Порядок ходов — по порядку игроков
    const turnOrder = players.map(p => p.id);

    return {
      gameId,
      players,
      turnOrder,
      currentTurnIndex: 0,
      phase: 'playerTurn',
      mainDeck: shuffledMainDeck,
      market,
      legendStack,
      wildMagicDeck,
      limpWandDeck,
      mayhemDiscard: [],
      deadTokensPool,
      grandPrizeHolderId: undefined,
      rlyehControllerId: undefined,
      pendingDefense: undefined,
      log: ['Игра началась']
    };
  }
}

//eventBus.on('comand', this.handleMessage);