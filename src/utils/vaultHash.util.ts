import crypto from "crypto";

export const hashAnswer = (ans:string, salt: Buffer): Buffer =>{
    return crypto.pbkdf2Sync(ans,salt,100_000,32,"sha256");
}

export const deriveVaultKey = (masterkey:string, salt:Buffer):Buffer =>{
    return crypto.pbkdf2Sync(masterkey,salt,250_000,32,"sha256");
}
