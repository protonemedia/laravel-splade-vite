import { Plugin } from 'vite';

type PluginConfig = {
    phpBinary?: string;
};
declare function LaravelSplade(config?: PluginConfig): Plugin;

export { LaravelSplade as default };
