import { ClientAction } from "../types/types";
import { Player } from "./player";
import { Engine } from "./engine";

export class CommandHandler {
  engine: Engine;
  constructor(engine: Engine) {
    this.engine = engine;
  } // ссылка на Engine

  handle(playerId: string, action: ClientAction): void {
    // главный метод, диспатчит по типу действия
    const player = this.engine.getPlayer(playerId);
    if (
      this.engine.phaseMachine.canAct(action.type) &&
      this.isPlayerTurn(playerId)
    ) {
      console.log(playerId);
      console.log(action);
      switch (action.type) {
        case "PLAY_CARD":
          this.playCard(playerId, action.payload);
          break;
        case "BUY_CARD":
          this.buyCard(playerId, action.payload);
          break;
        case "DEFEND":
          this.defend(playerId, action.payload);
          break;
        case "DECLINE_DEFEND":
          this.declineDefend(playerId, action.payload);
          break;
        case "END_TURN":
          this.endTurn(playerId);
          break;
        case "USE_PROPERTY":
          //this.useProperty(playerId, action.payload);
          break;
        default:
          // Действия с комнатами обрабатываются на уровне комнат, не в Engine
          this.engine.sendToPlayer(playerId, {
            type: "ERROR",
            payload: {
              message: `Unhandled action type: ${(action as any).type}`,
            },
          });
      }
    } else {
      //вернуть ошибку
    }
    // проверяет фазу через engine.phaseMachine.canAct
    // вызывает соответствующий private метод
  }

  private isPlayerTurn(playerId: string): boolean {
    return (
      playerId ==
      this.engine.state.turnOrder[this.engine.state.currentTurnIndex]
    );
  }

  private playCard(
    playerId: string,
    payload: { cardInstanceId: string; targetPlayerId?: string },
  ): void {
    // проверяет, что карта есть в руке игрока
    // удаляет карту из руки (player.discardFromHand)
    // вызывает engine.effectResolver.resolve(player, card, payload.targetPlayerId)
    // после разрешения (асинхронно) обновляет состояние и отправляет broadcast
  }

  private buyCard(
    playerId: string,
    payload: { zone: "market" | "legend" | "wildMagic"; cardIndex?: number },
  ): void {
    // проверяет мощь, покупает карту, пополняет рынок и т.д.
  }

  private defend(
    playerId: string,
    payload: { defenseRequestId: string; cardInstanceId: string },
  ): void {
    // проверяет фазу awaitingDefense и что requestId совпадает
    // вызывает engine.effectResolver.receiveDefenseResponse с картой
  }

  private declineDefend(
    playerId: string,
    payload: { defenseRequestId: string },
  ): void {
    // аналогично, но без карты
  }

  private endTurn(playerId: string): void {
    // завершение хода: сброс руки, добор, смена игрока, открытие легенды и т.д.
  }

  // другие методы...
}
