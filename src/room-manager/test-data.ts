import { Room } from "../types/types";

export const testDataRoom:Room = {
      roomId: "550e8400-e29b-41d4-a716-446655440000",
      name: "Battle Arena",
      hostId: "f47ac10b-58cc-4372-a567-0e02b2c3d479",  // хост всё ещё Alice
      players: [
        {
          playerId: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
          name: "Alice",
          ready: true
        },
        {
          playerId: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",  // новый ID для Bob
          name: "Bob",
          ready: true
        }
      ],
      maxPlayers: 4,
      status: "waiting"
    }

export const stateArray = ['PLAY_CARD','BUY_CARD','DEFEND','DECLINE_DEFEND','END_TURN','USE_PROPERTY']    