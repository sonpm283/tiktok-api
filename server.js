const app = require("./src/app");

const PORT = process.env.PORT || 3056;

const server = app.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`🚀 ⚡️[server]: Server is running at http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
  server.close(() => console.log(`Exit Server Express`))
})
