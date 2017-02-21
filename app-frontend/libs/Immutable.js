import Immutable from "immutable";

function makeOrderedMap(map, list, ownerID, hash) {
  const omap = Object.create(Immutable.OrderedMap.prototype);
  omap.size = map ? map.size : 0;
  omap._map = map;
  omap._list = list;
  omap.__ownerID = ownerID;
  omap.__hash = hash;
  return omap;
}

Immutable.OrderedMap.prototype.replace = function (oldKey, newKey, newValue) {
  const map = this._map;
  const list = this._list;
  const i = map.get(oldKey);

  if (i === undefined) {
    return this.set(newKey, newValue);
  }

  const newMap = map.delete(oldKey).set(newKey, i);
  const newList = list.set(i, [newKey, newValue]);
  if (this.__ownerID) {
    this.size = newMap.size;
    this._map = newMap;
    this._list = newList;
    this.__hash = undefined;
    return this;
  }

  return makeOrderedMap(newMap, newList);
};
