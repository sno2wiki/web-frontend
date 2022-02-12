import { customAlphabet } from "nanoid";
import { ulid as genCommitId } from "ulid";

export const generateCommitId = () => genCommitId();

const genLineId = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz", 16);
export const generateLineId = () => genLineId();
