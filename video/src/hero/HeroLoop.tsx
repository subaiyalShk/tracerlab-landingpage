import { Stage } from "./Stage";
import { World } from "./World";
import { People } from "./People";

export const HeroLoop: React.FC = () => (
  <Stage>
    <World />
    <People />
  </Stage>
);
