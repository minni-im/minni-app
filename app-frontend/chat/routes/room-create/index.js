import RoomCreate from "./RoomCreate.react";
import ContactList from "../../components/ContactListContainer.react";

export default {
  path: "create",
  components: {
    content: RoomCreate,
    sidebar: ContactList
  }
};
