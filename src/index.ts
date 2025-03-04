import { InfluxService } from "./InfluxService";
import { MqttService } from "./MqttService";
import { InfluxPointsTransformer } from "./types";
import { WeatherStation } from "./weatherStation/transformer";

WeatherStation.TOPIC_SUB;

const TRANSFORMERS: Record<string, InfluxPointsTransformer> = {
  [WeatherStation.TOPIC_SUB]: WeatherStation.TRANSFORMER,
};

const mqttService = new MqttService(
  TRANSFORMERS,
  (topic, message, transformerConfig) => {
    const transformer = transformerConfig[1];
    const dataPoints = transformer(topic, message);
    InfluxService.writeMeasurement(dataPoints);
  },
);

process.on("SIGINT", () => process.exit());
process.on("exit", async () => {
  mqttService.disconnect();
  await InfluxService.cleanupAndClose();
});

mqttService.connect();
