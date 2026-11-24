// The World Today — Tuesday 24 November 2026.
// A newspaper front page drawn entirely in code (Node 22+, stdlib only, no network,
// no randomness, no dates at runtime): the program writes /output/entry.png.
// Entry for make.fun news-image-20261124, account @teguharifiant.

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { deflateSync } from 'node:zlib';

const W = 1024;
const H = 1024;

// ---------------------------------------------------------------- palette
const PAPER: RGB = [246, 241, 227];
const INK: RGB = [20, 20, 20];
const RED: RGB = [179, 38, 30];
const SKY: RGB = [233, 223, 198];
const SEA: RGB = [46, 85, 104];
const SEA2: RGB = [36, 72, 92];
const HULL: RGB = [24, 28, 32];
const WHITE: RGB = [250, 250, 246];
const ORANGE: RGB = [224, 110, 30];
const YELLOW: RGB = [240, 178, 44];
const SMOKE: RGB = [120, 118, 110];
const CONTAINER: RGB = [178, 52, 40];

type RGB = [number, number, number];

// ------------------------------------------------------- 5x7 bitmap font
// Each glyph: 7 rows of 5 pixels, '#' = ink.
const FONT: Record<string, string[]> = {
  A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
  B: ['11110', '10001', '10001', '11110', '10001', '10001', '11110'],
  C: ['01110', '10001', '10000', '10000', '10000', '10001', '01110'],
  D: ['11110', '10001', '10001', '10001', '10001', '10001', '11110'],
  E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
  F: ['11111', '10000', '10000', '11110', '10000', '10000', '10000'],
  G: ['01110', '10001', '10000', '10111', '10001', '10001', '01111'],
  H: ['10001', '10001', '10001', '11111', '10001', '10001', '10001'],
  I: ['01110', '00100', '00100', '00100', '00100', '00100', '01110'],
  J: ['00111', '00010', '00010', '00010', '00010', '10010', '01100'],
  K: ['10001', '10010', '10100', '11000', '10100', '10010', '10001'],
  L: ['10000', '10000', '10000', '10000', '10000', '10000', '11111'],
  M: ['10001', '11011', '10101', '10101', '10001', '10001', '10001'],
  N: ['10001', '11001', '10101', '10011', '10001', '10001', '10001'],
  O: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
  P: ['11110', '10001', '10001', '11110', '10000', '10000', '10000'],
  Q: ['01110', '10001', '10001', '10001', '10101', '10010', '01101'],
  R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
  S: ['01111', '10000', '10000', '01110', '00001', '00001', '11110'],
  T: ['11111', '00100', '00100', '00100', '00100', '00100', '00100'],
  U: ['10001', '10001', '10001', '10001', '10001', '10001', '01110'],
  V: ['10001', '10001', '10001', '10001', '10001', '01010', '00100'],
  W: ['10001', '10001', '10001', '10101', '10101', '10101', '01010'],
  X: ['10001', '10001', '01010', '00100', '01010', '10001', '10001'],
  Y: ['10001', '10001', '01010', '00100', '00100', '00100', '00100'],
  Z: ['11111', '00001', '00010', '00100', '01000', '10000', '11111'],
  '0': ['01110', '10001', '10011', '10101', '11001', '10001', '01110'],
  '1': ['00100', '01100', '00100', '00100', '00100', '00100', '01110'],
  '2': ['01110', '10001', '00001', '00110', '01000', '10000', '11111'],
  '3': ['11110', '00001', '00001', '01110', '00001', '00001', '11110'],
  '4': ['00010', '00110', '01010', '10010', '11111', '00010', '00010'],
  '5': ['11111', '10000', '11110', '00001', '00001', '10001', '01110'],
  '6': ['01110', '10000', '10000', '11110', '10001', '10001', '01110'],
  '7': ['11111', '00001', '00010', '00100', '01000', '01000', '01000'],
  '8': ['01110', '10001', '10001', '01110', '10001', '10001', '01110'],
  '9': ['01110', '10001', '10001', '01111', '00001', '00001', '01110'],
  ' ': ['00000', '00000', '00000', '00000', '00000', '00000', '00000'],
  '.': ['00000', '00000', '00000', '00000', '00000', '01100', '01100'],
  ',': ['00000', '00000', '00000', '00000', '01100', '00100', '01000'],
  ':': ['00000', '01100', '01100', '00000', '01100', '01100', '00000'],
  ';': ['00000', '01100', '01100', '00000', '01100', '00100', '01000'],
  "'": ['00100', '00100', '01000', '00000', '00000', '00000', '00000'],
  '-': ['00000', '00000', '00000', '01110', '00000', '00000', '00000'],
  '(': ['00010', '00100', '01000', '01000', '01000', '00100', '00010'],
  ')': ['01000', '00100', '00010', '00010', '00010', '00100', '01000'],
  '&': ['01100', '10010', '10100', '01000', '10101', '10010', '01101'],
  '!': ['00100', '00100', '00100', '00100', '00100', '00000', '00100'],
  '?': ['01110', '10001', '00001', '00110', '00100', '00000', '00100'],
  '/': ['00001', '00010', '00010', '00100', '01000', '01000', '10000'],
  '%': ['11001', '11010', '00010', '00100', '01000', '01011', '10011'],
  $: ['00100', '01111', '10100', '01110', '00101', '11110', '00100'],
  '"': ['01010', '01010', '00000', '00000', '00000', '00000', '00000'],
  '+': ['00000', '00100', '00100', '11111', '00100', '00100', '00000'],
  '=': ['00000', '00000', '11111', '00000', '11111', '00000', '00000'],
  '\u2022': ['00000', '00000', '01100', '01100', '01100', '00000', '00000'],
};

