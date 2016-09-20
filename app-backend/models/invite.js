import recorder from "tape-recorder";
import crypto from "crypto";
import bcrypt from "bcryptjs";

const InviteSchema = new recorder.Schema({
  userId: String,
  accountId: String,
  maxAge: String,
  maxUsage: String,
  token: String,
  hash: String
});

InviteSchema.method("generateToken", (userId, accountId, maxAge, maxUsage) => {
  const Invite = recorder.model("Invite");
  const password = crypto.randomBytes(3).toString("hex");
  const hash = bcrypt.hashSync(password);

  const payload = {
    accountId,
    userId,
    maxAge,
    hash
  };
  if (maxUsage) {
    payload.maxUsage = maxUsage;
  }

  const invite = new Invite(payload);
  return invite.save()
    .then((newInvite) => {
      newInvite.token = new Buffer(`${newInvite.id}:${hash}`).toString("base64");
      return newInvite.save();
    });
});

InviteSchema.static("findByToken", (token) => {
  const [inviteId, hash] = new Buffer(token, "base64").toString("ascii").split(":");
  return this.findById(inviteId)
    .then(invite => new Promise((resolve, reject) => {
      bcrypt.compare(hash, invite.hash, (errorHash, isMatch) => {
        if (errorHash) {
          reject(errorHash);
          return;
        }
        resolve(isMatch ? invite : false);
      });
    }));
});

export default recorder.model("Invite", InviteSchema);
