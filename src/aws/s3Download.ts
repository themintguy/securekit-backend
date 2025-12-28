import { GetObjectCommand } from "@aws-sdk/client-s3";
import {s3} from './s3';

export const getS3ObjectStream = async(key: string) => {
    const response = await s3.send(
        new GetObjectCommand({
            Bucket:process.env.S3_BUCKET!,
            Key:key,
        })
    );

     if (!response.Body) {
       throw new Error("Empty S3 object");
     }

     return response.Body as NodeJS.ReadableStream;


     

}