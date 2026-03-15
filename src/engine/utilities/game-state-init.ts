import { GameState } from "../../types/types";

export function newGameState(gameId: string):GameState{
  return {
    gameId: gameId, // ID игры (комнаты)
    players: [], // все игроки в этой игре
    turnOrder: [], // порядок ходов (ID игроков)
    currentTurnIndex: 0, // индекс текущего игрока в turnOrder
    phase: 'waiting', // текущая фаза
  
    // Общие зоны
    mainDeck: [], // основная колода (перемешана)
    market: [], // барахолка (всегда 5 карт)
    legendStack: [], // стопка легенд (последний элемент - верхушка)
    wildMagicDeck: [], // стопка шальной магии
    limpWandDeck: [], // стопка вялых палочек
    mayhemDiscard: [], // стопка уничтоженных беспределов
    deadTokensPool: [], // пул жетонов дохлых колдунов
  
    // Глобальные объекты
    grandPrizeHolderId: undefined, // ID игрока, у которого Главный приз
    rlyehControllerId: undefined, // ID игрока, контролирующего Р'льех (если есть)
  
    // Для обработки защиты
    pendingDefense: undefined,
  
    // Лог событий (для отображения)
    log: []
  }
}