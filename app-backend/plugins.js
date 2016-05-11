export default {
  getPlugin(key, type) {
    const pluginName = `minni-${type}-${key}`;
    let plugin;
    try {
      plugin = require(pluginName).default;
    } catch (exception) {
      console.error(exception);
      throw new Error(`Module '${pluginName}' seems to not be available. Did you declare it in your package.json ? If yes, we failed trying to intanciate it.`);
    }

    const Provider = plugin && plugin[type];
    if (Provider) {
      return Provider;
    }

    throw new Error(`Module '${pluginName}' is not a '${type}' provider`);
  }
};