// ------------------------------------------------------------- pixel buffer
const px = Buffer.alloc(W * H * 3);
function setPixel(x: number, y: number, c: RGB): void {
  if (x < 0 || x >= W || y < 0 || y >= H) return;
  const i = (y * W + x) * 3;
  px[i] = c[0]; px[i + 1] = c[1]; px[i + 2] = c[2];
}
function fillRect(x: number, y: number, w: number, h: number, c: RGB): void {
  for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) setPixel(i, j, c);
}
function hline(x: number, y: number, w: number, c: RGB): void { fillRect(x, y, w, 1, c); }
function disc(cx: number, cy: number, r: number, c: RGB): void {
  for (let y = cy - r; y <= cy + r; y++) for (let x = cx - r; x <= cx + r; x++) {
    if ((x - cx) * (x - cx) + (y - cy) * (y - cy) <= r * r) setPixel(x, y, c);
  }
}
function tri(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, c: RGB): void {
  const minX = Math.min(x0, x1, x2), maxX = Math.max(x0, x1, x2);
  const minY = Math.min(y0, y1, y2), maxY = Math.max(y0, y1, y2);
  const d = (y1 - y2) * (x0 - x2) + (x2 - x1) * (y0 - y2);
  for (let y = minY; y <= maxY; y++) for (let x = minX; x <= maxX; x++) {
    const a = ((y1 - y2) * (x - x2) + (x2 - x1) * (y - y2)) / d;
    const b = ((y2 - y0) * (x - x2) + (x0 - x2) * (y - y2)) / d;
    const cc = 1 - a - b;
    if (a >= 0 && b >= 0 && cc >= 0) setPixel(x, y, c);
  }
}

