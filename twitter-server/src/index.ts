import apolloServer from "./app";

async function init() {
  const app = await apolloServer();
  app.listen(4000, () => {
    console.log("server is listening on port: 4000");
  });
}

init();
