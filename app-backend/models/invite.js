import recorder from "tape-recorder";
import crypto from "crypto";
import moment from "moment";

const InviteSchema = new recorder.Schema({
  token: String,
  inviterId: String,
  accountId: String,
  maxAge: Number,
  maxUsage: Number,
  usage: {
    type: Number,
    default: 0
  }
});

InviteSchema.virtual({
  expired: {
    get() {
      if (this.maxUsage && this.usage === this.maxUsage) {
        return true;
      }
      const maxAge = this.maxAge;
      if (maxAge > 0) {
        const dateCreated = moment(this.dateCreated);
        if (dateCreated.add(maxAge, "milliseconds").isBefore(Date.now())) {
          return true;
        }
      }
      return false;
    }
  }
});

InviteSchema.method("toAPI", function toAPI() {
  const { id, token, accountId, inviterId, maxAge, maxUsage, usage, dateCreated } = this;
  return {
    id,
    token,
    accountId,
    inviterId,
    maxAge,
    maxUsage,
    usage,
    dateCreated
  };
});

InviteSchema.static("generateToken", (userId, accountId, maxAge, maxUsage) => {
  const Invite = recorder.model("Invite");
  const token = new Buffer(crypto.randomBytes(3).toString("hex")).toString("base64");

  const payload = {
    accountId,
    inviterId: userId,
    maxAge,
    token
  };

  if (maxUsage) {
    payload.maxUsage = maxUsage;
  }

  const invite = new Invite(payload);
  return invite.save();
});

InviteSchema.static("findByToken", function findByToken(token) {
  return this.where("token", { key: token }).then((invites) => {
    if (invites.length) {
      return invites[0];
    }
    return Promise.reject(false);
  });
});

export default recorder.model("Invite", InviteSchema);
