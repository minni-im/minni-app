import recorder from "tape-recorder";

let AuditSchema = new recorder.Schema({
  userId: String,
  accountId: String,
  roomId: String
});

export default recorder.model("Audit", AuditSchema);
