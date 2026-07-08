import bcriptjs from "bcryptjs";

async function hash(password) {
  const rounds = getRounds();
  return await bcriptjs.hash(password, rounds);
}

function getRounds() {
  let rounds = 1;

  if (process.env.NODE_ENV === "production") {
    rounds = 14;
  }

  return rounds;
}

async function compare(providedPassword, storedPassword) {
  return await bcriptjs.compare(providedPassword, storedPassword);
}

const password = {
  hash,
  compare,
};

export default password;
