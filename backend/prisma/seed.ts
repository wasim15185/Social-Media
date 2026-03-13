import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { NotificationType, PrismaClient } from "../src/generated/prisma/client";
import { faker } from "@faker-js/faker";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg({
  connectionString: connectionString, // this line is important
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting database seed...");

  const users = [];

  /**
   * Create Users
   */
  for (let i = 0; i < 30; i++) {
    const user = await prisma.user.create({
      data: {
        username: faker.internet.username(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: "123456",
        bio: faker.person.bio(),
        profileImage: faker.image.avatar(),
        coverImage: faker.image.urlPicsumPhotos({ width: 1200, height: 400 }),
      },
    });

    users.push(user);
  }

  console.log("👤 Users created:", users.length);

  /**
   * Create Follow Relationships
   */
  for (const user of users) {
    for (let i = 0; i < 5; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];

      if (randomUser.id !== user.id) {
        try {
          await prisma.follow.create({
            data: {
              followerId: user.id,
              followingId: randomUser.id,
            },
          });
        } catch {}
      }
    }
  }

  console.log("👥 Follow relationships created");

  const posts = [];

  /**
   * Create Posts
   */
  for (let i = 0; i < 80; i++) {
    const author = users[Math.floor(Math.random() * users.length)];

    const post = await prisma.post.create({
      data: {
        content: faker.lorem.paragraph(),
        authorId: author.id,
        images: {
          create: [
            {
              imageUrl: faker.image.urlPicsumPhotos({
                width: 600,
                height: 600,
              }),
            },
          ],
        },
      },
    });

    posts.push(post);
  }

  console.log("📝 Posts created:", posts.length);

  /**
   * Likes
   */
  for (let i = 0; i < 200; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const post = posts[Math.floor(Math.random() * posts.length)];

    try {
      await prisma.like.create({
        data: {
          userId: user.id,
          postId: post.id,
        },
      });
    } catch {}
  }

  console.log("❤️ Likes created");

  /**
   * Comments
   */
  for (let i = 0; i < 150; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const post = posts[Math.floor(Math.random() * posts.length)];

    await prisma.comment.create({
      data: {
        content: faker.lorem.sentence(),
        userId: user.id,
        postId: post.id,
      },
    });
  }

  console.log("💬 Comments created");

  /**
   * Saved Posts
   */
  for (let i = 0; i < 100; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const post = posts[Math.floor(Math.random() * posts.length)];

    try {
      await prisma.savedPost.create({
        data: {
          userId: user.id,
          postId: post.id,
        },
      });
    } catch {}
  }

  console.log("🔖 Saved posts created");

  /**
   * Notifications
   */
  for (let i = 0; i < 120; i++) {
    const sender = users[Math.floor(Math.random() * users.length)];
    const receiver = users[Math.floor(Math.random() * users.length)];
    const post = posts[Math.floor(Math.random() * posts.length)];

    if (sender.id !== receiver.id) {
      await prisma.notification.create({
        data: {
          type: NotificationType.LIKE,
          senderId: sender.id,
          receiverId: receiver.id,
          postId: post.id,
        },
      });
    }
  }

  console.log("🔔 Notifications created");

  /**
   * Stories
   */
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  for (let i = 0; i < 40; i++) {
    const user = users[Math.floor(Math.random() * users.length)];

    await prisma.story.create({
      data: {
        imageUrl: faker.image.urlPicsumPhotos({
          width: 1080,
          height: 1920,
        }),
        authorId: user.id,
        expiresAt,
      },
    });
  }

  console.log("📸 Stories created");

  /**
   * Conversations
   */
  const conversations = [];

  for (let i = 0; i < 15; i++) {
    const userA = users[Math.floor(Math.random() * users.length)];
    const userB = users[Math.floor(Math.random() * users.length)];

    if (userA.id !== userB.id) {
      const conversation = await prisma.conversation.create({
        data: {
          participants: {
            create: [{ userId: userA.id }, { userId: userB.id }],
          },
        },
      });

      conversations.push(conversation);
    }
  }

  console.log("💬 Conversations created");

  /**
   * Messages
   */
  for (let i = 0; i < 200; i++) {
    const conversation =
      conversations[Math.floor(Math.random() * conversations.length)];

    const sender = users[Math.floor(Math.random() * users.length)];

    await prisma.message.create({
      data: {
        senderId: sender.id,
        conversationId: conversation.id,
        text: faker.lorem.sentence(),
      },
    });
  }

  console.log("✉️ Messages created");

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });