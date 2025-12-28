import { Router } from "express";
import { auth } from "../middlewares/auth";
import { vault } from "../middlewares/vault";
import { upload } from "../utils/multer.util";
import { uploadFile } from "../controllers/files/fileUpload.controller";
import { DownloadFile } from "../controllers/files/fileDownload.controller";
import { listFiles } from "../controllers/files/listFiles.controller";
import { getFileMetadata } from "../controllers/files/getFileMetadata.controller";
import { deleteFile } from "../controllers/files/deleteFile.controller";
import { updateFileMetadata } from "../controllers/files/updateFile.controller";
import { getFileUsage } from "../controllers/files/fileUsage.controller";

const router = Router();

router.post("/upload",auth,vault,upload.single("file"),uploadFile);

router.get("/",auth,listFiles);
router.get("/usage", auth, getFileUsage);
router.get("/:id",auth,getFileMetadata);

// router.get("/:id([0-9a-fA-F-]{36})", auth, getFileMetadata);
// router.get("/:id([0-9a-fA-F-]{36})/download", auth, vault, downloadFile);

router.get("/:id/download", auth, vault, DownloadFile);




router.delete("/:id", auth, vault, deleteFile);

router.put("/:id", auth, vault, updateFileMetadata);



export default router;