import {
  createClient,
  RedisClientType,
  RedisFunctions,
  RedisModules,
  RedisScripts,
} from "@redis/client";
import RedisJsonModule from "@redis/json";
import type { RedisJSON } from "@redis/json/dist/commands";
import { REDIS_SERVER_URL, REDIS_SERVER_PASSWORD } from "./env";
import { GenericData } from "./types";

const PREFIX_TIME = "TS_";
const PREFIX_DATA = "DATA_";

export class RedisService {
  private client:
    | RedisClientType<
        { json: typeof RedisJsonModule },
        RedisFunctions,
        RedisScripts
      >
    | undefined;

  constructor() {
    this.client = undefined;
  }

  public async connect() {
    await this.disconnect();

    console.log("RedisService connecting...");
    this.client = await createClient({
      url: REDIS_SERVER_URL,
      password: REDIS_SERVER_PASSWORD,
      modules: { json: RedisJsonModule },
    })
      .on("error", (err) => console.log("Redis Client Error", err))
      .connect();
    console.log("RedisService connected");
  }

  public async set(key: string, value: string) {
    if (this.client) {
      await this.client.set(key, value);
    }
  }

  public async get(key: string): Promise<string | null> {
    if (this.client) {
      const value = await this.client.get(key);
      return value;
    }

    return null;
  }

  public async setGenericData(generic: GenericData[]) {
    generic.forEach(async (data) => {
      const baseKey = this.buildKey(data);
      const timeStamp = await this.getDataTimestamp(baseKey);
      if (!timeStamp || data.at > timeStamp) {
        await this.setJsonRoot(PREFIX_DATA + baseKey, data);
        await this.setDataTimestamp(baseKey, data.at);
      }
    });
  }

  public async geGenericData(key: string): Promise<GenericData | null> {
    return await this.getJsonRoot(PREFIX_DATA + key);
  }

  public async getDataTimestamp(key: string): Promise<Date | null> {
    const timeString = await this.get(PREFIX_TIME + key);
    if (!timeString) {
      return null;
    }

    return new Date(timeString);
  }

  public async setDataTimestamp(key: string, at: Date) {
    await this.set(PREFIX_TIME + key, at.toISOString());
  }

  public async setJsonRoot(key: string, value: RedisJSON) {
    await this.setJson(key, "$", value);
  }

  public async setJson(key: string, path: string, value: RedisJSON) {
    if (this.client) {
      await this.client.json.set(key, path, value);
    }
  }

  public async getJsonRoot<T extends RedisJSON>(
    key: string,
  ): Promise<T | null> {
    if (this.client) {
      const value = await this.client.json.get(key);
      return value as T;
    }

    return null;
  }

  public async getJson(key: string, path: string): Promise<RedisJSON> {
    if (this.client) {
      const value = await this.client.json.get(key, { path });
      return value;
    }

    return null;
  }

  private buildKey = (generic: GenericData) =>
    `${generic.measurement}#${generic.key}`;

  public async disconnect() {
    if (this.client) {
      console.log("disconnecting from RedisService...");
      await this.client.disconnect();

      this.client = undefined;
      console.log("RedisService disconnected");
    }
  }
}
