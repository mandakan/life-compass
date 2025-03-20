declare interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly BASE_URL: string;
  // Add other environment variables here as needed, for example:
  // readonly VITE_API_URL: string;
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv;
}
