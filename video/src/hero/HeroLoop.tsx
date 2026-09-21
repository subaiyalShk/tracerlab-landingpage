import { Stage } from "./Stage";
import { World } from "./World";
import { People } from "./People";
import { Phone } from "./Phone";
import { Reveal } from "./Reveal";
import { Machine } from "./Machine";
import { Output } from "./Output";
import { Flywheel } from "./Flywheel";

// One unbroken camera move over a world of vector scenes (spec §1). Order =
// paint order; every scene positions itself in world coordinates.
export const HeroLoop: React.FC = () => (
  <Stage>
    <World />
    <People />
    <Phone />
    <Reveal />
    <Machine />
    <Output />
    <Flywheel />
  </Stage>
);
