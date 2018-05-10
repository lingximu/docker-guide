module.exports = {
  apps : [{
    name   : "app",
    script : "./cli.js",
    watch  : true,
    args: "app",
    env: {
      "NODE_ENV": "production"
    },
  }]
}
