# Social Media Website Backend

A scalable social media backend built with **Node.js, Express,
TypeScript, Prisma, PostgreSQL, and Socket.IO**. This backend supports
features similar to **Instagram + Messenger** including posts, likes,
comments, follow system, notifications, and real‑time chat.

------------------------------------------------------------------------

# Base URL

http://localhost:5000/api

Authentication header:

Authorization: Bearer `<JWT_TOKEN>`{=html}

------------------------------------------------------------------------

# Authentication APIs

## Register

POST /api/auth/register

Request

{ "username": "wasim", "email": "wasim@example.com", "password":
"123456" }

Response

{ "success": true, "message": "User registered successfully", "data": {
"id": 1, "username": "wasim", "email": "wasim@example.com", "token":
"JWT_TOKEN" } }

------------------------------------------------------------------------

## Login

POST /api/auth/login

Request

{ "email": "wasim@example.com", "password": "123456" }

Response

{ "success": true, "message": "Login successful", "data": { "id": 1,
"username": "wasim", "token": "JWT_TOKEN" } }

------------------------------------------------------------------------

# User APIs

## Get User Profile

GET /api/users/profile/:id

Example

GET /api/users/profile/1

Response

{ "id": 1, "username": "wasim", "bio": "Backend Developer",
"profileImage": "/uploads/profile.jpg", "followersCount": 10,
"followingCount": 5, "postCount": 3 }

------------------------------------------------------------------------

## Update Profile

PATCH /api/users/profile

Request

{ "bio": "Software Developer" }

Response

{ "success": true, "message": "Profile updated" }

------------------------------------------------------------------------

# Post APIs

## Create Post

POST /api/posts

Request

{ "content": "Hello world" }

Response

{ "success": true, "message": "Post created", "data": { "id": 10,
"content": "Hello world" } }

------------------------------------------------------------------------

## Get Feed

GET /api/posts/feed

Response

\[ { "id": 1, "content": "My first post", "author": { "username":
"wasim" }, "likeCount": 5, "commentCount": 2 }\]

------------------------------------------------------------------------

# Like APIs

POST /api/likes/:postId

Example

POST /api/likes/5

Response

{ "success": true, "message": "Post liked" }

------------------------------------------------------------------------

DELETE /api/likes/:postId

Example

DELETE /api/likes/5

Response

{ "success": true, "message": "Post unliked" }

------------------------------------------------------------------------

# Comment APIs

POST /api/posts/:postId/comments

Request

{ "content": "Nice post!" }

Response

{ "success": true, "data": { "id": 3, "content": "Nice post!" } }

------------------------------------------------------------------------

# Follow APIs

POST /api/users/:id/follow

Example

POST /api/users/2/follow

Response

{ "success": true, "message": "User followed" }

------------------------------------------------------------------------

DELETE /api/users/:id/follow

Example

DELETE /api/users/2/follow

Response

{ "success": true, "message": "User unfollowed" }

------------------------------------------------------------------------

# Saved Posts

POST /api/posts/:postId/save

Response

{ "success": true, "message": "Post saved" }

GET /api/users/saved-posts

Response

\[ { "post": { "id": 5, "content": "Example post" } }\]

------------------------------------------------------------------------

# Notifications

GET /api/users/notifications

Response

\[ { "id": 1, "type": "LIKE", "sender": { "username": "rahul" }, "post":
{ "id": 5 } }\]

------------------------------------------------------------------------

PATCH /api/users/notifications/:id/read

Response

{ "success": true, "message": "Notification marked as read" }

------------------------------------------------------------------------

# Chat APIs

POST /api/chat/conversation

Request

{ "targetUserId": 2 }

------------------------------------------------------------------------

GET /api/chat/conversations

Returns all user conversations.

------------------------------------------------------------------------

GET /api/chat/:conversationId/messages

Example

GET /api/chat/3/messages

Response

\[ { "id": 1, "text": "Hello", "sender": { "username": "wasim" } }\]

------------------------------------------------------------------------

POST /api/chat/:conversationId/message

Request

{ "text": "Hello" }

Response

{ "id": 5, "text": "Hello" }

------------------------------------------------------------------------

# Search

GET /api/search/users?q=wasim

Response

\[ { "id": 1, "username": "wasim" }\]

------------------------------------------------------------------------

# Real‑Time Socket Events

join-user join-conversation send-message receive-message typing
stop-typing

------------------------------------------------------------------------

# Global Response Format

{ "success": true, "message": "Operation successful", "data": {} }

------------------------------------------------------------------------

# Technologies

Node.js\
Express.js\
TypeScript\
Prisma ORM\
PostgreSQL\
Socket.IO\
Zod Validation\
Swagger API Docs\
Multer File Upload\
Pino Logger

------------------------------------------------------------------------

# Summary

This backend provides a full social media platform including:

Authentication\
User profiles\
Posts with images\
Likes and comments\
Follow system\
Saved posts\
Notifications\
Real‑time chat\
Search functionality
