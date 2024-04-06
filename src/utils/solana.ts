import { PublicKey } from "@solana/web3.js";

export const validateAddress = (addr: string) => {
  try {
    const pub = new PublicKey(addr);
    const isValid = PublicKey.isOnCurve(pub.toBuffer());
    return isValid;
  } catch (e) {
    return false;
  }
};
