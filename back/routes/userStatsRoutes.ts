import { authenticate } from "../authenticate";
import { resetQuizById } from "../controllers/quiz";
import {
  getUserAnswersByFormationByUser,
  getUserAnswersByQuizId,
  getUserProgressionAndCompletionByFormation,
  getUserProgressionByUser,
  saveUserAnswer,
  saveUserProgression,
} from "../controllers/user-stats";
import { fastify } from "../server";
import {
  BodyGetUserAnswer,
  BodyResetQuizById,
  BodySaveUserAnswer,
  IdParams,
  ProgressionByUserByFormation,
  UserAnswersByFormationByUser,
  UserProgression,
} from "../types/types";

/** User Stats */
fastify.route<{ Params: {}; Body: BodySaveUserAnswer }>({
  method: "POST",
  url: "/api/stats/save",
  preHandler: [authenticate],
  handler: saveUserAnswer,
});

fastify.route<{ Params: {}; Body: BodyGetUserAnswer }>({
  method: "POST",
  url: "/api/stats/useranswers",
  preHandler: [authenticate],
  handler: getUserAnswersByQuizId,
});

fastify.route<{ Params: {}; Body: UserAnswersByFormationByUser }>({
  method: "POST",
  url: "/api/stats/useranswers/user/formation",
  preHandler: [authenticate],
  handler: getUserAnswersByFormationByUser,
});

fastify.route<{ Params: {}; Body: BodyResetQuizById }>({
  method: "POST",
  url: "/api/stats/useranswers/delete",
  preHandler: [authenticate],
  handler: resetQuizById,
});

fastify.route<{ Params: {}; Body: IdParams }>({
  method: "POST",
  url: "/api/progression/user",
  preHandler: [authenticate],
  handler: getUserProgressionByUser,
});

fastify.route<{ Params: {}; Body: UserProgression }>({
  method: "POST",
  url: "/api/progression/save",
  preHandler: [authenticate],
  handler: saveUserProgression,
});

fastify.route<{ Params: {}; Body: ProgressionByUserByFormation }>({
  method: "POST",
  url: "/api/progression/formation",
  preHandler: [authenticate],
  handler: getUserProgressionAndCompletionByFormation,
});
