import { Plugin } from 'vite';

type PluginConfig = {
    phpBinary?: string;
    artisan?: string;
    verbose?: boolean;
};
declare function LaravelSplade(config?: PluginConfig): Plugin;

export { LaravelSplade as default };
