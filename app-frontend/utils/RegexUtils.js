export default {
  /**
   * Escape all valid Regex expressions in a string.
   *
   * @param {String} str
   * @return {String}
   */
  escape(str) {
    return str.replace(/[\-\[\]\/\{}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  }
};
