const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Raiz do monorepo
const monorepoRoot = path.resolve(__dirname, '../..');

const config = getDefaultConfig(__dirname);

// Incluir os defaults + a raiz do monorepo nos watchFolders
config.watchFolders = [...(config.watchFolders || []), monorepoRoot];

// Resolver node_modules do monorepo (prioridade local primeiro)
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

// Resolver o alias @mentemx/core para o source
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  '@mentemx/core': path.resolve(monorepoRoot, 'packages/core/src'),
};

module.exports = config;
