// ==================== Базовые перечисления ====================

// Типы карт (из правил)
export type CardType =
  | "Sign" // Знак
  | "Spell" // Заклинание
  | "Creature" // Тварь
  | "Treasure" // Сокровище
  | "Mayhem" // Беспредел
  | "Legend" // Легенда
  | "Location" // Место
  | "Familiar" // Фамильяр
  | "Wand" // Палочка (стартовая)
  | "Pshik" // Пшик
  | "LimpWand" // Вялая палочка
  | "WildMagic"; // Шальная магия

// Ключевые слова эффектов (пока простые)
export type EffectKeyword =
  | "power" // добавить мощь
  | "damage" // нанести урон
  | "draw" // взять карты
  | "heal" // накрутить жизни
  | "discard" // сбросить карту
  | "destroy" // уничтожить карту
  | "look" // посмотреть верхнюю карту
  | "mayhem" // специальный эффект беспредела
  | "groupAttack"; // групповая атака (для легенд)

// Типы целей для эффектов
export type TargetType =
  | "self" // сам игрок
  | "leftEnemy" // левый враг
  | "rightEnemy" // правый враг
  | "allEnemies" // все враги
  | "chosenEnemy" // выбранный враг (требует ввода)
  | "strongestEnemy" // самый могучий враг (по жизням)
  | "weakestEnemy" // самый хилый враг
  | "allPlayers" // все игроки (включая себя)
  | "mayhemOrder"; // порядок при беспределе (по часовой)

// ==================== Эффекты карт ====================

export interface CardEffect {
  keyword: EffectKeyword;
  value?: number; // величина эффекта (урон, мощность и т.п.)
  target?: TargetType; // цель (по умолчанию 'self')
  optional?: boolean; // для карт с выбором (например, Шальная магия)
  condition?: string; // условие (упрощённо, позже расширим)
  then?: CardEffect[]; // вложенные эффекты
}

// ==================== Карты (шаблон и экземпляр) ====================

// Шаблон карты (статичные данные)
export interface CardTemplate {
  id: string; // уникальный идентификатор шаблона (например, 'acid_dragon')
  name: string;
  type: CardType;
  cost: number; // стоимость покупки
  power?: number; // мощь, которую даёт при розыгрыше
  victoryPoints?: number; // победные очки (0, если нет)
  effects: CardEffect[]; // эффекты при розыгрыше
  isPermanent: boolean; // остаётся ли на столе (Постоянка)
  // для фамильяров
  familiarOf?: string; // имя колдуна, которому принадлежит
  defenseEffect?: CardEffect[]; // эффект при использовании в защите
}

// Экземпляр карты в игре (копия шаблона с уникальным id)
export interface Card extends CardTemplate {
  instanceId: string; // уникальный ID конкретной карты (UUID)
  ownerId?: string; // ID игрока-владельца (для отслеживания)
}

// ==================== Игрок ====================

export interface Player {
  id: string; // уникальный ID игрока (сессия)
  name: string; // имя (можно задать при создании)

  // Игровые зоны
  drawDeck: Card[]; // личная колода (перемешана)
  hand: Card[]; // карты на руке
  discardPile: Card[]; // личный сброс
  playArea: Card[]; // карты с Постоянкой, лежащие на столе

  // Состояние
  health: number; // текущие жизни (макс 25)
  maxHealth: number; // максимум жизней (обычно 25)
  powerThisTurn: number; // накопленная мощь в текущем ходу

  // Специальные зоны и жетоны
  familiar?: Card; // фамильяр (ещё не куплен, лежит под планшетом)
  propertyToken?: WizardProperty; // жетон колдунского свойства (пока any)
  deadTokens: DeadToken[]; // полученные жетоны дохлых колдунов

  // Временные флаги для защиты
  defenseUsed?: boolean; // использовал ли защиту в текущей атаке
}

// Пока заглушки для жетонов
export interface WizardProperty {
  id: string;
  // будет дополнено позже
}

export interface DeadToken {
  id: string;
  name: string;
  effect?: CardEffect[]; // эффект жетона (может быть постоянным)
  isPermanent: boolean;
  victoryPointsPenalty: number; // сколько ПО отнимает в конце
}

