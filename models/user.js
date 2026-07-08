import database from "infra/database.js";
import password from "models/password.js";
import { NotFoundError, ValidationError } from "infra/errors.js";

async function findOneByUsername(username) {
  const userFound = runSelectQuery(username);

  return userFound;

  async function runSelectQuery(username) {
    const results = await database.query({
      text: `
    SELECT
      *
    FROM
      users
    WHERE
      LOWER(username) = LOWER($1)
    LIMIT
      1
    ;`,
      values: [username],
    });

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: "O username informado não foi encontrado no sistema.",
        action: "Verifique se 'username' foi digitado correatamente.",
      });
    }
    return results.rows[0];
  }
}

async function create(userInputValues) {
  await validateUniqueEmail(userInputValues.email);
  await validateUniqueUsername(userInputValues.username);
  await hashPasswordInObject(userInputValues);

  const newUser = await runInsertQuery(userInputValues);

  return newUser;

  async function validateUniqueEmail(email) {
    const results = await database.query({
      text: `
    SELECT
      email
    FROM
      users
    WHERE
      LOWER(email) = LOWER($1)
    ;`,
      values: [email],
    });

    if (results.rowCount > 0) {
      throw new ValidationError({
        message: "O email importado já está sendo ultilizado.",
        action: "Ultilize outro email para realizar o cadastro.",
      });
    }
  }

  async function validateUniqueUsername(username) {
    const results = await database.query({
      text: `
    SELECT
      username
    FROM
      users
    WHERE
      LOWER(username) = LOWER($1)
    ;`,
      values: [username],
    });

    if (results.rowCount > 0) {
      throw new ValidationError({
        message: "O username importado já está sendo ultilizado.",
        action: "Ultilize outro username para realizar o cadastro.",
      });
    }
  }

  async function hashPasswordInObject(userInputValues) {
    const hashedPassword = await password.hash(userInputValues.password);
    userInputValues.password = hashedPassword;
  }
}

async function runInsertQuery(userInputValues) {
  const results = await database.query({
    text: `
    INSERT INTO
      users (username, email, password) 
    VALUES 
      ($1, $2, $3)
    RETURNING
      *
    ;`,
    values: [
      userInputValues.username,
      userInputValues.email,
      userInputValues.password,
    ],
  });

  return results.rows[0];
}

const user = {
  findOneByUsername,
  create,
};

export default user;
