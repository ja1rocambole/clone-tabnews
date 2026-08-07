import { createRouter } from "next-connect";
import controller from "infra/controller";
import user from "models/user.js";
import session from "models/session.js";

const router = createRouter();

router.get(getHandler);

export default router.handler(controller.errorHandler);

async function getHandler(request, response) {
  const sessionToken = request.cookies.session_id;

  const sessionObject = await session.findOneValidByToken(sessionToken);
  const renewadSessionObject = await session.renew(sessionObject.id);
  controller.setSessionCookie(renewadSessionObject.token, response);

  const userFound = await user.findOneById(sessionObject.user_id);
  return response.status(200).json(userFound);
}
