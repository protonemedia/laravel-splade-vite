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

  const run = async (command: string[]) => {
      const { stdout, failed, exitCode } = await execa(phpBinary, command, execOptions);

      if (verbose) {
        console.log(stdout);
        console.log(
          failed
            ? `Laravel Splade Vite plugin: Components failed to process, exit code: ${exitCode}`
            : "Laravel Splade Vite plugin: Components processed"
        );
      }

      return { stdout, failed, exitCode };
  }

  const generatePluginManifest = async () => {
      if (verbose) {
        console.log("Laravel Splade Vite plugin: Generating plugin manifest...");
      }

      if (!resolvedConfig) {
        console.error("Laravel Splade Vite plugin: Config not resolved");
        return;
      }

      if(resolvedConfig.isProduction) {
        if (verbose) {
          console.log("Laravel Splade Vite plugin: Generating plugin manifest is not needed in production mode");
        }
        return;
      }

      await run([artisan, "splade:core:generate-plugin-manifest"]);

      if (verbose) {
        console.log("Laravel Splade Vite plugin: Plugin manifest generated");
      }
  }

  return {
    name: "laravel-splade-vite",
    enforce: "pre",
    configResolved(config) {
      resolvedConfig = config;
      if (verbose) {
        console.log("Laravel Splade Vite plugin: Config resolved");
      }
    },
    async watchChange() {
      await generatePluginManifest();
    },
    async buildStart() {
      if (!resolvedConfig) {
        console.error("Laravel Splade Vite plugin: Config not resolved");
        return;
      }

      await generatePluginManifest();

      const extractComponentsCommand = resolvedConfig.isProduction
        ? [artisan, "splade:core:build-components", "--unprocessed"]
        : [artisan, "splade:core:clear-components"];

      if (verbose) {
        console.log("Laravel Splade Vite plugin: Processing components...");
      }

      await run(extractComponentsCommand);
    },
  };
}
