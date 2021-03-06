function interopDefault(dep) {
  return dep.default ? dep.default : dep;
}

export const getPlugin = (key, type, minniModule = false) => {
  const prefix = minniModule ? "@minni-im/minni" : "minni";
  const pluginName = `${prefix}-${type}-${key}`;
  let plugin;
  try {
    plugin = interopDefault(require(pluginName));
  } catch (exception) {
    throw new Error(
      `Module '${pluginName}' seems to not be available. Did you declare it in your package.json ? If yes, we failed trying to intanciate it.`,
    );
  }

  const Provider = plugin && plugin[type];
  if (Provider) {
    return Provider;
  }

  throw new Error(`Module '${pluginName}' is not a '${type}' provider`);
};
