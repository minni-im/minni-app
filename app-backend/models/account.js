import recorder from "tape-recorder";

let AccountSchema = new recorder.Schema({
  name: String,
  description: String,
  inviteToken: String,
  token: String,
  usersId: Array,
  adminId: String
});

AccountSchema.method("toAPI", function toAPI(isAdmin = false) {
  let json = {
    id: this.id,
    name: this.name,
    description: this.description,
    dateCreated: this.dateCreated,
    lastUpdated: this.lastUpdated,
    usersId: this.usersId,
    usersCount: this.usersId.length,
    adminId: this.adminId
  };
  if (isAdmin) {
    json.inviteToken = this.inviteToken;
  }
  return json;
});

AccountSchema.method("userBelongTo", function userBelongTo(userId) {
  return this.usersId.indexOf(userId) !== -1;
});

AccountSchema.static("getListForUser", function getListForUser (userId) {
  return this.findAll().then(accounts => {
    return accounts.filter(account => {
      return account.usersId.indexOf(userId) !== -1;
    });
  });
});

export default recorder.model("Account", AccountSchema);
