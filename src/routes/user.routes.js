import { Router } from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
import { body } from 'express-validator';
import {upload} from '../middlewares/multer.middleware.js'
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route('/register').post(
    upload.fields([//uploads.fields to accept the array of the uploaded files from different names
        {
            name:'avatar',
            maxCount:1
       },
       {
         name:'coverImage',
         maxCount:1
       }
    ]),
    body('username').trim().isLength(3).withMessage("Username must be at least 3 characters"),
    body('password').trim().isLength(6).withMessage("Password must be at least 6 characters"),
    body('email').trim().isEmail().withMessage("Email is required"),
    body("Name").trim().notEmpty().withMessage("Name is required")

    , registerUser
);

router.route("/login").post(
  body('username').trim().isLength(3).withMessage("Username must be at least 3 characters"),
  body('password').trim().isLength(6).withMessage("Password must be at least 6 characters"),
  body('email').trim().isEmail().withMessage("Email is required")
  ,
  loginUser);

//secured routes
router.route("/logout").post(verifyJWT,logoutUser);

router.route("/refresh-token").post(refreshAccessToken);


export default router