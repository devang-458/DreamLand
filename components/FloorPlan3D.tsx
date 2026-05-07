import React, { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Text,
  PerspectiveCamera,
} from "@react-three/drei";
import * as THREE from "three";
import type { FloorPlanData, Room } from "../lib/floorplan.types";

interface FloorPlan3DProps {
  floorPlanData: FloorPlanData;
}

const FEET_TO_METERS = 0.3048;
const CEILING_HEIGHT = 2.8;

const ROOM_COLORS: Record<string, string> = {
  living_room: "#E8D5B7",
  bedroom: "#B7C9E8",
  kitchen: "#E8E8B7",
  bathroom: "#B7E8E8",
  hallway: "#D5D5D5",
  balcony: "#C8E8B7",
  dining: "#E8C8B7",
  office: "#C8B7E8",
  other: "#E0E0E0",
};

const RoomBox: React.FC<{
  room: Room;
}> = ({ room }) => {
  const color = ROOM_COLORS[room.type] || ROOM_COLORS.other;

  const width = room.width * FEET_TO_METERS;
  const depth = room.height * FEET_TO_METERS;
  const posX = (room.x + room.width / 2) * FEET_TO_METERS;
  const posZ = (room.y + room.height / 2) * FEET_TO_METERS;
  const posY = CEILING_HEIGHT / 2;

  return (
    <group>
      <mesh position={[posX, posY, posZ]} castShadow receiveShadow>
        <boxGeometry args={[width, CEILING_HEIGHT, depth]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <Text
        position={[posX, CEILING_HEIGHT + 0.4, posZ]}
        fontSize={0.4}
        color="#333333"
        anchorX="center"
        anchorY="bottom"
      >
        {room.name}
      </Text>
    </group>
  );
};

const Window: React.FC<{
  room: Room;
  windowIndex: number;
}> = ({ room, windowIndex }) => {
  const window = room.windows[windowIndex];
  if (!window) return null;

  const width = window.width * FEET_TO_METERS;
  const height = 1.2;
  const depth = 0.05;

  const roomCenterX = (room.x + room.width / 2) * FEET_TO_METERS;
  const roomCenterZ = (room.y + room.height / 2) * FEET_TO_METERS;
  const roomWidth = room.width * FEET_TO_METERS;
  const roomDepth = room.height * FEET_TO_METERS;

  let posX = roomCenterX;
  let posZ = roomCenterZ;
  let posY = 1.2; // Mid-height on wall

  const offset = window.position * FEET_TO_METERS;

  switch (window.wall) {
    case "north":
      posX = roomCenterX - roomWidth / 2 + offset;
      posZ = roomCenterZ - roomDepth / 2 - depth / 2;
      break;
    case "south":
      posX = roomCenterX - roomWidth / 2 + offset;
      posZ = roomCenterZ + roomDepth / 2 + depth / 2;
      break;
    case "east":
      posX = roomCenterX + roomWidth / 2 + depth / 2;
      posZ = roomCenterZ - roomDepth / 2 + offset;
      break;
    case "west":
      posX = roomCenterX - roomWidth / 2 - depth / 2;
      posZ = roomCenterZ - roomDepth / 2 + offset;
      break;
  }

  return (
    <mesh position={[posX, posY, posZ]}>
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial
        color="#ADD8E6"
        transparent
        opacity={0.6}
      />
    </mesh>
  );
};

const GroundPlane: React.FC = () => {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
      receiveShadow
    >
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial color="#CCCCCC" />
    </mesh>
  );
};

const Scene: React.FC<{ floorPlanData: FloorPlanData }> = ({
  floorPlanData,
}) => {
  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={[15, 20, 15]}
        fov={50}
        near={0.1}
        far={1000}
      />
      <OrbitControls
        enablePan
        enableZoom
        enableRotate
      />

      <ambientLight intensity={0.6} />
      <directionalLight
        position={[10, 15, 10]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      <GroundPlane />

      {floorPlanData.rooms.map((room: Room) => (
        <group key={room.id}>
          <RoomBox room={room} />
          {room.windows.map((_: any, index: number) => (
            <Window key={`window-${index}`} room={room} windowIndex={index} />
          ))}
        </group>
      ))}
    </>
  );
};

const FloorPlan3D: React.FC<FloorPlan3DProps> = ({ floorPlanData }) => {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Canvas shadows>
        <Scene floorPlanData={floorPlanData} />
      </Canvas>
    </div>
  );
};

export default FloorPlan3D;
