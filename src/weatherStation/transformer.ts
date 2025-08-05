import { DataTransformer, GenericData } from "../types";
import {
  DEVICE_REGISTRY,
  TEMPERATURE_DATA,
  WIND_DATA,
  RAIN_DATA,
  POWER_DATA,
} from "../const";

const DEVICE_NAME = "ws1";
const DEVICE_TYPE = "weather-station";
const DEVICE_MANUFACTURER = "EMOS";
const BASE_DEVICE = DEVICE_NAME + "_base";
const TEMP_SENSOR_1 = DEVICE_NAME + "_temp_1";
const TEMP_SENSOR_2 = DEVICE_NAME + "_temp_2";
const WIND_SENSOR = DEVICE_NAME + "_wind";
const RAIN_SENSOR = DEVICE_NAME + "_rain";

const TOPIC_SUB = "weather_station";

type WeatherStationMeasurement = {
  mac: string;
  ip: string;
  firmversion: string;
  dcftime: string;
  dcfdate: string;
  windspeed: string; // wind_speed
  windspeed10: string;
  windspeed60: string;
  windspeed24: string;
  windchill: string;
  winddir: string; // wind_speed
  rain: string;
  rainh: string; // precipitation
  rain10: string; // precipitation
  raind: string; // precipitation
  rainw: string;
  pressure: string;
  owmicon: string;
  sunset: string;
  sunrise: string;
  temperature1: string; // temperature
  temperature2: string; // temperature
  temperature3: string;
  humidity1: string; // humidity
  humidity2: string; // humidity
  humidity3: string;
  lowbat1: string; // battery - Hauptsensor
  lowbat2: string; // battery - Kanal 2
  lowbat3: string;
  lowbat4: string; // battery - Regensensor
  dewpoint1: string; // temperature
  dewpoint2: string; // temperature
  dewpoint3: string;
  brightness: string;
  timestampwind: string;
  timestamprain: string;
};

