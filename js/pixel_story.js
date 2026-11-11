/**
 * Melodrio - Pixel Story Engine
 * Draws the ten-scene prologue on a chunky 320 x 180 canvas.
 * All motion is deliberately simple: bobbing, strumming, drifting fog, rising notes.
 */

(function () {
  'use strict';

  const W = 320;
  const H = 180;

  const C = {
    ink: '#171126',
    black: '#08060f',
    night: '#0b091d',
    deep: '#1b1233',
    purple: '#352057',
    mauve: '#8c4c69',
    rose: '#d98669',
    gold: '#ffd166',
    goldLight: '#ffe8a3',
    cream: '#fff3c7',
    skin: '#f3b47f',
    skinDark: '#d18c5a',
    hair: '#7a4426',
    hairDark: '#4a2618',
    red: '#d63b3f',
    redDark: '#a8242c',
    blue: '#2f55b5',
    blueDark: '#1f3a86',
    shoe: '#6b3a1e',
    wood: '#e0a33c',
    woodDark: '#5b2f1f',
    white: '#f8fafc'
  };

  const reduceMotion = Boolean(
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  /* ------------------------------------------------------------------------
     Low-level pixel helpers
     ------------------------------------------------------------------------ */

  function px(ctx, x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(
      Math.round(x),
      Math.round(y),
      Math.max(1, Math.round(w)),
      Math.max(1, Math.round(h))
    );
  }

  function bandSky(ctx, colors) {
    const step = Math.ceil(H / colors.length);
    for (let i = 0; i < colors.length; i += 1) {
      px(ctx, 0, i * step, W, Math.min(step, H - i * step), colors[i]);
    }
  }

  function disc(ctx, cx, cy, radius, color) {
    ctx.fillStyle = color;
    const r = Math.max(1, Math.round(radius));
    for (let y = -r; y < r; y += 2) {
      const half = Math.floor(Math.sqrt(r * r - y * y));
      ctx.fillRect(
        Math.round(cx - half),
        Math.round(cy + y),
        Math.max(1, half * 2),
        2
      );
    }
  }

  function ring(ctx, cx, cy, radius, thickness, color) {
    ctx.fillStyle = color;
    const r = Math.max(1, Math.round(radius));
    const t = Math.max(1, Math.round(thickness));
    for (let y = -r; y < r; y += 2) {
      const outer = Math.floor(Math.sqrt(Math.max(0, r * r - y * y)));
      const inner = Math.max(0, r - t);
      const innerHalf = Math.abs(y) < inner
        ? Math.floor(Math.sqrt(inner * inner - y * y))
        : 0;
      if (outer > innerHalf) {
        ctx.fillRect(cx - outer, cy + y, outer - innerHalf, 2);
        ctx.fillRect(cx + innerHalf, cy + y, outer - innerHalf, 2);
      }
    }
  }

  function stars(ctx, t, points, color) {
    for (let i = 0; i < points.length; i += 1) {
      const p = points[i];
      const visible = (i + Math.floor(t * 1.7)) % 5 !== 0;
      if (visible) {
        px(ctx, p[0], p[1], p[2] || 1, p[2] || 1, color || C.goldLight);
      }
    }
  }

  function hills(ctx, color, base, amp, freq, phase, step) {
    const s = step || 4;
    for (let x = 0; x < W; x += s) {
      const y = Math.round(
        base -
        Math.sin((x + phase) * freq) * amp -
        Math.cos((x * 0.63 + phase * 0.7) * freq * 0.8) * amp * 0.35
      );
      px(ctx, x, y, s, H - y, color);
    }
  }

  function cloud(ctx, x, y, scale, color) {
    const s = scale || 1;
    px(ctx, x, y + 3 * s, 7 * s, 2 * s, color);
    px(ctx, x + 2 * s, y + 2 * s, 3 * s, 1 * s, color);
    px(ctx, x + 5 * s, y + 1 * s, 4 * s, 3 * s, color);
    px(ctx, x + 9 * s, y + 3 * s, 4 * s, 2 * s, color);
  }

  function bird(ctx, x, y, color, flap) {
    const c = color || C.ink;
    px(ctx, x, y, 2, 1, c);
    px(ctx, x - 2, y - 1, 2, 1, c);
    px(ctx, x + 2, y - (flap ? 1 : 0), 2, 1, c);
  }

  function note(ctx, x, y, color, size) {
    const s = size || 1;
    px(ctx, x, y + 3 * s, 2 * s, 2 * s, color);
    px(ctx, x + 2 * s, y, s, 4 * s, color);
    px(ctx, x + 2 * s, y, 2 * s, s, color);
  }

  function house(ctx, x, ground, w, h, wall, roof, lit) {
    px(ctx, x, ground - h, w, h, wall);
    const rows = Math.ceil(w / 2);
    for (let i = 0; i < rows; i += 2) {
      px(ctx, x + i, ground - h - i, Math.max(1, w - i * 2), 2, roof);
    }
    const doorW = Math.max(2, Math.floor(w * 0.18));
    const doorH = Math.max(4, Math.floor(h * 0.32));
    px(ctx, x + Math.floor(w * 0.65), ground - doorH, doorW, doorH, C.ink);
    if (lit !== false) {
      const winW = Math.max(2, Math.floor(w * 0.2));
      const winH = Math.max(2, Math.floor(h * 0.24));
      px(ctx, x + Math.floor(w * 0.18), ground - Math.floor(h * 0.64), winW, winH, lit || C.gold);
    }
  }

  function villager(ctx, x, ground, opts) {
    const o = opts || {};
    const bob = Math.round(o.bob || 0);
    const y = ground - 18 + bob;
    const shirt = o.shirt || '#4c3a67';
    const hair = o.hair || '#2f211d';
    px(ctx, x - 6, ground - 1, 13, 2, 'rgba(10,8,20,0.25)');
    px(ctx, x - 3, y + 13, 2, 5, shirt);
    px(ctx, x + 2, y + 13, 2, 5, shirt);
    px(ctx, x - 4, y + 6, 9, 8, shirt);
    px(ctx, x - 3, y, 7, 6, C.skin);
    px(ctx, x - 4, y - 2, 9, 3, hair);
    px(ctx, x - 4, y + 1, 2, 3, hair);
    px(ctx, x + 3, y + 1, 2, 3, hair);
    if (o.armsUp) {
      px(ctx, x - 8, y + 3, 3, 2, shirt);
      px(ctx, x - 9, y, 2, 3, C.skin);
      px(ctx, x + 6, y + 3, 3, 2, shirt);
      px(ctx, x + 8, y, 2, 3, C.skin);
    } else {
      px(ctx, x - 7, y + 8, 3, 5, shirt);
      px(ctx, x + 5, y + 8, 3, 5, shirt);
    }
  }

  /* ------------------------------------------------------------------------
     Melodrio — a chibi guitarist inspired by the classic pixel reference
     ------------------------------------------------------------------------ */

  function drawMelodrio(ctx, x, ground, opts) {
    const o = opts || {};
    const s = o.scale || 1;
    const bob = Math.round(o.bob || 0);
    const strum = o.strum ? Math.sin(o.strum) : 0;
    const walk = o.walk || 0;
    const sit = Boolean(o.sit);
    const showGuitar = o.guitar !== false;
    const height = sit ? 24 : 31;
    const top = Math.round(ground - height * s) + bob;

    const R = (dx, dy, w, h, color) => {
      px(ctx, x + dx * s, top + dy * s, w * s, h * s, color);
    };

    const swing = walk ? Math.sin(walk) : 0;
    const legLift = Math.round(Math.max(0, swing) * 2);
    const legLift2 = Math.round(Math.max(0, -swing) * 2);

    // Ground shadow stays put while the body bobs.
    px(ctx, x - 3 * s, ground - s, 27 * s, 2 * s, 'rgba(10,8,20,0.3)');

    if (!sit) {
      R(5, 23 - legLift, 3, 7 + legLift, C.blue);
      R(13, 23 - legLift2, 3, 7 + legLift2, C.blue);
      R(3, 29 - legLift, 5, 2, C.shoe);
      R(14, 29 - legLift2, 5, 2, C.shoe);
      R(3, 30 - legLift, 5, 1, C.black);
      R(14, 30 - legLift2, 5, 1, C.black);
    } else {
      R(4, 21, 6, 4, C.blue);
      R(13, 21, 6, 4, C.blue);
      R(2, 23, 4, 2, C.shoe);
      R(17, 23, 4, 2, C.shoe);
    }

    // Torso, shirt and overalls.
    R(4, 11, 15, 13, C.black);
    R(5, 12, 13, 7, C.red);
    R(4, 13, 2, 5, C.red);
    R(17, 13, 2, 5, C.red);
    R(7, 15, 9, 9, C.blue);
    R(7, 12, 2, 4, C.blue);
    R(14, 12, 2, 4, C.blue);
    R(7, 13, 1, 1, '#ffd83d');
    R(15, 13, 1, 1, '#ffd83d');
    R(10, 18, 3, 2, C.blueDark);

    // Arms.
    R(2, 14, 3, 4, C.red);
    R(1, 18, 3, 3, C.skin);
    R(18, 14, 3, 4, C.red);
    R(18, 17 + (strum > 0 ? 1 : 0), 3, 2, C.skin);

    // Head.
    R(3, 3, 16, 9, C.hair);
    R(5, 5, 12, 7, C.skin);
    R(3, 6, 2, 6, C.hair);
    R(15, 4, 4, 7, C.hair);
    R(6, 8, 1, 2, C.ink);
    R(12, 8, 1, 2, C.ink);
    R(9, 11, 3, 1, C.skinDark);
    R(9, 9, 1, 2, C.skinDark);

    // Red cap with a brim pointing right, like the reference.
    R(4, 0, 13, 2, C.redDark);
    R(4, 2, 13, 3, C.red);
    R(15, 4, 5, 2, C.red);
    R(15, 6, 5, 1, C.redDark);

    if (showGuitar) {
      const gx = 10;
      const gy = 16 + (o.guitarBob || 0);

      // Acoustic guitar body.
      R(gx + 1, gy, 7, 2, C.woodDark);
      R(gx, gy + 2, 9, 6, C.woodDark);
      R(gx + 1, gy + 8, 7, 2, C.woodDark);
      R(gx + 1, gy + 1, 7, 1, C.wood);
      R(gx + 1, gy + 2, 7, 6, C.wood);
      R(gx + 1, gy + 8, 7, 1, C.wood);
      R(gx + 3, gy + 4, 3, 2, C.woodDark);
      R(gx + 4, gy + 4, 1, 1, C.goldLight);

      // Neck and headstock.
      for (let i = 0; i < 9; i += 1) {
        R(gx + 8 + i, gy + 1 - i, 2, 2, i > 5 ? '#3f2418' : C.woodDark);
      }
      R(gx + 16, gy - 9, 4, 3, '#3f2418');
      R(gx + 18, gy - 10, 1, 1, C.goldLight);
      R(gx + 20, gy - 9, 1, 1, C.goldLight);

      // String highlight across the sound hole.
      px(ctx, x + (gx + 2) * s, top + (gy + 4) * s, 6 * s, s, 'rgba(255,243,199,0.6)');
    }
  }

  /* Scene 1 — the Valley of Chords wakes up */
  function valleyScene(ctx, t) {
    bandSky(ctx, ['#130f2e', '#27194b', '#422758', '#633d5e', '#8a5165', '#bc6b68', '#e89f6c']);
    stars(ctx, t, [
      [16, 12, 1], [38, 22, 1], [64, 9, 2], [92, 28, 1], [124, 14, 1],
      [158, 24, 1], [196, 10, 1], [232, 20, 1], [272, 12, 1], [306, 26, 1]
    ], '#ffe8ad');

    disc(ctx, 258, 68, 30, 'rgba(255,209,120,0.10)');
    disc(ctx, 258, 68, 20, 'rgba(255,209,120,0.18)');
    disc(ctx, 258, 68, 11, '#ffe8a3');
    disc(ctx, 258, 68, 7, '#fff3c7');

    cloud(ctx, 28 + ((t * 2) % 380), 34, 1, 'rgba(255,190,160,0.25)');
    cloud(ctx, 188 + ((t * 1.2) % 380), 52, 1, 'rgba(255,190,160,0.18)');

    hills(ctx, '#3a2857', 92, 14, 0.014, 10);
    hills(ctx, '#2a1c47', 104, 12, 0.018, 20);
    hills(ctx, '#1f3348', 120, 9, 0.022, 90);

    // Huddled village on the mid hill.
    house(ctx, 172, 121, 14, 12, '#241a3c', '#3a2452', C.gold);
    house(ctx, 190, 124, 18, 15, '#201635', '#342046', C.gold);
    house(ctx, 212, 122, 13, 11, '#251b3e', '#3c2754', '#ffc85c');
    house(ctx, 228, 125, 17, 15, '#1d1533', '#332045', C.gold);
    house(ctx, 249, 122, 12, 10, '#241a3c', '#3a2452', '#ffc85c');
    house(ctx, 264, 124, 18, 14, '#201635', '#342046', C.gold);
    house(ctx, 286, 122, 12, 11, '#251b3e', '#3c2754', C.gold);

    // Church tower.
    px(ctx, 208, 96, 10, 26, '#2a1e40');
    px(ctx, 206, 90, 14, 6, '#3a2452');
    px(ctx, 211, 84, 4, 6, '#2a1e40');
    px(ctx, 209, 102, 8, 5, '#ffd166');

    // Chimneys and the notes climbing out of them.
    px(ctx, 196, 101, 3, 8, '#19112b');
    px(ctx, 233, 103, 3, 8, '#19112b');
    for (let i = 0; i < 7; i += 1) {
      const rise = (t * 9 + i * 13) % 70;
      const nx = 197 + Math.sin(t * 1.4 + i) * 4 + (i % 3) * 22;
      note(ctx, nx, 108 - rise, i % 2 ? C.gold : C.goldLight, 1);
    }

    hills(ctx, '#152f33', 148, 9, 0.02, 210);
    hills(ctx, '#0f2628', 162, 7, 0.026, 300);

    // Winding river catching the sunrise.
    for (let i = 0; i < 30; i += 1) {
      const p = i / 29;
      const rx = 206 + p * 96;
      const ry = 176 - p * 34 + Math.sin(p * 7) * 5;
      px(ctx, rx, ry, 9, 2, 'rgba(255,225,164,0.35)');
    }

    // Grass tufts.
    const tufts = [[70, 166], [88, 172], [120, 160], [160, 170], [236, 168], [280, 174], [308, 164]];
    tufts.forEach((p) => {
      px(ctx, p[0], p[1], 1, 3, '#1d4a3b');
      px(ctx, p[0] + 2, p[1] + 1, 1, 2, '#245c47');
    });

    // Birds crossing the dawn.
    for (let i = 0; i < 3; i += 1) {
      const bx = 84 + ((t * 7 + i * 46) % 170);
      const by = 42 + Math.sin(t * 2 + i) * 3;
      bird(ctx, bx, by, '#24192f', Math.floor(t * 4 + i) % 2 === 0);
    }

    // Melodrio greets the valley.
    drawMelodrio(ctx, 168, 160, {
      scale: 1.3,
      bob: Math.round(Math.sin(t * 2) * 1),
      strum: t * 5
    });

    for (let i = 0; i < 4; i += 1) {
      const rise = (t * 14 + i * 14) % 56;
      note(ctx, 198 + Math.sin(t * 1.6 + i) * 4, 142 - rise, i % 2 ? C.goldLight : C.gold, 1);
    }

    for (let i = 0; i < 8; i += 1) {
      const sx = (i * 41 + t * 3) % W;
      const sy = 150 + Math.sin(t * 2 + i) * 4;
      px(ctx, sx, sy, 1, 1, 'rgba(255,225,150,0.55)');
    }
  }

  /* Scene 2 — morning music in the village */
  function morningScene(ctx, t) {
    bandSky(ctx, ['#171130', '#3b2557', '#75455f', '#c47268', '#f0a56b', '#ffd08a']);
    disc(ctx, 286, 42, 24, 'rgba(255,225,150,0.16)');
    disc(ctx, 286, 42, 12, '#ffe8a3');
    disc(ctx, 286, 42, 7, '#fff3c7');

    cloud(ctx, 40 + ((t * 2.5) % 380), 28, 1, 'rgba(255,205,170,0.3)');
    cloud(ctx, 210 + ((t * 1.5) % 380), 46, 1, 'rgba(255,205,170,0.2)');

    hills(ctx, '#2e2742', 108, 10, 0.02, 30);
    hills(ctx, '#20233a', 128, 8, 0.024, 110);

    house(ctx, 130, 126, 16, 13, '#2a1c3f', '#3e2856', C.gold);
    house(ctx, 150, 129, 21, 17, '#251a39', '#38234e', '#ffc85c');
    house(ctx, 174, 125, 14, 11, '#2a1c3f', '#3e2856', C.gold);
    house(ctx, 190, 128, 18, 15, '#251a39', '#38234e', C.gold);
    house(ctx, 266, 126, 15, 12, '#2a1c3f', '#3e2856', '#ffc85c');
    house(ctx, 284, 129, 20, 16, '#251a39', '#38234e', C.gold);

    hills(ctx, '#173439', 150, 8, 0.023, 230);
    hills(ctx, '#102a25', 164, 6, 0.03, 320);

    // Bakery with its glowing oven.
    px(ctx, 18, 112, 96, 52, '#3c2a38');
    px(ctx, 14, 108, 104, 6, '#4b3444');
    px(ctx, 22, 116, 88, 4, '#2f2130');
    px(ctx, 36, 100, 12, 14, '#2b1e35');
    px(ctx, 28, 118, 26, 34, '#2a1c32');
    disc(ctx, 41, 134, 12, 'rgba(255,178,62,0.18)');
    disc(ctx, 41, 134, 8, 'rgba(255,178,62,0.5)');
    disc(ctx, 41, 134, 5, '#ffd166');
    px(ctx, 68, 122, 32, 24, '#2a1c32');
    px(ctx, 72, 126, 24, 3, '#c58b62');
    px(ctx, 72, 133, 20, 2, '#c58b62');
    px(ctx, 72, 139, 24, 2, '#c58b62');

    // The baker taps the rhythm on the oven. He stands behind the story card,
    // so his hat stays below the card lip instead of floating above it.
    const bakerBob = Math.round(Math.sin(t * 4));
    px(ctx, 113, 161, 18, 3, 'rgba(10,8,20,0.28)');
    px(ctx, 116, 141 + bakerBob, 11, 12, '#e8d7bd');
    px(ctx, 117, 134 + bakerBob, 9, 7, C.skin);
    px(ctx, 115, 130 + bakerBob, 13, 5, '#fff3d6');
    px(ctx, 117, 127 + bakerBob, 9, 4, '#fff8e6');
    px(ctx, 116, 144 + bakerBob, 3, 6, '#b97e58');
    const tap = Math.round(Math.sin(t * 7) * 2);
    px(ctx, 110, 141 + bakerBob + tap, 6, 2, '#e8d7bd');
    px(ctx, 108, 140 + bakerBob + tap, 3, 3, C.skin);
    px(ctx, 118, 153 + bakerBob, 2, 7, '#4b3444');
    px(ctx, 123, 153 + bakerBob, 2, 7, '#4b3444');
    px(ctx, 115, 160 + bakerBob, 4, 2, '#2a1c32');
    px(ctx, 122, 160 + bakerBob, 4, 2, '#2a1c32');

    for (let i = 0; i < 4; i += 1) {
      const rise = (t * 12 + i * 15) % 60;
      note(ctx, 46 + Math.sin(t + i) * 3, 118 - rise, i % 2 ? C.gold : C.goldLight, 1);
    }

    // Birds answer in tune.
    for (let i = 0; i < 4; i += 1) {
      const bx = 140 + ((t * 10 + i * 28) % 130);
      const by = 62 + Math.sin(t * 2.4 + i) * 4;
      bird(ctx, bx, by, '#22162f', Math.floor(t * 5 + i) % 2 === 0);
    }

    // Melodrio plays in the foreground.
    drawMelodrio(ctx, 172, 162, {
      scale: 1.35,
      bob: Math.round(Math.sin(t * 2.2) * 1),
      strum: t * 5.5
    });

    for (let i = 0; i < 5; i += 1) {
      const rise = (t * 16 + i * 12) % 54;
      note(ctx, 202 + Math.sin(t * 1.5 + i) * 5, 148 - rise, i % 2 ? C.goldLight : C.gold, 1);
    }

    px(ctx, 152, 118, 2, 2, C.goldLight);
    px(ctx, 194, 119, 2, 2, C.goldLight);
  }

  /* Scene 3 — the Noise rolls in */
  function noiseScene(ctx, t) {
    bandSky(ctx, ['#1a1030', '#35204a', '#5a3654', '#78606a', '#7b7a7e', '#666b74', '#4a505c']);
    disc(ctx, 78, 62, 26, 'rgba(255,205,120,0.10)');
    disc(ctx, 78, 62, 12, 'rgba(255,205,120,0.22)');
    disc(ctx, 78, 62, 6, '#ffdf9e');

    cloudsWarm(ctx, t);
    hills(ctx, '#3b2a50', 108, 11, 0.018, 40);
    hills(ctx, '#3f4652', 124, 8, 0.022, 120);

    // Houses on the left still remember music; the right side is fading.
    house(ctx, 26, 128, 16, 13, '#2b1d42', '#402a56', C.gold);
    house(ctx, 46, 131, 20, 16, '#261a3b', '#39244d', '#ffc85c');
    house(ctx, 70, 127, 13, 11, '#2b1d42', '#402a56', C.gold);
    house(ctx, 86, 130, 17, 14, '#261a3b', '#39244d', C.gold);
    house(ctx, 150, 128, 15, 12, '#3b3a46', '#4a4955', false);
    house(ctx, 168, 131, 19, 15, '#35343f', '#45444f', false);
    house(ctx, 214, 128, 15, 12, '#33323d', '#43424d', false);
    house(ctx, 232, 131, 18, 14, '#30303a', '#403f4a', false);
    house(ctx, 268, 127, 14, 11, '#33323d', '#43424d', false);
    house(ctx, 286, 130, 19, 15, '#30303a', '#403f4a', false);

    hills(ctx, '#243238', 150, 8, 0.024, 210);
    hills(ctx, '#18262a', 164, 6, 0.03, 300);

    // Warm notes on the left are being swallowed.
    for (let i = 0; i < 4; i += 1) {
      const rise = (t * 10 + i * 16) % 56;
      note(ctx, 34 + i * 16 + Math.sin(t + i) * 3, 118 - rise, i < 2 ? C.gold : '#c7a56d', 1);
    }

    // Falling grey notes on the right.
    for (let i = 0; i < 6; i += 1) {
      const fall = (t * 12 + i * 22) % 100;
      note(ctx, 176 + (i * 23) % 120 + Math.sin(t * 2 + i) * 4, 24 + fall, '#9aa2ad', 1);
    }

    // Birds flee to the left.
    for (let i = 0; i < 3; i += 1) {
      const bx = 190 - ((t * 14 + i * 30) % 110);
      const by = 46 + Math.sin(t * 3 + i) * 5;
      bird(ctx, bx, by, '#2b2238', Math.floor(t * 7 + i) % 2 === 0);
    }

    // The grey wall of Noise.
    fogBank(ctx, t, 196, 0.9);
    fogBank(ctx, t + 2, 218, 0.65);

    // A few noise flickers inside the fog.
    for (let i = 0; i < 4; i += 1) {
      const fx = 190 + ((i * 37 + t * 9) % 110);
      const fy = 32 + ((i * 41 + t * 5) % 120);
      px(ctx, fx, fy, 3, 1, 'rgba(235,240,245,0.3)');
      px(ctx, fx + 3, fy + 2, 2, 1, 'rgba(235,240,245,0.18)');
    }

    drawMelodrio(ctx, 168, 161, {
      scale: 1.2,
      bob: Math.round(Math.sin(t * 2.5) * 1),
      strum: t * 4,
      guitar: false
    });
  }

  function cloudsWarm(ctx, t) {
    cloud(ctx, 30 + ((t * 2.2) % 380), 30, 1, 'rgba(255,190,160,0.2)');
    cloud(ctx, 200 + ((t * 1.4) % 380), 48, 1, 'rgba(255,190,160,0.14)');
  }

  function fogBank(ctx, t, baseX, alpha) {
    for (let y = 0; y < H; y += 10) {
      const edge =
        baseX +
        Math.sin(y * 0.07 + t * 1.1) * 9 +
        Math.sin(y * 0.16 - t * 0.8) * 4;
      ctx.globalAlpha = Math.min(1, alpha * (0.55 + 0.35 * Math.sin(y * 0.11 + t * 2)));
      px(ctx, edge, y, W - edge, 12, '#b9c0ca');
    }
    ctx.globalAlpha = 1;
  }

  /* Scene 4 — the valley has gone silent */
  function silenceScene(ctx, t) {
    bandSky(ctx, ['#181c26', '#242a36', '#3a404c', '#5b616c', '#6f747d']);
    disc(ctx, 268, 52, 18, 'rgba(200,205,215,0.12)');
    disc(ctx, 268, 52, 8, '#9aa1ab');

    hills(ctx, '#3a404d', 108, 9, 0.019, 50);
    hills(ctx, '#303642', 124, 7, 0.024, 130);

    // Dead village, dark windows.
    house(ctx, 20, 128, 17, 14, '#2b303b', '#3a3f4b', false);
    house(ctx, 42, 131, 21, 17, '#272c37', '#363b46', false);
    house(ctx, 68, 127, 13, 11, '#2b303b', '#3a3f4b', false);
    house(ctx, 84, 130, 18, 15, '#272c37', '#363b46', false);
    house(ctx, 208, 128, 16, 13, '#2b303b', '#3a3f4b', false);
    house(ctx, 228, 131, 20, 16, '#272c37', '#363b46', false);
    house(ctx, 254, 127, 14, 12, '#2b303b', '#3a3f4b', false);
    house(ctx, 272, 130, 19, 15, '#272c37', '#363b46', false);

    // Bell tower with a silent bell.
    px(ctx, 148, 86, 24, 44, '#3d424e');
    px(ctx, 144, 80, 32, 7, '#4a4f5b');
    px(ctx, 154, 72, 12, 9, '#343946');
    px(ctx, 160, 68, 2, 5, '#4a4f5b');
    px(ctx, 156, 100, 8, 4, '#20252f');
    px(ctx, 153, 104, 14, 10, '#5a606b');
    px(ctx, 151, 114, 18, 2, '#4a4f5a');
    px(ctx, 159, 116, 2, 3, '#262b35');
    px(ctx, 158, 93, 4, 2, '#5a606b');

    hills(ctx, '#242a34', 150, 8, 0.023, 220);
    hills(ctx, '#191e27', 164, 6, 0.029, 310);

    // Ground mist drifts behind the last villagers.
    ctx.globalAlpha = 0.16;
    for (let i = 0; i < 5; i += 1) {
      const mx = (i * 73 + t * 6) % (W + 60) - 30;
      disc(ctx, mx, 158 + Math.sin(t + i) * 2, 22, '#c3c9d2');
    }
    ctx.globalAlpha = 1;

    // People who forgot how to sing.
    villager(ctx, 176, 156, { shirt: '#3b4554', hair: '#2d323d', bob: 0 });
    villager(ctx, 202, 160, { shirt: '#444e5e', hair: '#2a2f39', bob: 0 });
    villager(ctx, 228, 158, { shirt: '#37414f', hair: '#2f3540', bob: 0 });

    // A single grey note falls.
    const fall = (t * 7) % 60;
    note(ctx, 188 + Math.sin(t * 1.6) * 5, 48 + fall, '#9aa2ad', 1);

    // Slow dust.
    for (let i = 0; i < 10; i += 1) {
      const dx = (i * 33 + t * 2.5) % W;
      const dy = 60 + ((i * 47 + t * 4) % 90);
      px(ctx, dx, dy, 1, 1, 'rgba(190,198,210,0.4)');
    }
  }

  /* Scene 5 — alone with a guitar he forgot how to play */
  function aloneScene(ctx, t) {
    bandSky(ctx, ['#151a26', '#232a38', '#364050', '#4d5666', '#626a78']);
    stars(ctx, t, [
      [24, 16, 1], [58, 30, 1], [96, 12, 1], [132, 26, 1],
      [176, 18, 1], [222, 32, 1], [292, 14, 1], [310, 40, 1]
    ], '#c5cbd5');

    disc(ctx, 258, 50, 24, 'rgba(200,206,216,0.10)');
    disc(ctx, 258, 50, 13, '#9aa2ad');
    disc(ctx, 258, 50, 8, '#c5cbd5');

    hills(ctx, '#3a4352', 106, 10, 0.019, 40);
    hills(ctx, '#2f3744', 122, 8, 0.024, 120);

    // Dead tree on the right.
    px(ctx, 276, 92, 5, 72, '#202630');
    px(ctx, 266, 96, 10, 5, '#202630');
    px(ctx, 281, 78, 4, 20, '#202630');
    px(ctx, 272, 82, 11, 4, '#202630');
    px(ctx, 284, 68, 3, 14, '#202630');
    px(ctx, 276, 62, 11, 3, '#202630');
    px(ctx, 287, 54, 2, 10, '#202630');
    px(ctx, 294, 46, 2, 9, '#202630');
    px(ctx, 268, 58, 2, 10, '#202630');
    px(ctx, 258, 48, 2, 10, '#202630');
    px(ctx, 252, 42, 8, 2, '#202630');

    hills(ctx, '#252c37', 146, 8, 0.024, 210);
    hills(ctx, '#181e27', 162, 6, 0.03, 300);

    // Ground mist drifts through behind the stone seat.
    ctx.globalAlpha = 0.18;
    for (let i = 0; i < 5; i += 1) {
      const mx = (i * 79 + t * 7) % (W + 70) - 35;
      disc(ctx, mx, 164 + Math.sin(t * 0.8 + i) * 2, 24, '#b7bdc7');
    }
    ctx.globalAlpha = 1;

    // Stone seat.
    px(ctx, 150, 152, 74, 10, '#3a414c');
    px(ctx, 156, 146, 62, 7, '#4a525f');
    px(ctx, 156, 146, 62, 1, '#6b7484');
    px(ctx, 164, 142, 46, 5, '#5c6575');
    px(ctx, 176, 140, 22, 3, '#6b7484');
    px(ctx, 146, 160, 82, 4, '#2b303a');
    px(ctx, 154, 158, 9, 6, '#333a45');
    px(ctx, 210, 158, 9, 6, '#333a45');

    // Melodrio sits, guitar on his knee.
    drawMelodrio(ctx, 172, 152, {
      scale: 1.25,
      sit: true,
      bob: Math.round(Math.sin(t * 1.2) * 0.6),
      guitarBob: 4
    });

    // One lost note and a few dust motes.
    const drift = (t * 5) % 70;
    note(ctx, 222 + Math.sin(t * 1.2) * 6, 46 + drift, 'rgba(170,177,188,0.55)', 1);

    for (let i = 0; i < 12; i += 1) {
      const dx = (i * 29 + t * 2) % W;
      const dy = 64 + ((i * 41 + t * 3) % 100);
      px(ctx, dx, dy, 1, 1, 'rgba(190,198,210,0.3)');
    }
  }

  /* Scene 6 — a tiny spark above the guitar */
  function sparkScene(ctx, t) {
    bandSky(ctx, ['#0a0818', '#121024', '#1c1a33', '#292640', '#39364e']);
    stars(ctx, t, [
      [20, 14, 1], [48, 28, 1], [80, 10, 1], [112, 24, 1], [148, 16, 1],
      [184, 30, 1], [214, 12, 1], [248, 26, 1], [286, 18, 1], [310, 38, 1]
    ], '#c5cbd5');

    disc(ctx, 264, 44, 19, 'rgba(200,206,216,0.10)');
    disc(ctx, 264, 44, 9, '#9aa2ad');

    hills(ctx, '#252b39', 104, 10, 0.019, 30);
    hills(ctx, '#1c2230', 124, 8, 0.024, 110);

    // Bare tree on the left.
    px(ctx, 26, 96, 5, 68, '#151a24');
    px(ctx, 18, 100, 8, 4, '#151a24');
    px(ctx, 31, 82, 3, 16, '#151a24');
    px(ctx, 22, 86, 9, 3, '#151a24');
    px(ctx, 34, 72, 2, 12, '#151a24');
    px(ctx, 28, 66, 9, 2, '#151a24');
    px(ctx, 12, 70, 8, 2, '#151a24');
    px(ctx, 8, 60, 2, 11, '#151a24');

    hills(ctx, '#161c28', 148, 8, 0.024, 210);
    hills(ctx, '#0f141e', 164, 6, 0.03, 300);

    // The spark.
    const pulse = 0.5 + Math.sin(t * 2.6) * 0.5;
    const sx = 122 + Math.round(Math.sin(t * 0.8) * 3);
    const sy = 98 + Math.round(Math.cos(t * 1.1) * 2);

    px(ctx, sx - 1, sy - 40, 2, 50, 'rgba(255,209,102,0.04)');
    px(ctx, sx - 3, sy - 30, 6, 40, 'rgba(255,209,102,0.05)');

    disc(ctx, sx, sy, 30 + pulse * 6, 'rgba(255,180,70,0.05)');
    disc(ctx, sx, sy, 20 + pulse * 4, 'rgba(255,200,90,0.10)');
    disc(ctx, sx, sy, 12 + pulse * 2, 'rgba(255,220,130,0.22)');
    disc(ctx, sx, sy, 5 + pulse * 2, '#ffe8a3');
    disc(ctx, sx, sy, 2, '#fff8dc');

    note(ctx, sx + 1, sy - 26, '#ffe39a', 1);

    // Orbiting motes.
    for (let i = 0; i < 7; i += 1) {
      const a = t * 1.4 + i * 0.9;
      const rad = 16 + (i % 3) * 8;
      const ox = sx + Math.cos(a) * rad;
      const oy = sy + Math.sin(a) * rad * 0.6;
      px(ctx, ox, oy, i % 2 ? 1 : 2, i % 2 ? 1 : 2, 'rgba(255,232,163,0.8)');
    }

    // Melodrio, lit only by the little spark.
    drawMelodrio(ctx, 170, 162, {
      scale: 1.5,
      bob: Math.round(Math.sin(t * 2) * 1),
      strum: t * 2
    });

    // Light catches the guitar.
    ctx.globalAlpha = 0.12 + pulse * 0.1;
    disc(ctx, 194, 140, 22, '#ffd166');
    ctx.globalAlpha = 1;

    // Low mist.
    ctx.globalAlpha = 0.12;
    for (let i = 0; i < 4; i += 1) {
      const mx = (i * 91 + t * 5) % (W + 60) - 30;
      disc(ctx, mx, 168, 26, '#b7bdc7');
    }
    ctx.globalAlpha = 1;
  }

  /* Scene 7 — the first note pushes the grey away */
  function greyMask(ctx, cx, cy, radius, alpha) {
    ctx.fillStyle = '#707783';
    ctx.globalAlpha = alpha;
    for (let y = 0; y < H; y += 2) {
      const dy = y - cy;
      const half = Math.abs(dy) < radius
        ? Math.floor(Math.sqrt(radius * radius - dy * dy))
        : 0;
      if (half <= 0) {
        ctx.fillRect(0, y, W, 2);
      } else {
        ctx.fillRect(0, y, Math.max(0, cx - half), 2);
        ctx.fillRect(cx + half, y, Math.max(0, W - (cx + half)), 2);
      }
    }
    ctx.globalAlpha = 1;
  }

  function firstNoteScene(ctx, t) {
    bandSky(ctx, ['#100d2b', '#241846', '#432a5a', '#7a4463', '#c47368', '#f3b86e']);
    stars(ctx, t, [[22, 14, 1], [56, 26, 1], [94, 10, 1], [136, 22, 1], [206, 12, 1], [248, 24, 1], [300, 16, 1]], '#ffe8ad');

    disc(ctx, 250, 58, 24, 'rgba(255,209,120,0.12)');
    disc(ctx, 250, 58, 13, '#ffe8a3');
    disc(ctx, 250, 58, 7, '#fff3c7');

    cloud(ctx, 30 + ((t * 2) % 380), 30, 1, 'rgba(255,190,160,0.25)');
    cloud(ctx, 190 + ((t * 1.3) % 380), 48, 1, 'rgba(255,190,160,0.18)');

    hills(ctx, '#34234f', 104, 10, 0.019, 40);
    hills(ctx, '#1d3f49', 122, 8, 0.023, 120);

    house(ctx, 206, 124, 15, 12, '#241a3c', '#3a2452', C.gold);
    house(ctx, 224, 127, 19, 15, '#201635', '#342046', '#ffc85c');
    house(ctx, 248, 123, 13, 11, '#251b3e', '#3c2754', C.gold);
    house(ctx, 264, 126, 18, 14, '#1d1533', '#332045', C.gold);
    house(ctx, 286, 124, 14, 12, '#241a3c', '#3a2452', '#ffc85c');

    px(ctx, 226, 106, 3, 8, '#19112b');
    for (let i = 0; i < 4; i += 1) {
      const rise = (t * 10 + i * 15) % 55;
      note(ctx, 228 + Math.sin(t + i) * 3, 112 - rise, i % 2 ? C.gold : C.goldLight, 1);
    }

    hills(ctx, '#173c38', 150, 8, 0.024, 210);
    hills(ctx, '#102822', 164, 6, 0.03, 300);

    // The grey still covers everything except the growing circle of music.
    const cx = 190;
    const cy = 108;
    const reveal = 58 + Math.sin(t * 1.8) * 5;
    greyMask(ctx, cx, cy, reveal, 0.82);

    // Melodrio plays the first note.
    drawMelodrio(ctx, 168, 156, {
      scale: 1.5,
      bob: Math.round(Math.sin(t * 3) * 1),
      strum: t * 6
    });

    // Expanding rings of sound.
    for (let i = 0; i < 4; i += 1) {
      const rad = 18 + ((t * 28 + i * 26) % 96);
      const fade = Math.max(0, 1 - rad / 112);
      ctx.globalAlpha = fade * 0.9;
      ring(ctx, cx, cy, rad, 2, i % 2 ? C.goldLight : C.gold);
    }
    ctx.globalAlpha = 1;

    circleSparkles(ctx, cx, cy, t);

    for (let i = 0; i < 5; i += 1) {
      const rise = (t * 15 + i * 13) % 58;
      note(ctx, 200 + Math.sin(t * 1.7 + i) * 7, 132 - rise, i % 2 ? C.goldLight : C.gold, 1);
    }
  }

  function circleSparkles(ctx, cx, cy, t) {
    for (let i = 0; i < 8; i += 1) {
      const a = t * 1.2 + i * 0.8;
      const rad = 14 + (i % 4) * 9;
      const x = cx + Math.cos(a) * rad;
      const y = cy + Math.sin(a) * rad * 0.7;
      px(ctx, x, y, i % 2 ? 1 : 2, i % 2 ? 1 : 2, 'rgba(255,232,163,0.85)');
    }
  }

  /* Scene 8 — the road back to the villages */
  function journeyScene(ctx, t) {
    bandSky(ctx, ['#101127', '#2b1c49', '#4b2c5c', '#7d4763', '#bd7069', '#efb271']);
    disc(ctx, 252, 64, 27, 'rgba(255,215,140,0.13)');
    disc(ctx, 252, 64, 13, '#ffe8a3');
    disc(ctx, 252, 64, 7, '#fff3c7');

    cloud(ctx, 34 + ((t * 2.2) % 380), 30, 1, 'rgba(255,200,170,0.24)');
    cloud(ctx, 216 + ((t * 1.4) % 380), 50, 1, 'rgba(255,200,170,0.16)');

    hills(ctx, '#3d3b69', 104, 11, 0.018, 40);
    hills(ctx, '#2c5057', 122, 9, 0.022, 120);

    house(ctx, 250, 124, 14, 11, '#241a3c', '#3a2452', C.gold);
    house(ctx, 266, 127, 18, 15, '#201635', '#342046', '#ffc85c');
    house(ctx, 286, 123, 13, 11, '#251b3e', '#3c2754', C.gold);
    house(ctx, 300, 126, 15, 13, '#1d1533', '#332045', C.gold);

    hills(ctx, '#245043', 148, 8, 0.023, 210);
    hills(ctx, '#173326', 164, 6, 0.03, 300);

    // Winding pixel road.
    for (let i = 0; i < 42; i += 1) {
      const p = i / 41;
      const rx = 56 + p * 208;
      const ry = 193 - p * 56 + Math.sin(p * 6) * 6;
      px(ctx, rx - 9, ry, 18, 4, '#3d2a35');
      px(ctx, rx - 6, ry, 12, 4, '#b57b4d');
      px(ctx, rx - 3, ry, 5, 1, 'rgba(255,227,166,0.3)');
    }

    // Birds follow the traveller.
    for (let i = 0; i < 3; i += 1) {
      const bx = 84 + ((t * 9 + i * 34) % 150);
      const by = 48 + Math.sin(t * 2.2 + i) * 4;
      bird(ctx, bx, by, '#2b2036', Math.floor(t * 5 + i) % 2 === 0);
    }

    // Melodrio walks on, one note at a time.
    const stride = t * 7;
    drawMelodrio(ctx, 170, 162, {
      scale: 1.35,
      walk: stride,
      bob: -Math.abs(Math.round(Math.sin(stride) * 1.5)),
      strum: t * 3
    });

    // Dust puffs behind his shoes.
    for (let i = 0; i < 4; i += 1) {
      const dp = (t * 1.6 + i * 0.25) % 1;
      px(ctx, 160 - dp * 26, 160 + Math.sin(i * 2) * 2, 2 + dp * 3, 2, `rgba(230,190,140,${0.3 * (1 - dp)})`);
    }

    // The Noise still lingers far to the right.
    ctx.globalAlpha = 0.18;
    disc(ctx, 306, 126, 34, '#8f97a3');
    disc(ctx, 318, 142, 26, '#8f97a3');
    ctx.globalAlpha = 1;

    // Golden notes drift ahead of him.
    for (let i = 0; i < 4; i += 1) {
      const rise = (t * 12 + i * 16) % 50;
      note(ctx, 198 + Math.sin(t * 1.3 + i) * 6, 138 - rise, i % 2 ? C.goldLight : C.gold, 1);
    }
  }

  /* Scene 9 — colour and song return */
  function returnScene(ctx, t) {
    bandSky(ctx, ['#15102e', '#3b2259', '#6b3a64', '#a85a68', '#e08d69', '#ffc47a']);
    disc(ctx, 254, 74, 28, 'rgba(255,209,120,0.14)');
    disc(ctx, 254, 74, 14, '#ffe8a3');
    disc(ctx, 254, 74, 8, '#fff3c7');

    cloud(ctx, 34 + ((t * 2.4) % 380), 28, 1, 'rgba(255,205,170,0.26)');
    cloud(ctx, 208 + ((t * 1.2) % 380), 46, 1, 'rgba(255,205,170,0.16)');

    hills(ctx, '#3a2c4f', 108, 10, 0.019, 40);
    hills(ctx, '#2b3344', 124, 8, 0.023, 120);

    house(ctx, 30, 126, 15, 12, '#3a2546', '#4f3158', C.gold);
    house(ctx, 48, 129, 18, 15, '#33203f', '#482c50', '#ffc85c');
    house(ctx, 70, 125, 13, 10, '#3a2546', '#4f3158', C.gold);
    house(ctx, 84, 128, 17, 14, '#33203f', '#482c50', C.gold);
    house(ctx, 238, 126, 15, 12, '#3a2546', '#4f3158', '#ffc85c');
    house(ctx, 256, 129, 19, 16, '#33203f', '#482c50', C.gold);
    house(ctx, 282, 125, 13, 10, '#3a2546', '#4f3158', C.gold);
    house(ctx, 296, 128, 17, 14, '#33203f', '#482c50', '#ffc85c');

    // Strings of warm lights between the houses.
    for (let i = 0; i < 14; i += 1) {
      px(ctx, 62 + i * 16, 108 + Math.round(Math.sin(i * 0.8) * 3), 1, 1, 'rgba(80,50,60,0.7)');
      if ((i + Math.floor(t * 3)) % 3 !== 0) {
        px(ctx, 62 + i * 16, 109 + Math.round(Math.sin(i * 0.8) * 3), 2, 2, C.gold);
      }
    }

    hills(ctx, '#28523f', 148, 8, 0.023, 210);
    hills(ctx, '#193628', 164, 6, 0.03, 300);

    // Villagers dance again.
    villager(ctx, 210, 156, {
      shirt: '#5a3e70',
      hair: '#3a2820',
      armsUp: true,
      bob: Math.round(Math.sin(t * 5) * 2)
    });
    villager(ctx, 236, 160, {
      shirt: '#70405f',
      hair: '#2f211d',
      armsUp: true,
      bob: Math.round(Math.sin(t * 5 + 2) * 2)
    });
    villager(ctx, 252, 158, {
      shirt: '#4c3a67',
      hair: '#4a2a1a',
      armsUp: true,
      bob: Math.round(Math.sin(t * 5 + 4) * 2)
    });

    // Melodrio plays the valley back to life.
    drawMelodrio(ctx, 168, 162, {
      scale: 1.5,
      bob: -Math.abs(Math.round(Math.sin(t * 3) * 1.5)),
      strum: t * 6
    });

    for (let i = 0; i < 7; i += 1) {
      const rise = (t * 17 + i * 12) % 66;
      note(ctx, 176 + Math.sin(t * 1.4 + i) * 8 + (i % 3) * 8, 138 - rise, i % 2 ? C.goldLight : C.gold, 1);
    }

    circleSparkles(ctx, 194, 116, t);

    for (let i = 0; i < 3; i += 1) {
      const bx = 96 + ((t * 8 + i * 42) % 160);
      const by = 52 + Math.sin(t * 2 + i) * 4;
      bird(ctx, bx, by, '#2b2036', Math.floor(t * 5 + i) % 2 === 0);
    }
  }

  /* Scene 10 — your journey begins */
  function beginningScene(ctx, t) {
    bandSky(ctx, ['#0d0a26', '#241847', '#4a2a5b', '#8e4d73', '#e98d63', '#ffd68a']);
    stars(ctx, t, [[20, 12, 1], [52, 24, 1], [86, 10, 1], [228, 12, 1], [264, 24, 1], [298, 14, 1]], '#ffe8ad');

    // Rays around the rising sun.
    for (let k = 0; k < 10; k += 1) {
      const a = (k / 10) * Math.PI * 2;
      for (let r = 28; r < 120; r += 5) {
        px(ctx, 160 + Math.cos(a) * r, 104 + Math.sin(a) * r * 0.55, 1, 1, 'rgba(255,230,170,0.08)');
      }
    }

    disc(ctx, 160, 104, 58, 'rgba(255,209,120,0.10)');
    disc(ctx, 160, 104, 34, 'rgba(255,214,138,0.18)');
    disc(ctx, 160, 104, 18, '#ffe8a3');
    disc(ctx, 160, 104, 10, '#fff6cf');

    cloud(ctx, 20 + ((t * 1.6) % 360), 32, 1, 'rgba(255,205,170,0.2)');
    cloud(ctx, 230 + ((t * 1.1) % 360), 48, 1, 'rgba(255,205,170,0.14)');

    hills(ctx, '#3d3b69', 112, 10, 0.018, 40);
    hills(ctx, '#2b5960', 130, 8, 0.022, 120);
    hills(ctx, '#23563f', 150, 8, 0.023, 210);
    hills(ctx, '#0c2118', 166, 6, 0.03, 300);

    house(ctx, 34, 130, 15, 12, '#241a3c', '#3a2452', C.gold);
    house(ctx, 52, 133, 18, 15, '#201635', '#342046', '#ffc85c');
    house(ctx, 74, 129, 13, 11, '#251b3e', '#3c2754', C.gold);
    house(ctx, 246, 129, 15, 12, '#241a3c', '#3a2452', '#ffc85c');
    house(ctx, 264, 132, 19, 15, '#201635', '#342046', C.gold);
    house(ctx, 288, 128, 14, 11, '#251b3e', '#3c2754', C.gold);

    // The path widens toward the viewer.
    for (let y = 124; y < 180; y += 2) {
      const p = (y - 124) / 56;
      const half = 4 + p * 28;
      px(ctx, 160 - half, y, half * 2, 2, '#4c3342');
      px(ctx, 160 - half + 2, y, half * 2 - 4, 2, '#c48b52');
      px(ctx, 160 - half + 2, y, 2, 2, 'rgba(255,227,166,0.22)');
      px(ctx, 160 + half - 4, y, 2, 2, 'rgba(76,51,66,0.5)');
    }

    // Melodrio, big in the foreground, inviting the player along.
    // Keep his feet above the fixed control bar on all aspect ratios.
    drawMelodrio(ctx, 164, 166, {
      scale: 1.8,
      bob: Math.round(Math.sin(t * 2.2) * 1),
      strum: t * 4.5
    });

    // Notes climb toward the sunrise.
    for (let i = 0; i < 8; i += 1) {
      const rise = (t * 15 + i * 11) % 76;
      note(ctx, 104 + Math.sin(t * 1.3 + i) * 10 + (i % 4) * 26, 142 - rise, i % 2 ? C.goldLight : C.gold, 1);
    }

    for (let i = 0; i < 12; i += 1) {
      const sx = (i * 27 + t * 4) % W;
      const sy = 70 + ((i * 43 + t * 3) % 100);
      px(ctx, sx, sy, i % 3 === 0 ? 2 : 1, i % 3 === 0 ? 2 : 1, 'rgba(255,232,163,0.55)');
    }

    for (let i = 0; i < 3; i += 1) {
      const bx = 62 + ((t * 7 + i * 38) % 200);
      const by = 44 + Math.sin(t * 2.2 + i) * 4;
      bird(ctx, bx, by, '#2b2036', Math.floor(t * 5 + i) % 2 === 0);
    }
  }

  const scenes = [
    valleyScene,
    morningScene,
    noiseScene,
    silenceScene,
    aloneScene,
    sparkScene,
    firstNoteScene,
    journeyScene,
    returnScene,
    beginningScene
  ];

  /* ------------------------------------------------------------------------
     Engine
     ------------------------------------------------------------------------ */

  const engine = {
    canvas: null,
    ctx: null,
    scene: 0,
    sceneStart: 0,
    raf: 0,
    running: false,

    init(canvas) {
      if (!canvas) return;
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      if (this.ctx) this.ctx.imageSmoothingEnabled = false;
    },

    setScene(index) {
      this.scene = Math.max(0, Math.min(scenes.length - 1, index));
      this.sceneStart = performance.now();
      if (!this.running) this.drawAt(this.sceneStart);
    },

    start() {
      if (!this.canvas || this.running) return;
      this.running = true;
      this.sceneStart = performance.now();

      const loop = (now) => {
        if (!this.running) return;
        this.drawAt(now);
        this.raf = window.requestAnimationFrame(loop);
      };

      this.raf = window.requestAnimationFrame(loop);
    },

    stop() {
      this.running = false;
      if (this.raf) {
        window.cancelAnimationFrame(this.raf);
        this.raf = 0;
      }
    },

    drawAt(now) {
      const ctx = this.ctx;
      if (!ctx) return;

      const elapsed = Math.max(0, (now - this.sceneStart) / 1000);
      const t = reduceMotion ? 0 : elapsed;
      const scene = scenes[this.scene] || scenes[0];

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.imageSmoothingEnabled = false;
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, W, H);
      scene(ctx, t);
    }
  };

  window.PixelStory = engine;
})();
