// player/Player.ts
import { Card, Player as PlayerInterface, DeadToken, WizardProperty } from '../types/types';
import { createMultipleInstances, shuffleArray } from './utilities/card-utils';

export class Player implements PlayerInterface {
  id: string;
  name: string;
  drawDeck: Card[];
  hand: Card[];
  discardPile: Card[];
  playArea: Card[];
  health: number;
  maxHealth: number;
  powerThisTurn: number;
  familiar?: Card;
  propertyToken?: WizardProperty;
  deadTokens: DeadToken[];
  defenseUsed?: boolean;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.health = 20;
    this.maxHealth = 25;
    this.powerThisTurn = 0;
    this.deadTokens = [];
    this.playArea = [];
    this.discardPile = [];

    // Инициализация начальной колоды: 6 знаков, 3 пшика, 1 палочка
    const starterSigns = createMultipleInstances('sign', 6, this.id);
    const starterPshiks = createMultipleInstances('pshik', 3, this.id);
    const starterWand = createMultipleInstances('wand', 1, this.id);
    this.drawDeck = shuffleArray([...starterSigns, ...starterPshiks, ...starterWand]);

    // Начальная рука: 5 карт
    this.hand = this.drawDeck.splice(0, 5);
  }

  // ---------- Управление колодой и рукой ----------

  /**
   * Перемешивает колоду.
   */
  shuffleDrawDeck(): void {
    this.drawDeck = shuffleArray(this.drawDeck);
  }

  /**
   * Берёт указанное количество карт из колоды в руку.
   * Если карт не хватает, перемешивает сброс и добавляет их.
   */
  drawCards(count: number): void {
    for (let i = 0; i < count; i++) {
      if (this.drawDeck.length === 0) {
        this.shuffleDiscardIntoDrawDeck();
      }
      if (this.drawDeck.length > 0) {
        const card = this.drawDeck.shift()!;
        this.hand.push(card);
      } else {
        // Если после перемешивания всё ещё нет карт (например, сброс пуст), выходим
        break;
      }
    }
  }

  /**
   * Перемешивает сброс и делает его новой колодой.
   */
  shuffleDiscardIntoDrawDeck(): void {
    if (this.discardPile.length === 0) return;
    this.drawDeck = shuffleArray([...this.discardPile]);
    this.discardPile = [];
  }

  /**
   * Сбрасывает карту из руки по её instanceId.
   * @returns true, если карта найдена и сброшена
   */
  discardFromHand(cardInstanceId: string): boolean {
    const index = this.hand.findIndex(c => c.instanceId === cardInstanceId);
    if (index === -1) return false;
    const [card] = this.hand.splice(index, 1);
    this.discardPile.push(card);
    return true;
  }

  /**
   * Добавляет карту напрямую в сброс (например, купленную или полученную).
   */
  addToDiscard(card: Card): void {
    this.discardPile.push(card);
  }

  /**
   * Добавляет карту в руку (например, при эффектах).
   */
  addToHand(card: Card): void {
    this.hand.push(card);
  }

  /**
   * Сбрасывает всю руку в сброс.
   */
  discardHand(): void {
    this.discardPile.push(...this.hand);
    this.hand = [];
  }

  // ---------- Здоровье ----------

  /**
   * Наносит урон игроку. Здоровье не может стать меньше 0.
   * @returns фактическое количество полученного урона (для логики смерти)
   */
  takeDamage(amount: number): number {
    const actualDamage = Math.min(amount, this.health);
    this.health -= actualDamage;
    return actualDamage;
  }

  /**
   * Лечит игрока, но не выше максимума.
   */
  heal(amount: number): void {
    this.health = Math.min(this.health + amount, this.maxHealth);
  }

  // ---------- Мощь ----------

  addPower(amount: number): void {
    this.powerThisTurn += amount;
  }

  resetPower(): void {
    this.powerThisTurn = 0;
  }

  // ---------- Постоянки и фамильяр ----------

  /**
   * Добавляет карту в зону постоянок (playArea).
   */
  addToPlayArea(card: Card): void {
    this.playArea.push(card);
  }

  /**
   * Удаляет карту из зоны постоянок (например, при уничтожении).
   */
  removeFromPlayArea(cardInstanceId: string): boolean {
    const index = this.playArea.findIndex(c => c.instanceId === cardInstanceId);
    if (index === -1) return false;
    this.playArea.splice(index, 1);
    return true;
  }

  /**
   * Устанавливает фамильяра (карта под планшетом).
   */
  setFamiliar(card: Card): void {
    this.familiar = card;
  }

  /**
   * Покупает фамильяра – перемещает его из под планшета в сброс.
   * Предполагается, что фамильяр уже существует в свойстве familiar.
   */
  buyFamiliar(): boolean {
    if (!this.familiar) return false;
    this.addToDiscard(this.familiar);
    this.familiar = undefined;
    return true;
  }

  // ---------- Жетоны ----------

  addDeadToken(token: DeadToken): void {
    this.deadTokens.push(token);
  }

  // ---------- Сброс меток защиты (в конце фазы) ----------

  resetDefenseFlag(): void {
    this.defenseUsed = false;
  }

  // ---------- Вспомогательные методы для доступа к состоянию ----------

  getHand(): Card[] {
    return [...this.hand];
  }

  getDrawDeck(): Card[] {
    return [...this.drawDeck];
  }

  getDiscardPile(): Card[] {
    return [...this.discardPile];
  }

  getPlayArea(): Card[] {
    return [...this.playArea];
  }

  getDeadTokens(): DeadToken[] {
    return [...this.deadTokens];
  }
}