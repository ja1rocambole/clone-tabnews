function getOrigin() {
  if (["test", "development"].includes(process.env.NODE_ENV)) {
    return "https://localhost:3000";
  }

  if (process.env.VERCEL_ENV === "preview") {
    return `htts://${process.env.VERCEL_URL}`;
  }

  return "https://localhost.com.br";
}

const webserver = {
  getOrigin,
};

export default webserver;
