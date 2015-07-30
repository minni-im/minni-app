import Waterline from "waterline";

export default Waterline.Collection.extend({
  identity: "message",
  connection: "couchdb",
  attributes: {
    content: "string"
  }
});
