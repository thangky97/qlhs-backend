module.exports = {
  apps: [
    {
      name: "v-quantum",
      script: "C:/Apps/Vquantum/v-quantum-backend/server.js",
      env: {
        NODE_ENV: "production",
        PORT: 9000,
      },
      instances: "max",
      autorestart: true,
      watch: false,
    },
  ],
};
