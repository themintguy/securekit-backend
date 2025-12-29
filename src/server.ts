import express, { Application} from "express";
import { checkS3Connection } from "./aws/s3Healtchech";





console.log("AWS_REGION:", process.env.AWS_REGION);


(async ()=> {
    await checkS3Connection();
})();

// checkS3Connection();


const app: Application = express();


export default app;
