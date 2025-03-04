import { Point } from "@influxdata/influxdb-client";

export type InfluxPointsTransformer = (
  topic: string,
  message: string,
) => Point[];
