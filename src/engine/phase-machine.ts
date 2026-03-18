import { GamePhase } from '../types/types';

export class PhaseMachine {
  constructor(private engine: any) {} // ссылка на Engine

  canAct(actionType: string): boolean|void {
    // проверяет, допустимо ли действие в текущей фазе
    // вход: тип действия (например, 'PLAY_CARD')
    // выход: boolean
  }

  transition(newPhase: GamePhase, data?: any): void {
    // меняет фазу в GameState, генерирует событие 'phaseChanged'
    // вход: новая фаза, опциональные данные
    // выход: void
  }

  getPhase(): GamePhase|void {
    // возвращает текущую фазу из GameState
  }
}