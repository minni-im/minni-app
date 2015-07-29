import Waterline from "waterline";

export default Waterline.Collection.extend({
  identity: "message",
  connection: "minniCouch",
  attributes: {
    content: "string"
  }
});
