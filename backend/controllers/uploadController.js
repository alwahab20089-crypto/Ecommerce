import asyncHandler from "../utils/asyncHandler.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

export const uploadImage = asyncHandler(async (req, res) => {
    if (!req.file) {
        res.status(400);
        throw new Error("Please upload an image");
    }

    const streamUpload = () =>
        new Promise((resolve, reject) => {

            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: "ecommerce",
                },
                (error, result) => {

                    if (result)
                        resolve(result);

                    else
                        reject(error);

                }
            );

            streamifier.createReadStream(req.file.buffer).pipe(stream);

        });

    const result = await streamUpload();

    res.json({
        url: result.secure_url,
        public_id: result.public_id,
    });

});