const fs = require('fs');
const path = require('path');

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, 'utf8');
  const env = {};
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx !== -1) {
      const key = trimmed.slice(0, idx).trim();
      let val = trimmed.slice(idx + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      env[key] = val;
    }
  }
  return env;
}

const envVars = {
  ...parseEnvFile(path.resolve(__dirname, '.env')),
  ...parseEnvFile(path.resolve(__dirname, '.env.local')),
};

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    function inlineEnvPlugin({ types: t }) {
      return {
        visitor: {
          MemberExpression(nodePath) {
            if (
              nodePath.get('object').isMemberExpression() &&
              nodePath.get('object.object').isIdentifier({ name: 'process' }) &&
              nodePath.get('object.property').isIdentifier({ name: 'env' })
            ) {
              const key =
                nodePath.node.property.name || nodePath.node.property.value;
              if (key && Object.prototype.hasOwnProperty.call(envVars, key)) {
                nodePath.replaceWith(t.stringLiteral(envVars[key] || ''));
              }
            }
          },
        },
      };
    },
  ],
};
