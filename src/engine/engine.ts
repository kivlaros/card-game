import { Room } from "../types/types";
import { GameState } from "../types/types";
import { RoomManager } from "../room-manager/room-manger";

export class Engine{
  room:Room;
  roomManager: RoomManager;
  constructor(room:Room, roomManager:RoomManager){
    this.room = room;
    this.roomManager = roomManager
  }
}
