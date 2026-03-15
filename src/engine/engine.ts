import { Room } from "../types/types";
import { GameState } from "../types/types";
import { RoomManager } from "../room-manager/room-manger";
import { PlayerManager } from "./player";
import { GameManager } from "./game";

export class Engine{
  room:Room;
  roomManager: RoomManager;
  playersMangerArr: PlayerManager[] = []
  gM = new GameManager()
  constructor(room:Room, roomManager:RoomManager){
    this.room = room;
    this.roomManager = roomManager
    this.connectPlayers()
    //console.log(this.playersMangerArr)
    this.gM.addPlayers(this.playersMangerArr)
    console.log(this.gM.gameState)
    this.sendGameState()
  }
  connectPlayers(){
    for(let player of this.room.players){
      let PlM = new PlayerManager(player.playerId,player.name)
      this.playersMangerArr?.push(PlM)
    }
  }
  sendGameState(){
    let message = {
      type: 'gamestate',
      gamestate: this.gM.gameState
    }
    this.roomManager.broadcastToRoom(this.room.roomId, message)
  }
}
