import "dotenv/config";
import ImageKit from "imagekit";

let imagekit = null;

try {
  if (
    process.env.IMAGEKIT_PUBLIC_KEY &&
    process.env.IMAGEKIT_PRIVATE_KEY &&
    process.env.IMAGEKIT_URL_ENDPOINT
  ) {
    imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    });
  } else {
    console.warn("WARNING: ImageKit configuration is incomplete. Image uploads will fail.");
  }
} catch (error) {
  console.error("Failed to initialize ImageKit:", error.message);
}

export default imagekit;