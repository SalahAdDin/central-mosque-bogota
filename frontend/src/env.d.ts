type ImportMetaEnv = {
  readonly ISLAMIC_API_URL: string;
  readonly ISLAMIC_API_KEY: string;
  readonly LOCATION_API_URL: string;
};

type ImportMeta = {
  readonly env: ImportMetaEnv;
};
