import Waterline from "waterline";

export default Waterline.Collection.extend({
  identity: "user",
  connection: "minniCouch",
  attributes: {
    firstName: "string",
    lastName: "string"
  }
});
