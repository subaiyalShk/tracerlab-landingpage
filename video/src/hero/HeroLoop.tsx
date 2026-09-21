import { Stage } from "./Stage";
import { World } from "./World";
import { People } from "./People";
import { Phone } from "./Phone";
import { Reveal } from "./Reveal";
import { Machine } from "./Machine";
import { Output } from "./Output";
import { Flywheel } from "./Flywheel";
import { Stats } from "./Stats";
import { ThemeContext, type Theme } from "./config";

// One unbroken camera move over a world of vector scenes (spec §1). Order =
// paint order; every scene positions itself in world coordinates. `theme`
// comes from the composition's defaultProps (Root.tsx) and reaches the scenes
// through ThemeContext → usePalette(); the scenes themselves are theme-blind.
export const HeroLoop: React.FC<{ theme: Theme }> = ({ theme }) => (
  <ThemeContext.Provider value={theme}>
    <Stage overlay={<Stats />}>
      <World />
      <People />
      <Phone />
      <Reveal />
      <Machine />
      <Output />
      <Flywheel />
    </Stage>
  </ThemeContext.Provider>
);
