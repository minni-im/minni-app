const platform = navigator.platform;

export function isWindows() {
  return platform.toLowerCase().substring(0, 3) === "win";
}

export function isOSX() {
  return platform.toLowerCase().substring(0, 3) === "mac";
}
