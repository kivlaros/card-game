import { Card, CardEffect, Player } from '../types/types';

export class EffectResolver {
  constructor(private engine: any) {} // ссылка на Engine

  // Основной метод для разрешения эффектов карты
  async resolve(sourcePlayer: Player, card: Card, chosenTargetId?: string): Promise<void> {
    // проходит по всем эффектам карты и обрабатывает их
    // может вызывать handleDefense, applyEffect, а также рекурсивно для then
    // вход: игрок-источник, карта, опционально выбранный ID цели
    // выход: Promise, который завершится после всех эффектов и ожиданий
  }

  // Определение целей для эффекта
  private getTargets(sourcePlayer: Player, effect: CardEffect, chosenTargetId?: string): Player[]|void {
    // на основе effect.target и текущего состояния игры возвращает массив игроков-целей
    // вход: источник, эффект, выбранный ID цели (если есть)
    // выход: массив Player
  }

  // Обработка защиты для атакующих эффектов
  private async handleDefense(attacker: Player, effect: CardEffect, targets: Player[]): Promise<void> {
    // создаёт запрос защиты, переключает фазу, ждёт ответы, сохраняет результаты
    // вход: атакующий, эффект, цели
    // выход: Promise, который разрешится после сбора ответов
  }

  // Применение одного эффекта к цели (без учёта защиты, только изменение состояния)
  private applyEffect(sourcePlayer: Player, target: Player, effect: CardEffect): void {
    // в зависимости от keyword модифицирует состояние target или sourcePlayer
    // например, damage: target.takeDamage(effect.value!)
    // power: sourcePlayer.powerThisTurn += effect.value!
    // и т.д.
  }

  // Метод, вызываемый из CommandHandler при получении ответа защиты
  public receiveDefenseResponse(requestId: string, playerId: string, cardInstanceId?: string): void {
    // сохраняет ответ в pendingDefense (возможно, через колбэк или Promise)
    // если все ответы получены или истёк таймер, разрешает ожидание в handleDefense
  }
}