import { version as uuidVersion } from "uuid";
import orchestrator from "tests/orchestrator.js";
import user from "models/user.js";
import password from "models/password.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/users", () => {
  describe("Anonymous user", () => {
    test("With unique and valid data", async () => {
      const res = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "lari",
          email: "lari@email.com",
          password: "123456",
        }),
      });

      expect(res.status).toBe(201);

      const resBody = await res.json();

      expect(resBody).toEqual({
        id: resBody.id,
        username: "lari",
        email: "lari@email.com",
        password: resBody.password,
        created_at: resBody.created_at,
        updated_at: resBody.updated_at,
      });

      expect(uuidVersion(resBody.id)).toBe(4);
      expect(Date.parse(resBody.created_at)).not.toBeNaN();
      expect(Date.parse(resBody.updated_at)).not.toBeNaN();

      const userInDatabase = await user.findOneByUsername("lari");
      const corectPasswodMatch = await password.compare(
        "123456",
        userInDatabase.password,
      );

      const incorectPasswodMatch = await password.compare(
        "senhaerrada",
        userInDatabase.password,
      );

      expect(corectPasswodMatch).toBe(true);
      expect(incorectPasswodMatch).toBe(false);
    });

    test("With duplicate 'email'", async () => {
      const res1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "emailDuplicado1",
          email: "email@email.com",
          password: "123456",
        }),
      });

      expect(res1.status).toBe(201);

      const res2 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "emailDuplicado2",
          email: "Email@email.com",
          password: "123456",
        }),
      });

      expect(res2.status).toBe(400);

      const res2Body = await res2.json();

      expect(res2Body).toEqual({
        name: "ValidationError",
        message: "O email informado já está sendo ultilizado.",
        action: "Ultilize outro email para realizar esta operação.",
        status_code: 400,
      });
    });

    test("With duplicate 'username'", async () => {
      const res1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "usernameDuplicado",
          email: "usernameduplicado1@email.com",
          password: "123456",
        }),
      });

      expect(res1.status).toBe(201);

      const res2 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "usernameDuplicado",
          email: "usernameduplicado2@email.com",
          password: "123456",
        }),
      });

      expect(res2.status).toBe(400);

      const res2Body = await res2.json();

      expect(res2Body).toEqual({
        name: "ValidationError",
        message: "O username informado já está sendo ultilizado.",
        action: "Ultilize outro username para realizar esta operação.",
        status_code: 400,
      });
    });
  });
});
