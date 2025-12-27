import express, { Application} from "express";
import { checkS3Connection } from "./aws/s3Healtchech";

(async ()=> {
    await checkS3Connection();
})();


const app: Application = express();


export default app;
