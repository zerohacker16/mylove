export interface LoveLetterParams {
  partnerName: string;
  myName: string;
  tone: 'romantic' | 'passionate' | 'cute' | 'poetic';
  memories: string;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
  type?: 'firework' | 'heart';
  rotation?: number;
  rotationSpeed?: number;
  stopped?: boolean; // For piling hearts
}

export interface Firework {
  x: number;
  y: number;
  particles: Particle[];
  age: number;
}

export interface BeautyCompliment {
  word: string;
  description: string;
}