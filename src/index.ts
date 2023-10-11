import { exec } from "child_process";
import { Plugin, ResolvedConfig } from 'vite';

type PluginConfig = {
  phpBinary?: string;
};

export default function LaravelSplade(config: PluginConfig = {}): Plugin {
  let resolvedConfig: undefined | ResolvedConfig = undefined;
  const phpBinary = config?.phpBinary ?? "php";

  return {
    name: "laravel-splade-vite",
    configResolved(config) {
      resolvedConfig = config;
    },
    buildStart: async () => {
      if(!resolvedConfig) {
        return;
      }

      if (resolvedConfig.isProduction) {
        await exec(
          `${phpBinary} artisan splade:core:build-components --unprocessed`
        );
      } else {
        await exec(`${phpBinary} artisan splade:core:clear-components`);
      }
    },
  };
}
