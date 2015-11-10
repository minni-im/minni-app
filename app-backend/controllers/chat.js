import recorder from "tape-recorder";

export default (app) => {

  app.io.route("disconnect", (req) => {
    console.log("client socket disconnection");
  });
  
};
