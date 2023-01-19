module.exports = function hasValidApiKey(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.sendStatus(403);
  }

  if (authHeader !== 'randomTOKENgoesHERE') return res.sendStatus(403);
  return next();
};
