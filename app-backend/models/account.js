import Waterline from "waterline";

export default Waterline.Collection.extend({
  identity: "account",
  connection: "couchdb",
  attributes: {
    name: "string",
    description: "string",
    inviteToken: "string",
    token: "string"
  }
});
