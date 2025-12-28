import crypto from "crypto";
import { PassThrough } from "stream";

export const encryptBufferGCM = (buffer: Buffer,key:Buffer)=>{

    const iv = crypto.randomBytes(12);
    const ciper = crypto.createCipheriv("aes-256-gcm",key,iv);

    const encrypted = Buffer.concat([ciper.update(buffer),ciper.final(),]);

    const authTag = ciper.getAuthTag();

    return {encrypted , iv, authTag}
}
