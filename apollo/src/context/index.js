const { prisma } = require('../generated/prisma-client');
const decodeToken = require('../auth');

const context = async ({ req, connection }) => {
  // Connections are wide open ATM
  if (connection) {
    const {
      context: { authorization },
    } = connection;

    if (authorization) {
      const user = await decodeToken(authorization);
      return { ...connection, user, prisma };
    }
    return {
      ...connection,
      prisma,
    };
  }

  if (req) {
    const { authorization } = req.headers;
    if (authorization) {
      const user = await decodeToken(authorization);
      return { ...req, user, prisma };
    }
    return {
      ...req,
      prisma,
    };
  }
  return {
    prisma,
  };
};

module.exports = context;
