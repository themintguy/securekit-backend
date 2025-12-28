import { Upload } from "@aws-sdk/lib-storage";
import { s3 } from "./s3";

export const uploadToS3 = async (key: string,body:Buffer)=>{
    const upload = new Upload({
        client:s3,
        params:{
            Bucket: process.env.S3_BUCKET!,
            Key:key,
            Body:body,
        },
    });

    await upload.done();
}