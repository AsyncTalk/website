import path from "path";
import fs from "fs";
import OpenAI from "openai";

const openai = new OpenAI();

const facePath = path.resolve("..", "public/asynctalk-annatarhe.jpg");

async function createFile(filePath) {
  const fileContent = fs.createReadStream(facePath);
  const result = await openai.files.create({
    file: fileContent,
    purpose: "vision",
  });
  return result.id;
}

// file-Ps7rTzRKvrg6NMc4j9pimS
const faceFileId = await createFile(facePath);

console.log("faceFileId", faceFileId);
