"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const build_webpack_1 = require("@angular-devkit/build-webpack");
const core_1 = require("@angular-devkit/core");
const path = require("path");
const operators_1 = require("rxjs/operators");
const webpack = require("webpack");
const webpack_configs_1 = require("../angular-cli-files/models/webpack-configs");
const read_tsconfig_1 = require("../angular-cli-files/utilities/read-tsconfig");
const stats_1 = require("../angular-cli-files/utilities/stats");
const webpackMerge = require('webpack-merge');
class ExtractI18nBuilder {
    constructor(context) {
        this.context = context;
    }
    run(builderConfig) {
        const architect = this.context.architect;
        const options = builderConfig.options;
        const root = this.context.workspace.root;
        const projectRoot = core_1.resolve(root, builderConfig.root);
        const [project, targetName, configuration] = options.browserTarget.split(':');
        // Override browser build watch setting.
        const overrides = { watch: false };
        const browserTargetSpec = { project, target: targetName, configuration, overrides };
        const browserBuilderConfig = architect.getBuilderConfiguration(browserTargetSpec);
        const webpackBuilder = new build_webpack_1.WebpackBuilder(this.context);
        const loggingCb = (stats, config, logger) => {
            const json = stats.toJson();
            if (stats.hasWarnings()) {
                this.context.logger.warn(stats_1.statsWarningsToString(json, config.stats));
            }
            if (stats.hasErrors()) {
                this.context.logger.error(stats_1.statsErrorsToString(json, config.stats));
            }
        };
        return architect.getBuilderDescription(browserBuilderConfig).pipe(operators_1.concatMap(browserDescription => architect.validateBuilderOptions(browserBuilderConfig, browserDescription)), operators_1.map(browserBuilderConfig => browserBuilderConfig.options), operators_1.concatMap((validatedBrowserOptions) => {
            const browserOptions = validatedBrowserOptions;
            // We need to determine the outFile name so that AngularCompiler can retrieve it.
            let outFile = options.outFile || getI18nOutfile(options.i18nFormat);
            if (options.outputPath) {
                // AngularCompilerPlugin doesn't support genDir so we have to adjust outFile instead.
                outFile = path.join(options.outputPath, outFile);
            }
            // Extracting i18n uses the browser target webpack config with some specific options.
            const webpackConfig = this.buildWebpackConfig(root, projectRoot, Object.assign({}, browserOptions, { optimization: {
                    scripts: false,
                    styles: false,
                }, i18nLocale: options.i18nLocale, i18nFormat: options.i18nFormat, i18nFile: outFile, aot: true, progress: options.progress, assets: [], scripts: [], styles: [] }));
            return webpackBuilder.runWebpack(webpackConfig, loggingCb);
        }));
    }
    buildWebpackConfig(root, projectRoot, options) {
        let wco;
        const host = new core_1.virtualFs.AliasHost(this.context.host);
        const tsConfigPath = core_1.getSystemPath(core_1.normalize(core_1.resolve(root, core_1.normalize(options.tsConfig))));
        const tsConfig = read_tsconfig_1.readTsconfig(tsConfigPath);
        wco = {
            root: core_1.getSystemPath(root),
            logger: this.context.logger,
            projectRoot: core_1.getSystemPath(projectRoot),
            // TODO: use only this.options, it contains all flags and configs items already.
            buildOptions: options,
            tsConfig,
            tsConfigPath,
            supportES2015: false,
        };
        const webpackConfigs = [
            // We don't need to write to disk.
            { plugins: [new InMemoryOutputPlugin()] },
            webpack_configs_1.getCommonConfig(wco),
            webpack_configs_1.getAotConfig(wco, host, true),
            webpack_configs_1.getStylesConfig(wco),
            webpack_configs_1.getStatsConfig(wco),
        ];
        return webpackMerge(webpackConfigs);
    }
}
exports.ExtractI18nBuilder = ExtractI18nBuilder;
function getI18nOutfile(format) {
    switch (format) {
        case 'xmb':
            return 'messages.xmb';
        case 'xlf':
        case 'xlif':
        case 'xliff':
        case 'xlf2':
        case 'xliff2':
            return 'messages.xlf';
        default:
            throw new Error(`Unsupported format "${format}"`);
    }
}
class InMemoryOutputPlugin {
    constructor() { }
    apply(compiler) {
        // tslint:disable-next-line:no-any
        compiler.outputFileSystem = new webpack.MemoryOutputFileSystem();
    }
}
exports.default = ExtractI18nBuilder;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2FuZ3VsYXJfZGV2a2l0L2J1aWxkX2FuZ3VsYXIvc3JjL2V4dHJhY3QtaTE4bi9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQWFBLGlFQUFnRjtBQUNoRiwrQ0FBMEY7QUFFMUYsNkJBQTZCO0FBRTdCLDhDQUFnRDtBQUNoRCxtQ0FBbUM7QUFFbkMsaUZBS3FEO0FBQ3JELGdGQUE0RTtBQUM1RSxnRUFBa0c7QUFFbEcsTUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBWTlDLE1BQWEsa0JBQWtCO0lBRTdCLFlBQW1CLE9BQXVCO1FBQXZCLFlBQU8sR0FBUCxPQUFPLENBQWdCO0lBQUksQ0FBQztJQUUvQyxHQUFHLENBQUMsYUFBOEQ7UUFDaEUsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUM7UUFDekMsTUFBTSxPQUFPLEdBQUcsYUFBYSxDQUFDLE9BQU8sQ0FBQztRQUN0QyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7UUFDekMsTUFBTSxXQUFXLEdBQUcsY0FBTyxDQUFDLElBQUksRUFBRSxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdEQsTUFBTSxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsYUFBYSxDQUFDLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDOUUsd0NBQXdDO1FBQ3hDLE1BQU0sU0FBUyxHQUFHLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDO1FBRW5DLE1BQU0saUJBQWlCLEdBQUcsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxhQUFhLEVBQUUsU0FBUyxFQUFFLENBQUM7UUFDcEYsTUFBTSxvQkFBb0IsR0FBRyxTQUFTLENBQUMsdUJBQXVCLENB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ICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7XG4gIEJ1aWxkRXZlbnQsXG4gIEJ1aWxkZXIsXG4gIEJ1aWxkZXJDb25maWd1cmF0aW9uLFxuICBCdWlsZGVyQ29udGV4dCxcbn0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2FyY2hpdGVjdCc7XG5pbXBvcnQgeyBMb2dnaW5nQ2FsbGJhY2ssIFdlYnBhY2tCdWlsZGVyIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2J1aWxkLXdlYnBhY2snO1xuaW1wb3J0IHsgUGF0aCwgZ2V0U3lzdGVtUGF0aCwgbm9ybWFsaXplLCByZXNvbHZlLCB2aXJ0dWFsRnMgfSBmcm9tICdAYW5ndWxhci1kZXZraXQvY29yZSc7XG5pbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgY29uY2F0TWFwLCBtYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgKiBhcyB3ZWJwYWNrIGZyb20gJ3dlYnBhY2snO1xuaW1wb3J0IHsgV2VicGFja0NvbmZpZ09wdGlvbnMgfSBmcm9tICcuLi9hbmd1bGFyLWNsaS1maWxlcy9tb2RlbHMvYnVpbGQtb3B0aW9ucyc7XG5pbXBvcnQge1xuICBnZXRBb3RDb25maWcsXG4gIGdldENvbW1vbkNvbmZpZyxcbiAgZ2V0U3RhdHNDb25maWcsXG4gIGdldFN0eWxlc0NvbmZpZyxcbn0gZnJvbSAnLi4vYW5ndWxhci1jbGktZmlsZXMvbW9kZWxzL3dlYnBhY2stY29uZmlncyc7XG5pbXBvcnQgeyByZWFkVHNjb25maWcgfSBmcm9tICcuLi9hbmd1bGFyLWNsaS1maWxlcy91dGlsaXRpZXMvcmVhZC10c2NvbmZpZyc7XG5pbXBvcnQgeyBzdGF0c0Vycm9yc1RvU3RyaW5nLCBzdGF0c1dhcm5pbmdzVG9TdHJpbmcgfSBmcm9tICcuLi9hbmd1bGFyLWNsaS1maWxlcy91dGlsaXRpZXMvc3RhdHMnO1xuaW1wb3J0IHsgQnJvd3NlckJ1aWxkZXJTY2hlbWEsIE5vcm1hbGl6ZWRCcm93c2VyQnVpbGRlclNjaGVtYSB9IGZyb20gJy4uL2Jyb3dzZXIvc2NoZW1hJztcbmNvbnN0IHdlYnBhY2tNZXJnZSA9IHJlcXVpcmUoJ3dlYnBhY2stbWVyZ2UnKTtcblxuXG5leHBvcnQgaW50ZXJmYWNlIEV4dHJhY3RJMThuQnVpbGRlck9wdGlvbnMge1xuICBicm93c2VyVGFyZ2V0OiBzdHJpbmc7XG4gIGkxOG5Gb3JtYXQ6IHN0cmluZztcbiAgaTE4bkxvY2FsZTogc3RyaW5nO1xuICBvdXRwdXRQYXRoPzogc3RyaW5nO1xuICBvdXRGaWxlPzogc3RyaW5nO1xuICBwcm9ncmVzcz86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBjbGFzcyBFeHRyYWN0STE4bkJ1aWxkZXIgaW1wbGVtZW50cyBCdWlsZGVyPEV4dHJhY3RJMThuQnVpbGRlck9wdGlvbnM+IHtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgY29udGV4dDogQnVpbGRlckNvbnRleHQpIHsgfVxuXG4gIHJ1bihidWlsZGVyQ29uZmlnOiBCdWlsZGVyQ29uZmlndXJhdGlvbjxFeHRyYWN0STE4bkJ1aWxkZXJPcHRpb25zPik6IE9ic2VydmFibGU8QnVpbGRFdmVudD4ge1xuICAgIGNvbnN0IGFyY2hpdGVjdCA9IHRoaXMuY29udGV4dC5hcmNoaXRlY3Q7XG4gICAgY29uc3Qgb3B0aW9ucyA9IGJ1aWxkZXJDb25maWcub3B0aW9ucztcbiAgICBjb25zdCByb290ID0gdGhpcy5jb250ZXh0LndvcmtzcGFjZS5yb290O1xuICAgIGNvbnN0IHByb2plY3RSb290ID0gcmVzb2x2ZShyb290LCBidWlsZGVyQ29uZmlnLnJvb3QpO1xuICAgIGNvbnN0IFtwcm9qZWN0LCB0YXJnZXROYW1lLCBjb25maWd1cmF0aW9uXSA9IG9wdGlvbnMuYnJvd3NlclRhcmdldC5zcGxpdCgnOicpO1xuICAgIC8vIE92ZXJyaWRlIGJyb3dzZXIgYnVpbGQgd2F0Y2ggc2V0dGluZy5cbiAgICBjb25zdCBvdmVycmlkZXMgPSB7IHdhdGNoOiBmYWxzZSB9O1xuXG4gICAgY29uc3QgYnJvd3NlclRhcmdldFNwZWMgPSB7IHByb2plY3QsIHRhcmdldDogdGFyZ2V0TmFtZSwgY29uZmlndXJhdGlvbiwgb3ZlcnJpZGVzIH07XG4gICAgY29uc3QgYnJvd3NlckJ1aWxkZXJDb25maWcgPSBhcmNoaXRlY3QuZ2V0QnVpbGRlckNvbmZpZ3VyYXRpb248QnJvd3NlckJ1aWxkZXJTY2hlbWE+KFxuICAgICAgYnJvd3NlclRhcmdldFNwZWMpO1xuICAgIGNvbnN0IHdlYnBhY2tCdWlsZGVyID0gbmV3IFdlYnBhY2tCdWlsZGVyKHRoaXMuY29udGV4dCk7XG5cbiAgICBjb25zdCBsb2dnaW5nQ2I6IExvZ2dpbmdDYWxsYmFjayA9IChzdGF0cywgY29uZmlnLCBsb2dnZXIpID0+IHtcbiAgICAgIGNvbnN0IGpzb24gPSBzdGF0cy50b0pzb24oKTtcbiAgICAgIGlmIChzdGF0cy5oYXNXYXJuaW5ncygpKSB7XG4gICAgICAgIHRoaXMuY29udGV4dC5sb2dnZXIud2FybihzdGF0c1dhcm5pbmdzVG9TdHJpbmcoanNvbiwgY29uZmlnLnN0YXRzKSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChzdGF0cy5oYXNFcnJvcnMoKSkge1xuICAgICAgICB0aGlzLmNvbnRleHQubG9nZ2VyLmVycm9yKHN0YXRzRXJyb3JzVG9TdHJpbmcoanNvbiwgY29uZmlnLnN0YXRzKSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiBhcmNoaXRlY3QuZ2V0QnVpbGRlckRlc2NyaXB0aW9uKGJyb3dzZXJCdWlsZGVyQ29uZmlnKS5waXBlKFxuICAgICAgY29uY2F0TWFwKGJyb3dzZXJEZXNjcmlwdGlvbiA9PlxuICAgICAgICBhcmNoaXRlY3QudmFsaWRhdGVCdWlsZGVyT3B0aW9ucyhicm93c2VyQnVpbGRlckNvbmZpZywgYnJvd3NlckRlc2NyaXB0aW9uKSksXG4gICAgICBtYXAoYnJvd3NlckJ1aWxkZXJDb25maWcgPT4gYnJvd3NlckJ1aWxkZXJDb25maWcub3B0aW9ucyksXG4gICAgICBjb25jYXRNYXAoKHZhbGlkYXRlZEJyb3dzZXJPcHRpb25zKSA9PiB7XG4gICAgICAgIGNvbnN0IGJyb3dzZXJPcHRpb25zID0gdmFsaWRhdGVkQnJvd3Nlck9wdGlvbnM7XG5cbiAgICAgICAgLy8gV2UgbmVlZCB0byBkZXRlcm1pbmUgdGhlIG91dEZpbGUgbmFtZSBzbyB0aGF0IEFuZ3VsYXJDb21waWxlciBjYW4gcmV0cmlldmUgaXQuXG4gICAgICAgIGxldCBvdXRGaWxlID0gb3B0aW9ucy5vdXRGaWxlIHx8IGdldEkxOG5PdXRmaWxlKG9wdGlvbnMuaTE4bkZvcm1hdCk7XG4gICAgICAgIGlmIChvcHRpb25zLm91dHB1dFBhdGgpIHtcbiAgICAgICAgICAvLyBBbmd1bGFyQ29tcGlsZXJQbHVnaW4gZG9lc24ndCBzdXBwb3J0IGdlbkRpciBzbyB3ZSBoYXZlIHRvIGFkanVzdCBvdXRGaWxlIGluc3RlYWQuXG4gICAgICAgICAgb3V0RmlsZSA9IHBhdGguam9pbihvcHRpb25zLm91dHB1dFBhdGgsIG91dEZpbGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRXh0cmFjdGluZyBpMThuIHVzZXMgdGhlIGJyb3dzZXIgdGFyZ2V0IHdlYnBhY2sgY29uZmlnIHdpdGggc29tZSBzcGVjaWZpYyBvcHRpb25zLlxuICAgICAgICBjb25zdCB3ZWJwYWNrQ29uZmlnID0gdGhpcy5idWlsZFdlYnBhY2tDb25maWcocm9vdCwgcHJvamVjdFJvb3QsIHtcbiAgICAgICAgICAvLyB0b2RvOiByZW1vdmUgdGhpcyBjYXN0aW5nIHdoZW4gJ0N1cnJlbnRGaWxlUmVwbGFjZW1lbnQnIGlzIGNoYW5nZWQgdG8gJ0ZpbGVSZXBsYWNlbWVudCdcbiAgICAgICAgICAuLi4oYnJvd3Nlck9wdGlvbnMgYXMgTm9ybWFsaXplZEJyb3dzZXJCdWlsZGVyU2NoZW1hKSxcbiAgICAgICAgICBvcHRpbWl6YXRpb246IHtcbiAgICAgICAgICAgIHNjcmlwdHM6IGZhbHNlLFxuICAgICAgICAgICAgc3R5bGVzOiBmYWxzZSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGkxOG5Mb2NhbGU6IG9wdGlvbnMuaTE4bkxvY2FsZSxcbiAgICAgICAgICBpMThuRm9ybWF0OiBvcHRpb25zLmkxOG5Gb3JtYXQsXG4gICAgICAgICAgaTE4bkZpbGU6IG91dEZpbGUsXG4gICAgICAgICAgYW90OiB0cnVlLFxuICAgICAgICAgIHByb2dyZXNzOiBvcHRpb25zLnByb2dyZXNzLFxuICAgICAgICAgIGFzc2V0czogW10sXG4gICAgICAgICAgc2NyaXB0czogW10sXG4gICAgICAgICAgc3R5bGVzOiBbXSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHdlYnBhY2tCdWlsZGVyLnJ1bldlYnBhY2sod2VicGFja0NvbmZpZywgbG9nZ2luZ0NiKTtcbiAgICAgIH0pLFxuICAgICk7XG4gIH1cblxuICBidWlsZFdlYnBhY2tDb25maWcoXG4gICAgcm9vdDogUGF0aCxcbiAgICBwcm9qZWN0Um9vdDogUGF0aCxcbiAgICBvcHRpb25zOiBOb3JtYWxpemVkQnJvd3NlckJ1aWxkZXJTY2hlbWEsXG4gICkge1xuICAgIGxldCB3Y286IFdlYnBhY2tDb25maWdPcHRpb25zO1xuXG4gICAgY29uc3QgaG9zdCA9IG5ldyB2aXJ0dWFsRnMuQWxpYXNIb3N0KHRoaXMuY29udGV4dC5ob3N0IGFzIHZpcnR1YWxGcy5Ib3N0PGZzLlN0YXRzPik7XG5cbiAgICBjb25zdCB0c0NvbmZpZ1BhdGggPSBnZXRTeXN0ZW1QYXRoKG5vcm1hbGl6ZShyZXNvbHZlKHJvb3QsIG5vcm1hbGl6ZShvcHRpb25zLnRzQ29uZmlnKSkpKTtcbiAgICBjb25zdCB0c0NvbmZpZyA9IHJlYWRUc2NvbmZpZyh0c0NvbmZpZ1BhdGgpO1xuXG4gICAgd2NvID0ge1xuICAgICAgcm9vdDogZ2V0U3lzdGVtUGF0aChyb290KSxcbiAgICAgIGxvZ2dlcjogdGhpcy5jb250ZXh0LmxvZ2dlcixcbiAgICAgIHByb2plY3RSb290OiBnZXRTeXN0ZW1QYXRoKHByb2plY3RSb290KSxcbiAgICAgIC8vIFRPRE86IHVzZSBvbmx5IHRoaXMub3B0aW9ucywgaXQgY29udGFpbnMgYWxsIGZsYWdzIGFuZCBjb25maWdzIGl0ZW1zIGFscmVhZHkuXG4gICAgICBidWlsZE9wdGlvbnM6IG9wdGlvbnMsXG4gICAgICB0c0NvbmZpZyxcbiAgICAgIHRzQ29uZmlnUGF0aCxcbiAgICAgIHN1cHBvcnRFUzIwMTU6IGZhbHNlLFxuICAgIH07XG5cbiAgICBjb25zdCB3ZWJwYWNrQ29uZmlnczoge31bXSA9IFtcbiAgICAgIC8vIFdlIGRvbid0IG5lZWQgdG8gd3JpdGUgdG8gZGlzay5cbiAgICAgIHsgcGx1Z2luczogW25ldyBJbk1lbW9yeU91dHB1dFBsdWdpbigpXSB9LFxuICAgICAgZ2V0Q29tbW9uQ29uZmlnKHdjbyksXG4gICAgICBnZXRBb3RDb25maWcod2NvLCBob3N0LCB0cnVlKSxcbiAgICAgIGdldFN0eWxlc0NvbmZpZyh3Y28pLFxuICAgICAgZ2V0U3RhdHNDb25maWcod2NvKSxcbiAgICBdO1xuXG4gICAgcmV0dXJuIHdlYnBhY2tNZXJnZSh3ZWJwYWNrQ29uZmlncyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0STE4bk91dGZpbGUoZm9ybWF0OiBzdHJpbmcpIHtcbiAgc3dpdGNoIChmb3JtYXQpIHtcbiAgICBjYXNlICd4bWInOlxuICAgICAgcmV0dXJuICdtZXNzYWdlcy54bWInO1xuICAgIGNhc2UgJ3hsZic6XG4gICAgY2FzZSAneGxpZic6XG4gICAgY2FzZSAneGxpZmYnOlxuICAgIGNhc2UgJ3hsZjInOlxuICAgIGNhc2UgJ3hsaWZmMic6XG4gICAgICByZXR1cm4gJ21lc3NhZ2VzLnhsZic7XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgZm9ybWF0IFwiJHtmb3JtYXR9XCJgKTtcbiAgfVxufVxuXG5jbGFzcyBJbk1lbW9yeU91dHB1dFBsdWdpbiB7XG4gIGNvbnN0cnVjdG9yKCkgeyB9XG5cbiAgYXBwbHkoY29tcGlsZXI6IHdlYnBhY2suQ29tcGlsZXIpOiB2b2lkIHtcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYW55XG4gICAgY29tcGlsZXIub3V0cHV0RmlsZVN5c3RlbSA9IG5ldyAod2VicGFjayBhcyBhbnkpLk1lbW9yeU91dHB1dEZpbGVTeXN0ZW0oKTtcbiAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IEV4dHJhY3RJMThuQnVpbGRlcjtcbiJdfQ==