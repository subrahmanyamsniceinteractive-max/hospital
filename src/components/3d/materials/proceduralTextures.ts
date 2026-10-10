import * as THREE from 'three';

/**
 * Procedural PBR Texture Generator for Photorealistic Medical & Architectural Surfaces
 * Generates high-resolution normal, bump, roughness, and display textures
 */

// Cached textures to avoid re-generating
const textureCache: Record<string, THREE.CanvasTexture> = {};

/**
 * Generates a photorealistic micro-grain surface normal/roughness map
 */
export function getMicroNoiseTexture(): THREE.CanvasTexture {
  if (textureCache['micro_noise']) return textureCache['micro_noise'];

  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const imgData = ctx.createImageData(size, size);
  for (let i = 0; i < imgData.data.length; i += 4) {
    const val = 128 + (Math.random() * 30 - 15);
    imgData.data[i] = val;     // R
    imgData.data[i + 1] = val; // G
    imgData.data[i + 2] = 255; // B (normal points mostly Z)
    imgData.data[i + 3] = 255; // A
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(12, 12);
  textureCache['micro_noise'] = texture;
  return texture;
}

/**
 * Generates a polished hospital terrazzo/tile floor texture with subtle grout lines
 */
export function getHospitalFloorTexture(): THREE.CanvasTexture {
  if (textureCache['hospital_floor']) return textureCache['hospital_floor'];

  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Light neutral clinical stone base
  ctx.fillStyle = '#111827';
  ctx.fillRect(0, 0, size, size);

  // Subtle aggregate speckles
  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const radius = Math.random() * 1.5;
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(56, 189, 248, 0.05)' : 'rgba(255, 255, 255, 0.04)';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // Fine architectural tile grid (1200mm tiles)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, size, size);
  ctx.strokeRect(0, 0, size / 2, size / 2);
  ctx.strokeRect(size / 2, size / 2, size / 2, size / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 8);
  textureCache['hospital_floor'] = texture;
  return texture;
}

/**
 * Generates asphalt road texture with realistic aggregate roughness
 */
export function getAsphaltTexture(): THREE.CanvasTexture {
  if (textureCache['asphalt']) return textureCache['asphalt'];

  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#1e232d';
  ctx.fillRect(0, 0, size, size);

  const imgData = ctx.getImageData(0, 0, size, size);
  for (let i = 0; i < imgData.data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 25;
    imgData.data[i] = Math.max(0, Math.min(255, imgData.data[i] + noise));
    imgData.data[i + 1] = Math.max(0, Math.min(255, imgData.data[i + 1] + noise));
    imgData.data[i + 2] = Math.max(0, Math.min(255, imgData.data[i + 2] + noise));
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(16, 16);
  textureCache['asphalt'] = texture;
  return texture;
}

/**
 * Generates brushed stainless steel micro-groove texture
 */
export function getBrushedMetalTexture(): THREE.CanvasTexture {
  if (textureCache['brushed_metal']) return textureCache['brushed_metal'];

  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#888888';
  ctx.fillRect(0, 0, size, size);

  // Fine horizontal brushing lines
  for (let y = 0; y < size; y++) {
    const alpha = (Math.random() * 0.15);
    ctx.fillStyle = Math.random() > 0.5 ? `rgba(255,255,255,${alpha})` : `rgba(0,0,0,${alpha})`;
    ctx.fillRect(0, y, size, 1);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  textureCache['brushed_metal'] = texture;
  return texture;
}

/**
 * Generates real clinical ECG & multi-lead monitor UI texture
 */
export function getPatientMonitorScreenTexture(): THREE.CanvasTexture {
  if (textureCache['monitor_ui']) return textureCache['monitor_ui'];

  const width = 1024;
  const height = 640;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Deep obsidian medical background
  ctx.fillStyle = '#050811';
  ctx.fillRect(0, 0, width, height);

  // Medical header status bar
  ctx.fillStyle = '#0c1322';
  ctx.fillRect(0, 0, width, 44);
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 16px monospace';
  ctx.fillText('BED 04 • ICU CRITICAL • HR ALARMS ON • PACER: OFF', 24, 28);
  ctx.fillStyle = '#10b981';
  ctx.fillText('100% BATTERY • WI-FI 6 CONNECTED', 720, 28);

  // Waveform Channels
  // Channel 1: Lead II ECG (Green)
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 3;
  ctx.beginPath();
  let ecgY = 120;
  for (let x = 0; x < 720; x++) {
    let dy = 0;
    const cycle = x % 160;
    if (cycle > 40 && cycle < 55) dy = -12; // P wave
    else if (cycle >= 65 && cycle < 70) dy = 6;  // Q wave
    else if (cycle >= 70 && cycle < 80) dy = -52; // R spike
    else if (cycle >= 80 && cycle < 85) dy = 16;  // S wave
    else if (cycle >= 100 && cycle < 125) dy = -18; // T wave
    const y = ecgY + dy;
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // ECG Numeric Box
  ctx.fillStyle = '#22c55e';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText('HR /min', 760, 95);
  ctx.font = 'bold 64px monospace';
  ctx.fillText('72', 760, 155);

  // Channel 2: Pleth SpO2 (Cyan)
  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = 3;
  ctx.beginPath();
  let spo2Y = 240;
  for (let x = 0; x < 720; x++) {
    const cycle = (x % 160) / 160;
    const dy = Math.sin(cycle * Math.PI) * -38;
    const y = spo2Y + (cycle < 0.6 ? dy : dy * 0.3);
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.fillStyle = '#06b6d4';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText('SpO2 %', 760, 215);
  ctx.font = 'bold 64px monospace';
  ctx.fillText('99', 760, 275);

  // Channel 3: Arterial Pressure ART (Red)
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 3;
  ctx.beginPath();
  let artY = 360;
  for (let x = 0; x < 720; x++) {
    const cycle = (x % 160) / 160;
    const dy = Math.sin(cycle * Math.PI * 1.5) * -32;
    const y = artY + (cycle < 0.5 ? dy : dy * 0.2);
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.fillStyle = '#ef4444';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText('ART mmHg', 760, 335);
  ctx.font = 'bold 52px monospace';
  ctx.fillText('120/80', 760, 395);
  ctx.font = 'bold 24px monospace';
  ctx.fillText('(93)', 930, 395);

  // Channel 4: Capnography EtCO2 (Yellow)
  ctx.strokeStyle = '#eab308';
  ctx.lineWidth = 3;
  ctx.beginPath();
  let etco2Y = 480;
  for (let x = 0; x < 720; x++) {
    const cycle = x % 240;
    let dy = 0;
    if (cycle > 50 && cycle < 160) dy = -30; // Alveolar plateau
    const y = etco2Y + dy;
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.fillStyle = '#eab308';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText('EtCO2 mmHg', 760, 465);
  ctx.font = 'bold 56px monospace';
  ctx.fillText('38', 760, 520);

  // Bottom parameters
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 560, width, 80);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px monospace';
  ctx.fillText('NIBP: 118/78 (Auto 15m)   RESP: 14 /min   TEMP: 37.1 °C   ST-II: +0.02 mV', 24, 608);

  const texture = new THREE.CanvasTexture(canvas);
  textureCache['monitor_ui'] = texture;
  return texture;
}

/**
 * Generates authentic mechanical ventilator waveform screen texture
 */
export function getVentilatorScreenTexture(): THREE.CanvasTexture {
  if (textureCache['vent_ui']) return textureCache['vent_ui'];

  const width = 1024;
  const height = 640;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#080d18';
  ctx.fillRect(0, 0, width, height);

  // Header
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, width, 40);
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('ASV 1.1 • ADULT 70 kg • LUNG PROTECTIVE PROTOCOL • ACTIVE', 20, 26);

  // Pressure waveform (Yellow)
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let x = 0; x < 700; x++) {
    const cycle = (x % 220) / 220;
    let p = 140;
    if (cycle < 0.3) p -= cycle * 180;
    else if (cycle < 0.4) p -= 54;
    else p -= 15; // PEEP
    if (x === 0) ctx.moveTo(x, p);
    else ctx.lineTo(x, p);
  }
  ctx.stroke();

  // Flow waveform (Green)
  ctx.strokeStyle = '#4ade80';
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let x = 0; x < 700; x++) {
    const cycle = (x % 220) / 220;
    let f = 300;
    if (cycle < 0.3) f -= (1 - cycle * 3.3) * 60;
    else if (cycle < 0.6) f += (1 - (cycle - 0.3) * 3.3) * 45;
    if (x === 0) ctx.moveTo(x, f);
    else ctx.lineTo(x, f);
  }
  ctx.stroke();

  // Volume waveform (Cyan)
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let x = 0; x < 700; x++) {
    const cycle = (x % 220) / 220;
    let v = 460;
    if (cycle < 0.35) v -= Math.sin(cycle * Math.PI * 2.8) * 55;
    if (x === 0) ctx.moveTo(x, v);
    else ctx.lineTo(x, v);
  }
  ctx.stroke();

  // Right Numerical Metrics
  ctx.fillStyle = '#facc15';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('Ppeak cmH2O', 740, 100);
  ctx.font = 'bold 48px monospace';
  ctx.fillText('18.5', 740, 150);

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('Vte mL', 740, 230);
  ctx.font = 'bold 48px monospace';
  ctx.fillText('480', 740, 280);

  ctx.fillStyle = '#4ade80';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('PEEP cmH2O', 740, 360);
  ctx.font = 'bold 48px monospace';
  ctx.fillText('8.0', 740, 410);

  ctx.fillStyle = '#fb923c';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('FiO2 %', 740, 490);
  ctx.font = 'bold 48px monospace';
  ctx.fillText('40', 740, 540);

  const texture = new THREE.CanvasTexture(canvas);
  textureCache['vent_ui'] = texture;
  return texture;
}

/**
 * Generates authentic diagnostic ultrasound B-mode scan screen texture
 */
export function getUltrasoundScreenTexture(): THREE.CanvasTexture {
  if (textureCache['us_ui']) return textureCache['us_ui'];

  const width = 1024;
  const height = 640;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, width, height);

  // Ultrasound Sector Cone Fan
  ctx.save();
  ctx.translate(width / 2, 80);

  // Sector Clip
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(0, 0, 450, Math.PI * 0.35, Math.PI * 0.65);
  ctx.closePath();
  ctx.clip();

  // Grayscale Acoustic Speckle Background
  const coneImg = ctx.createImageData(width, 500);
  for (let i = 0; i < coneImg.data.length; i += 4) {
    const val = Math.random() * 55;
    coneImg.data[i] = val;
    coneImg.data[i + 1] = val;
    coneImg.data[i + 2] = val;
    coneImg.data[i + 3] = 255;
  }
  ctx.putImageData(coneImg, 0, 80);

  // Anatomical Heart / Vessel Echogenic Structures
  ctx.strokeStyle = '#dddddd';
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.ellipse(0, 220, 90, 130, 0.2, 0, Math.PI * 2);
  ctx.stroke();

  // Doppler Color Flow Jet (Red/Blue blood flow turbulent mapping)
  const grad = ctx.createRadialGradient(10, 220, 10, 10, 220, 70);
  grad.addColorStop(0, 'rgba(239, 68, 68, 0.75)');
  grad.addColorStop(0.6, 'rgba(59, 130, 246, 0.6)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(10, 220, 70, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  // Clinical Annotations Header
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 15px monospace';
  ctx.fillText('AETHER-SONOVISION 5000 • CARDIAC TTE • 3.5 MHz PUREWAVE • MI: 1.1 TIS: 0.8', 24, 35);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '13px monospace';
  ctx.fillText('FR: 58 Hz • 2D GAIN: 54 dB • D: 16.0 cm • EJECTION FRACTION: 62% [NORMAL]', 24, 60);

  // Depth ruler scale on side
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 2;
  for (let y = 100; y <= 550; y += 45) {
    ctx.beginPath();
    ctx.moveTo(900, y);
    ctx.lineTo(915, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  textureCache['us_ui'] = texture;
  return texture;
}

/**
 * Generates automotive radial tire tread normal/bump texture
 */
export function getTireTreadTexture(): THREE.CanvasTexture {
  if (textureCache['tire_tread']) return textureCache['tire_tread'];

  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#111111';
  ctx.fillRect(0, 0, size, size);

  // Circumferential water evacuation grooves
  ctx.fillStyle = '#000000';
  [40, 100, 156, 216].forEach((x) => {
    ctx.fillRect(x - 6, 0, 12, size);
  });

  // Angled lateral tread blocks & sipes
  ctx.strokeStyle = '#2a2a2a';
  ctx.lineWidth = 3;
  for (let y = 0; y < size; y += 16) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(40, y + 8);
    ctx.moveTo(40, y + 8);
    ctx.lineTo(100, y + 2);
    ctx.moveTo(100, y + 2);
    ctx.lineTo(156, y + 14);
    ctx.moveTo(156, y + 14);
    ctx.lineTo(216, y + 6);
    ctx.moveTo(216, y + 6);
    ctx.lineTo(256, y + 12);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 8);
  textureCache['tire_tread'] = texture;
  return texture;
}

/**
 * Generates photorealistic dermal pore & micro-crease skin normal map
 */
export function getSkinTexture(): THREE.CanvasTexture {
  if (textureCache['skin_normal']) return textureCache['skin_normal'];

  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const imgData = ctx.createImageData(size, size);
  for (let i = 0; i < imgData.data.length; i += 4) {
    // Subtle cellular micro-variations
    const nx = 128 + (Math.random() * 20 - 10);
    const ny = 128 + (Math.random() * 20 - 10);
    imgData.data[i] = nx;
    imgData.data[i + 1] = ny;
    imgData.data[i + 2] = 255; // Upward normal
    imgData.data[i + 3] = 255;
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 8);
  textureCache['skin_normal'] = texture;
  return texture;
}

/**
 * Generates realistic textile weave pattern for medical coats & scrubs
 */
export function getFabricWeaveTexture(): THREE.CanvasTexture {
  if (textureCache['fabric_weave']) return textureCache['fabric_weave'];

  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, size, size);

  // Cross-hatch fabric weave
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1;
  for (let i = 0; i < size; i += 4) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, size);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(size, i);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(16, 16);
  textureCache['fabric_weave'] = texture;
  return texture;
}

/**
 * Generates hexagonal mesh honeycomb pattern for vehicle radiator grilles
 */
export function getCarGrilleTexture(): THREE.CanvasTexture {
  if (textureCache['car_grille']) return textureCache['car_grille'];

  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#050505';
  ctx.fillRect(0, 0, size, size);

  ctx.strokeStyle = '#262626';
  ctx.lineWidth = 2;
  const r = 8;
  for (let y = 0; y < size + r; y += r * 1.5) {
    const offsetX = (Math.floor(y / (r * 1.5)) % 2) * (r * Math.sqrt(3) / 2);
    for (let x = -r; x < size + r; x += r * Math.sqrt(3)) {
      ctx.beginPath();
      for (let a = 0; a < 6; a++) {
        const angle = (a * Math.PI) / 3;
        const px = x + offsetX + r * Math.cos(angle);
        const py = y + r * Math.sin(angle);
        if (a === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 4);
  textureCache['car_grille'] = texture;
  return texture;
}

/**
 * Generates organic vertical tree bark ridges and furrowed crevices
 */
export function getTreeBarkTexture(): THREE.CanvasTexture {
  if (textureCache['tree_bark']) return textureCache['tree_bark'];

  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#3a271d';
  ctx.fillRect(0, 0, size, size);

  // Vertical furrowed ridges
  for (let x = 0; x < size; x += 6) {
    const w = 3 + Math.random() * 4;
    ctx.fillStyle = Math.random() > 0.5 ? '#241710' : '#4d3324';
    ctx.fillRect(x, 0, w, size);
  }

  const imgData = ctx.getImageData(0, 0, size, size);
  for (let i = 0; i < imgData.data.length; i += 4) {
    const grain = (Math.random() - 0.5) * 20;
    imgData.data[i] = Math.max(0, Math.min(255, imgData.data[i] + grain));
    imgData.data[i + 1] = Math.max(0, Math.min(255, imgData.data[i + 1] + grain));
    imgData.data[i + 2] = Math.max(0, Math.min(255, imgData.data[i + 2] + grain));
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 6);
  textureCache['tree_bark'] = texture;
  return texture;
}

/**
 * Generates traditional baked terracotta clay roof tiles (khaprail) with curved overlapping relief
 */
export function getTerracottaTileTexture(): THREE.CanvasTexture {
  if (textureCache['terracotta_tiles']) return textureCache['terracotta_tiles'];

  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#b45309';
  ctx.fillRect(0, 0, size, size);

  // Overlapping curved tile courses
  const rowHeight = 32;
  const colWidth = 24;

  for (let y = 0; y < size; y += rowHeight) {
    const isShifted = (y / rowHeight) % 2 === 1;
    const startX = isShifted ? -colWidth / 2 : 0;

    for (let x = startX; x < size + colWidth; x += colWidth) {
      // Tile body with gradient shadow
      const grad = ctx.createLinearGradient(x, y, x + colWidth, y);
      grad.addColorStop(0, '#78350f');
      grad.addColorStop(0.3, '#d97706');
      grad.addColorStop(0.7, '#b45309');
      grad.addColorStop(1, '#451a03');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x + 1, y + 1, colWidth - 2, rowHeight - 2, [3, 3, 0, 0]);
      ctx.fill();

      // Deep shadow under lower lip
      ctx.fillStyle = 'rgba(20, 10, 5, 0.4)';
      ctx.fillRect(x, y + rowHeight - 4, colWidth, 4);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  textureCache['terracotta_tiles'] = texture;
  return texture;
}

/**
 * Generates warm rustic earth/mud plaster wall texture with trowel texture
 */
export function getMudPlasterTexture(): THREE.CanvasTexture {
  if (textureCache['mud_plaster']) return textureCache['mud_plaster'];

  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Warm clay/ochre earth tone
  ctx.fillStyle = '#d4a373';
  ctx.fillRect(0, 0, size, size);

  const imgData = ctx.getImageData(0, 0, size, size);
  for (let i = 0; i < imgData.data.length; i += 4) {
    const val = (Math.random() - 0.5) * 35;
    imgData.data[i] = Math.max(0, Math.min(255, imgData.data[i] + val));
    imgData.data[i + 1] = Math.max(0, Math.min(255, imgData.data[i + 1] + val * 0.8));
    imgData.data[i + 2] = Math.max(0, Math.min(255, imgData.data[i + 2] + val * 0.6));
  }
  ctx.putImageData(imgData, 0, 0);

  // Organic straw and chaff flecks
  ctx.strokeStyle = '#a16207';
  ctx.lineWidth = 1;
  for (let i = 0; i < 200; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const len = 3 + Math.random() * 5;
    const ang = Math.random() * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(ang) * len, y + Math.sin(ang) * len);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  textureCache['mud_plaster'] = texture;
  return texture;
}

/**
 * Generates agricultural paddy/crop field texture with vibrant agricultural rows
 */
export function getPaddyFieldTexture(): THREE.CanvasTexture {
  if (textureCache['paddy_field']) return textureCache['paddy_field'];

  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Deep rich alluvial soil base
  ctx.fillStyle = '#22381e';
  ctx.fillRect(0, 0, size, size);

  // Parallel crop planting rows
  for (let y = 0; y < size; y += 16) {
    ctx.fillStyle = '#15803d';
    ctx.fillRect(0, y, size, 10);

    // Lighter green shoots
    for (let x = 0; x < size; x += 12) {
      ctx.fillStyle = '#4ade80';
      ctx.fillRect(x + (y % 8), y + 2, 4, 6);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 8);
  textureCache['paddy_field'] = texture;
  return texture;
}

/**
 * Generates rural dirt road shoulder / gravel texture
 */
export function getDirtRoadTexture(): THREE.CanvasTexture {
  if (textureCache['dirt_road']) return textureCache['dirt_road'];

  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#78593c';
  ctx.fillRect(0, 0, size, size);

  const imgData = ctx.getImageData(0, 0, size, size);
  for (let i = 0; i < imgData.data.length; i += 4) {
    const val = (Math.random() - 0.5) * 40;
    imgData.data[i] = Math.max(0, Math.min(255, imgData.data[i] + val));
    imgData.data[i + 1] = Math.max(0, Math.min(255, imgData.data[i + 1] + val * 0.9));
    imgData.data[i + 2] = Math.max(0, Math.min(255, imgData.data[i + 2] + val * 0.7));
  }
  ctx.putImageData(imgData, 0, 0);

  // Small pebbles and sand grains
  for (let i = 0; i < 300; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = 1 + Math.random() * 2;
    ctx.fillStyle = Math.random() > 0.5 ? '#a8896a' : '#45301d';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 6);
  textureCache['dirt_road'] = texture;
  return texture;
}

/**
 * Generates corrugated galvanized tin roof texture for village shops
 */
export function getTinRoofTexture(): THREE.CanvasTexture {
  if (textureCache['tin_roof']) return textureCache['tin_roof'];

  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#64748b';
  ctx.fillRect(0, 0, size, size);

  // Corrugation ridges
  for (let x = 0; x < size; x += 12) {
    const grad = ctx.createLinearGradient(x, 0, x + 12, 0);
    grad.addColorStop(0, '#334155');
    grad.addColorStop(0.5, '#cbd5e1');
    grad.addColorStop(1, '#1e293b');
    ctx.fillStyle = grad;
    ctx.fillRect(x, 0, 12, size);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 2);
  textureCache['tin_roof'] = texture;
  return texture;
}

/**
 * Generates worn Andhra Pradesh bitumen/asphalt road texture with tar seams and aggregate
 */
export function getAPRoadTexture(): THREE.CanvasTexture {
  if (textureCache['ap_road']) return textureCache['ap_road'];

  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Dark weathered bitumen base
  ctx.fillStyle = '#26282b';
  ctx.fillRect(0, 0, size, size);

  // Road aggregate speckling
  const imgData = ctx.getImageData(0, 0, size, size);
  for (let i = 0; i < imgData.data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 36;
    imgData.data[i] = Math.max(0, Math.min(255, imgData.data[i] + noise));
    imgData.data[i + 1] = Math.max(0, Math.min(255, imgData.data[i + 1] + noise));
    imgData.data[i + 2] = Math.max(0, Math.min(255, imgData.data[i + 2] + noise));
  }
  ctx.putImageData(imgData, 0, 0);

  // Subtle tar repair patches and micro-cracks
  ctx.strokeStyle = '#1a1b1d';
  ctx.lineWidth = 1.5;
  for (let p = 0; p < 8; p++) {
    const sx = Math.random() * size;
    const sy = Math.random() * size;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.bezierCurveTo(
      sx + (Math.random() - 0.5) * 60,
      sy + (Math.random() - 0.5) * 60,
      sx + (Math.random() - 0.5) * 80,
      sy + (Math.random() - 0.5) * 80,
      sx + (Math.random() - 0.5) * 100,
      sy + (Math.random() - 0.5) * 100
    );
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 16);
  textureCache['ap_road'] = texture;
  return texture;
}

/**
 * Generates authentic Andhra Pradesh laterite red soil (erra mannu) road shoulder
 */
export function getRedSoilTexture(): THREE.CanvasTexture {
  if (textureCache['red_soil']) return textureCache['red_soil'];

  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Rich Andhra laterite red earth base
  ctx.fillStyle = '#9c4424';
  ctx.fillRect(0, 0, size, size);

  const imgData = ctx.getImageData(0, 0, size, size);
  for (let i = 0; i < imgData.data.length; i += 4) {
    const val = (Math.random() - 0.5) * 45;
    imgData.data[i] = Math.max(0, Math.min(255, imgData.data[i] + val));
    imgData.data[i + 1] = Math.max(0, Math.min(255, imgData.data[i + 1] + val * 0.7));
    imgData.data[i + 2] = Math.max(0, Math.min(255, imgData.data[i + 2] + val * 0.5));
  }
  ctx.putImageData(imgData, 0, 0);

  // Gravel pebbles and laterite nodules
  for (let i = 0; i < 500; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = 0.8 + Math.random() * 2.5;
    ctx.fillStyle = Math.random() > 0.4 ? '#b85d38' : '#6b2d16';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 12);
  textureCache['red_soil'] = texture;
  return texture;
}

/**
 * Generates coastal Andhra / Mangalore clay roof tile texture
 */
export function getMangaloreTileTexture(): THREE.CanvasTexture {
  if (textureCache['mangalore_tile']) return textureCache['mangalore_tile'];

  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#b45309';
  ctx.fillRect(0, 0, size, size);

  // Interlocking roof tile ribs
  const tileH = 32;
  for (let y = 0; y < size; y += tileH) {
    const grad = ctx.createLinearGradient(0, y, 0, y + tileH);
    grad.addColorStop(0, '#78350f');
    grad.addColorStop(0.3, '#c2410c');
    grad.addColorStop(0.7, '#ea580c');
    grad.addColorStop(1, '#451a03');
    ctx.fillStyle = grad;
    ctx.fillRect(0, y, size, tileH - 2);

    // Weathering moss and kiln shadow accents
    for (let x = 0; x < size; x += 48) {
      ctx.fillStyle = 'rgba(69, 26, 3, 0.4)';
      ctx.fillRect(x, y, 2, tileH);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 6);
  textureCache['mangalore_tile'] = texture;
  return texture;
}

/**
 * Generates traditional lime-washed village masonry with weathering
 */
export function getLimestoneWashTexture(): THREE.CanvasTexture {
  if (textureCache['limestone_wash']) return textureCache['limestone_wash'];

  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Warm off-white limestone plaster base
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, size, size);

  const imgData = ctx.getImageData(0, 0, size, size);
  for (let i = 0; i < imgData.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 22;
    imgData.data[i] = Math.max(0, Math.min(255, imgData.data[i] + n));
    imgData.data[i + 1] = Math.max(0, Math.min(255, imgData.data[i + 1] + n * 0.95));
    imgData.data[i + 2] = Math.max(0, Math.min(255, imgData.data[i + 2] + n * 0.85));
  }
  ctx.putImageData(imgData, 0, 0);

  // Subtle brush application strokes
  ctx.fillStyle = 'rgba(226, 232, 240, 0.3)';
  for (let i = 0; i < 40; i++) {
    ctx.fillRect(0, Math.random() * size, size, 2 + Math.random() * 4);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  textureCache['limestone_wash'] = texture;
  return texture;
}

/**
 * Generates ringed fibrous coconut palm trunk texture
 */
export function getCoconutBarkTexture(): THREE.CanvasTexture {
  if (textureCache['coconut_bark']) return textureCache['coconut_bark'];

  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Fibrous grey-brown trunk base
  ctx.fillStyle = '#5c4333';
  ctx.fillRect(0, 0, size, size);

  // Ringed leaf-base scars
  for (let y = 0; y < size; y += 14) {
    ctx.fillStyle = '#3e2c20';
    ctx.fillRect(0, y, size, 3);
    ctx.fillStyle = '#785b47';
    ctx.fillRect(0, y + 3, size, 2);
  }

  const imgData = ctx.getImageData(0, 0, size, size);
  for (let i = 0; i < imgData.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 25;
    imgData.data[i] = Math.max(0, Math.min(255, imgData.data[i] + n));
    imgData.data[i + 1] = Math.max(0, Math.min(255, imgData.data[i + 1] + n));
    imgData.data[i + 2] = Math.max(0, Math.min(255, imgData.data[i + 2] + n));
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 8);
  textureCache['coconut_bark'] = texture;
  return texture;
}

/**
 * Generates translucent waxy banana leaf texture
 */
export function getBananaLeafTexture(): THREE.CanvasTexture {
  if (textureCache['banana_leaf']) return textureCache['banana_leaf'];

  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Vibrant emerald green base
  ctx.fillStyle = '#16a34a';
  ctx.fillRect(0, 0, size, size);

  // Parallel lateral leaf veins
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 1;
  for (let y = 0; y < size; y += 4) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size, y + 6);
    ctx.stroke();
  }

  // Midrib central ridge
  ctx.fillStyle = '#86efac';
  ctx.fillRect(size / 2 - 4, 0, 8, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 2);
  textureCache['banana_leaf'] = texture;
  return texture;
}

/**
 * Generates architectural composite facade panel texture with crisp panel reveals
 */
export function getArchitecturalPanelTexture(): THREE.CanvasTexture {
  if (textureCache['arch_panel']) return textureCache['arch_panel'];

  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Clean satin architectural panel off-white
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, size, size);

  // 1200mm x 600mm panel reveal shadow grooves
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, size, size);
  ctx.strokeRect(0, size / 2, size, size / 2);
  ctx.strokeRect(0, 0, size / 2, size);
  ctx.strokeRect(size / 2, 0, size / 2, size);

  // Micro aluminum flake specular sheen
  const imgData = ctx.getImageData(0, 0, size, size);
  for (let i = 0; i < imgData.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 8;
    imgData.data[i] = Math.max(0, Math.min(255, imgData.data[i] + n));
    imgData.data[i + 1] = Math.max(0, Math.min(255, imgData.data[i + 1] + n));
    imgData.data[i + 2] = Math.max(0, Math.min(255, imgData.data[i + 2] + n));
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  textureCache['arch_panel'] = texture;
  return texture;
}

/**
 * Generates polished architectural South Indian granite plinth texture
 */
export function getGraniteTexture(): THREE.CanvasTexture {
  if (textureCache['granite']) return textureCache['granite'];

  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Polished charcoal granite base
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, size, size);

  // Quartz and feldspar crystal flecks
  for (let i = 0; i < 2500; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = 0.5 + Math.random() * 1.5;
    ctx.fillStyle = Math.random() > 0.6 ? '#64748b' : Math.random() > 0.3 ? '#0f172a' : '#94a3b8';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  textureCache['granite'] = texture;
  return texture;
}