// ------------------------------------------------------------------- text
const CHAR_W = 6; // 5 px glyph + 1 px gap, times scale
function textWidth(s: string, scale: number): number {
  return s.length * CHAR_W * scale - scale;
}
function drawChar(ch: string, x: number, y: number, scale: number, c: RGB): void {
  const g = FONT[ch] ?? FONT['?'];
  for (let r = 0; r < 7; r++) for (let col = 0; col < 5; col++) {
    if (g[r][col] === '1') fillRect(x + col * scale, y + r * scale, scale, scale, c);
  }
}
function drawText(s: string, x: number, y: number, scale: number, c: RGB): void {
  const up = s.toUpperCase(); // font is capitals-only; front pages set in caps
  for (let i = 0; i < up.length; i++) drawChar(up[i], x + i * CHAR_W * scale, y, scale, c);
}
function drawTextCentered(s: string, cx: number, y: number, scale: number, c: RGB): void {
  drawText(s, cx - Math.floor(textWidth(s, scale) / 2), y, scale, c);
}
// Greedy word wrap to maxWidth px at scale; returns lines.
function wrap(s: string, scale: number, maxWidth: number): string[] {
  const words = s.split(' ');
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    const trial = cur ? cur + ' ' + w : w;
    if (textWidth(trial, scale) <= maxWidth) { cur = trial; continue; }
    if (cur) lines.push(cur);
    cur = w;
  }
  if (cur) lines.push(cur);
  return lines;
}

