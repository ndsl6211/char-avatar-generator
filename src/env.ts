import { cleanEnv, num, port } from "envalid";
import { config } from "dotenv";

config()

export const env = cleanEnv(process.env, {
  PORT: port({ default: 3000 }),
  DEFAULT_AVATAR_SIZE: num({ default: 100 }),
})
