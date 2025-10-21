/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

interface ImportMetaEnv {
  readonly VITE_GIT_TOKEN: string;
  readonly VITE_REPO_OWNER: string;
  readonly VITE_REPO_NAME: string;
  readonly VITE_GIT_BASE: string;
  readonly VITE_API_BASE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
