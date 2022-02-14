/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_WS_ENDPOINT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
