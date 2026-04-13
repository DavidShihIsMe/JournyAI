const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, "..");

const config = getDefaultConfig(projectRoot);

// Only watch the shared lib/ directory — not the entire parent
// This prevents Metro from picking up the root package.json
config.watchFolders = [path.resolve(monorepoRoot, "lib")];

// Resolve modules only from mobile/node_modules
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
];

module.exports = withNativeWind(config, { input: "./global.css" });
