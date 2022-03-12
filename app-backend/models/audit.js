import recorder from "@minni-im/tape-recorder";

const AuditSchema = new recorder.Schema({
  userId: String,
  accountId: String,
  roomId: String,
});

export default recorder.model("Audit", AuditSchema);
