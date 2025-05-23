import { InfluxService } from "./InfluxService";
import { MqttService } from "./MqttService";
import { RedisService } from "./RedisService";
import { DataTransformer } from "./types";
import { WeatherStation } from "./weatherStation/transformer";

const TRANSFORMERS: Record<string, DataTransformer> = {
  [WeatherStation.TOPIC_SUB]: WeatherStation.TRANSFORMER,
};

const redisService = new RedisService();
const mqttService = new MqttService(
  TRANSFORMERS,
  (topic, message, transformerConfig) => {
    const transformer = transformerConfig[1];
    const data = transformer(topic, message);
    if (data.timeseries) {
      InfluxService.writeData(data.timeseries);
    }

    if (data.lvc) {
      redisService.setGenericData(data.lvc);
    }
  },
);

process.on("SIGINT", () => process.exit());
process.on("exit", async () => {
  mqttService.disconnect();
  await InfluxService.cleanupAndClose();
  await redisService.disconnect();
});

redisService.connect().then(() => {
  mqttService.connect();
});
