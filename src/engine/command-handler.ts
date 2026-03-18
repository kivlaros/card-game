import { ClientAction } from '../types/types';
import { Player } from './player';

export class CommandHandler {
  constructor(private engine: any) {} // ссылка на Engine

  handle(playerId: string, action: ClientAction): void {
    // главный метод, диспатчит по типу действия
    // проверяет фазу через engine.phaseMachine.canAct
    // вызывает соответствующий private метод
  }

  private playCard(playerId: string, payload: { cardInstanceId: string; targetPlayerId?: string }): void {
    // проверяет, что карта есть в руке игрока
    // удаляет карту из руки (player.discardFromHand)
    // вызывает engine.effectResolver.resolve(player, card, payload.targetPlayerId)
    // после разрешения (асинхронно) обновляет состояние и отправляет broadcast
  }

  private buyCard(playerId: string, payload: { zone: 'market' | 'legend' | 'wildMagic'; cardIndex?: number }): void {
    // проверяет мощь, покупает карту, пополняет рынок и т.д.
  }

  private defend(playerId: string, payload: { defenseRequestId: string; cardInstanceId: string }): void {
    // проверяет фазу awaitingDefense и что requestId совпадает
    // вызывает engine.effectResolver.receiveDefenseResponse с картой
  }

  private declineDefend(playerId: string, payload: { defenseRequestId: string }): void {
    // аналогично, но без карты
  }

  private endTurn(playerId: string): void {
    // завершение хода: сброс руки, добор, смена игрока, открытие легенды и т.д.
  }

  // другие методы...
}