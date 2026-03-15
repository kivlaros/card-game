import { Card, Player } from "../types/types";
import { cardTemplates } from "../card-templates/card-templates";
import { createNewPlayer } from "./utilities/player-creator";

export class playerManager {
  player: Player;
  host: boolean;
  playerId: string;
  playerName: string;
  constructor(playerId: string, playerName: string, isHost = false) {
    this.host = isHost;
    this.playerId = playerId;
    this.playerName = playerName;
    this.player = createNewPlayer(this.playerId, this.playerName);
    this.addStartCards();
    this.player.drawDeck = this.shuffle(this.player.drawDeck as Card[])
  }
  private addStartCards() {
    for (let i = 1; i <= 6; i++) {
      let singCard: Card = {
        ...cardTemplates.sign,
        instanceId: this.generateId(),
        ownerId: this.playerId,
      };
      this.player.drawDeck?.push(singCard);
    }
    for (let i = 1; i <= 3; i++) {
      let singCard: Card = {
        ...cardTemplates.pshik,
        instanceId: this.generateId(),
        ownerId: this.playerId,
      };
      this.player.drawDeck?.push(singCard);
    }
    let wandCard: Card = {
      ...cardTemplates.wand,
      instanceId: this.generateId(),
      ownerId: this.playerId,
    };
    this.player.drawDeck?.push(wandCard);
  }
  private generateId(): string {
    return crypto.randomUUID();
  }

  private shuffle<T>(array: T[]): T[] {
        return [...array].sort(() => Math.random() - 0.5);
  }
}
