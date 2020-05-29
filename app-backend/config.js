import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import isPlainObject from "lodash.isplainobject";

function normalizeEnvValue(value, isArray) {
  value = value.trim();
  if (isArray) {
    value.split(",").map(item => normalizeEnvValue(item));
  } else if (/^(y|yes|true|on)$/i.test(value)) {
    // YAML compatible boolean values
    return true;
  } else if (/^(n|no|false|off)$/i.test(value)) {
    return false;
  } else if (/^[+-]?\d+.?\d*$/.test(value) && !isNaN(parseInt(value, 10))) {
    return parseInt(value, 10);
  }

  // finally simply look if the value could be also an env variable itself
  return process.env[value] || value;
}

const config = {};

[
  // loadDefaultSettings
  (context) => {
    const file = fs.readFileSync(path.join(__dirname, "..", "..", "default.yml"), "utf8");
    Object.assign(context, yaml.safeLoad(file));
  },

  // loadSettings
  (context) => {
    const file = fs.readFileSync(path.join(__dirname, "..", "..", "settings.yml"), "utf8");
    Object.assign(context, yaml.safeLoad(file));
  },

  // mergeEnvSettings
  (context) => {
    const merge = (baseKey, object) => {
      for (const key in object) {
        if (!object.hasOwnProperty(key)) {
          continue;
        }
        const value = object[key];
        const envKey = `${baseKey}_${key.replace(/([A-Z]+)/g, "_$1").toUpperCase()}`;
        if (isPlainObject(value)) {
          merge(envKey, value);
        } else {
          const envValue = process.env[envKey];
          if (envValue) {
            object[key] = normalizeEnvValue(envValue, Array.isArray(object[key]));
          }
        }
      }
    };
    merge("MINNI", context);
  },
].forEach(step => step(config));

export default config;
