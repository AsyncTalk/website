import { createReadStream } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { parseArgs } from "node:util";
import OpenAI from "openai";
import sharp from "sharp";

const hostFaceFileId = "file-Ps7rTzRKvrg6NMc4j9pimS";

type Ratio = "1:1" | "3:4" | "4:3" | "16:9";
type OutputFormat = "png" | "jpeg" | "webp";

type InputFile = {
  slug?: string;
  title?: string;
  description?: string;
  ratio?: Ratio | Ratio[];
  ratios?: Ratio[];
  format?: OutputFormat;
  output?: string;
  model?: string;
};

type Config = {
  title: string;
  description: string;
  slug: string;
  ratios: Ratio[];
  format: OutputFormat;
  outputDir: string;
  model: string;
  dryRun: boolean;
  overwrite: boolean;
};

const allowedRatios = ["1:1", "3:4", "4:3", "16:9"] as const;
const allowedFormats = ["png", "jpeg", "webp"] as const;

const ratioSettings: Record<
  Ratio,
  {
    apiSize: "1024x1024" | "1024x1536" | "1536x1024";
    finalWidth: number;
    finalHeight: number;
  }
> = {
  "1:1": {
    apiSize: "1024x1024",
    finalWidth: 1024,
    finalHeight: 1024,
  },
  "3:4": {
    apiSize: "1024x1536",
    finalWidth: 1536,
    finalHeight: 2048,
  },
  "4:3": {
    apiSize: "1536x1024",
    finalWidth: 2048,
    finalHeight: 1536,
  },
  "16:9": {
    apiSize: "1536x1024",
    finalWidth: 1920,
    finalHeight: 1080,
  },
};

const help = `Generate AsyncTalk podcast thumbnails with OpenAI.

Usage:
  pnpm generate:thumbnail -- --title "EP62" --description "Episode notes"
  pnpm generate:thumbnail -- --input ./episode.json --ratio 1:1 --ratio 16:9

Options:
  --title <text>         Episode title. Overrides JSON input.
  --description <text>   Episode description. Overrides JSON input.
  --input <path>         JSON file with title, description, slug, ratios, format, output, model.
  --slug <text>          Output filename prefix. Defaults to a slug from title.
  --ratio <ratio>        1:1, 3:4, 4:3, or 16:9. Can repeat or use comma-separated values.
  --format <format>      png, jpeg, or webp. Defaults to png.
  --output <dir>         Output directory. Defaults to public/thumbnails.
  --model <model>        Image model. Defaults to gpt-image-1.5.
  --dry-run              Print resolved requests without calling OpenAI.
  --overwrite            Replace existing output files.
  --help                 Show this message.
`;

async function main() {
  await loadEnvFile(path.resolve(".env"));

  const config = await readConfig();

  if (config.dryRun) {
    printDryRun(config);
    return;
  }

  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is required unless --dry-run is used.");
  }

  await fs.mkdir(config.outputDir, { recursive: true });

  const client = new OpenAI();

  for (const ratio of config.ratios) {
    const settings = ratioSettings[ratio];
    const outputPath = getOutputPath(config, ratio);
    await assertCanWrite(outputPath, config.overwrite);

    console.log(
      `Generating ${ratio} thumbnail with ${config.model} (${settings.apiSize})...`,
    );

    const response = await client.responses.create({
      model: "gpt-5.5",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: buildPrompt(config, ratio),
            },
            {
              type: "input_image",
              file_id: hostFaceFileId,
              detail: "auto",
            },
          ],
        },
      ],

      tools: [
        {
          type: "image_generation",
          quality: "high",
          // format: config.format,
          size: settings.apiSize,
        },
      ],
    });

    const imageData = response.output
      .filter((output) => output.type === "image_generation_call")
      .map((output) => output.result);

    const imageBase64 = imageData[0];
    if (imageBase64) {
      await writeProcessedImage(
        Buffer.from(imageBase64, "base64"),
        outputPath,
        config.format,
        {
          width: settings.finalWidth,
          height: settings.finalHeight,
        },
      );

      console.log(`Wrote ${outputPath}`);
    }
  }
}

