import * as fileType from 'file-type';
import { createWriteStream, readFile } from 'fs';
import util from 'util';
import zlib from 'zlib';

import { ServerError, ServerErrorType } from 'src/shared/configs/errors.config';

export interface FileInformation {
  ext: string;
  type: string;
}

async function extractFileInformation(file: any): Promise<FileInformation> {
  let extractedFileType: fileType.FileTypeResult;
  try {
    extractedFileType = await fileType.fromBuffer(file.data);
  } catch (error) {
    throw new ServerError(ServerErrorType.MEDIA_TYPE_IS_UNSUPPORTED, undefined);
  }

  const fileInformation: FileInformation = {
    type: extractedFileType.mime.split('/')[0],
    ext: extractedFileType.ext,
  };

  return fileInformation;
}

async function validateMimeType(
  fileInformation: FileInformation,
  expectedMimeTypes: string[],
): Promise<void> {
  if (!expectedMimeTypes.includes(fileInformation.type)) {
    throw new ServerError(
      ServerErrorType.MEDIA_TYPE_IS_UNEXPECTED,
      expectedMimeTypes.join(' or '),
      fileInformation.type,
    );
  }
}

async function validateImage(image: any) {
  const fileInformation = await extractFileInformation(image);
  await validateMimeType(fileInformation, ['image']);
}

async function validateImageArray(images: any[]) {
  for (const picture of images) {
    if (picture !== '') {
      const fileInformation = await extractFileInformation(picture);
      await validateMimeType(fileInformation, ['image']);
    }
  }
}

async function readCompressedJson<T>(
  filePath: string,
  altReturn?: any,
): Promise<T> {
  return new Promise((resolve, reject) => {
    readFile(filePath, 'binary', async (error, data) => {
      if (error) {
        reject(error);
      } else {
        try {
          const decompressedData = await util.promisify(zlib.inflate)(
            Buffer.from(data, 'binary'),
          );
          resolve(JSON.parse(decompressedData.toString()) as T);
        } catch {
          resolve(altReturn || []);
        }
      }
    });
  });
}

async function compressData(json: any) {
  const compressedData = await util.promisify(zlib.deflate)(
    Buffer.from(JSON.stringify(json)),
  );

  return compressedData;
}

async function compressAndWriteJson(filePath: string, json: any) {
  const compressedData = await compressData(json);
  const ws = createWriteStream(filePath);
  ws.write(compressedData);
  ws.end();
}

export default {
  extractFileInformation,
  validateMimeType,
  validateImage,
  validateImageArray,
  readCompressedJson,
  compressAndWriteJson,
  compressData,
};
