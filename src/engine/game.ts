import { GameState } from "../types/types";
import { newGameState } from "./utilities/game-state-init";


export class GameManager{
  gameState:GameState
  constructor(){
    this.gameState = newGameState(this.generateId())
  }
  private generateId(): string {
    return crypto.randomUUID();
  }
  
}