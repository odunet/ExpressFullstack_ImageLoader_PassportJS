module.exports = async (req, res, next) => {
  // Check if token is here

  let token = await req.session.token;
  req.body.token = token;

  next();
};
