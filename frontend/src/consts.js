import { Empty, BeltDown, Mine, Exporter, Diamond, Coal, Factory, DiamondImporter, BeltRight, BeltLeft, BeltUp, DiamondChipper, Burner } from "./components/Element";

const consts = {
    INFURE_API_KEY: 'c59cfc2bb2114215a9168fc9ec994dca',
    // Buildings
    EMPTY: 0,
    MINE: 1,
    DIAMOND_IMPORTER: 2,
    EXPORTER: 3,
    FACTORY: 4,
    BELT_RIGHT: 5,
    BELT_DOWN: 6,
    BELT_LEFT: 6,
    BELT_UP: 7,
    DIAMOND_CHIPPER: 9,
    BURNER: 10,
    // Resources
    CARBON: 1,
    DIAMOND: 2,
    BUILDINGS: {
      0: Empty,
      1: Mine,
      2: DiamondImporter,
      3: Exporter,
      4: Factory,
      5: BeltRight,
      6: BeltDown,
      7: BeltLeft,
      8: BeltUp,
      9: DiamondChipper,
      10: Burner,
    },
    RESOURCES: {
      0: Coal,
      1: Diamond,
    }
};

export default consts;
