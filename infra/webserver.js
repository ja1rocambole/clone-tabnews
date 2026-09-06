function getOrigin() {
  if (["test", "development"].includes(process.env.NODE_ENV)) {
    return "http://localhost:3000";
  }

  if (process.env.VERCEL_ENV === "preview") {
    return `htts://${process.env.VERCEL_URL}`;
  }

  return "https://joaofernandes.dev.br";
}

const webserver = {
  origin: getOrigin(),
};

export default webserver;