async function readConfig(): Promise<Config> {
  const args = process.argv.slice(2);

  const { values } = parseArgs({
    args: args[0] === "--" ? args.slice(1) : args,
    options: {
      title: { type: "string" },
      description: { type: "string" },
      input: { type: "string" },
      slug: { type: "string" },
      ratio: { type: "string", multiple: true },
      format: { type: "string" },
      output: { type: "string" },
      model: { type: "string" },
      "dry-run": { type: "boolean" },
      overwrite: { type: "boolean" },
      help: { type: "boolean", short: "h" },
    },
  });

  if (values.help) {
    console.log(help);
    process.exit(0);
  }

  const input = values.input ? await readInputFile(values.input) : {};
  const title = values.title ?? input.title;
  const description = values.description ?? input.description;
  const format = parseFormat(values.format ?? input.format ?? "png");
  const ratios = parseRatios(
    values.ratio,
    input.ratios ?? input.ratio ?? "1:1",
  );

  if (!title) {
    throw new Error("--title or input.title is required.");
  }

  if (!description) {
    throw new Error("--description or input.description is required.");
  }

  return {
    title,
    description,
    slug: values.slug ?? input.slug ?? slugify(title),
    ratios,
    format,
    outputDir: path.resolve(
      values.output ?? input.output ?? "public/thumbnails",
    ),
    model: values.model ?? input.model ?? "gpt-image-2",
    dryRun: values["dry-run"] ?? false,
    overwrite: values.overwrite ?? false,
  };
}

async function readInputFile(inputPath: string): Promise<InputFile> {
  const filePath = path.resolve(inputPath);
  const raw = await fs.readFile(filePath, "utf8");
  const parsed = JSON.parse(raw) as unknown;

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error(`Input file must contain a JSON object: ${filePath}`);
  }

  return parsed as InputFile;
}

async function loadEnvFile(filePath: string) {
  let raw: string;

  try {
    raw = await fs.readFile(filePath, "utf8");
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return;
    }

    throw error;
  }

  for (const line of raw.split(/\r?\n/)) {
    const parsed = parseEnvLine(line);
    if (!parsed || process.env[parsed.key] !== undefined) {
      continue;
    }

    process.env[parsed.key] = parsed.value;
  }
}

function parseEnvLine(line: string) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) {
    return null;
  }

  const normalized = trimmed.startsWith("export ")
    ? trimmed.slice(7).trimStart()
    : trimmed;
  const separatorIndex = normalized.indexOf("=");
  if (separatorIndex === -1) {
    return null;
  }

  const key = normalized.slice(0, separatorIndex).trim();
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) {
    return null;
  }

  return {
    key,
    value: parseEnvValue(normalized.slice(separatorIndex + 1).trim()),
  };
}

function parseEnvValue(value: string) {
  if (value.startsWith('"')) {
    const closingQuoteIndex = findClosingQuote(value, '"');
    return value
      .slice(1, closingQuoteIndex)
      .replace(/\\n/g, "\n")
      .replace(/\\r/g, "\r")
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, "\\");
  }

  if (value.startsWith("'")) {
    const closingQuoteIndex = findClosingQuote(value, "'");
    return value.slice(1, closingQuoteIndex);
  }

  return value.replace(/\s+#.*$/, "").trim();
}

function findClosingQuote(value: string, quote: '"' | "'") {
  for (let index = 1; index < value.length; index += 1) {
    if (value[index] === quote && value[index - 1] !== "\\") {
      return index;
    }
  }

  return value.length;
}

function parseFormat(value: string): OutputFormat {
  if (allowedFormats.includes(value as OutputFormat)) {
    return value as OutputFormat;
  }

  throw new Error(
    `Unsupported format "${value}". Use: ${allowedFormats.join(", ")}.`,
  );
}

function parseRatios(
  cliRatios: string[] | undefined,
  inputRatios: Ratio | Ratio[],
): Ratio[] {
  const rawRatios = cliRatios?.length
    ? cliRatios
    : Array.isArray(inputRatios)
      ? inputRatios
      : [inputRatios];

  const ratios = rawRatios
    .flatMap((ratio) => ratio.split(","))
    .map((ratio) => ratio.trim());
  const uniqueRatios = [...new Set(ratios)];

  if (uniqueRatios.length === 0) {
    throw new Error("At least one ratio is required.");
  }

  for (const ratio of uniqueRatios) {
    if (!allowedRatios.includes(ratio as Ratio)) {
      throw new Error(
        `Unsupported ratio "${ratio}". Use: ${allowedRatios.join(", ")}.`,
      );
    }
  }

  return uniqueRatios as Ratio[];
}

