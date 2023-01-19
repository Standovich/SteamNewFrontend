const PROXY_CONFIG = [
  {
    context: [
      "/weatherforecast",
      "/api/user",
      "/api/game",
      "/api/post",
      "/api/developer"
    ],
    target: "https://localhost:7172",
    secure: false
  }
]

module.exports = PROXY_CONFIG;
