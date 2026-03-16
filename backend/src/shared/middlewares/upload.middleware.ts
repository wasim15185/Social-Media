import multer from "multer";
import path from "path";
import fs from "fs";

/**
 * Multer Storage Configuration
 * -----------------------------------------
 * Saves post images inside:
 *
 * uploads/users/{username_userid}/posts
 */

const storage = multer.diskStorage({
  destination: (req: any, file, cb) => {
    const user = req.user;

    if (!user) {
      return cb(new Error("User not authenticated"), "");
    }

    /**
     * Example folder name:
     * wasim_31
     */

    const folderName = `${user.username}_${user.id}`;

    /**
     * Final upload path
     */

    const uploadPath = path.join(
      process.cwd(),
      "uploads",
      "users",
      folderName,
      "posts",
    );

    /**
     * Create folder if it doesn't exist
     */

    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },

  /**
   * File naming strategy
   */

  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname.replace(/\s/g, "_");

    cb(null, uniqueName);
  },
});

/**
 * Allow only image uploads
 */

const fileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"));
  }
};

/**
 * Export upload middleware
 */

export const uploadPostImages = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});
