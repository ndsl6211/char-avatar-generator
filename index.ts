import express from 'express';
import { createCanvas } from 'canvas';
import { Request, Response } from 'express';
import { env } from './src/env'

const app = express();

function getRandomColor(): string {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function getContrastColor(hexColor: string): string {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? '#000000' : '#FFFFFF';
}

function adjustColorBrightness(hexColor: string, factor: number): string {
  // Parse the hex string to decimal RGB values
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  // Adjust each channel by the factor (lighter or darker)
  const newR = Math.min(255, Math.floor(Math.max(0, r * factor)));
  const newG = Math.min(255, Math.floor(Math.max(0, g * factor)));
  const newB = Math.min(255, Math.floor(Math.max(0, b * factor)));

  // Convert the new decimal values back to hex
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}

app.get('/avatar', (req: Request, res: Response) => {
  const name: string = (req.query.name as string) || 'A';
  const sizeParam = req.query.size as string;

  const char: string = name.charAt(0).toUpperCase();
  const size = sizeParam ? parseInt(sizeParam, 10) : env.DEFAULT_AVATAR_SIZE;

  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  const bgColor = getRandomColor();
  const textColor = getContrastColor(bgColor);

  // Adjust the inner circle color by brightening or darkening the background
  const innerCircleColor = adjustColorBrightness(bgColor, 0.8); // Factor <1 makes it darker, >1 makes it lighter

  // Background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, size, size);

  // Circle (optional aesthetic)
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.fillStyle = innerCircleColor;
  ctx.fill();

  // Text
  ctx.fillStyle = textColor;
  ctx.font = `${Math.floor(size / 2)}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(char, size / 2, size / 2);

  res.setHeader('Content-Type', 'image/png');
  canvas.createPNGStream().pipe(res);
});

app.listen(env.PORT, () => {
  console.log(`Server is running on http://localhost:${env.PORT}`);
});

