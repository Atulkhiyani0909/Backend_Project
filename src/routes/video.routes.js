import { Router } from "express";
import {upload} from '../middlewares/multer.middleware.js'
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {deleteVideo, getAllVideos, getVideoById, publishAVideo, togglePublishStatus, updateVideo} from "../controllers/video.controller.js"


const router=Router();

router.route("/get-all-videos").get(getAllVideos);

router.route("/upload-video").post(verifyJWT,upload.fields([
    //uploads.fields to accept the array of the uploaded files from different names
            {
                name:'video',
                maxCount:1
           },
           {
             name:'thumbnail',
             maxCount:1
           }
        ]
        ),  publishAVideo)

router.route("/getVideo/:videoId").get(getVideoById)

router.route("/update-video/:videoId/edit").patch(verifyJWT, upload.single("thumbnail") ,updateVideo)

router.route("/delete-video/:videoId").delete(verifyJWT,deleteVideo)

router.route("/toggle-status/:videoId").get(verifyJWT,togglePublishStatus)

export default router