// ==================== Состояние игры (GameState) ====================

// Фазы игры
export type GamePhase =
  | "waiting" // ожидание игроков (до старта)
  | "playerTurn" // ход игрока
  | "awaitingDefense" // ожидание защиты от атаки
  | "resolvingMayhem" // разрешение беспредела
  | "resolvingLegend" // разрешение групповой атаки легенды
  | "ended"; // игра завершена

export interface GameState {
  gameId: string; // ID игры (комнаты)
  players: Player[]; // все игроки в этой игре
  turnOrder: string[]; // порядок ходов (ID игроков)
  currentTurnIndex: number; // индекс текущего игрока в turnOrder
  phase: GamePhase; // текущая фаза

  // Общие зоны
  mainDeck: Card[]; // основная колода (перемешана)
  market: Card[]; // барахолка (всегда 5 карт)
  legendStack: Card[]; // стопка легенд (последний элемент - верхушка)
  wildMagicDeck: Card[]; // стопка шальной магии
  limpWandDeck: Card[]; // стопка вялых палочек
  mayhemDiscard: Card[]; // стопка уничтоженных беспределов
  deadTokensPool: DeadToken[]; // пул жетонов дохлых колдунов

  // Глобальные объекты
  grandPrizeHolderId?: string; // ID игрока, у которого Главный приз
  rlyehControllerId?: string; // ID игрока, контролирующего Р'льех (если есть)

  // Для обработки защиты
  pendingDefense?: {
    requestId: string; // уникальный ID запроса
    attackerId: string; // кто атакует
    effect: CardEffect; // эффект атаки
    targetIds: string[]; // ID целей, которые могут защищаться
    expiresAt: number; // таймстемп, до которого ждём ответы
  };

  // Лог событий (для отображения)
  log: string[];
}

// ==================== Комнаты (управление играми) ====================

export type RoomStatus = "waiting" | "playing" | "finished";

export interface Room {
  roomId: string; // уникальный ID комнаты
  name: string; // название комнаты (может генерироваться)
  hostId: string; // ID создателя комнаты
  players: {
    playerId: string;
    name: string;
    ready: boolean; // готов ли начать
  }[];
  maxPlayers: number; // максимум игроков (обычно 2-4)
  status: RoomStatus;
  gameState?: GameState; // если игра начата
  createdAt: number;
}

// ==================== Действия (клиент -> сервер) ====================

// Все возможные действия от клиента
export type ClientAction =
  | {
      type: "CREATE_ROOM";
      payload: { playerName: string; maxPlayers?: number };
    }
  | { type: "JOIN_ROOM"; payload: { roomId: string; playerName: string } }
  | { type: "LEAVE_ROOM" }
  | { type: "READY"; payload: { ready: boolean } } // готовность в комнате
  | { type: "START_GAME" } // хост запускает игру
  | {
      type: "PLAY_CARD";
      payload: { cardInstanceId: string; targetPlayerId?: string };
    }
  | {
      type: "BUY_CARD";
      payload: { zone: "market" | "legend" | "wildMagic"; cardIndex?: number };
    }
  | {
      type: "DEFEND";
      payload: { defenseRequestId: string; cardInstanceId: string };
    }
  | { type: "DECLINE_DEFEND"; payload: { defenseRequestId: string } }
  | { type: "END_TURN" }
  | {
      type: "USE_PROPERTY";
      payload: { propertyId: string; effectIndex?: number };
    }; // жетон свойства

// ==================== Ответы (сервер -> клиент) ====================

// Общий формат ответа от сервера
export type ServerMessage =
  | { type: "ROOM_UPDATE"; payload: Room } // обновление данных комнаты
  | { type: "GAME_STATE_UPDATE"; payload: GameState } // полное состояние игры (или diff)
  | { type: "INPUT_REQUEST"; payload: InputRequest } // запрос ввода от игрока
  | { type: "ERROR"; payload: { message: string; code?: number } };

// Запрос ввода (например, защита)
export interface InputRequest {
  requestId: string;
  requestType: "DEFENSE" | "CHOOSE_TARGET";
  context: any; // данные, специфичные для запроса
  timeoutMs: number; // сколько миллисекунд ждать ответ
}
