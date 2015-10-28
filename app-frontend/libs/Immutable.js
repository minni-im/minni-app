import Immutable from "immutable";

function makeOrderedMap(map, list, ownerID, hash) {
  let omap = Object.create(Immutable.OrderedMap.prototype);
  omap.size = map ? map.size : 0;
  omap._map = map;
  omap._list = list;
  omap.__ownerID = ownerID;
  omap.__hash = hash;
  return omap;
}

Immutable.OrderedMap.prototype.replace = function (oldKey, newKey, newValue) {
  let map = this._map;
  let list = this._list;
  let i = map.get(oldKey);

  if (i === undefined) {
    return this.set(newKey, newValue);
  }

  let newMap = map.delete(oldKey).set(newKey, i);
  let newList = list.set(i, [newKey, newValue]);
  if (this.__ownerID) {
    this.size = newMap.size;
    this._map = newMap;
    this._list = newList;
    this.__hash = undefined;
    return this;
  }

  return makeOrderedMap(newMap, newList);
};
