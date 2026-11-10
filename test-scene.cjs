const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const registry = new Map();
const context = vm.createContext({
  HTMLElement: class {
    attachShadow() {
      return { querySelector: () => ({ addEventListener() {} }) };
    }
  },
  customElements: {
    get: (tag) => registry.get(tag),
    define: (tag, element) => registry.set(tag, element),
  },
  matchMedia: () => ({ matches: false }),
});
context.window = context;
for (const file of ['city-switch.js', 'nowy-targ.js']) {
  vm.runInContext(fs.readFileSync(path.join(__dirname, file), 'utf8'), context, { filename: file });
}
const Switch = registry.get('nowy-targ-switch');
assert.ok(Switch, 'the scene registers its custom element');
const world = new Switch().world;
const lights = ['lampG', 'floodG', 'clockG', 'lanternG', 'museumG', 'signG', 'cafeG', 'stallG', 'shopG', 'fountG'];
const daylight = new Uint8Array(world.rgba.length);
for (const hour of [12, 17, 18.5, 22, 26, 29, 31, 36]) {
  for (let frame = 0; frame < 35; frame++) world.tick(1 / 30, hour);
  assert.equal(world.rgba.length, 400 * 190 * 4);
  assert.ok(world.rgba.some((value) => value > 0), `the scene renders at ${hour}`);
  assert.ok(world.groups.length < 256);
  if (hour === 12) daylight.set(world.rgba);
  if (hour === 12 || hour === 36) for (const name of lights) assert.equal(world.levels[world[name]], 0, `${name} is off at ${hour}`);
  if (hour === 22) {
    assert.notDeepEqual(world.rgba, daylight, 'night changes the scene');
    for (const name of ['lampG', 'floodG', 'clockG', 'lanternG', 'signG', 'cafeG', 'fountG']) assert.ok(world.levels[world[name]] > 0.9, `${name} is lit at night`);
    assert.equal(world.levels[world.museumG], 0, 'the museum is dark by ten');
    assert.equal(world.levels[world.stallG], 0, 'the stalls have packed up by ten');
  }
  if (hour === 26) assert.equal(world.levels[world.cafeG], 0, 'the pavilion has closed by two');
}

// The street is shared on a 104-second round: the cart, then the bus, then the cyclists, with gaps between.
// Count a colour on the rows of the street inside the window.
const streetPixels = (test) => {
  let count = 0;
  for (let i = (130 + 40) * 400 * 4; i < (146 + 40) * 400 * 4; i += 4) if (test(world.rgba[i], world.rgba[i + 1], world.rgba[i + 2])) count++;
  return count;
};
const busYellow = (r, g, b) => r > 225 && g > 180 && g < 215 && b < 60;
const horseWhite = (r, g, b) => r === 240 && g === 234 && b === 221; // HORSE_W, not the paint of the crossing
const jersey = (r, g, b) => r < 70 && g > 160 && b > 180;
const until = (second) => { while ((world.t + 6) % 104 < second || (world.t + 6) % 104 > second + 1) world.tick(1 / 30, 12); };
until(1); // a new round, started in daylight, sends everyone out
until(20);
assert.ok(streetPixels(horseWhite) > 8, 'the highlander cart crosses behind its piebald horses');
assert.equal(streetPixels(busYellow), 0, 'the bus waits for the cart');
until(41);
assert.equal(streetPixels(horseWhite) + streetPixels(busYellow), 0, 'the street is clear between the cart and the bus');
until(52);
assert.ok(streetPixels(busYellow) > 150, 'the yellow town bus passes');
until(80);
assert.ok(streetPixels(jersey) > 5, 'the touring cyclists follow');
assert.equal(streetPixels(busYellow), 0, 'after the bus has gone');
until(97);
assert.equal(streetPixels(jersey) + streetPixels(busYellow) + streetPixels(horseWhite), 0, 'the street is clear at the end of the round');
assert.ok(world.pigeons.every((pigeon) => pigeon.fly === 0), 'the pigeons are back on the pavilion roof');

// A quick flick of the lens startles the cat and lifts the pigeons; each flies one loop and lands where it sat.
world.startle();
world.tick(1 / 30, 14);
assert.ok(world.cat.puff > 0, 'the cat reacts to a quick drag');
assert.ok(world.pigeons.every((pigeon) => pigeon.fly > 0), 'the pigeons take off');
for (let frame = 0; frame < 30 * 10; frame++) world.tick(1 / 30, 14);
assert.ok(world.pigeons.every((pigeon) => pigeon.fly === 0), 'and land again within ten seconds');

const frozenTime = world.t;
const cloud = world.lenses[0].x;
world.tick(1 / 30, 22, { calm: true });
assert.equal(world.t, frozenTime, 'reduced motion stops the scene animation');
assert.equal(world.lenses[0].x, cloud, 'reduced motion stills the clouds');
assert.equal(world.levels[world.lampG], 1);

// After dark the cart stays in and the bus still runs; in the small hours the street is empty.
until(99);
for (let frame = 0; frame < 30 * 8; frame++) world.tick(1 / 30, 21.5);
while ((world.t + 6) % 104 < 20 || (world.t + 6) % 104 > 21) world.tick(1 / 30, 21.5);
assert.equal(world.cartOut, false, 'no cart after dark');
while ((world.t + 6) % 104 < 52 || (world.t + 6) % 104 > 53) world.tick(1 / 30, 21.5);
assert.equal(world.busOut, true, 'the evening bus runs');
while ((world.t + 6) % 104 < 43 || (world.t + 6) % 104 > 44) world.tick(1 / 30, 26);
assert.equal(world.busOut, false, 'no bus at two in the morning');

// Optional raw frames let the same check produce a visual preview without browser dependencies.
if (process.argv[2]) {
  for (const hour of [12, 18, 22]) {
    world.tick(0, hour, { calm: true });
    fs.writeFileSync(path.join(process.argv[2], `nowy-targ-${hour}.rgba`), world.rgba);
  }
}
console.log('Nowy Targ: day, dusk, night, dawn, light schedules, startle, street round and reduced motion passed.');
