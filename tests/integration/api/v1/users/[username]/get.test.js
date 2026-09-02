import { version as uuidVersion } from "uuid";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/v1/users/[username]", () => {
  describe("Anonymous user", () => {
    test("With exact case match", async () => {
      await orchestrator.createUser({
        username: "MesmoCase",
      });

      const res2 = await fetch("http://localhost:3000/api/v1/users/MesmoCase");

      expect(res2.status).toBe(200);

      const res2Body = await res2.json();

      expect(res2Body).toEqual({
        id: res2Body.id,
        username: "MesmoCase",
        features: ["read:activation_token"],
        created_at: res2Body.created_at,
        updated_at: res2Body.updated_at,
      });

      expect(uuidVersion(res2Body.id)).toBe(4);
      expect(Date.parse(res2Body.created_at)).not.toBeNaN();
      expect(Date.parse(res2Body.updated_at)).not.toBeNaN();
    });

    test("With case mismatch", async () => {
      await orchestrator.createUser({
        username: "CaseDiferente",
      });

      const res2 = await fetch(
        "http://localhost:3000/api/v1/users/casediferente",
      );

      expect(res2.status).toBe(200);

      const res2Body = await res2.json();

      expect(res2Body).toEqual({
        id: res2Body.id,
        username: "CaseDiferente",
        features: ["read:activation_token"],
        created_at: res2Body.created_at,
        updated_at: res2Body.updated_at,
      });

      expect(uuidVersion(res2Body.id)).toBe(4);
      expect(Date.parse(res2Body.created_at)).not.toBeNaN();
      expect(Date.parse(res2Body.updated_at)).not.toBeNaN();
    });

    test("With  none existent username", async () => {
      const res = await fetch(
        "http://localhost:3000/api/v1/users/UsuarioInesistente",
      );

      expect(res.status).toBe(404);

      const resBody = await res.json();

      expect(resBody).toEqual({
        name: "NotFoundError",
        message: "O username informado não foi encontrado no sistema.",
        action: "Verifique se 'username' foi digitado correatamente.",
        status_code: 404,
      });
    });
  });
});