function buildPrompt(config: Config, ratio: Ratio) {
  return `
请创建一个 ${ratio} 比例的播客缩略图，用于中文网络开发播客 "AsyncTalk", 根据我提供的人脸的图片，要求不修改任何人脸数据。主播的脸必须没有任何修改
此图片将会用于视频节目的封面。标题必须要在图片中，介绍可以作为小字解释

标题: ${config.title}
介绍: ${config.description}
  `;
  // return [
  //   `Create a polished ${ratio} podcast thumbnail for the Chinese web development podcast "AsyncTalk".`,
  //   "Use the attached reference photo as the identity source. The person must remain clearly recognizable as the same Asian male with glasses, but you may adjust pose, facial expression, clothing, lighting, and background to fit the episode mood.",
  //   "Make the composition bold and readable at small sizes for YouTube, TikTok, podcast apps, and social sharing.",
  //   "Show the person prominently, with a modern web-development, software-engineering, or internet-technology atmosphere inspired by the episode.",
  //   'Include the exact brand text "AsyncTalk" as clean, large, legible typography. Do not add the episode title as visible text.',
  //   "Avoid extra words, subtitles, watermarks, social platform logos, malformed text, distorted hands, and duplicated faces.",
  //   `Episode title: ${config.title}`,
  //   `Episode description: ${config.description}`,
  // ].join("\n");
}

async function writeProcessedImage(
  image: Buffer,
  outputPath: string,
  format: OutputFormat,
  size: { width: number; height: number },
) {
  await fs.writeFile(outputPath, image);

  let pipeline = sharp(image)
    .resize(size.width, size.height, {
      fit: "cover",
      position: "attention",
      kernel: "lanczos3",
    })
    .removeAlpha();

  if (format === "png") {
    pipeline = pipeline.png({ compressionLevel: 9 });
  } else if (format === "jpeg") {
    pipeline = pipeline.jpeg({ quality: 100, mozjpeg: true });
  } else {
    pipeline = pipeline.webp({ quality: 100 });
  }

  await pipeline.toFile(outputPath);
}

function getOutputPath(config: Config, ratio: Ratio) {
  const settings = ratioSettings[ratio];
  const ratioName = ratio.replace(":", "x");
  const filename = `${config.slug}-${Date.now()}-${ratioName}-${settings.finalWidth}x${settings.finalHeight}.${config.format}`;

  return path.join(config.outputDir, filename);
}

async function assertReadableFile(filePath: string, label: string) {
  try {
    const stat = await fs.stat(filePath);
    if (!stat.isFile()) {
      throw new Error(`${label} must point to a file: ${filePath}`);
    }
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      throw new Error(`${label} file does not exist: ${filePath}`);
    }

    throw error;
  }
}

async function assertCanWrite(filePath: string, overwrite: boolean) {
  if (overwrite) {
    return;
  }

  try {
    await fs.access(filePath);
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return;
    }

    throw error;
  }

  throw new Error(
    `Output already exists. Pass --overwrite to replace it: ${filePath}`,
  );
}

function printDryRun(config: Config) {
  console.log("Dry run. No OpenAI request will be made.");
  console.log(`Output: ${config.outputDir}`);
  console.log(`Model: ${config.model}`);
  console.log(`Format: ${config.format}`);

  for (const ratio of config.ratios) {
    const settings = ratioSettings[ratio];
    console.log("");
    console.log(`Ratio: ${ratio}`);
    console.log(`API size: ${settings.apiSize}`);
    console.log(`Final size: ${settings.finalWidth}x${settings.finalHeight}`);
    console.log(`Output file: ${getOutputPath(config, ratio)}`);
    console.log("Prompt:");
    console.log(buildPrompt(config, ratio));
  }
}

function slugify(value: string) {
  const slug = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return slug || `thumbnail-${new Date().toISOString().slice(0, 10)}`;
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
