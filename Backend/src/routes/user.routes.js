import { Router } from "express";
import { getUserChannelProfile,currPasswordChange, getCurrentUser, getWatchHistory, loginUser, logoutUser, refreshAccessToken, registerUser, updateUser, updateUserAvatar, updateUserCoverImage } from "../controllers/user.controller.js";
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

router.route("/update-profile").patch(verifyJWT,
  body("email").trim().optional().isEmail().withMessage("Email is required"),
  body("Name").trim().optional().isLength(3).withMessage("Username must be at least 3 characters")
  ,updateUser);  // because patch will not update all the details

router.route("/update-password").post(verifyJWT,
  body("password").trim().isLength(6).withMessage("Password is required")
  ,currPasswordChange);

  router.route("/update-avatar").patch(verifyJWT,
    upload.single("avatar"),
    updateUserAvatar);

    router.route("/update-cover-image").patch(verifyJWT,
      upload.single("coverImage"),
      updateUserCoverImage);

      router.route("/current-user").get(verifyJWT,getCurrentUser);

      router.route("/getUserChannel/:username").get(verifyJWT,getUserChannelProfile);

      router.route("/watchHistory").get(verifyJWT,getWatchHistory);


export default router