const vaultSessionKeys = new Map<string,Buffer>();
const VaultAttempts = new Map<string,VaultAttemptState>();

type VaultAttemptState = {
    failures:number;
    lockedUntil?:number;
}

const MAX_FAILURES = 3;
const LOCK_TIME_MS = 10 * 60 * 1000;



export const setVaultkey = (userId:string,key:Buffer) =>{
    vaultSessionKeys.set(userId,key);
    VaultAttempts.delete(userId);
}

export const getVaultkey = (userId:string) =>{
    vaultSessionKeys.get(userId);
}

export const clearVaultkey = (userId: string) =>{
    vaultSessionKeys.delete(userId);
}

export const isVaultunlocked = (userId:string): boolean => {
    return vaultSessionKeys.has(userId);
}

export const registerVaultFailure = (userId: string) => {
    const state = VaultAttempts.get(userId) || {failures:0};
    state.failures +=1;

    if(state.failures >= MAX_FAILURES){
        state.lockedUntil = Date.now() + LOCK_TIME_MS;
    }

    VaultAttempts.set(userId,state);
}

export const canAttemptUnlock = (userId:string): boolean =>{
    const state = VaultAttempts.get(userId);

    if(!state?.lockedUntil){
        return true;
    }

    if(Date.now() > state.lockedUntil){
        VaultAttempts.delete(userId);
        return true;
    }

    return false;
}