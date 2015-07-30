import Waterline from "waterline";

export default Waterline.Collection.extend({
  identity: "user",
  connection: "couchdb",
  attributes: {
    firstName: "string",
    lastName: "string"
  }
});
