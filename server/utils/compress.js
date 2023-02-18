import sharp from "sharp";
import fs from "fs";
import { spawn } from "child_process";
import { randomUUID } from "crypto";
import * as ffmpegBinary from "@ffmpeg-installer/ffmpeg";

export const audioFormats = ["mp3", "aac", "ogg", "wma", "flac"];
export const imageFormats = ["jpg", "jpeg", "png", "gif", "bmp", "tiff"];
export const videoFormats = [
  "mp4",
  "webm",
  "mkv",
  "avi",
  "mov",
  "wmv",
  "flv",
  "mpg",
  "mpeg",
  "3gp",
  "3g2",
  "m4v",
  "f4v",
  "f4p",
  "f4a",
  "f4b",
];

export async function compressImage(filePath, extension) {
  let file = fs.readFileSync(filePath);
  if (extension === "gif") {
    return false;
  }
  return await sharp(Buffer.from(file.buffer)).webp({ quality: 50 }).toBuffer();
}

export async function compressVideo(filePath, extension) {
  let outputFile = `./${process.env.TEMP_FOLDER}/${randomUUID()}.${extension}`;
  const ffmpeg = spawn(ffmpegBinary.path, [
    "-i",
    `${filePath}`,
    "-c:v",
    "libx264",
    "-qp",
    "0",
    "-crf",
    "24",
    "-y",
    outputFile,
  ]);

  return await getBuffer(ffmpeg, outputFile);
}

export async function compressAudio(filePath, extension) {
  let outputFile = `./${process.env.TEMP_FOLDER}/${randomUUID()}.${extension}`;
  const ffmpeg = spawn(ffmpegBinary.path, [
    "-i",
    `${filePath}`,
    "-c:a",
    "libmp3lame",
    "-q:a",
    "4",
    "-y",
    outputFile,
  ]);
  return await getBuffer(ffmpeg, outputFile);
}

function getBuffer(ffmpeg, outputFile) {
  return new Promise((resolve, reject) => {
    ffmpeg.stderr.on("error", (err) => {
      return reject(err);
    });
    ffmpeg.on("close", async () => {
      let buffer = Buffer.from(fs.readFileSync(outputFile).buffer);
      try {
        const didDeleteFile = await fs.promises.rm(`./${outputFile}`, {});
        if (!didDeleteFile) {
          return resolve(buffer);
        }
        return reject(false);
      } catch (err) {
        return reject(err.code === "ENOENT");
      }
    });
  });
}
