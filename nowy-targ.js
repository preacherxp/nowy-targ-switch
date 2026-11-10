/* nowy-targ-switch — the Rynek of the capital of Podhale on a fair day in August: the town hall under its limes,
 * St Catherine's tower, the St Jan Kanty shrine, the café pavilion, and the Tatras behind. A collage; see RESEARCH.md. */
(() => {
  const { BAYER, clamp, mix, smooth, rng } = CitySwitch;
  const GOLD = 1, DUSK = 2, NIGHT = 3, DAWN = 4; // sky and grade keys after NOON = 0
  const FOOT = 118; // where the façades meet the square
  const KERB = 131; // pale kerb between the slabs and the cobbled street
  const ROADY = 145; // where wheels and hooves touch the street; the frame shades the rows below
  let M, N;
  const bayer = (x, y) => BAYER[((y & 3) << 2) | (x & 3)];
  const at = (x, y) => (y + 40) * 400 + x + 40;

  // Only the upper half of each ramp shows above the ridge, so the horizon glow sits in the third stop.
  const SKY = [
    ['#1a5fb4', '#2f7dd0', '#8fc0e8', '#cfe3ee', '#e6eee8'],
    ['#345f9e', '#5f8fc4', '#e9c39a', '#ffd08a', '#ffe2a8'],
    ['#141a4a', '#343a78', '#b0688c', '#ee9a78', '#f8c08a'],
    ['#040817', '#081228', '#16284a', '#22364e', '#2c4052'],
    ['#2c4884', '#5f7fb6', '#e0b4b4', '#f6cdb0', '#fbe7c8'],
  ];
  const grade = [
    ([r, g, b]) => [r, g, b],
    ([r, g, b]) => [r * 1.03 + 0.03, g * 0.86 + 0.02, b * 0.68 + 0.01],
    ([r, g, b]) => [r * 0.56 + 0.06, g * 0.44 + 0.03, b * 0.62 + 0.09],
    ([r, g, b]) => [r * 0.19 + 0.02, g * 0.23 + 0.03, b * 0.36 + 0.07],
    ([r, g, b]) => [r * 0.72 + 0.07, g * 0.68 + 0.04, b * 0.76 + 0.07],
  ];

  const palette = ({ mat, neon }) => {
    // The range, its foothills and the forest below, each with its own air at every hour
    mat('TATRA', '#7389ac', { [GOLD]: '#c99088', [DUSK]: '#6a4f86', [NIGHT]: '#22335a', [DAWN]: '#9a8fb2' });
    mat('TATRA_L', '#b4c4d6', { [GOLD]: '#f4b48c', [DUSK]: '#b06c8e', [NIGHT]: '#30456e', [DAWN]: '#e0b4b8' });
    mat('TATRA_D', '#566c94', { [GOLD]: '#98708a', [DUSK]: '#4a3a74', [NIGHT]: '#18264a', [DAWN]: '#77749c' });
    mat('SNOWP', '#e8eef3', { [GOLD]: '#ffd8b2', [DUSK]: '#d99ca8', [NIGHT]: '#4a5e86', [DAWN]: '#f6dad4' });
    mat('FOOTHILL', '#5f8474', { [GOLD]: '#8c8460', [DUSK]: '#3f3c62', [NIGHT]: '#101c32', [DAWN]: '#70808e' });
    mat('FOREST', '#3d6453', { [GOLD]: '#5e6242', [DUSK]: '#2c2d4c', [NIGHT]: '#0b1526', [DAWN]: '#4e626a' });
    mat('FOREST_D', '#2f5245', { [GOLD]: '#4a4e38', [DUSK]: '#232540', [NIGHT]: '#08101e', [DAWN]: '#3f525c' });
    mat('MEADOW', '#8aa96a', { [GOLD]: '#b3a55c', [DUSK]: '#57506a', [NIGHT]: '#16233a', [DAWN]: '#8f9c8e' });
    mat('FARWALL', '#d9d2bf', { [GOLD]: '#e3bd8f', [DUSK]: '#6f5a7a', [NIGHT]: '#1a2540', [DAWN]: '#b4a9ae' });
    mat('FARROOF', '#a8625a', { [GOLD]: '#b8674a', [DUSK]: '#553a5c', [NIGHT]: '#141c34', [DAWN]: '#8c6a74' });
    // Lens clouds over the ridge
    mat('LENT', '#f7f9fb', { [GOLD]: '#ffe2bd', [DUSK]: '#e79a9c', [NIGHT]: '#24324e', [DAWN]: '#f8d6ca' });
    mat('LENT_SH', '#cbd9e6', { [GOLD]: '#eeb08c', [DUSK]: '#8f6492', [NIGHT]: '#18243c', [DAWN]: '#c9aebe' });
    mat('LENT_HI', '#ffffff', { [GOLD]: '#fff2d4', [DUSK]: '#f8b9a2', [NIGHT]: '#31405c', [DAWN]: '#fde8da' });
    // The square: granite slabs between bands of small setts; the street: cobbles
    mat('SLABG', '#b9bab6');
    mat('SLABG_D', '#a2a4a2');
    mat('SLABG_L', '#c9cac5');
    mat('SETTB', '#85888b');
    mat('SETTB_D', '#6e7175');
    mat('KERBG', '#d2d0c8');
    mat('COBBLE', '#8e8c88');
    mat('COBBLE_D', '#74726f');
    mat('COBBLE_L', '#a3a09a');
    mat('WET', '#8d9698');
    mat('WALK_D', '#8a8c8c'); // the engine's shadow under people, darkened for granite
    // Town hall
    mat('RAT_Y', '#ecd27e');
    mat('RAT_YD', '#d3b863');
    mat('RAT_YL', '#f5e2a0');
    mat('RAT_TRIM', '#f6eed2');
    mat('ROOF_G', '#6f8179');
    mat('ROOF_GD', '#56665f');
    mat('ROOF_GL', '#8c9d94');
    mat('LANT', '#473a32');
    mat('LANT_F', '#a56a38');
    mat('HELM', '#5f6f66');
    mat('HELM_L', '#83938a');
    mat('HELM_D', '#465149');
    mat('FRAME', '#7a4a2e');
    mat('PANE', '#4b5b68', { [GOLD]: '#cf965c' });
    mat('PANE_L', '#8ea7b4', { [GOLD]: '#f2cc88' });
    mat('DOOR', '#b47430');
    mat('DOOR_D', '#8c5622');
    mat('DIAL', '#f3efe2');
    mat('IRON', '#2a2d31');
    mat('SIGNB', '#3b2f26');
    mat('PLAQUE', '#7d807f');
    // St Catherine's
    mat('CH_CREAM', '#efe2bd');
    mat('CH_CREAM_D', '#d5c69d');
    mat('CH_WHITE', '#f8f4e8');
    mat('SHINGLE', '#3e3b3e');
    mat('SHINGLE_L', '#5b585e');
    mat('SHINGLE_D', '#2b292d');
    mat('COPPERG', '#5f9c86');
    mat('GOLDB', '#dcb44a');
    // Tenements
    mat('T_OCHRE', '#e3c27a');
    mat('T_OCHRE_D', '#c7a660');
    mat('T_CREAM', '#ece1c6');
    mat('T_CREAM_D', '#cfc3a6');
    mat('T_ORANGE', '#e2884c');
    mat('T_ORANGE_D', '#c26e38');
    mat('T_YEL', '#efd98c');
    mat('T_YEL_D', '#d2bb6c');
    mat('T_GREY', '#d7d6cf');
    mat('T_GREY_D', '#b9b8b0');
    mat('TRIMW', '#f8f4ea');
    mat('BRICKS', '#a65a46');
    mat('BRICKS_D', '#884636');
    mat('ROOF_R', '#b84a3c');
    mat('ROOF_RD', '#963a30');
    mat('ROOF_RL', '#d2675a');
    mat('ROOF_S', '#93a3ae');
    mat('ROOF_SD', '#75858f');
    mat('ROOF_SL', '#b1c0c9');
    mat('SHOPF', '#33373c');
    mat('AWNING', '#f1ede0');
    // Shrine, pavilion, furniture
    mat('STONE', '#cfb894');
    mat('STONE_D', '#ad9675');
    mat('STONE_L', '#e3d0ae');
    mat('CANOPY', '#474b4f');
    mat('ROBE', '#4f5f86');
    mat('PAV_ROOF', '#4d5156');
    mat('PAV_ROOF_D', '#373a3f');
    mat('PAV_ROOF_L', '#666b71');
    mat('TIMBER', '#aa6b3c');
    mat('TIMBER_D', '#7d4b2a');
    mat('PAV_GLASS', '#3d4a52', { [GOLD]: '#b98a5c' });
    mat('PLANTER', '#cbc9bf');
    mat('PLANTER_D', '#a9a79d');
    mat('GRASSP', '#6b4160');
    mat('GRASSP_L', '#93608a');
    mat('BENCH', '#c9713c');
    mat('PET_P', '#e45fa3');
    mat('PET_L', '#f4a2ca');
    // Limes and the spruce
    mat('LIME', '#4f8040');
    mat('LIME_D', '#356034');
    mat('LIME_L', '#77a447');
    mat('LIME_LL', '#9cc057');
    mat('SPRUCE', '#2f5c46');
    mat('SPRUCE_D', '#214434');
    mat('SPRUCE_L', '#4b7c5c');
    mat('TRUNK', '#57463a');
    mat('TRUNK_L', '#74604f');
    // Stalls
    mat('TENT_W', '#f5f3ea');
    mat('TENT_WD', '#d4d1c5');
    mat('TENT_R', '#c8362f');
    mat('TENT_RD', '#a22a26');
    mat('BANNER', '#2e5a3d');
    mat('JUTE', '#c7ab7c');
    mat('JUTE_D', '#a88c60');
    mat('OSCYPEK', '#dba640');
    mat('OSCYPEK_D', '#b37b2a');
    mat('FLEECE', '#f0e7d3');
    mat('FLEECE_D', '#cbbb9c');
    mat('FLEECE_B', '#8b6543');
    // Highlanders, horses, cart
    mat('HAT', '#1c1a1b');
    mat('PORTKI', '#eae3d0');
    mat('SERDAK', '#3b2a22');
    mat('SKIRT_F', '#b93248');
    mat('KERCH', '#d8402f');
    mat('FIDDLE', '#9a5a2c');
    mat('HORSE', '#70472f');
    mat('HORSE_D', '#4d2f1f');
    mat('HORSE_W', '#f0eadd');
    mat('MANE', '#2a211e');
    mat('CART', '#a8733f');
    mat('CART_D', '#7b502b');
    mat('HARN', '#c9323b');
    // Bus, cyclists, aircraft
    mat('BUS_Y', '#f3c81c');
    mat('BUS_YD', '#cfa512');
    mat('BUS_K', '#22252a');
    mat('JERSEY_C', '#2fb0c2');
    mat('JERSEY_O', '#f07a2a');
    mat('HELMET', '#e9ecec');
    mat('DENIM', '#4c6a96');
    mat('TEE_G', '#4f9a6a');
    mat('TEE_R', '#d5523f');
    mat('PLANE_Y', '#f4c22c', { [GOLD]: '#ffc23a' });
    mat('PLANE_D', '#b98d1c');
    mat('GLIDER', '#fbfbf6', { [GOLD]: '#ffe9c8', [DUSK]: '#c9a0b0' });
    mat('TIP_R', '#d8323a');
    mat('BALLOON', '#d9402f', { [DUSK]: '#a8383c' });
    mat('BALLOON_L', '#f4f0e4', { [DUSK]: '#c9a6a8' });
    mat('BASKET', '#6f4a2c');
    mat('PIGEON', '#8d95a3');
    mat('PIGEON_D', '#5c6472');
    mat('WATER', '#c4e2ec');
    mat('WATER_L', '#f0f9fb');

    neon('LAMPW', '#ffe6b0', '#ffbc62', 0.55);
    // Lamplight on granite and floodlight on walls: three steps each, so the falloff stays soft
    ['#a39a82', '#74746e', '#4b545e'].forEach((c, i) => neon(`POOL${i}`, c, '#ecc688', 0.03));
    ['#c9a85a', '#9a8250', '#6a5e46'].forEach((c, i) => neon(`FY${i}`, c, '#ffc46c', 0.02));
    ['#a98b46', '#7f6c42', '#57503e'].forEach((c, i) => neon(`FYD${i}`, c, '#ffc46c', 0.02));
    ['#d6c9a0', '#a59c80', '#716e62'].forEach((c, i) => neon(`FT${i}`, c, '#ffdca0', 0.03));
    ['#cfc096', '#a0957a', '#6f6a5c'].forEach((c, i) => neon(`FC${i}`, c, '#ffe0a8', 0.03));
    neon('AMBER', '#ffc266', '#ff9a2e', 0.4);
    neon('DIAL_LIT', '#fff4d2', '#ffe2a4', 0.3);
    neon('BULB', '#ffe9b2', '#ffb244', 0.6);
    neon('BRASS', '#f4d68e', '#e8ba62', 0.16);
    neon('SHOPW', '#f2deb4', '#ffd08c', 0.2);
    neon('PAPER', '#f6f2e2', '#eadfbe', 0.12);
    neon('FOUNT', '#dff4ff', '#8fd0ff', 0.5);
    neon('BUSLIT', '#e8f0e2', '#cfe6c8', 0.25);
  };

  // ---- Background: the Tatra ridge, the foothills, the spruce forest of the valley floor
  const RIDGE = [[-40, 58], [-28, 50], [-20, 55], [-10, 46], [-4, 53], [6, 49], [14, 57], [24, 50], [30, 44], [36, 53], [46, 48], [54, 58], [62, 52], [70, 60], [80, 54], [88, 47], [96, 56], [104, 51], [112, 59], [122, 53], [132, 61], [140, 55], [150, 50], [158, 58], [170, 54], [180, 61], [190, 56], [200, 62], [212, 57], [224, 61], [236, 55], [250, 59], [262, 53], [276, 57], [290, 55], [304, 59], [318, 56], [332, 60], [346, 57], [360, 60]];
  const buildRange = (w) => {
    const r = rng(2499); // Rysy, in metres
    const top = [];
    for (let i = 0; i < RIDGE.length - 1; i++) {
      const [x0, y0] = RIDGE[i], [x1, y1] = RIDGE[i + 1];
      for (let x = x0; x < x1; x++) {
        const t = (x - x0) / (x1 - x0);
        // Sharp teeth on the granite at the left, smooth domes on the limestone at the right
        const jag = x < 200 ? Math.round((r() - 0.5) * 2.4) : 0;
        top[x + 40] = Math.round(mix(y0, y1, x < 200 ? t : t * t * (3 - 2 * t))) + jag - 7;
      }
    }
    w.depth = 1;
    for (let x = -40; x < 360; x++) {
      const y0 = top[x + 40], slope = (top[Math.min(399, x + 43)] ?? y0) - (top[Math.max(0, x + 37)] ?? y0);
      const lit = slope > 0; // the sun stands to the left, so faces that fall away to the right of a peak are in shade
      for (let y = y0; y < 78; y++) {
        const d = y - y0;
        const rib = (x * 3 + d * (lit ? 5 : -5) + 400) % 13 < 4;
        let m = lit ? (rib || d < 2 ? M.TATRA_D : M.TATRA) : rib || d < 1 ? M.TATRA_L : M.TATRA;
        if (!lit && d > 0 && d < 9 && y0 < 48 && r() < 0.16) m = M.SNOWP;
        if (d > 10 && bayer(x, y) < (d - 10) * 1.6) m = M.TATRA; // haze towards the foot
        w.px(x, y, m);
      }
    }
    // Foothills, then the dark spruce of the valley with its sawtooth edge
    for (let x = -40; x < 360; x++) {
      const hill = Math.round(73 + Math.sin(x * 0.045 + 1) * 2.4 + Math.sin(x * 0.11) * 1.2);
      for (let y = hill; y < 84; y++) w.px(x, y, (x + y * 2) % 9 === 0 || (y > hill + 3 && r() < 0.2) ? M.MEADOW : M.FOOTHILL);
      const wood = 81 + ((x * 7) % 3) + (r() < 0.3 ? -1 : 0);
      for (let y = wood; y < 100; y++) w.px(x, y, r() < 0.3 ? M.FOREST_D : M.FOREST);
      if (r() < 0.05) w.light(x, hill + 2 + Math.floor(r() * 5), N.WARM_DIM, w.farWin[x & 3]);
    }
    // Roofs of the town between the square and the forest
    for (let x = -40; x < 360;) {
      const wd = 6 + Math.floor(r() * 9), y = 97 + Math.floor(r() * 6);
      w.rect(x, y, wd, 24, M.FARWALL); w.rect(x, y - 2, wd, 2, M.FARROOF); w.rect(x + 1, y - 3, wd - 2, 1, M.FARROOF);
      w.light(x + 2, y + 3, N.WARM_DIM, w.farWin[(x + 40) % 5]);
      x += wd + (r() < 0.3 ? 3 : 0);
    }
    w.depth = 2;
  };

  // ---- Ground: slabs in a grid of sett bands, the kerb, the cobbled street
  const buildGround = (w) => {
    const r = rng(1346); // the year of the town's charter
    for (let y = FOOT; y < KERB; y++) for (let x = -40; x < 360; x++) {
      const row = Math.floor((y - FOOT) / 4);
      const band = (x + 418) % 46 < 3 || y === 126;
      const joint = (y - FOOT) % 4 === 3 || (x + 400 + row * 5) % 11 === 0;
      w.px(x, y, band ? ((x + y) % 2 ? M.SETTB : M.SETTB_D) : joint ? M.SLABG_D : r() < 0.14 ? M.SLABG_L : M.SLABG);
    }
    for (let x = -40; x < 360; x++) { w.px(x, KERB, (x + 400) % 12 ? M.KERBG : M.SLABG_D); w.px(x, KERB + 1, M.SETTB_D); }
    for (let y = KERB + 2; y < 150; y++) for (let x = -40; x < 360; x++) {
      const v = r();
      w.px(x, y, (x + (y % 2) * 2 + 400) % 4 === 0 || y % 3 === 0 ? (v < 0.5 ? M.COBBLE_D : M.COBBLE) : v < 0.2 ? M.COBBLE_L : M.COBBLE);
    }
    // A zebra crossing painted over the cobbles, worn at the edges, and a drain by the kerb
    for (let y = KERB + 3; y < 149; y += 3) for (let x = 96; x < 111; x++) if (r() < 0.86) { w.px(x, y, M.LINE); if (r() < 0.8) w.px(x, y + 1, M.LINE); }
    w.rect(226, KERB + 2, 5, 2, M.MANHOLE); w.rect(40, KERB + 2, 5, 2, M.MANHOLE);
  };

  // A window: surround, frame, two panes, and a light that comes on with its group.
  const pane = (w, x, y, ww, wh, g, n = N.WARM, surround = M.TRIMW, frame = M.FRAME) => {
    w.rect(x - 1, y - 1, ww + 2, wh + 2, surround);
    w.rect(x, y, ww, wh, frame);
    w.rect(x + 1, y + 1, ww - 2, wh - 2, M.PANE);
    w.px(x + 1, y + 1, M.PANE_L);
    if (ww > 4) w.rect(x + (ww >> 1), y + 1, 1, wh - 2, frame);
    if (g) w.lightRect(x + 1, y + 1, ww - 2, wh - 2, n, g);
  };
  // Floodlight thrown up a wall from its foot, in three dithered steps.
  const flood = (w, x0, y0, x1, y1, g, table, reach = 1) => {
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      const i = at(x, y), n = table.get(w.smat[i]);
      if (!n || w.sgroup[i]) continue;
      const step = Math.floor((((y1 - y) / (y1 - y0)) * 3.2) / reach + (bayer(x, y) / 16 - 0.5) * 0.8);
      if (step < 3) w.light(x, y, N[n + Math.max(0, step)], g);
    }
  };

  // ---- Kościół św. Katarzyny: the tower and the nave roof over the houses, after the 2012 and 2020 photographs
  const buildChurch = (w) => {
    const cx = 43;
    // Nave: steep dark shingles, with the small copper ridge turret
    for (let y = 72; y < 92; y++) for (let x = 50; x < 96 - Math.max(0, 76 - y); x++) w.px(x, y, y % 3 === 0 ? M.SHINGLE_D : (x * 5 + y) % 11 === 0 ? M.SHINGLE_L : M.SHINGLE);
    w.rect(70, 64, 3, 8, M.COPPERG); w.rect(69, 67, 5, 1, M.COPPERG); w.px(71, 63, M.COPPERG); w.rect(71, 59, 1, 4, M.IRON); w.px(71, 61, M.GOLDB);
    // Tower shaft with white bands, round-headed openings and the clock under a curved cornice
    for (let y = 54; y < 96; y++) for (let x = cx - 7; x < cx + 7; x++) w.px(x, y, x > cx + 4 ? M.CH_CREAM_D : M.CH_CREAM);
    w.rect(cx - 7, 54, 1, 42, M.CH_WHITE); w.rect(cx - 7, 74, 14, 1, M.CH_WHITE);
    for (const x of [cx - 4, cx + 2]) { w.rect(x, 66, 2, 6, M.CH_WHITE); w.px(x, 66, M.CH_CREAM); w.rect(x, 78, 2, 5, M.SHINGLE_D); }
    w.rect(cx - 8, 53, 16, 1, M.CH_WHITE); w.rect(cx - 9, 52, 18, 1, M.CH_WHITE);
    w.rect(cx - 9, 51, 4, 1, M.CH_WHITE); w.rect(cx + 5, 51, 4, 1, M.CH_WHITE); w.rect(cx - 5, 50, 10, 1, M.CH_WHITE); w.rect(cx - 4, 51, 8, 1, M.CH_CREAM);
    w.rect(cx - 2, 56, 5, 5, M.DIAL); w.px(cx - 2, 56, M.CH_CREAM); w.px(cx + 2, 56, M.CH_CREAM); w.px(cx - 2, 60, M.CH_CREAM); w.px(cx + 2, 60, M.CH_CREAM);
    w.lightRect(cx - 1, 56, 3, 5, N.DIAL_LIT, w.clockG); w.lightRect(cx - 2, 57, 5, 3, N.DIAL_LIT, w.clockG);
    w.clockChurch = [cx, 58, 2];
    // The black helmet: a broad onion, an open lantern, a small onion, the gold ball and the cross
    const rows = [[49, 9], [48, 8], [47, 8], [46, 8], [45, 7], [44, 7], [43, 6], [42, 5], [41, 4], [40, 3], [39, 3], [38, 5], [37, 4], [36, 4], [35, 4], [34, 4], [33, 4], [32, 5], [31, 3], [30, 3], [29, 3], [28, 2], [27, 1]];
    for (const [y, half] of rows) for (let x = cx - half; x < cx + half; x++) w.px(x, y, x < cx - half + 2 && half > 2 ? M.SHINGLE_L : x >= cx + half - 2 ? M.SHINGLE_D : M.SHINGLE);
    for (const x of [cx - 3, cx + 1]) w.rect(x, 34, 2, 3, M.SHINGLE_D);
    w.rect(cx, 21, 1, 6, M.SHINGLE); w.px(cx, 22, M.GOLDB); w.px(cx - 1, 22, M.GOLDB); w.px(cx + 1, 22, M.GOLDB);
    w.rect(cx, 16, 1, 5, M.GOLDB); w.rect(cx - 1, 18, 3, 1, M.GOLDB);
    flood(w, cx - 7, 50, cx + 6, 92, w.floodG, new Map([[M.CH_CREAM, 'FC'], [M.CH_CREAM_D, 'FC'], [M.CH_WHITE, 'FT']]), 0.8);
  };

  // A plain tenement: wall, cornice, a low roof, rows of windows. Shop floors are added by the caller.
  const house = (w, x0, x1, top, roofTop, wall, wallD, roof, roofD, seed, win) => {
    for (let y = roofTop; y < top; y++) for (let x = x0; x < x1; x++) w.px(x, y, (x + 400) % 5 === 0 || y === top - 1 ? roofD : roof);
    w.rect(x0, top, x1 - x0, FOOT - top, wall);
    w.rect(x1 - 1, top, 1, FOOT - top, wallD);
    w.rect(x0, top, x1 - x0, 1, M.TRIMW);
    for (const [y, h, step, ww] of win) for (let x = x0 + 4; x + ww < x1 - 2; x += step) pane(w, x, y, ww, h, (x * 7 + y * 3 + seed) % 5 < 3 ? w.winGroups[(x + y + seed + 400) % 28] : 0, (x + seed) % 3 ? N.WARM : N.WARM_DIM);
  };

  const buildTenements = (w) => {
    // West end: an ochre house under a red roof, mostly behind the spruce
    house(w, -40, 18, 90, 82, M.T_OCHRE, M.T_OCHRE_D, M.ROOF_R, M.ROOF_RD, 3, [[94, 7, 10, 4], [106, 8, 10, 4]]);
    // Rynek 16: cream, pilasters and pediments, a balustrade under the windows
    house(w, 18, 58, 86, 83, M.T_CREAM, M.T_CREAM_D, M.ROOF_S, M.ROOF_SD, 16, []);
    for (let x = 22; x < 54; x += 9) {
      w.rect(x, 88, 4, 2, M.PANE);
      pane(w, x, 94, 5, 9, w.winGroups[(x + 3) % 28], N.WARM);
      w.rect(x - 1, 91, 7, 1, M.TRIMW); w.rect(x + 1, 90, 3, 1, M.TRIMW);
      w.rect(x - 2, 92, 1, 12, M.TRIMW);
      w.rect(x - 1, 105, 7, 2, M.TRIMW); w.px(x, 106, M.T_CREAM_D); w.px(x + 2, 106, M.T_CREAM_D); w.px(x + 4, 106, M.T_CREAM_D);
    }
    w.rect(18, 107, 40, 1, M.T_CREAM_D);
    w.rect(21, 109, 12, 9, M.SHOPF); w.lightRect(22, 110, 10, 7, N.SHOPW, w.shopG); w.rect(37, 109, 5, 9, M.DOOR_D); w.rect(45, 109, 11, 9, M.SHOPF); w.lightRect(46, 110, 9, 7, N.SHOPW, w.shopG);
    // Rynek 17: orange with white trim, the cartouche of 1905, a brick shop floor with white awnings
    house(w, 58, 98, 84, 81, M.T_ORANGE, M.T_ORANGE_D, M.SHINGLE, M.SHINGLE_D, 17, []);
    w.rect(66, 78, 3, 3, M.BRICKS_D); w.rect(86, 77, 3, 4, M.BRICKS_D);
    for (let x = 62; x < 94; x += 9) {
      w.rect(x, 86, 5, 2, M.PANE); w.rect(x - 1, 85, 7, 1, M.TRIMW);
      pane(w, x, 92, 5, 10, w.winGroups[(x + 9) % 28], N.WARM_DIM, M.TRIMW, M.SUIT);
      w.rect(x - 1, 90, 7, 1, M.TRIMW);
    }
    w.rect(76, 88, 4, 2, M.TRIMW); w.px(77, 88, M.T_ORANGE_D);
    w.rect(58, 104, 40, 1, M.TRIMW);
    for (let y = 105; y < FOOT; y++) for (let x = 58; x < 98; x++) w.px(x, y, y % 3 === 0 || (x + (y % 2) * 3) % 6 === 0 ? M.BRICKS_D : M.BRICKS);
    for (const x of [60, 86]) { w.rect(x, 109, 10, 8, M.SHOPF); w.lightRect(x + 1, 110, 8, 6, N.SHOPW, w.shopG); w.rect(x - 1, 107, 12, 2, M.AWNING); w.rect(x - 1, 109, 12, 1, M.TENT_WD); }
    // Lower houses of the far frontage close the gaps either side of the town hall
    house(w, 98, 122, 93, 87, M.T_GREY, M.T_GREY_D, M.ROOF_R, M.ROOF_RD, 5, [[97, 7, 8, 4]]);
    house(w, 198, 226, 95, 88, M.T_OCHRE, M.T_OCHRE_D, M.ROOF_S, M.ROOF_SD, 8, [[99, 7, 8, 4]]);
    // East side: a yellow house under a red sheet roof with its dormer, then a grey one under blue-grey sheet
    house(w, 226, 300, 88, 78, M.T_YEL, M.T_YEL_D, M.ROOF_R, M.ROOF_RD, 9, [[91, 6, 11, 5]]);
    for (let y = 70; y < 78; y++) { const half = y - 69; w.rect(262 - half, y, half * 2, 1, M.ROOF_R); w.px(262 - half, y, M.ROOF_RL); }
    w.rect(259, 79, 6, 5, M.T_YEL); w.rect(260, 80, 4, 3, M.PANE); w.lightRect(260, 80, 4, 3, N.WARM_DIM, w.winGroups[5]);
    w.rect(244, 74, 3, 4, M.BRICKS_D); w.rect(284, 73, 3, 5, M.BRICKS_D);
    house(w, 300, 360, 90, 79, M.T_GREY, M.T_GREY_D, M.ROOF_S, M.ROOF_SD, 21, [[94, 7, 10, 4], [106, 8, 10, 4]]);
    for (let x = 304; x < 360; x += 7) w.px(x, 79, M.ROOF_SL);
  };

  // ---- Ratusz, Rynek 1: front elevation after the September 2015 and July 2020 photographs
  const buildRatusz = (w) => {
    const X0 = 122, X1 = 198, cx = 160;
    // Hip roof in grey-green sheet with standing seams
    for (let y = 68; y < 78; y++) {
      const inset = Math.round((77 - y) * 1.4);
      for (let x = X0 + inset; x < X1 - inset; x++) w.px(x, y, y === 68 ? M.ROOF_GL : (x + 400) % 4 === 0 ? M.ROOF_GD : M.ROOF_G);
      w.px(X0 + inset, y, M.ROOF_GL); w.px(X1 - inset - 1, y, M.ROOF_GD);
    }
    // Walls: smooth above, banded below, with corner pilasters and two cornices
    for (let y = 78; y < FOOT; y++) for (let x = X0; x < X1; x++) {
      const mid = x >= 146 && x < 174;
      const banded = (y > 98 && (y - 99) % 3 === 2) || ((x < X0 + 3 || x >= X1 - 3 || (mid && (x < 148 || x >= 172))) && y % 3 === 0);
      w.px(x, y, banded ? M.RAT_YD : mid ? M.RAT_YL : M.RAT_Y);
    }
    w.rect(X0 - 1, 77, X1 - X0 + 2, 1, M.RAT_TRIM); w.rect(X0, 78, X1 - X0, 1, M.RAT_YD);
    w.rect(X0, 97, X1 - X0, 1, M.RAT_TRIM); w.rect(X0, 98, X1 - X0, 1, M.RAT_YD);
    w.rect(X0 - 1, 115, X1 - X0 + 2, 3, M.RAT_YD); w.rect(X0 - 1, 115, X1 - X0 + 2, 1, M.RAT_TRIM);
    // Wings: pedimented windows above, plain below. The museum closes at five, so most are dark at night.
    for (const x of [127, 137, 178, 188]) {
      pane(w, x, 84, 5, 10, x === 137 ? w.museumG : 0, N.WARM, M.RAT_TRIM);
      w.rect(x - 2, 82, 9, 1, M.RAT_TRIM); w.rect(x, 81, 5, 1, M.RAT_TRIM); w.rect(x + 2, 80, 1, 1, M.RAT_TRIM);
      w.rect(x - 1, 95, 7, 1, M.RAT_TRIM);
      pane(w, x, 103, 5, 9, x === 178 || x === 127 ? w.museumG : 0, N.WARM_DIM, M.RAT_TRIM);
      w.rect(x - 1, 113, 7, 1, M.RAT_TRIM);
    }
    // Middle bay: balcony door, iron balcony, the museum sign, the door between two lanterns
    pane(w, 157, 82, 6, 9, w.museumG, N.WARM, M.RAT_TRIM);
    w.rect(155, 80, 10, 1, M.RAT_TRIM); w.rect(157, 79, 6, 1, M.RAT_TRIM);
    for (const x of [150, 167]) pane(w, x, 84, 3, 7, 0, N.WARM, M.RAT_TRIM);
    for (let x = 152; x < 168; x++) { w.px(x, 91, M.IRON); if (x % 2 === 0) { w.px(x, 92, M.IRON); w.px(x, 93, M.IRON); } }
    w.rect(151, 94, 18, 1, M.RAT_TRIM);
    w.hsign(146, 95, 29, 7, 'MUZEUM', { mode: 'lit', n: N.PAPER, g: w.signG, board: M.DIAL, ink: M.SIGNB });
    w.rect(155, 104, 10, 14, M.RAT_TRIM); w.rect(156, 105, 8, 13, M.DOOR); w.rect(156, 105, 8, 3, M.PANE); w.rect(160, 108, 1, 10, M.DOOR_D); w.rect(156, 108, 8, 1, M.DOOR_D);
    w.lightRect(156, 105, 8, 3, N.WARM_DIM, w.lampG);
    for (const x of [152, 166]) { w.rect(x, 104, 2, 1, M.IRON); w.rect(x, 105, 2, 3, M.TENT_WD); w.lightRect(x, 105, 2, 3, N.LAMPW, w.lampG); }
    w.rect(149, 109, 3, 4, M.PLAQUE); w.rect(168, 108, 3, 5, M.PLAQUE); w.px(169, 109, M.TEE_R);
    for (let i = 0; i < 2; i++) w.rect(153 - i, 116 + i, 14 + i * 2, 1, i ? M.SLABG_D : M.KERBG);
    // Attic with the clock under its pediment
    w.rect(150, 67, 20, 10, M.RAT_YL); w.rect(150, 67, 2, 10, M.RAT_YD); w.rect(168, 67, 2, 10, M.RAT_YD);
    w.rect(149, 66, 22, 1, M.RAT_TRIM);
    for (let i = 0; i < 4; i++) { w.rect(151 + i * 2, 65 - i, 18 - i * 4, 1, i === 3 ? M.RAT_TRIM : M.RAT_Y); w.px(151 + i * 2, 65 - i, M.RAT_TRIM); w.px(168 - i * 2, 65 - i, M.RAT_TRIM); }
    w.rect(157, 69, 7, 7, M.RAT_TRIM); w.rect(158, 70, 5, 5, M.DIAL);
    w.lightRect(158, 70, 5, 5, N.DIAL_LIT, w.clockG);
    w.clockHall = [cx, 72, 2];
    // Tower: bell-cast skirt, dark timber lantern with arched windows, bell helmet, spire, weathervane
    [[61, 9], [60, 9], [59, 8], [58, 8], [57, 7], [56, 7]].forEach(([y, half]) => { w.rect(cx - half, y, half * 2, 1, M.ROOF_G); w.px(cx - half, y, M.ROOF_GL); w.px(cx + half - 1, y, M.ROOF_GD); });
    w.rect(cx - 6, 45, 12, 11, M.LANT); w.rect(cx + 4, 45, 2, 11, M.IRON);
    for (const x of [cx - 5, cx - 1, cx + 2]) { w.rect(x, 47, 3, 8, M.LANT_F); w.rect(x + 1, 48, 1, 6, M.PANE_L); w.px(x, 47, M.LANT); w.px(x + 2, 47, M.LANT); w.lightRect(x + 1, 48, 1, 6, N.AMBER, w.lanternG); }
    w.rect(cx - 7, 44, 14, 1, M.HELM_L);
    [[43, 7], [42, 6], [41, 6], [40, 5], [39, 4], [38, 4], [37, 3], [36, 2], [35, 2], [34, 1], [33, 1]].forEach(([y, half]) => { w.rect(cx - half, y, half * 2, 1, M.HELM); w.px(cx - half, y, M.HELM_L); w.px(cx + half - 1, y, M.HELM_D); });
    w.rect(cx - 1, 30, 2, 3, M.HELM_D); w.rect(cx, 20, 1, 10, M.IRON); w.rect(cx - 1, 27, 3, 1, M.IRON);
    w.rect(cx - 1, 19, 4, 1, M.IRON); w.px(cx + 2, 18, M.IRON);
    flood(w, X0 - 1, 66, X1, 117, w.floodG, new Map([[M.RAT_Y, 'FY'], [M.RAT_YL, 'FY'], [M.RAT_YD, 'FYD'], [M.RAT_TRIM, 'FT']]), 0.85);
  };

  // A lime: many small tufts thrown inside an egg-shaped outline, each lit from the upper left.
  const lime = (w, cx, cy, rx, ry, seed) => {
    const r = rng(seed);
    const tufts = [];
    for (let n = 0; n < rx * ry * 0.2; n++) {
      const a = r() * 6.283, d = Math.pow(r(), 0.62);
      const ty = cy + Math.sin(a) * d * ry;
      const squeeze = ty < cy ? 0.72 + 0.28 * (1 - (cy - ty) / ry) : 1; // narrower towards the top
      tufts.push([Math.round(cx + Math.cos(a) * d * rx * squeeze), Math.round(ty), 3 + Math.floor(r() * 3)]);
    }
    tufts.sort((a, b) => a[1] - b[1] + (a[0] - b[0]) * 0.4); // lower right tufts overlap the ones behind
    for (const [tx, ty, rad] of tufts) for (let dy = -rad; dy <= rad; dy++) for (let dx = -rad; dx <= rad; dx++) {
      if (dx * dx + dy * dy > rad * rad + 1) continue;
      const side = (dx + dy) / rad, glow = (tx - cx) / rx + (ty - cy) / ry;
      w.px(tx + dx, ty + dy, side < -0.7 ? (glow < 0 ? M.LIME_LL : M.LIME_L) : side > 0.75 ? M.LIME_D : glow > 0.5 && r() < 0.5 ? M.LIME_D : M.LIME);
    }
  };
  const spruce = (w, cx, top, foot) => {
    const r = rng(cx + 77);
    for (let y = top; y < foot - 4; y++) {
      const tier = (y - top) % 7;
      const half = Math.round(1 + (y - top) * 0.2 + tier * 0.45);
      for (let x = cx - half; x <= cx + half; x++) w.px(x, y, tier === 6 ? M.SPRUCE_D : x < cx - half * 0.3 && r() < 0.6 ? M.SPRUCE_L : r() < 0.25 ? M.SPRUCE_D : M.SPRUCE);
    }
    w.rect(cx, foot - 4, 2, 4, M.TRUNK);
  };

  // ---- Kapliczka św. Jana Kantego, after the July 2020 photograph
  const buildShrine = (w) => {
    const cx = 74;
    for (let y = 96; y < FOOT; y++) for (let x = cx - 5; x <= cx + 5; x++) w.px(x, y, x > cx + 3 ? M.STONE_D : x < cx - 4 ? M.STONE_L : M.STONE);
    for (const x of [cx - 3, cx + 1]) { w.rect(x, 100, 3, 9, M.STONE_D); w.px(x, 100, M.STONE); w.px(x + 2, 100, M.STONE); w.rect(x + 1, 101, 1, 8, M.STONE); }
    w.rect(cx - 6, 113, 13, 1, M.STONE_L); w.rect(cx - 7, 95, 15, 1, M.STONE_L); w.rect(cx - 6, 94, 13, 1, M.STONE_D);
    // The saint and the girl with her jug, under the canopy on four posts
    w.rect(cx - 1, 90, 3, 4, M.ROBE); w.rect(cx - 1, 88, 3, 2, M.SKIN); w.px(cx - 1, 88, M.HAIR); w.rect(cx - 3, 92, 1, 2, M.CH_WHITE); w.px(cx - 3, 91, M.SKIN);
    for (const x of [cx - 6, cx + 6]) w.rect(x, 86, 1, 8, M.IRON);
    [[86, 7, 1], [85, 7, 0], [84, 6, 0], [83, 4, 0], [82, 2, 0], [81, 1, 0]].forEach(([y, half, open]) => { for (let x = cx - half; x <= cx + half; x++) if (!open || Math.abs(x - cx) > 5) w.px(x, y, x < cx - 1 ? M.PAV_ROOF_L : M.CANOPY); });
    w.px(cx, 80, M.GOLDB); w.rect(cx, 76, 1, 4, M.GOLDB); w.rect(cx - 1, 77, 3, 1, M.GOLDB);
    // Stone posts and the iron fence
    for (const x of [cx - 11, cx + 9]) { w.rect(x, 110, 3, 9, M.PLANTER); w.rect(x, 109, 3, 1, M.PLANTER_D); w.px(x + 1, 108, M.PLANTER); w.px(x + 2, 112, M.PLANTER_D); }
    for (let x = cx - 8; x < cx + 9; x++) { w.px(x, 112, M.IRON); w.px(x, 117, M.IRON); if ((x + 400) % 2 === 0) w.rect(x, 111, 1, 7, M.IRON); }
    w.lightRect(cx - 1, 88, 3, 6, N.PAPER, w.floodG);
  };

  // ---- The glazed timber pavilion, after the July and December 2020 photographs
  const buildPavilion = (w) => {
    const X0 = 240, X1 = 292;
    for (let i = 0; i < 6; i++) {
      const a = X0 - 4 + Math.round(i * 3.4), b = X1 + 4 - Math.round(i * 3.4);
      for (let x = a; x < b; x++) w.px(x, 102 - i, i === 0 ? M.PAV_ROOF_D : (x + 400) % 5 === 0 ? M.PAV_ROOF_L : M.PAV_ROOF);
    }
    w.rect(X0 - 1, 103, X1 - X0 + 2, 1, M.TIMBER_D);
    w.rect(X0, 104, X1 - X0, 13, M.PAV_GLASS);
    w.lightRect(X0, 104, X1 - X0, 13, N.WARM, w.cafeG);
    for (let x = X0; x <= X1; x += 13) { w.rect(Math.min(x, X1 - 2), 104, 2, 13, M.TIMBER); }
    for (let x = X0 + 6; x < X1; x += 13) w.rect(x, 104, 1, 13, M.TIMBER_D);
    w.rect(X0, 104, X1 - X0, 1, M.TIMBER_D);
    for (let x = X0 + 3; x < X1 - 2; x += 4) w.tube(x, 105 + ((x >> 2) % 2), M.TENT_WD, N.BULB, w.cafeG);
    // Dark chairs and small tables on the deck, the steps, a low sandstone bed with clipped green
    for (let x = X0 + 3; x < X1 - 4; x += 9) { w.rect(x, 112, 1, 5, M.SHOPF); w.rect(x, 114, 3, 1, M.SHOPF); w.rect(x + 4, 113, 3, 1, M.SHOPF); w.px(x + 5, 114, M.SHOPF); w.px(x + 5, 115, M.SHOPF); }
    w.rect(X0 - 3, 117, X1 - X0 + 6, 1, M.TIMBER); w.rect(X0 - 4, 118, X1 - X0 + 8, 1, M.TIMBER_D);
    for (let x = 258; x < 284; x++) { w.px(x, 120, (x + 400) % 5 ? M.STONE : M.STONE_D); w.px(x, 121, (x + 402) % 5 ? M.STONE : M.STONE_D); w.px(x, 119, x % 3 ? M.LIME : M.LIME_L); }
    w.roost = [];
    for (let i = 0; i < 12; i++) { const row = i % 3; w.roost.push([X0 + 8 + i * 3 + row, 96 + row * 2]); }
  };

  // ---- Stalls of the fair: cheese under a white tent at the left, sheepskins under a red canopy at the right
  const buildStalls = (w) => {
    // White pop-up tent
    for (let i = 0; i < 6; i++) { w.rect(18 + i * 3, 98 - i, 43 - i * 6, 1, i % 2 ? M.TENT_WD : M.TENT_W); w.px(18 + i * 3, 98 - i, M.TENT_W); }
    w.hsign(18, 99, 43, 9, 'OSCYPKI', { font: 5, n: N.PAPER, g: w.stallG, board: M.BANNER, off: M.TENT_W });
    for (const x of [18, 60]) w.rect(x, 108, 1, 14, M.STEEL_LT);
    for (let x = 22; x < 58; x += 4) w.tube(x, 109, M.TENT_WD, N.BULB, w.stallG);
    // Table: a jute cloth, golden smoked cheeses in rows, a few big ones on a stand
    w.rect(20, 113, 39, 1, M.CART_D); w.rect(20, 114, 39, 7, M.JUTE);
    for (let x = 20; x < 59; x += 3) w.rect(x, 115, 1, 6, M.JUTE_D);
    for (let x = 22; x < 57; x += 3) { w.px(x, 112, x % 2 ? M.OSCYPEK : M.OSCYPEK_D); w.px(x + 1, 112, M.OSCYPEK); if (x % 4 === 0) w.px(x, 111, M.OSCYPEK); }
    w.rect(50, 109, 6, 1, M.CART_D); for (const x of [50, 52, 54]) w.rect(x, 110, 1, 2, M.OSCYPEK_D);
    // Red canopy with sheepskins hung in a row and slippers on the table
    for (let i = 0; i < 4; i++) w.rect(302 - i, 98 + i, 26 + i * 2, 1, i % 2 ? M.TENT_RD : M.TENT_R);
    for (let x = 300; x < 330; x += 3) w.px(x, 102, M.TENT_W);
    for (const x of [300, 328]) w.rect(x, 102, 1, 20, M.STEEL_LT);
    for (let k = 0; k < 4; k++) {
      const x = 303 + k * 6, m = k % 2 ? M.FLEECE_B : M.FLEECE;
      w.rect(x, 103, 4, 8, m); w.rect(x - 1, 105, 6, 4, m); w.px(x, 111, m); w.px(x + 3, 111, m); w.rect(x + 1, 104, 2, 6, k % 2 ? M.FLEECE_D : M.TENT_W);
    }
    w.rect(301, 114, 27, 1, M.CART_D); w.rect(301, 115, 27, 6, M.TENT_RD);
    for (let x = 303; x < 326; x += 4) { w.rect(x, 113, 2, 1, M.FLEECE_D); w.px(x, 112, M.FLEECE); }
    for (let x = 304; x < 326; x += 5) w.tube(x, 103, M.TENT_WD, N.BULB, w.stallG);
  };

  // ---- Furniture: lamps with their baskets, planters, benches, flagpoles, the wet patch of the fountain
  const buildSquare = (w) => {
    for (const x of [92, 296]) {
      w.rect(x, 94, 1, 26, M.IRON); w.rect(x - 1, 118, 3, 2, M.IRON);
      w.rect(x - 4, 96, 9, 1, M.IRON);
      for (const lx of [x - 6, x + 4]) { w.rect(lx, 96, 3, 1, M.IRON); w.rect(lx, 97, 3, 4, M.TENT_WD); w.rect(lx, 101, 3, 1, M.IRON); w.lightRect(lx, 97, 3, 4, N.LAMPW, w.lampG); }
      w.rect(x - 2, 104, 5, 3, M.PET_P); w.px(x - 2, 104, M.PET_L); w.px(x + 1, 105, M.PET_L); w.px(x - 3, 105, M.PET_P); w.px(x + 3, 105, M.PET_P); w.px(x, 107, M.LIME_D);
      for (let dy = 0; dy < 9; dy++) for (let dx = -15; dx <= 15; dx++) {
        const d = (dx * dx) / 225 + ((dy - 3) * (dy - 3)) / 26;
        const step = Math.floor(d * 3 + (bayer(x + dx, 120 + dy) / 16 - 0.5) * 0.9);
        if (d < 1 && step < 3) w.light(x + dx, 120 + dy, N[`POOL${Math.max(0, step)}`], w.lampG);
      }
    }
    // Light spilling from the town hall door and the pavilion
    for (let dy = 0; dy < 5; dy++) for (let dx = -9; dx <= 9; dx++) if (Math.abs(dx) + dy * 2 < 10 + (bayer(dx + 160, dy) >> 2)) w.light(160 + dx, 119 + dy, N[`POOL${Math.min(2, dy >> 1)}`], w.lampG);
    // Square planters with dark purple grasses
    for (const x of [136, 178]) {
      w.rect(x, 116, 7, 5, M.PLANTER); w.rect(x, 116, 7, 1, M.KERBG); w.rect(x + 6, 117, 1, 4, M.PLANTER_D);
      for (let i = 0; i < 7; i++) { const h = 2 + ((i * 5 + x) % 4); w.rect(x + i, 116 - h, 1, h, i % 3 ? M.GRASSP : M.GRASSP_L); }
    }
    // Benches of orange slats against the wall
    for (const x of [185, 126]) { w.rect(x, 113, 9, 1, M.BENCH); w.rect(x, 115, 9, 1, M.BENCH); w.px(x, 116, M.STEEL); w.px(x + 8, 116, M.STEEL); w.px(x, 117, M.STEEL); w.px(x + 8, 117, M.STEEL); }
    w.benchAt = [186, 115];
    // The fountain is flush with the paving: a darker wet field with nozzles
    for (let y = 119; y < 123; y++) for (let x = 148; x < 173; x++) if (y > 119 || (x > 149 && x < 171)) w.px(x, y, (x + y) % 3 ? M.WET : M.SLABG_D);
    w.jets = [151, 154, 157, 160, 163, 166, 169];
    // Three white flagpoles
    for (const x of [229, 232, 235]) { w.rect(x, 68, 1, 51, M.SHIRT); w.px(x, 67, M.GOLDB); }
    w.flagAt = [233, 69];
  };

  // ---- Sky. The sun stands left of the spire at noon, sinks behind the rounded western end of the range and
  // comes up over the teeth at its eastern end. The moon climbs later from the left and crosses high.
  const buildClouds = (w) => {
    w.lenses = [[52, 27, 0.55, 40, 3], [70, 22, 0.55, 22, 2], [204, 14, 0.4, 56, 3], [226, 9, 0.4, 30, 2], [300, 33, 0.7, 30, 2], [-30, 12, 0.48, 34, 2]].map(([x, y, v, len, h]) => ({ x, y, v, len, h }));
  };
  const drawSky = (w, dt, hour) => {
    if (hour < 19) {
      const t = clamp((hour - 12) / 6.9);
      const low = smooth(16, 17.8, hour);
      w.sun(mix(118, 286, t * (0.45 + 0.55 * t)), mix(8, 66, t * t * t * 0.4 + t * 0.6), low > 0.3 ? 7 : 5, low);
    } else if (hour > 28.9) {
      const t = clamp((hour - 28.9) / 7.1);
      const low = 1 - smooth(30.6, 32.2, hour);
      w.sun(mix(14, 118, Math.sqrt(t)), mix(60, 8, 1 - (1 - t) * (1 - t)), low > 0.3 ? 7 : 5, low);
    }
    const m = (hour - 19.6) / 10;
    if (m > 0 && m < 1) w.moon(mix(64, 300, m), 46 - Math.sin(m * Math.PI) * 34 + m * 14);
    w.drawStars();
    // Lens clouds of the halny: smooth stacked plates that hardly move
    for (const c of w.lenses) {
      c.x += c.v * dt;
      if (c.x > 366) c.x = -c.len - 44;
      const cx = Math.round(c.x);
      for (let i = 0; i < c.len; i++) {
        const u = (i + 0.5) / c.len * 2 - 1, arc = Math.sqrt(1 - u * u);
        const up = Math.round(arc * c.h), down = Math.round(arc * c.h * 0.45);
        for (let j = -up; j <= down; j++) w.pxSky(cx + i, c.y + j, j === down && up > 0 ? M.LENT_SH : j === -up && u < 0.3 ? M.LENT_HI : j > 0 && bayer(cx + i, c.y + j) > 8 ? M.LENT_SH : M.LENT);
      }
    }
  };

  // The tow plane, the rope and the glider climb across the sky towards the range; in the evening a balloon drifts over.
  const TUG = ['..YYYYYYYY.', 'T....DD....', 'TYYYYYGGYK.', '.....D.....', '.....K.....'];
  const SAIL = ['WWW..........', '.W..RWWWWWR..', '.WWWWWWWGGW..'];
  const BALL = ['..RRRRR..', '.RRRRRRR.', 'RRRRRRRRR', 'LLLLLLLLL', 'RRRRRRRRR', '.RRRRRRR.', '..RRRRR..', '...RRR...', '...K.K...', '...BBB...', '...BBB...'];
  const drawFlight = (w, dt, hour) => {
    const day = hour < 18.4 || hour > 31.6;
    const c = (w.t + 20) % 74;
    if (c < 1 || w.towFlies === undefined) w.towFlies = day; // decided off screen, so the tow never vanishes half way
    if (w.towFlies && c < 40) {
      const x = Math.round(-70 + c * 12), y = Math.round(40 - c * 0.62 + Math.sin(c * 0.9) * 1.5);
      const paint = (rows, map, ox, oy) => { for (let j = 0; j < rows.length; j++) for (let i = 0; i < rows[j].length; i++) { const m = map[rows[j][i]]; if (m) w.pxSky(ox + i, oy + j, m); } };
      paint(TUG, { Y: M.PLANE_Y, D: M.PLANE_D, T: M.PLANE_Y, G: M.CAR_GLASS, K: M.IRON }, x + 30, y);
      const gy = y + 4 + Math.round(Math.sin(c * 0.9 - 0.8) * 1.5);
      for (let i = 0; i < 18; i++) if (i % 2) w.pxSky(x + 12 + i, Math.round(mix(gy + 2, y + 2, i / 17) + Math.sin((i / 17) * Math.PI)), M.WIRE);
      paint(SAIL, { W: M.GLIDER, R: M.TIP_R, G: M.CAR_GLASS }, x, gy);
      if (Math.sin(w.t * 30) > 0) w.pxSky(x + 40, y + 1, M.IRON); else w.pxSky(x + 40, y + 3, M.IRON);
      // Caught out after sunset, it shows a red light under the wing
      if (w.dark > 0.4 && w.t % 1.6 < 0.8 && w.smat[at(clamp(x + 35, -40, 359), y + 1)] === 0) w.pxLight(clamp(x + 35, -40, 359), y + 1, N.BEACON);
    }
    const b = hour > 16.2 && hour < 19 ? (hour - 16.2) / 2.8 : hour > 30.6 && hour < 33 ? (hour - 30.6) / 2.4 : -1;
    if (b >= 0) {
      const x = Math.round(84 + b * 60 + Math.sin(w.t * 0.11) * 5), y = Math.round(20 - Math.sin(b * Math.PI) * 9 + Math.sin(w.t * 0.23) * 1.5);
      for (let j = 0; j < BALL.length; j++) for (let i = 0; i < 9; i++) { const m = { R: M.BALLOON, L: M.BALLOON_L, K: M.IRON, B: M.BASKET }[BALL[j][i]]; if (m) w.pxSky(x + i, y + j, m); }
      if (w.dark > 0.15 && Math.sin(w.t * 1.7) > 0.3 && w.smat[at(x + 4, y + 7)] === 0) { w.pxLight(x + 4, y + 7, N.EMBER); w.pxLight(x + 4, y + 6, N.EMBER); }
    }
  };

  // Clock hands for the hour on the 12..36 clock: [cx, cy, radius]
  const drawHands = (w, [cx, cy, R], hour) => {
    const hand = (turn, len) => { for (let d = 0; d <= len; d += 0.5) w.px(Math.round(cx + Math.sin(turn * Math.PI * 2) * d), Math.round(cy - Math.cos(turn * Math.PI * 2) * d), M.IRON); };
    hand(hour % 1, R);
    hand((hour % 12) / 12, R - 1);
  };

  // A standing figure, 3 wide and 10 tall with its feet on y. `hat` adds the brim of a highlander's hat or a kerchief.
  const person = (w, x, y, top, leg, head, brim, sway = 0) => {
    w.rect(x, y - 2, 3, 3, leg); w.px(x + 1, y, M.WALK_D);
    w.rect(x + sway, y - 6, 3, 4, top);
    w.rect(x + sway, y - 8, 3, 2, M.SKIN); w.rect(x + sway, y - 9, 3, 1, head);
    if (brim) { w.px(x + sway - 1, y - 8, brim); w.px(x + sway + 3, y - 8, brim); w.rect(x + sway, y - 8, 3, 1, brim); }
  };

  // ---- Life on the square
  const drawFountain = (w, dt, hour) => {
    if (hour > 24 && hour < 31) return; // switched off overnight
    const lit = w.levels[w.fountG] > 0.5;
    w.jets.forEach((x, i) => {
      // The jets rise and fall in a slow wave, with one tall burst running along the row
      const wave = 0.5 + 0.5 * Math.sin(w.t * 1.1 - i * 0.7), burst = Math.max(0, Math.sin(w.t * 0.37 - i * 0.5)) ** 6;
      const h = Math.round(2 + wave * 4 + burst * 5);
      for (let j = 0; j < h; j++) {
        const y = 121 - j;
        w.px(x, y, j > h - 3 || (j + i + Math.floor(w.t * 9)) % 3 === 0 ? M.WATER_L : M.WATER);
        if (lit) w.pxLight(x, y, N.FOUNT, w.fountG);
      }
      const s = Math.floor(w.t * 7 + i * 3) % 4;
      if (s < 2) w.px(x - 1 + s * 2, 122 - (s ? 0 : 1), M.WATER_L);
    });
  };

  const drawFolk = (w, dt, hour) => {
    const day = hour < 21.3 || hour > 32;
    // Someone on the bench under the lime
    if (hour < 22.5 || hour > 31) {
      const [x, y] = w.benchAt;
      w.rect(x, y - 5, 3, 4, M.TEE_G); w.rect(x, y - 8, 3, 3, M.SKIN); w.rect(x, y - 8, 3, 1, M.HAIR); w.rect(x + 1, y - 1, 4, 1, M.DENIM); w.rect(x + 4, y, 1, 2, M.DENIM);
      w.rect(x + 5, y - 5, 3, 4, M.SHIRT_P); w.rect(x + 5, y - 8, 3, 3, M.SKIN); w.rect(x + 5, y - 8, 3, 1, M.COAT); w.rect(x + 6, y - 1, 3, 1, M.SUIT); w.px(x + 8, y, M.SUIT);
      if (Math.sin(w.t * 0.5) > 0.6) w.px(x + 3, y - 4, M.SKIN);
    }
    if (!day) return;
    // The fiddle trio by the town hall: lead fiddle, second fiddle, and the three-stringed bass
    const beat = Math.floor(w.t * 2.6) % 2, bow = Math.floor(w.t * 5.2) % 2;
    [[127, 0], [132, 1], [138, 0]].forEach(([x, off], n) => {
      const sway = (beat + off) % 2 && n < 2 ? 1 : 0;
      person(w, x, 122, n === 1 ? M.SERDAK : M.SHIRT, M.PORTKI, M.HAT, M.HAT, sway);
      if (n < 2) { w.px(x + sway + 3, 115, M.FIDDLE); w.px(x + sway + 4, 115, M.FIDDLE); w.px(x + sway + 3 + bow, 114 + bow, M.HAT); w.px(x + sway + 4 + bow, 113 + bow * 2, M.HAT); }
      else { w.rect(x + 3, 116, 2, 6, M.FIDDLE); w.px(x + 3, 115, M.CART_D); w.px(x + 4, 114, M.CART_D); w.px(x + 2, 118 + bow, M.HAT); w.px(x + 1, 118 + bow, M.HAT); }
    });
    // The cheese stall: the seller behind her table, three customers in front of it
    if (hour < 21.2 || hour > 33) {
      const give = Math.sin(w.t * 0.8) > 0.55;
      w.rect(37, 108, 3, 1, M.KERCH); w.rect(37, 109, 3, 2, M.SKIN); w.rect(36, 111, 5, 2, M.SERDAK); w.px(36, 109, M.KERCH); w.px(40, 109, M.KERCH);
      if (give) { w.px(34, 111, M.SKIN); w.px(33, 111, M.OSCYPEK); }
      [[29, M.TEE_R, M.DENIM, M.HAIR], [24, M.SHIRT_B, M.SUIT, M.COAT], [46, M.SHIRT, M.PORTKI, M.HAT]].forEach(([x, top, leg, head], n) => {
        person(w, x, 122 + (n === 2 ? 1 : 0), top, leg, head, n === 2 ? M.HAT : 0, n === 1 && Math.sin(w.t * 0.6 + 1) > 0.8 ? 1 : 0);
        if (n === 0 && give) w.px(x + 3, 117, M.SKIN);
      });
      // And the sheepskin seller under the red canopy
      person(w, 306, 122, M.SERDAK, M.PORTKI, M.HAT, M.HAT, Math.sin(w.t * 0.45) > 0.85 ? 1 : 0);
    }
  };

  const drawPigeons = (w, dt, hour) => {
    const about = hour < 19.6 || hour > 30;
    w.scare = Math.max(0, w.scare - dt);
    w.pigeons.forEach((p, n) => {
      if (p.fly <= 0 && about && w.scare > 0) { p.fly = 1; p.span = 5 + (n % 4); }
      if (p.fly > 0) {
        // One loop out over the square and back to the same place on the roof
        p.fly = Math.max(0, p.fly - dt / p.span);
        const u = 1 - p.fly, out = Math.sin(u * Math.PI), a = u * Math.PI * 2 + n;
        const x = Math.round(p.hx + out * (Math.cos(a) * (26 + n * 2) - 30)), y = Math.round(p.hy - out * (16 + (n % 5) * 3 + Math.sin(a) * 9));
        const up = Math.sin(w.t * 22 + n) > 0 ? -1 : 1;
        w.px(x, y, M.PIGEON); w.px(x + 1, y, M.PIGEON); w.px(x - 1, y + up, M.PIGEON_D); w.px(x + 2, y + up, M.PIGEON_D);
        return;
      }
      const peck = about && Math.sin(w.t * 1.3 + n * 2.1) > 0.75 ? 1 : 0;
      w.px(p.hx, p.hy, M.PIGEON); w.px(p.hx + 1, p.hy, M.PIGEON_D); w.px(p.hx + (n % 2 ? 2 : -1), p.hy - 1 + peck, M.PIGEON_D);
    });
  };

  // ---- The street: a highlander cart behind two piebald horses, the yellow town bus, two touring cyclists.
  // They take the one lane in turn on a 104-second round, and each is only sent out between rounds.
  const NAG = [
    ['.............HH..', '............HHHW.', '...........NNH.H.', '.T.BBBBBBBBNN....', 'TTBBWWWBBBRBN....', 'T.BBWWWWBBRB.....', '..BBBWWBBBBB.....', '..BB.....BBB.....', '.L.L.....L..L....', '.L..L....L...L...', '.F..F....F...F...'],
    ['.............HH..', '............HHHW.', '...........NNH.H.', '.T.BBBBBBBBNN....', 'TTBBWWWBBBRBN....', 'T.BBWWWWBBRB.....', '..BBBWWBBBBB.....', '..BB.....BBB.....', '..LL......LL.....', '..LL......LL.....', '..FF......FF.....'],
  ];
  const drawCart = (w, x0) => {
    const top = ROADY - 15;
    const trot = Math.floor(w.t * 5) % 2;
    // The far horse a shade darker, half a step out of time
    w.sprite(NAG[1 - trot], { B: M.HORSE_D, W: M.HORSE_D, H: M.HORSE_D, N: M.HORSE_D, T: M.MANE, L: M.HORSE_D, F: M.MANE, R: M.HARN }, x0 + 27, top + 3);
    w.sprite(NAG[trot], { B: M.HORSE, W: M.HORSE_W, H: M.HORSE, N: M.MANE, T: M.MANE, L: M.HORSE_W, F: M.MANE, R: M.HARN }, x0 + 24, top + 5 - trot);
    w.px(x0 + 37, top + 5 - trot, M.HARN);
    // Shafts, the box with its slatted side, the wheels
    w.rect(x0 + 20, top + 10, 8, 1, M.CART_D);
    w.rect(x0, top + 7, 21, 4, M.CART); w.rect(x0, top + 7, 21, 1, M.CART_D); for (let i = 2; i < 21; i += 4) w.rect(x0 + i, top + 8, 1, 3, M.CART_D);
    w.rect(x0 + 16, top + 5, 5, 2, M.CART);
    const spoke = Math.floor(w.t * 6) % 2;
    for (const [wx, rad] of [[3, 3], [15, 2]]) for (let dy = -rad; dy <= rad; dy++) for (let dx = -rad; dx <= rad; dx++) {
      const d = dx * dx + dy * dy;
      if (d > rad * rad + 1) continue;
      const rim = d >= rad * rad - 1, arm = spoke ? dx === 0 || dy === 0 : Math.abs(dx) === Math.abs(dy);
      if (rim || arm) w.px(x0 + wx + dx, ROADY - rad + dy, rim ? M.MANE : M.CART_D);
    }
    // A woman in a red kerchief, the fiddler, and the driver with the reins
    w.rect(x0 + 2, top + 1, 3, 1, M.KERCH); w.rect(x0 + 2, top + 2, 3, 2, M.SKIN); w.px(x0 + 2, top + 2, M.KERCH); w.rect(x0 + 2, top + 4, 3, 3, M.SKIRT_F); w.px(x0 + 3, top + 4, M.SHIRT);
    const bow = Math.floor(w.t * 5.2) % 2;
    w.rect(x0 + 7, top + 1, 5, 1, M.HAT); w.rect(x0 + 8, top, 3, 1, M.HAT); w.rect(x0 + 8, top + 2, 3, 2, M.SKIN); w.rect(x0 + 8, top + 4, 3, 3, M.SHIRT);
    w.px(x0 + 11, top + 4, M.FIDDLE); w.px(x0 + 12, top + 4, M.FIDDLE); w.px(x0 + 11 + bow, top + 3 - bow, M.HAT); w.px(x0 + 12 + bow, top + 2, M.HAT);
    w.rect(x0 + 15, top + 1, 5, 1, M.HAT); w.rect(x0 + 16, top, 3, 1, M.HAT); w.rect(x0 + 16, top + 2, 3, 2, M.SKIN); w.rect(x0 + 16, top + 4, 3, 2, M.SHIRT); w.rect(x0 + 16, top + 4, 1, 2, M.SERDAK);
    for (let i = 0; i < 8; i++) w.px(x0 + 19 + i, top + 4 + (i >> 1) + (i > 5 ? 1 : 0), M.MANE);
    // A lantern hangs under the box after dark
    w.px(x0 + 9, top + 11, M.IRON); w.px(x0 + 9, top + 12, M.TENT_WD);
    if (w.dark > 0.3) w.pxLight(x0 + 9, top + 12, N.LAMPW);
  };

  const BUSLEN = 58;
  const drawBus = (w, x0, lit) => {
    const top = ROADY - 14;
    const R = (i, row, len, h, m) => w.rect(x0 + i, top + row, len, h, m); // the nose is at the left: it runs right to left
    R(3, 0, 52, 1, M.BUS_YD); R(8, -1, 12, 1, M.STEEL_LT); R(1, 1, 56, 1, M.BUS_Y);
    R(0, 2, 58, 10, M.BUS_Y); R(0, 2, 1, 2, M.BUS_YD);
    R(0, 2, 56, 6, M.BUS_K);
    R(0, 3, 4, 6, M.CAR_GLASS); R(1, 1, 8, 1, M.BUS_K);
    for (let i = 6; i < 54; i += 8) R(i, 3, 7, 4, M.CAR_GLASS);
    R(0, 9, 58, 1, M.BUS_YD); R(0, 12, 58, 1, M.BUS_K);
    for (const i of [13, 36]) { R(i, 2, 7, 10, M.BUS_K); R(i + 1, 3, 2, 8, M.CAR_GLASS); R(i + 4, 3, 2, 8, M.CAR_GLASS); }
    for (const i of [6, 45]) { R(i, 10, 6, 3, M.BUS_K); R(i + 1, 11, 4, 3, M.TIRE); R(i, 12, 6, 1, M.TIRE); R(i + 2, 12, 2, 1, M.STEEL_LT); }
    R(0, 10, 1, 1, M.SHIRT); R(57, 10, 1, 1, M.CAR_R);
    // Passengers, as heads in the windows
    for (let k = 0; k < 6; k++) { const seat = ((k + 3) * 2654435761) >>> 29; if (seat < 5 && k !== 1 && k !== 4) { R(8 + k * 8, 4, 2, 1, [M.HAIR, M.COAT, M.HAT][seat % 3]); R(8 + k * 8, 5, 2, 2, lit ? M.SUIT : M.SKIN); } }
    R(1, 4, 2, 1, M.HAIR); R(1, 5, 2, 2, lit ? M.SUIT : M.SHIRT_B);
    const L = (i, row, len, h, n, g = 2) => { for (let a = 0; a < len; a++) for (let b = 0; b < h; b++) w.pxLight(x0 + i + a, top + row + b, n, g); };
    L(2, 1, 6, 1, N.LED, 1);
    if (lit) { for (let i = 6; i < 54; i += 8) L(i, 3, 7, 1, N.BUSLIT); for (const i of [14, 17, 37, 40]) L(i, 3, 2, 2, N.BUSLIT); L(0, 10, 1, 2, N.HEAD, 1); L(57, 10, 1, 2, N.TAIL, 1); }
    w.rect(x0 + 3, ROADY + 1, BUSLEN - 6, 1, M.COBBLE_D);
  };

  const BIKE = [
    ['.....EE.....', '.....SS.....', '....JJJ.....', '...JJJJS....', '.PPJJJ..K...', '.PPLLL..K...', '.KKKLLKKK...', '.WWKL.K.WW..', 'W..WLK.W..W.', 'W..W.L.W..W.', '.WW.....WW..'],
    ['.....EE.....', '.....SS.....', '....JJJ.....', '...JJJJS....', '.PPJJJ..K...', '.PPLLL..K...', '.KKKKLLKK...', '.WWK.LK.WW..', 'W..WKL.W..W.', 'W..W...W..W.', '.WW.....WW..'],
  ];
  const drawRiders = (w, x0, lit) => {
    [[0, M.JERSEY_C], [-21, M.JERSEY_O]].forEach(([off, jersey], n) => {
      const x = x0 + off;
      w.rect(x + 2, ROADY + 1, 8, 1, M.COBBLE_D);
      w.sprite(BIKE[Math.floor((x0 + n * 2) / 4 + 400) % 2], { E: M.HELMET, S: M.SKIN, J: jersey, L: M.SUIT, P: M.TENT_R, K: M.IRON, W: M.TIRE }, x, ROADY - 10);
      if (lit) { w.pxLight(x + 9, ROADY - 5, N.HEAD); w.pxLight(x, ROADY - 5, N.TAIL); }
    });
  };

  const drawStreet = (w, dt, hour) => {
    const c = (w.t + 6) % 104;
    if (c < 0.5 || w.cartOut === undefined) w.cartOut = hour < 19.4 || hour > 32;
    if ((c > 41 && c < 42) || w.busOut === undefined) w.busOut = hour < 22.6 || hour > 29.4;
    if ((c > 67 && c < 68) || w.ridersOut === undefined) w.ridersOut = hour < 20.4 || hour > 30.6;
    const lit = w.dark > 0.3;
    w.cartX = null;
    if (c < 40 && w.cartOut) { w.cartX = Math.round(-84 + c * 11.5); drawCart(w, w.cartX); }
    else if (c >= 43 && c < 62 && w.busOut) drawBus(w, Math.round(366 - (c - 43) * 25), lit);
    else if (c >= 69 && c < 94 && w.ridersOut) drawRiders(w, Math.round(-16 + (c - 69) * 17), lit);
  };

  const draw = (w, dt, hour) => {
    drawSky(w, dt, hour);
    drawFlight(w, dt, hour);
    drawHands(w, w.clockChurch, hour);
    drawHands(w, w.clockHall, hour);
    // The flag on the middle pole
    const [fx, fy] = w.flagAt;
    for (let i = 0; i < 8; i++) {
      const wave = Math.round(Math.sin(w.t * 3.6 - i * 0.8) * (i / 7) * 1.3);
      w.px(fx + i, fy + wave, M.SHIRT); w.px(fx + i, fy + 1 + wave, M.SHIRT); w.px(fx + i, fy + 2 + wave, M.TIP_R); w.px(fx + i, fy + 3 + wave, M.TIP_R);
    }
    drawFountain(w, dt, hour);
    drawFolk(w, dt, hour);
    w.drawCat(dt, hour);
    w.drawPeople(dt, hour);
    drawStreet(w, dt, hour);
    // Hooves on the cobbles send the pigeons off the pavilion roof
    if (w.cartX !== null && Math.abs(w.cartX + 30 - 266) < 3) w.scare = 0.3;
    drawPigeons(w, dt, hour);
  };

  const build = (w, ctx) => {
    M = ctx.M;
    N = ctx.N;
    w.noSignal = true;
    w.walkTop = FOOT;
    w.roadTop = KERB + 2;
    // Lights, on the 12..36 clock; every group is off at both noons
    w.lampG = w.addGroup(18.6, 29.6, 'neon', { soft: true });
    w.floodG = w.addGroup(19, 28.6, 'room');
    w.clockG = w.addGroup(18.3, 30.1, 'room');
    w.lanternG = w.addGroup(18.8, 25, 'room');
    w.museumG = w.addGroup(17.5, 19.6, 'room');
    w.signG = w.addGroup(18.2, 23.5, 'neon', { soft: true });
    w.cafeG = w.addGroup(17.8, 23.7);
    w.stallG = w.addGroup(17.9, 21.4);
    w.shopG = w.addGroup(17.6, 20.8, 'room');
    w.fountG = w.addGroup(18.7, 24, 'room');
    buildRange(w);
    buildGround(w);
    buildChurch(w);
    buildTenements(w);
    buildRatusz(w);
    buildShrine(w);
    buildPavilion(w);
    buildStalls(w);
    buildSquare(w);
    buildClouds(w);
    // Trees stand in front of everything on the square
    w.depth = 3;
    spruce(w, 3, 58, FOOT + 1);
    w.rect(109, 94, 3, 25, M.TRUNK); w.rect(109, 94, 1, 25, M.TRUNK_L); w.px(108, 118, M.TRUNK); w.px(112, 118, M.TRUNK);
    lime(w, 110, 70, 15, 27, 1886);
    w.rect(211, 92, 3, 27, M.TRUNK); w.rect(211, 92, 1, 27, M.TRUNK_L); w.px(210, 118, M.TRUNK); w.px(214, 118, M.TRUNK);
    lime(w, 212, 65, 17, 29, 2012);
    w.depth = 2;

    // Actors
    w.cat.x = 86; w.cat.y = 120; // by the shrine fence
    w.scare = 0;
    w.personStyles.gazda = [M.SHIRT, M.PORTKI, M.HAT];
    w.personStyles.gazdzina = [M.SERDAK, M.SKIRT_F, M.KERCH];
    w.personStyles.red = [M.TEE_R, M.DENIM, M.HAIR];
    w.personStyles.green = [M.TEE_G, M.PORTKI, M.COAT];
    w.personStyles.blue = [M.SHIRT_B, M.DENIM, M.HAIR];
    w.personStyles.pink = [M.SHIRT_P, M.SUIT, M.COAT];
    for (const [x, y, dir, speed, style, nightOnly] of [[12, 124, 1, 5, 'gazda'], [64, 126, -1, 4, 'pink'], [104, 123, 1, 6, 'blue'], [146, 127, -1, 5, 'gazdzina'], [176, 125, 1, 4, 'red'], [214, 126, -1, 6, 'green'], [252, 124, 1, 5, 'coat'], [282, 127, -1, 4, 'gazda'], [326, 125, 1, 7, 'shirt'], [40, 126, -1, 3, 'gazdzina'], [196, 123, -1, 5, 'blue'],
      [88, 126, 1, 3, 'suit', true], [232, 125, -1, 4, 'red', true], [310, 126, 1, 3, 'pink', true]]) w.peds.push({ x, y, dir, speed, style, nightOnly, phase: x % 3 });
    w.pigeons = w.roost.map(([hx, hy]) => ({ hx, hy, fly: 0, span: 6 }));
  };

  CitySwitch.define('nowy-targ-switch', {
    city: 'Nowy Targ',
    label: 'Nowy Targ day and night',
    tube: ['#f2c46c', '#8fc6e0'],
    body: ['#e8e6dc', '#101a2c'],
    glass: 'clear',
    sky: SKY,
    grade,
    palette,
    build,
    draw,
    startle: (w) => { w.cat.puff = 1.4; w.scare = 0.3; },
  });
})();
