const validateEnv = () => {
  const required = [
    "MONGODB_URI",
    "JWT_SECRET",
    "ADMIN_EMAIL",
    "ADMIN_PASSWORD",
  ];

  const missing = [];
  required.forEach((key) => {
    if (!process.env[key]) {
      missing.push(key);
    }
  });

  if (missing.length > 0) {
    console.error("FATAL ERROR: Missing required environment variables during startup:");
    missing.forEach((key) => console.error(` - ${key}`));
    process.exit(1);
  }
};

export default validateEnv;
