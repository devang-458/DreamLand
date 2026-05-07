export interface RoomDoor {
  wall: "north" | "south" | "east" | "west";
  position: number;
}

export interface RoomWindow {
  wall: "north" | "south" | "east" | "west";
  position: number;
  width: number;
}

export interface Room {
  id: string;
  name: string;
  type:
    | "living_room"
    | "bedroom"
    | "kitchen"
    | "bathroom"
    | "hallway"
    | "balcony"
    | "dining"
    | "office"
    | "other";
  x: number;
  y: number;
  width: number;
  height: number;
  doors: RoomDoor[];
  windows: RoomWindow[];
}

export interface FloorPlanData {
  floorPlan: {
    totalArea: number;
    width: number;
    height: number;
    unit: string;
  };
  rooms: Room[];
  walls: {
    thickness: number;
  };
  scale: string | null;
}
