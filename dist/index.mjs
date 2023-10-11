import { exec } from 'child_process';

function LaravelSplade(config = {}) {
  let resolvedConfig = void 0;
  const phpBinary = config?.phpBinary ?? "php";
  return {
    name: "laravel-splade-vite",
    configResolved(config2) {
      resolvedConfig = config2;
    },
    buildStart: async () => {
      if (!resolvedConfig) {
        return;
      }
      if (resolvedConfig.isProduction) {
        await exec(
          `${phpBinary} artisan splade:core:build-components --unprocessed`
        );
      } else {
        await exec(`${phpBinary} artisan splade:core:clear-components`);
      }
    }
  };
}

export { LaravelSplade as default };
