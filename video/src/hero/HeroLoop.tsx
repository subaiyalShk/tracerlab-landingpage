import { Stage } from "./Stage";
import { World } from "./World";
import { People } from "./People";
import { Phone } from "./Phone";
import { Reveal } from "./Reveal";

export const HeroLoop: React.FC = () => (
  <Stage>
    <World />
    <People />
    <Phone />
    <Reveal />
  </Stage>
);
