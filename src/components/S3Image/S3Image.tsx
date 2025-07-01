import React, { useState, useEffect } from 'react'
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

export type Props = {
    objectKey: string
    classes: string
}

const S3Image = (props: Props) => {
    const { objectKey, classes } = props
    const [imageUrl, setImageUrl] = useState('');


    const getPubURL = async (objKey: string) => {
      const region = process.env.AWS_REGION
      const bucketName = process.env.AWS_BUCKET_NAME
      const client = new S3Client({ 
        region: region,
        credentials: { 
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,  
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
      });
      const command = new GetObjectCommand({
          Bucket: bucketName,
          Key: objKey,
          // @ts-ignore
          ACL:'public-read',
        });
      const url = await getSignedUrl(client, command, { expiresIn: 3600 });
      setImageUrl(url);
    }

    useEffect(() => {
        getPubURL(objectKey)
    }, ['objectKey']);

  return (
    <div>
      {imageUrl && (
        <img
          src={imageUrl}
          className={classes}
        />
      )}
    </div>
  );
};

export default S3Image;
