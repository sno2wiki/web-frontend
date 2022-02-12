import { customAlphabet } from "nanoid";
import { ulid as genCommitId } from "ulid";

export const generateCommitId = () => genCommitId();

const genLineId = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", 12);
export const generateLineId = () => genLineId();
