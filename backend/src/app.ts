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


const app = express();

app.use(cors());
app.use(express.json());

setupSwagger(app);
app.use(morgan("dev"));

 

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/users", followRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/likes", likeRoutes);
app.use("/api/v1/users", notificationRoutes);
app.use("/api/v1/posts", commentRoutes);
app.use("/api/v1/search", searchRoutes);
app.use("/api/v1/stories", storyRoutes);

export default app;
