const platform = navigator.platform;

export default {
  isWindows() {
    return platform.toLowerCase().substring(0, 3) === "win";
  },
  
  isOSX() {
    return platform.toLowerCase().substring(0, 3) === "mac";
  }
};
