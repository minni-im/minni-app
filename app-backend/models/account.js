import recorder from "@minni-im/tape-recorder";

const AccountSchema = new recorder.Schema({
  name: {
    type: String,
    view: true,
  },
  description: String,
  usersId: {
    type: Array,
    default: [],
  },
  adminId: String,
});

AccountSchema.method("toAPI", function toAPI() {
  return {
    id: this.id,
    name: this.name,
    description: this.description,
    dateCreated: this.dateCreated,
    lastUpdated: this.lastUpdated,
    usersId: this.usersId,
    usersCount: this.usersId.length,
    adminId: this.adminId,
  };
});

AccountSchema.method("userBelongTo", function userBelongTo(userId) {
  return this.usersId.indexOf(userId) !== -1;
});

AccountSchema.static("getListForUser", function getListForUser(userId) {
  return this.findAll().then((accounts) =>
    accounts.filter((account) => account.usersId.indexOf(userId) !== -1)
  );
});

export default recorder.model("Account", AccountSchema);
