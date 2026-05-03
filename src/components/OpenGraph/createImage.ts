import fs from "fs/promises";
import path from 'node:path'
import type React from "react";
import satori from "satori";
import sharp from "sharp";

let fontDataPromise: Promise<Buffer> | null = null;
function loadFont() {
  if (!fontDataPromise) {
    fontDataPromise = fs.readFile(
      path.resolve('./src/assets/fonts/LXGWWenKai-Regular.ttf')
    );
  }
  return fontDataPromise;
}

export async function SVG(component: React.ReactNode) {
  return await satori(component, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "LXGWWenKai",
        data: await loadFont(),
        weight: 400,
      },
    ],
  });
}

export async function PNG(component: React.ReactNode) {
  return await sharp(Buffer.from(await SVG(component)))
    .png()
    .toBuffer();
}