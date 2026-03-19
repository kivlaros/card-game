import { GamePhase } from '../types/types';
import { Engine } from './engine';

export class PhaseMachine {
  engine: Engine
  constructor(engine:Engine) {
    this.engine = engine
  } // ссылка на Engine

  canAct(actionType: string): boolean|void {
    let phase = this.getPhase()
     switch (actionType) {
      case 'PLAY_CARD':
      case 'BUY_CARD':
      case 'END_TURN':
        return phase === 'playerTurn';
      case 'DEFEND':
      case 'DECLINE_DEFEND':
        return phase === 'awaitingDefense';
      case 'USE_PROPERTY':
        // Свойства можно использовать в любой фазе? Пока разрешим в playerTurn
        return phase === 'playerTurn';
      default:
        return false;
    }
  }

  transition(newPhase: GamePhase, data?: any): void {
    // меняет фазу в GameState, генерирует событие 'phaseChanged'
    // вход: новая фаза, опциональные данные
    this.engine.state.phase = newPhase
    // выход: void
  }

  getPhase(): GamePhase|void {
    return this.engine.state.phase
  }
}