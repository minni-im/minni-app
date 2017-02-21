export function Mixin(Parent, ...mixins) {
  class Mixed extends Parent {}
  for (const mixin of mixins) {
    for (const prop of Object.keys(mixin)) {
      Mixed.prototype[prop] = mixin[prop];
    }
  }
  return Mixed;
}
