export default {
  getPlugin(key, type) {
    const pluginName = `minni-${type}-${key}`;
    let plugin;
    try {
      plugin = require(pluginName);
    } catch(exception) {
      throw `Module '${pluginName}' seems to not be available. Did you declare it your package.json ?`;
    }

    let Provider = plugin && plugin[type];
    if (Provider) {
      return Provider;
    }

    throw `Module '${pluginName}' is not a '${type}' provider`;
  }
};
