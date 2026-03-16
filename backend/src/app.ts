import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";

import "./config/prisma"; // ensure prisma is initialized
import { setupSwagger } from "./config/swagger";

import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/user/user.routes";
import postRoutes from "./modules/post/post.routes";
import likeRoutes from "./modules/like/like.routes";
import followRoutes from "./modules/follow/follow.routes";
import notificationRoutes from "./modules/notification/notification.routes";
import commentRoutes from "./modules/comment/comment.routes";
import searchRoutes from "./modules/search/search.routes";
import storyRoutes from "./modules/story/story.routes";

import { errorHandler } from "./shared/middlewares/errorHandler.middleware";

const app = express();

/**
 * ------------------------------------------------
 * Global Middlewares
 * ------------------------------------------------
 */

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

/**
 * ------------------------------------------------
 * Swagger Documentation
 * ------------------------------------------------
 */

setupSwagger(app);

/**
 * ------------------------------------------------
 * Static File Serving
 * ------------------------------------------------
 * Allows access to uploaded files like:
 *
 * http://localhost:5000/uploads/users/wasim_31/posts/img.jpg
 */

app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

/**
 * ------------------------------------------------
 * API Routes
 * ------------------------------------------------
 */

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);
app.use("/api/users", followRoutes);
app.use("/api/users", notificationRoutes);

app.use("/api/posts", postRoutes);
app.use("/api/posts", commentRoutes);

app.use("/api/likes", likeRoutes);

app.use("/api/search", searchRoutes);

app.use("/api/stories", storyRoutes);

/**
 * ------------------------------------------------
 * Global Error Handler
 * ------------------------------------------------
 */

app.use(errorHandler);

export default app;