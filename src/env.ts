/** InfluxDB v3 Host */
const INFLUX_HOST = process.env["INFLUX_HOST"] || "http://localhost:8181";
/** InfluxDB authorization token */
const INFLUX_TOKEN = process.env["INFLUX_TOKEN"];
/** Organization within InfluxDB  */
const INFLUX_DATABASE = process.env["INFLUX_DATABASE"]!;

/** Url of the MQTT broker */
const MQTT_BROKER_URL = process.env["MQTT_BROKER_URL"]!;
const MQTT_USER = process.env["MQTT_USER"]!;
const MQTT_PASSWORD = process.env["MQTT_PASSWORD"]!;

/** Config of the Redis */
const REDIS_SERVER_URL = process.env["REDIS_SERVER_URL"]!;
const REDIS_SERVER_PASSWORD = process.env["REDIS_SERVER_PASSWORD"]!;

export {
  INFLUX_HOST,
  INFLUX_TOKEN,
  INFLUX_DATABASE,
  MQTT_BROKER_URL,
  MQTT_USER,
  MQTT_PASSWORD,
  REDIS_SERVER_URL,
  REDIS_SERVER_PASSWORD,
};
