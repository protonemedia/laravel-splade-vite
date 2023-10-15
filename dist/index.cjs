'use strict';

const child_process = require('child_process');

function LaravelSplade(config = {}) {
  let resolvedConfig = void 0;
  const phpBinary = config?.phpBinary ?? "php";
  return {
    name: "laravel-splade-vite",
    enforce: "pre",
    configResolved(config2) {
      resolvedConfig = config2;
      console.log("Laravel Splade Vite plugin: config resolved");
    },
    buildStart() {
      if (!resolvedConfig) {
        console.error("Laravel Splade Vite plugin: config not resolved");
        return;
      }
      const command = resolvedConfig.isProduction ? "artisan splade:core:build-components --unprocessed" : "artisan splade:core:clear-components";
      console.log("Laravel Splade Vite plugin: Processing components...");
      child_process.exec(`${phpBinary} ${command}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`error: ${error.message}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
      });
      console.log("Laravel Splade Vite plugin: Components processed");
    }
  };
}

module.exports = LaravelSplade;
