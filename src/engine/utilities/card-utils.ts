// utils/card-utils.ts
import { Card } from '../../types/types';
import { cardTemplates } from '../../card-templates/card-templates';

/**
 * Создаёт экземпляр карты на основе шаблона.
 * @param templateId - идентификатор шаблона
 * @param ownerId - ID игрока-владельца (опционально)
 * @returns экземпляр карты с уникальным instanceId
 */
export function createCardInstance(templateId: string, ownerId?: string): Card {
  const template = cardTemplates[templateId];
  if (!template) {
    throw new Error(`Card template with id "${templateId}" not found`);
  }
  return {
    ...template,
    instanceId: generateId(),
    ownerId,
  };
}

/**
 * Создаёт несколько экземпляров карты по шаблону.
 */
export function createMultipleInstances(templateId: string, count: number, ownerId?: string): Card[] {
  return Array.from({ length: count }, () => createCardInstance(templateId, ownerId));
}

/**
 * Перемешивает массив случайным образом (алгоритм Фишера-Йетса).
 */
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function generateId(): string {
    return crypto.randomUUID();
  }

export function generateMainDeckCardList(): string[] {
  const allowedTypes = ["Spell", "Creature", "Treasure", "Wizard", "Location"];
  
  return Object.values(cardTemplates)
    .filter(card => allowedTypes.includes(card.type))
    .map(card => card.id);
}