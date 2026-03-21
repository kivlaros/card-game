import { Player } from "../../types/types";
import { cardTemplates } from "../../card-templates/card-templates";

export function createNewPlayer(playerId:string, playerName:string):Player{
  return {
  id: playerId,// уникальный ID игрока (сессия)
  name: playerName, // имя (можно задать при создании)

  // Игровые зоны
  drawDeck: [], // личная колода (перемешана)
  hand: [], // карты на руке
  discardPile: [], // личный сброс
  permanentArea: [], // карты с Постоянкой, лежащие на столе
  playArea: [], // карты сыгранные лежащие на столе

  // Состояние
  health: 20, // текущие жизни (макс 25)
  maxHealth: 25, // максимум жизней (обычно 25)
  powerThisTurn: 0, // накопленная мощь в текущем ходу

  // Специальные зоны и жетоны
  familiar: undefined, // фамильяр (ещё не куплен, лежит под планшетом)
  propertyToken: undefined, // жетон колдунского свойства (пока any)
  deadTokens: [], // полученные жетоны дохлых колдунов

  // Временные флаги для защиты
  defenseUsed: false // использовал ли защиту в текущей атаке
}
  
}

