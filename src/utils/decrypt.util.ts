import crypto from "crypto";

export const createDecryptStream = (key: Buffer,iv: Buffer,authTag: Buffer
) => {
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);

  decipher.setAuthTag(authTag);
  return decipher;
};
