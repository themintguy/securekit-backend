import { HeadBucketCommand } from "@aws-sdk/client-s3";
import { s3 } from "./s3";

export const checkS3Connection = async () => {
  try {
    await s3.send(
      new HeadBucketCommand({
        Bucket: process.env.S3_BUCKET!,
      })
    );

    console.log("S3 connection successful");
    return true;
  } catch (err: any) {
    console.error("S3 connection failed");

    if (err.name === "Forbidden") {
      console.error("→ Access denied (check IAM policy)");
    } else if (err.name === "NotFound") {
      console.error("Bucket not found (check name/region)");
    } else {
      console.error(err);
    }

    return false;
  }
};
