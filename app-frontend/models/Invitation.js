import Immutable from "immutable";
import moment from "moment";

const InvitationRecord = Immutable.Record({
  token: undefined,
  usage: 0,
  maxAge: undefined,
  maxUsage: undefined,
  accountId: undefined,
  inviterId: undefined,
  inviter: undefined,
  dateCreated: undefined
});

export default class Invitation extends InvitationRecord {
  getExpiresAt() {
    if (this.maxAge > 0) {
      const dateCreated = moment(this.dateCreated);
      return dateCreated.add(this.maxAge, "milliseconds").toDate();
    }
    return Infinity;
  }

  get isExpired() {
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
