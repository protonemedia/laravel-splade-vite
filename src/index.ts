import { execa } from "execa";
import { Plugin, ResolvedConfig } from "vite";

type PluginConfig = {
  phpBinary?: string;
  artisan?: string;
  verbose?: boolean;
  execOptions?: object;
};

export default function LaravelSplade(config: PluginConfig = {}): Plugin {
  let resolvedConfig: undefined | ResolvedConfig = undefined;
  const phpBinary = config?.phpBinary ?? "php";
  const artisan = config?.artisan ?? "artisan";
  const verbose = config?.verbose ?? false;
  const execOptions = config?.execOptions ?? {};

  return {
    name: "laravel-splade-vite",
    enforce: "pre",
    configResolved(config) {
      resolvedConfig = config;
      if (verbose) {
        console.log("Laravel Splade Vite plugin: Config resolved");
      }
    },
    async buildStart() {
      if (!resolvedConfig) {
        console.error("Laravel Splade Vite plugin: Config not resolved");
        return;
      }

      const command = resolvedConfig.isProduction
        ? [artisan, "splade:core:build-components", "--unprocessed"]
        : [artisan, "splade:core:clear-components"];

      if (verbose) {
        console.log("Laravel Splade Vite plugin: Processing components...");
      }

      const { stdout, failed, exitCode } = await execa(phpBinary, command, execOptions);

      if (verbose) {
        console.log(stdout);
        console.log(
          failed
            ? `Laravel Splade Vite plugin: Components failed to process, exit code: ${exitCode}`
            : "Laravel Splade Vite plugin: Components processed"
        );
      }
    },
  };
}
