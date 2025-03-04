import { Point } from "@influxdata/influxdb-client";
import { InfluxPointsTransformer } from "../types";
import { DEVICE_REGISTRY } from "../const";

const DEVICE_NAME = "ws1";
const DEVICE_TYPE = "weather-station";
const DEVICE_MANUFACTURER = "EMOS";

const TOPIC_SUB = "weather_station";

type WeatherStationMeasurement = {
  mac: string;
  ip: string;
  firmversion: string;
  dcftime: string;
  dcfdate: string;
  windspeed: string;
  windspeed10: string;
  windspeed60: string;
  windspeed24: string;
  windchill: string;
  winddir: string;
  rain: string;
  rainh: string;
  rain10: string;
  raind: string;
  rainw: string;
  pressure: string;
  owmicon: string;
  sunset: string;
  sunrise: string;
  temperature1: string;
  temperature2: string;
  temperature3: string;
  humidity1: string;
  humidity2: string;
  humidity3: string;
  lowbat1: string;
  lowbat2: string;
  lowbat3: string;
  lowbat4: string;
  dewpoint1: string;
  dewpoint2: string;
  dewpoint3: string;
  brightness: string;
  timestampwind: string;
  timestamprain: string;
};

const TRANSFORMER: InfluxPointsTransformer = (
  _topic: string,
  message: string,
): Point[] => {
  const measurement: WeatherStationMeasurement = JSON.parse(message);
  return [
    new Point(DEVICE_REGISTRY.MEASUREMENT_NAME)
      .timestamp(new Date())
      .tag(DEVICE_REGISTRY.TAG_DEVICE_TYPE, DEVICE_TYPE)
      .tag(DEVICE_REGISTRY.TAG_DEVICE_NAME, DEVICE_NAME)
      .tag(DEVICE_REGISTRY.TAG_DEVICE_MANUFACTURER, DEVICE_MANUFACTURER)
      .stringField(DEVICE_REGISTRY.FIELD_IP, measurement.ip)
      .stringField(DEVICE_REGISTRY.FIELD_MAC, measurement.mac),
  ];
};

export const WeatherStation = { TRANSFORMER, TOPIC_SUB };
