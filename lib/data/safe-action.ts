import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action";
import { auth } from "../auth/server";

class ActionError extends Error {}

/**
 * Creates a client of next-safe-action to use in server actions
 */
export const actionClient = createSafeActionClient({
  handleServerError(e) {
    if (e instanceof ActionError) {
      return e.message;
    }

    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
});

/**
 * Creates an authenticated action
 *
 * Passes the userId to the next function
 *
 * @returns {Promise<void>} A promise that resolves when the action is executed.
 * @throws {Error} If the user is not authenticated or the user ID is not available.
 */
export const authenticatedAction = actionClient.use(async ({ next }) => {
  const session = await auth();
  const userId = session?.user.id;

  if (!session || !userId) {
    throw new Error("Not authenticated");
  }

  return next({ ctx: { userId } });
});
