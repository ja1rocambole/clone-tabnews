import database from "infra/database.js";
import webserver from "infra/webserver.js";
import email from "infra/email.js";

const EXPIRATION_IN_MILLISECONDS = 60 * 15 * 1000; // 15 minutes

async function create(userId) {
  const expires_at = new Date(Date.now() + EXPIRATION_IN_MILLISECONDS);

  const newToken = await runInsertQuery(userId, expires_at);
  return newToken;

  async function runInsertQuery(userId, expires_at) {
    const results = await database.query({
      text: `
        INSERT INTO
          user_activation_tokens (user_id, expires_at)
        VALUES
          ($1, $2)
        RETURNING
          *
      ;`,
      values: [userId, expires_at],
    });

    return results.rows[0];
  }
}

async function findOneByUserId(userId) {
  const newToken = runSelectQuery(userId);
  return newToken;

  async function runSelectQuery(userId) {
    const results = await database.query({
      text: `
        SELECT 
          *
        FROM
          user_activation_tokens
        WHERE
          user_id = $1
        LIMIT 
          1
      ;`,
      values: [userId],
    });

    return results.rows[0];
  }
}

async function sendEmailToUser(user, activationToken) {
  await email.send({
    from: "TabNews <contato@tabnews.com.br>",
    to: user.email,
    subject: "Ative seu cadastro no TabNews!",
    text: `${user.username}, clique no link abaixo para ativar seu cadastro no TabNews:

${webserver.getOrigin()}/cadastro/ativar/${activationToken.id}
`,
  });
}

const activation = {
  create,
  findOneByUserId,
  sendEmailToUser,
};

export default activation;