const TRANSFORMER: DataTransformer = (_topic: string, message: string) => {
  const measurement: WeatherStationMeasurement = JSON.parse(message);
  const measurementTime = new Date();

  const deviceData: GenericData = {
    at: measurementTime,
    measurement: DEVICE_REGISTRY.MEASUREMENT_NAME,
    key: DEVICE_NAME,
    tags: {
      [DEVICE_REGISTRY.TAG_DEVICE_TYPE]: DEVICE_TYPE,
      [DEVICE_REGISTRY.TAG_DEVICE_NAME]: DEVICE_NAME,
      [DEVICE_REGISTRY.TAG_DEVICE_MANUFACTURER]: DEVICE_MANUFACTURER,
    },
    fields: {
      [DEVICE_REGISTRY.FIELD_IP]: { string: measurement.ip },
      [DEVICE_REGISTRY.FIELD_MAC]: { string: measurement.mac },
    },
  };

  const temperatureData1: GenericData = {
    at: measurementTime,
    measurement: TEMPERATURE_DATA.MEASUREMENT_NAME,
    key: TEMP_SENSOR_1,
    tags: {
      [TEMPERATURE_DATA.TAG_DEVICE_TYPE]: DEVICE_TYPE,
      [TEMPERATURE_DATA.TAG_DEVICE_NAME]: TEMP_SENSOR_1,
      [TEMPERATURE_DATA.TAG_DEVICE_LOCATION]: "Garten",
      [TEMPERATURE_DATA.TAG_DEVICE_INOUT]: "out",
    },
    fields: {
      [TEMPERATURE_DATA.FIELD_TEMP]: {
        float: parseFloat(measurement.temperature1),
      },
      [TEMPERATURE_DATA.FIELD_HUMIDITY]: {
        int: parseInt(measurement.humidity1),
      },
      [TEMPERATURE_DATA.FIELD_DEWPOINT]: {
        float: parseFloat(measurement.dewpoint1),
      },
    },
  };

  const temperatureData2: GenericData = {
    at: measurementTime,
    measurement: TEMPERATURE_DATA.MEASUREMENT_NAME,
    key: TEMP_SENSOR_2,
    tags: {
      [TEMPERATURE_DATA.TAG_DEVICE_TYPE]: DEVICE_TYPE,
      [TEMPERATURE_DATA.TAG_DEVICE_NAME]: TEMP_SENSOR_2,
      [TEMPERATURE_DATA.TAG_DEVICE_LOCATION]: "Garage",
      [TEMPERATURE_DATA.TAG_DEVICE_INOUT]: "out",
    },
    fields: {
      [TEMPERATURE_DATA.FIELD_TEMP]: {
        float: parseFloat(measurement.temperature2),
      },
      [TEMPERATURE_DATA.FIELD_HUMIDITY]: {
        int: parseInt(measurement.humidity2),
      },
      [TEMPERATURE_DATA.FIELD_DEWPOINT]: {
        float: parseFloat(measurement.dewpoint2),
      },
    },
  };

  const windData: GenericData = {
    at: measurementTime,
    measurement: WIND_DATA.MEASUREMENT_NAME,
    key: WIND_SENSOR,
    tags: {
      [WIND_DATA.TAG_DEVICE_TYPE]: DEVICE_TYPE,
      [WIND_DATA.TAG_DEVICE_NAME]: WIND_SENSOR,
      [WIND_DATA.TAG_DEVICE_LOCATION]: "Garten",
    },
    fields: {
      [WIND_DATA.FIELD_WINDSPEED]: { int: parseInt(measurement.windspeed) },
      [WIND_DATA.FIELD_WINDCHILL]: { float: parseFloat(measurement.windchill) },
      [WIND_DATA.FIELD_WINDDIR]: { int: parseInt(measurement.winddir) },
    },
  };

  const rainData: GenericData = {
    at: measurementTime,
    measurement: RAIN_DATA.MEASUREMENT_NAME,
    key: RAIN_SENSOR,
    tags: {
      [RAIN_DATA.TAG_DEVICE_TYPE]: DEVICE_TYPE,
      [RAIN_DATA.TAG_DEVICE_NAME]: RAIN_SENSOR,
      [RAIN_DATA.TAG_DEVICE_LOCATION]: "Garten",
    },
    fields: {
      [RAIN_DATA.FIELD_RAIN_10]: { float: parseFloat(measurement.rain10) },
      [RAIN_DATA.FIELD_RAIN_H]: { float: parseFloat(measurement.rainh) },
      [RAIN_DATA.FIELD_RAIN_D]: { float: parseFloat(measurement.raind) },
    },
  };

  const powerBase: GenericData = {
    at: measurementTime,
    measurement: POWER_DATA.MEASUREMENT_NAME,
    key: BASE_DEVICE,
    tags: {
      [POWER_DATA.TAG_DEVICE_TYPE]: DEVICE_TYPE,
      [POWER_DATA.TAG_DEVICE_NAME]: BASE_DEVICE,
      [POWER_DATA.TAG_DEVICE_LOCATION]: "Garten",
      [POWER_DATA.TAG_DEVICE_INOUT]: "out",
    },
    fields: {
      [POWER_DATA.FIELD_LOW_BAT]: {
        boolean: Boolean(JSON.parse(measurement.lowbat1)),
      },
    },
  };

  const powerTemp2: GenericData = {
    at: measurementTime,
    measurement: POWER_DATA.MEASUREMENT_NAME,
    key: TEMP_SENSOR_2,
    tags: {
      [POWER_DATA.TAG_DEVICE_TYPE]: DEVICE_TYPE,
      [POWER_DATA.TAG_DEVICE_NAME]: TEMP_SENSOR_2,
      [POWER_DATA.TAG_DEVICE_LOCATION]: "Garage",
      [POWER_DATA.TAG_DEVICE_INOUT]: "out",
    },
    fields: {
      [POWER_DATA.FIELD_LOW_BAT]: {
        boolean: Boolean(JSON.parse(measurement.lowbat2)),
      },
    },
  };

  const powerRain: GenericData = {
    at: measurementTime,
    measurement: POWER_DATA.MEASUREMENT_NAME,
    key: RAIN_SENSOR,
    tags: {
      [POWER_DATA.TAG_DEVICE_TYPE]: DEVICE_TYPE,
      [POWER_DATA.TAG_DEVICE_NAME]: RAIN_SENSOR,
      [POWER_DATA.TAG_DEVICE_LOCATION]: "Garten",
      [POWER_DATA.TAG_DEVICE_INOUT]: "out",
    },
    fields: {
      [POWER_DATA.FIELD_LOW_BAT]: {
        boolean: Boolean(JSON.parse(measurement.lowbat4)),
      },
    },
  };

  return {
    timeseries: [
      temperatureData1,
      temperatureData2,
      windData,
      rainData,
      powerBase,
      powerTemp2,
      powerRain,
    ],
    lvc: [
      deviceData,
      temperatureData1,
      temperatureData2,
      windData,
      rainData,
      powerBase,
      powerTemp2,
      powerRain,
    ],
  };
};

export const WeatherStation = { TRANSFORMER, TOPIC_SUB };
