import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { isPlainObject } from "lodash";

let normalizeEnvValue = (value, isArray) => {
  value = value.trim();
  if (isArray) {
    value.split(",").map(item => {
      return normalizeEnvValue(item);
    });
  }
  // YAML compatible boolean values
  else if (/^(y|yes|true|on)$/i.test(value)) {
    return true;
  }
  else if (/^(n|no|false|off)$/i.test(value)) {
    return false;
  }
  else if (/^[+-]?\d+.?\d*$/.test(value) && !isNaN(parseInt(value, 10))) {
    return parseInt(value, 10);
  }

  // finally simply look if the value could be also an env variable itself
  return process.env[value] || value;
};

let config = {};

let steps = [
  // loadDefaultSettings
  context => {
    let file = fs.readFileSync(path.join(__dirname, "..", "default.yml"), "utf8");
    Object.assign(context, yaml.safeLoad(file));
  },

  // loadSettings
  context => {
    let file = fs.readFileSync(path.join(__dirname, "..", "settings.yml"), "utf8");
    Object.assign(context, yaml.safeLoad(file));
  },

  // mergeEnvSettings
  context => {
    let merge = (baseKey, object) => {
      for (let key in object) {
        let value = object[key];
        let envKey = baseKey + "_" + key.replace(/([A-Z]+)/g, "_$1").toUpperCase();
        if (isPlainObject(value)) {
          merge(envKey, value);
        } else {
          let envValue = process.env[envKey];
          if (envValue) {
            object[key] = normalizeEnvValue(envValue, Array.isArray(object[key]));
          }
        }
      }
    };
    merge("MINNI", context);
  }
];

for (let step of steps) {
  step(config);
}

export default config;
