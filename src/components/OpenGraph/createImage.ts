import fs from "fs/promises";
import path from 'node:path'
import satori from "satori";
import sharp from "sharp";

export async function SVG(component: JSX.Element) {
  return await satori(component, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "LXGWWenKai",
        data: await fs.readFile(
          path.resolve(
            './src/assets/fonts/LXGWWenKai-Regular.ttf'
          )
        ),
        weight: 400,
      },
    ],
  });
}

export async function PNG(component: JSX.Element) {
  return await sharp(Buffer.from(await SVG(component)))
    .png()
    .toBuffer();
}