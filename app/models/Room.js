import Waterline from "waterline";

export default Waterline.Collection.extend({
  identity: "room",
  connection: "minniCouch",
  attributes: {
    name: "string",
    topic: "string",
    token: "string"
  }
});
