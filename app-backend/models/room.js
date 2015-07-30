import Waterline from "waterline";

export default Waterline.Collection.extend({
  identity: "room",
  connection: "couchdb",
  attributes: {
    name: "string",
    topic: "string",
    token: "string"
  }
});