// --------------------------------------------------------------- PNG encode
const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();
function crc32(buf: Buffer): number {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type: string, data: Buffer): Buffer {
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0);
  out.write(type, 4, 'ascii');
  data.copy(out, 8);
  out.writeUInt32BE(crc32(Buffer.concat([Buffer.from(type, 'ascii'), data])), 8 + data.length);
  return out;
}
function encodePNG(): Buffer {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4);
  ihdr[8] = 8; ihdr[9] = 2; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  const raw = Buffer.alloc(H * (1 + W * 3));
  for (let y = 0; y < H; y++) {
    raw[y * (1 + W * 3)] = 0;
    px.copy(raw, y * (1 + W * 3) + 1, y * W * 3, (y + 1) * W * 3);
  }
  const idat = deflateSync(raw, { level: 9 });
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// ------------------------------------------------------------------ scene
function drawScene(): void {
  fillRect(0, 0, W, H, PAPER);

  // Masthead
  drawTextCentered('THE WORLD TODAY', W / 2, 40, 10, INK);
  hline(28, 124, 968, INK); hline(28, 127, 968, INK);
  drawText('No. 328', 28, 142, 2, INK);
  drawTextCentered('TUESDAY 24 NOVEMBER 2026', W / 2, 142, 3, INK);
  drawText('ONE DOLLAR', 996 - textWidth('ONE DOLLAR', 2), 142, 2, INK);
  hline(28, 176, 968, INK);

  // Lead kicker + headline
  drawTextCentered('THE BALTIC BURNS', W / 2, 190, 3, RED);
  drawTextCentered('DRONE-STRUCK SHIP', W / 2, 222, 6, INK);
  drawTextCentered('DOCKS IN ST PETERSBURG', W / 2, 274, 6, INK);
  const sub = wrap('A sanctioned Russian cargo vessel linked to the defence ministry is towed home after two drones set it ablaze in the Gulf of Finland - as Helsinki says Ukraine was likely behind the attack.', 2, 968);
  sub.forEach((ln, i) => drawTextCentered(ln, W / 2, 330 + i * 18, 2, INK));
  hline(28, 394, 968, INK);

  // Illustration: the burning ship in the Gulf of Finland
  const bx = 28, by = 408, bw = 968, bh = 220;
  fillRect(bx, by, bw, bh, SKY);
  fillRect(bx, by + 132, bw, bh - 132, SEA);
  fillRect(bx, by + 132, bw, 4, SEA2);
  // waves
  for (const [wx, wy, wl] of [[70, 570, 60], [300, 596, 80], [620, 584, 70], [850, 606, 60], [180, 614, 70], [760, 616, 80]] as const) {
    hline(bx + wx - 28, wy, wl, WHITE);
  }
  // smoke (kept inside the illustration frame, top edge y=408)
  disc(478, 452, 12, SMOKE); disc(498, 436, 14, SMOKE); disc(520, 422, 12, SMOKE);
  disc(486, 448, 7, [90, 88, 82]); disc(508, 432, 8, [90, 88, 82]);
  // flames on deck
  tri(458, 496, 498, 496, 478, 452, ORANGE);
  tri(468, 496, 490, 496, 479, 468, YELLOW);
  // containers on deck
  fillRect(368, 496, 60, 24, CONTAINER);
  fillRect(433, 496, 60, 24, ORANGE);
  fillRect(498, 496, 60, 24, CONTAINER);
  fillRect(563, 496, 60, 24, YELLOW);
  // bridge tower
  fillRect(668, 486, 50, 34, WHITE);
  fillRect(674, 494, 12, 8, INK); fillRect(692, 494, 12, 8, INK);
  // mast + flag
  fillRect(728, 468, 3, 52, INK);
  tri(731, 468, 731, 482, 756, 475, RED);
  // hull
  fillRect(348, 520, 400, 55, HULL);
  tri(748, 520, 748, 575, 828, 560, HULL);
  tri(348, 520, 348, 575, 300, 575, HULL);
  hline(348, 520, 400, WHITE);
  // water-cannon arcs from two tugs
  const arc = (x0: number, y0: number, cx: number, cy: number, x1: number, y1: number) => {
    for (let t = 0; t <= 1.0001; t += 0.05) {
      const x = Math.round((1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * cx + t * t * x1);
      const y = Math.round((1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * cy + t * t * y1);
      disc(x, y, 3, WHITE);
    }
  };
  arc(118, 608, 230, 498, 398, 512);
  arc(946, 608, 830, 498, 668, 512);
  // tugs
  fillRect(98, 600, 40, 14, HULL); fillRect(110, 590, 16, 10, WHITE);
  fillRect(926, 600, 40, 14, HULL); fillRect(938, 590, 16, 10, WHITE);
  // frame
  hline(bx, by, bw, INK); hline(bx, by + bh - 1, bw, INK);
  fillRect(bx, by, 2, bh, INK); fillRect(bx + bw - 2, by, 2, bh, INK);

  // Caption
  const cap = wrap('The Sparta II under tow in the Gulf of Finland after two drones set it ablaze on Saturday. Finland says Ukraine was likely behind the strike.', 2, 968);
  cap.forEach((ln, i) => drawTextCentered(ln, W / 2, 640 + i * 18, 2, INK));
  hline(28, 676, 968, INK);

  // Secondary stories, two columns
  const leftBody = wrap('Allies met in Brussels after three Russian Kh-101 missiles fell in Poland on 20 November. Warsaw asks for AWACS planes and F-35 jets to guard its eastern border.', 2, 472);
  const rightBody = wrap('Rescue teams keep digging at the Indonesian candy factory. Twenty-four body bags have been recovered and 29 workers survived, five of them in hospital.', 2, 472);
  drawText('NATO WEIGHS AIR SHIELD', 28, 690, 3, INK);
  drawText('FOR POLAND', 28, 714, 3, INK);
  leftBody.forEach((ln, i) => drawText(ln, 28, 744 + i * 18, 2, INK));
  drawText('CIKANDE: 24 DEAD,', 524, 690, 3, INK);
  drawText('30 STILL MISSING', 524, 714, 3, INK);
  rightBody.forEach((ln, i) => drawText(ln, 524, 744 + i * 18, 2, INK));
  fillRect(512, 690, 2, 122, INK);
  hline(28, 826, 968, INK);

  // Bottom row
  drawText('ALCARAZ WINS FIRST ATP FINALS', 28, 840, 2, INK);
  drawText('Spaniard beats Zverev in Turin.', 28, 862, 2, INK);
  drawText('CHESS CROWN DEFENCE BEGINS', 524, 840, 2, INK);
  drawText('Gukesh faces Sindarov in Geneva.', 524, 862, 2, INK);
  fillRect(512, 840, 2, 36, INK);

  // Ticker
  fillRect(28, 892, 968, 76, RED);
  drawTextCentered('SPARTA II DOCKS  \u2022  NATO WEIGHS AIR SHIELD  \u2022  24 BODY BAGS, 30 MISSING', W / 2, 922, 2, WHITE);
  drawTextCentered('THE WORLD TODAY - TUESDAY 24 NOVEMBER 2026', W / 2, 984, 1, INK);
}

// -------------------------------------------------------------------- main
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
drawScene();
writeFileSync(join(outDir, 'entry.png'), encodePNG());
