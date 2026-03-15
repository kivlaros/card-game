import { GameState } from "../types/types";
import { newGameState } from "./utilities/game-state-init";
import { Player } from "../types/types";
import { PlayerManager } from "./player";

export class GameManager{
  gameState:GameState
  constructor(){
    this.gameState = newGameState(this.generateId())
  }
  private generateId(): string {
    return crypto.randomUUID();
  }
  public addPlayers(players:PlayerManager[]){
    for(let player of players){
      this.gameState.players.push(player.player)
    }
  }
  getCurrentSate(){
    return this.gameState
  }
}