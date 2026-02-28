const fs = require('fs');
const path = require('path');

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);
  const env = {};

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const eq = trimmed.indexOf('=');
    if (eq <= 0) {
      continue;
    }

    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    env[key] = value;
  }

  return env;
}

module.exports = function inlineDotenvPlugin({ types: t }) {
  return {
    name: 'inline-dotenv',
    visitor: {
      ImportDeclaration(importPath, state) {
        const opts = state.opts || {};
        const moduleName = opts.moduleName || '@env';
        if (importPath.node.source.value !== moduleName) {
          return;
        }

        const envPath = path.resolve(process.cwd(), opts.path || '.env');
        const envVars = parseEnvFile(envPath);
        const allowUndefined = opts.allowUndefined !== false;

        const declarations = importPath.node.specifiers.map(specifier => {
          if (!t.isImportSpecifier(specifier)) {
            throw importPath.buildCodeFrameError(
              'Only named imports are supported from @env.',
            );
          }

          const importedName = specifier.imported.name;
          const localName = specifier.local.name;
          const rawValue = envVars[importedName];

          if (rawValue === undefined && !allowUndefined) {
            throw importPath.buildCodeFrameError(
              `Missing env var "${importedName}" in ${envPath}.`,
            );
          }

          return t.variableDeclaration('const', [
            t.variableDeclarator(
              t.identifier(localName),
              rawValue === undefined ? t.identifier('undefined') : t.stringLiteral(rawValue),
            ),
          ]);
        });

        importPath.replaceWithMultiple(declarations);
      },
    },
  };
};
