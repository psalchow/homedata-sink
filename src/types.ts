export type GenericData = {
  at: Date;
  measurement: string;
  key: string;
  tags: Record<string, string> | null;
  fields: Record<string, string | number | boolean>;
};

export type DataTransformer = (
  topic: string,
  message: string,
) => { timeseries?: GenericData[]; lvc?: GenericData[] };
