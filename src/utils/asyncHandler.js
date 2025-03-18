

//Using Promises this is the advanced syntax
//async handler using the promises
const asyncHandler1 = (reqHandler) => {
     (req, res, next) => {
      Promise.resolve(reqHandler(req, res, next))//resolve our function
      .catch((err)=>next(err))//catch or reject the error here 
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

//this is the async handler using the try catch
//const ayncHandler = (fn)={()=>{}};     passsing fn to another fn  higher order function


//this is the wrapper function that wraps async route handlers
const asyncHandler=(fn)=async(req,res,next)=>{
     try {
        await fn(req,res,next);
     } catch (error) {
        res.status(error.code || 500).json({
          message:error.message || "Something went Wrong",
          success: false,
        });
     }
}


