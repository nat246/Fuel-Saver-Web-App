// var express = require("express");
const AWS = require("aws-sdk");

const bucketName = "visitbuckets";
const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

const getCount = (req, res, next) => {
    const key = "counter";

    var params = {
        Bucket: bucketName,
        Key: `${key}.json`,
    };

    var objectParams ={
        Bucket: bucketName,
        Key: `${key}.json`,
        Body: JSON.stringify({
            count: 1,
        })
    }

    // Try get the counter object in AWS S3
    s3.getObject(params)
        .promise()
        .then((r) => {

            // Save the result for later
            const result = JSON.parse(r.Body);

            // Delete the existing object
            s3.deleteObject(params)
                .promise()
                .then(() => {
                    // Increment for visit
                    const newCount = result.count + 1;

                    const newObjectParams = {
                        Bucket: bucketName,
                        Key: `${key}.json`,
                        Body: JSON.stringify({
                            count: newCount,
                        }),
                    };

                    // Create a new object with the updated values
                    s3.putObject(newObjectParams)
                        .promise()
                        .then(() => {
                            console.log(`Updated ${bucketName}/${key}.json`);
                            return res.status(200).json(result);
                        });
                });
        })
        // Catches the error if the bucket does not exist.
        .catch((e) => {
            console.log(`error: ${e.code}`);
            switch (e.code) {
                case "NoSuchBucket":
                    s3.createBucket({ Bucket: bucketName })
                        .promise()
                        .then(() => {
                            // Creates a new object in the newly created bucket to store the counter
                            s3.putObject(objectParams)
                                .promise()
                                .then(() => {
                                    console.log(
                                        `Created Bucket ${bucketName} and File ${key}.json`
                                    );

                                    // Returns a JSON of 1 since there's a new visit
                                    return res.status(200).json({
                                        count: 1,
                                    });
                                });
                        });
            }
        });
};

exports.getCount = getCount;
