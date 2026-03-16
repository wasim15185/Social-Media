import express from "express";
import cors from "cors";
import { setupSwagger } from "./config/swagger";
import morgan from "morgan";
import  './config/prisma'; // ensure prisma is initialized
import userRoutes from "./modules/user/user.routes";
import postRoutes from "./modules/post/post.routes";
import authRoutes from "./modules/auth/auth.routes";
import likeRoutes from "./modules/like/like.routes";
import followRoutes from "./modules/follow/follow.routes";
import notificationRoutes from "./modules/notification/notification.routes";
import commentRoutes from "./modules/comment/comment.routes";
import searchRoutes from "./modules/search/search.routes";
import storyRoutes from "./modules/story/story.routes";
import { errorHandler } from "./shared/middlewares/errorHandler.middleware";
import path from "path/win32";


const app = express();

app.use(cors());
app.use(express.json());

setupSwagger(app);
app.use(morgan("dev"));

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
 

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/users", followRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/users", notificationRoutes);
app.use("/api/posts", commentRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/stories", storyRoutes);



app.use(errorHandler);

export default app;
