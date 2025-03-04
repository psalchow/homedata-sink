import { Agent } from "http";
import { InfluxDB, Point, WriteApi } from "@influxdata/influxdb-client";
import { INFLUX_BUCKET, INFLUX_ORG, INFLUX_TOKEN, INFLUX_URL } from "./env";

let keepAliveAgent: Agent | undefined;
const getKeepAliveAgent = () => {
  if (!keepAliveAgent) {
    console.log("Creating keep alive agent");
    keepAliveAgent = new Agent({
      keepAlive: true, // reuse existing connections
      keepAliveMsecs: 30 * 1000, // 20 seconds keep alive
    });
  }
  return keepAliveAgent;
};

let influxDB: InfluxDB | undefined;
const getInfluxDB = () => {
  if (!influxDB) {
    console.log("Creating Influx DB connection");
    influxDB = new InfluxDB({
      url: INFLUX_URL,
      token: INFLUX_TOKEN,
      transportOptions: {
        agent: getKeepAliveAgent(),
      },
    });
  }
  return influxDB;
};

let writeApi: WriteApi | undefined;
const getWriteApi = () => {
  if (!writeApi) {
    console.log("Creating write API");
    writeApi = getInfluxDB().getWriteApi(INFLUX_ORG, INFLUX_BUCKET);
  }
  return writeApi;
};

const writeMeasurement = (points: Point[]) => {
  if (points.length > 0) {
    console.log(`Writing ${points.length} points to Influx`);
    getWriteApi().writePoints(points);
  } else {
    console.log(`No Points to write to Influx`);
  }
};

const cleanupAndClose = async () => {
  console.log("closing InfluxService...");
  await writeApi?.close();
  writeApi = undefined;
  influxDB = undefined;
  keepAliveAgent?.destroy();
  keepAliveAgent = undefined;
  console.log("InfluxService closed");
};

export const InfluxService = { writeMeasurement, cleanupAndClose };
