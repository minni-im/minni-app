import recorder from "tape-recorder";

let AccountSchema = new recorder.Schema({
  name: String,
  description: String,
  inviteToken: String,
  token: String,
  users: Array,
  adminId: String
});

AccountSchema.method("toAPI", function toAPI(isAdmin = false) {
  let json = {
    id: this.id,
    name: this.name,
    description: this.description,
    dateCreated: this.dateCreated,
    lastUpdated: this.lastUpdated,
    users: this.users,
    usersCount: this.users.length,
    adminId: this.adminId
  };
  if (isAdmin) {
    json.inviteToken = this.inviteToken;
  }
  return json;
});

AccountSchema.static("getListForUser", function getListForUser (userId) {
  return this.findAll().then(accounts => {
    return accounts.filter(account => {
      return account.users.indexOf(userId) !== -1;
    });
  });
});

export default recorder.model("Account", AccountSchema);
