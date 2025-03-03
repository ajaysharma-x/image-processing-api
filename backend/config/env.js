import { config } from "dotenv"

config({path: './.env'})

export const { MONGO_URI } = process.env;