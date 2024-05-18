import { Empty, Belt, Mine, Exporter, Diamond, Coal } from "./components/Element";

const consts = {
    INFURE_API_KEY: 'c59cfc2bb2114215a9168fc9ec994dca',
    EMPTY: 0,
    MINE: 1,
    BELT_DOWN: 2,
    EXPORTER: 3,
    CARBON: 1,
    DIAMOND: 2,
    BUILDINGS: {
      0: Empty,
      1: Mine,
      2: Belt,
      3: Exporter,
    },
    RESOURCES: {
      0: Coal,
      1: Diamond,
    }
};

export default consts;
