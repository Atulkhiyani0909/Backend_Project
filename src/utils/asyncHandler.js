// const asyncHandler=()=>{}
//another method

//Using Promises this is the advanced sysntax
const asyncHandler1 = (reqHandler) => {
    return (req, res, next) => {
      Promise.resolve(reqHandler(req, res, next))
        .catch(next); // If an error occurs, Express will handle it via middleware
    };
  };
  



export {asyncHandler1};

// asyncHandler(fn) is a higher-order function that wraps async route handlers.
/*

app.get('/users', asyncHandler(async (req, res) => {
  const users = await User.find(); // If there's an error, asyncHandler catches it
  res.json(users);
}));

*/
const asyncHandler = (fn) => {
    return async (req, res, next) => {
      try {
        await fn(req, res, next);
      } catch (error) {
        res.status(error.status || 500).json({
          message: error.message || "Internal Server Error",
          success: false,
        });
      }
    };
  };
  


