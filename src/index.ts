import { exec } from "child_process";
import { Plugin, ResolvedConfig } from "vite";

type PluginConfig = {
  phpBinary?: string;
};

export default function LaravelSplade(config: PluginConfig = {}): Plugin {
  let resolvedConfig: undefined | ResolvedConfig = undefined;
  const phpBinary = config?.phpBinary ?? "php";

  return {
    name: "laravel-splade-vite",
    enforce: "pre",
    configResolved(config) {
      resolvedConfig = config;
      console.log("Laravel Splade Vite plugin: config resolved");
    },
    buildStart() {
      if (!resolvedConfig) {
        console.error("Laravel Splade Vite plugin: config not resolved");
        return;
      }

      const command = resolvedConfig.isProduction
        ? "artisan splade:core:build-components --unprocessed"
        : "artisan splade:core:clear-components";

      console.log("Laravel Splade Vite plugin: Processing components...");

      exec(`${phpBinary} ${command}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`error: ${error.message}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
      });

      console.log("Laravel Splade Vite plugin: Components processed");
    },
  };
}
