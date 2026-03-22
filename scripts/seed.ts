import "dotenv/config";
import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { user, account } from "../schema/auth";
import { photo } from "../schema/platform";

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle({ client });

const SEED_USERS = [
  { name: "Valentina Ruiz", username: "valruiz", email: "val@cruda.test" },
  { name: "Tomás Herrera", username: "tomasherrera", email: "tomas@cruda.test" },
  { name: "Camila Soto", username: "camisoto", email: "camila@cruda.test" },
  { name: "Mateo Lagos", username: "mateolagos", email: "mateo@cruda.test" },
  { name: "Isidora Parra", username: "isiparra", email: "isi@cruda.test" },
];

const PASSWORD = "password123";
const PHOTOS_PER_USER = 20;

// better-auth uses this format for password hashing (bcrypt-like via built-in)
// We'll use a simple hash via the Web Crypto API since we just need seed data
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

interface PicsumPhoto {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}

async function fetchPicsumPhotos(): Promise<PicsumPhoto[]> {
  const res = await fetch("https://picsum.photos/v2/list?limit=100");
  if (!res.ok) throw new Error("Failed to fetch picsum photos");
  return res.json();
}

async function seed() {
  console.log("Fetching photos from picsum.photos...");
  const picsumPhotos = await fetchPicsumPhotos();
  console.log(`Got ${picsumPhotos.length} photos`);

  const hashedPassword = await hashPassword(PASSWORD);

  for (let i = 0; i < SEED_USERS.length; i++) {
    const u = SEED_USERS[i];
    const userId = crypto.randomUUID();

    console.log(`\nCreating user: ${u.name} (@${u.username})`);

    await db.insert(user).values({
      id: userId,
      name: u.name,
      email: u.email,
      emailVerified: true,
      username: u.username,
      displayUsername: u.username,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).onConflictDoNothing();

    await db.insert(account).values({
      id: crypto.randomUUID(),
      accountId: userId,
      providerId: "credential",
      userId,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).onConflictDoNothing();

    // Each user gets a different slice of picsum photos
    const startIdx = (i * PHOTOS_PER_USER) % picsumPhotos.length;
    const userPhotos: typeof photo.$inferInsert[] = [];

    for (let j = 0; j < PHOTOS_PER_USER; j++) {
      const p = picsumPhotos[(startIdx + j) % picsumPhotos.length];

      // Use picsum's direct URL format for specific dimensions
      // Keep original aspect ratio but cap at reasonable sizes
      const maxDim = 1200;
      const scale = Math.min(maxDim / p.width, maxDim / p.height, 1);
      const width = Math.round(p.width * scale);
      const height = Math.round(p.height * scale);
      const url = `https://picsum.photos/id/${p.id}/${width}/${height}`;

      // Stagger creation dates so they show up in a nice order
      const createdAt = new Date();
      createdAt.setHours(createdAt.getHours() - (SEED_USERS.length - i) * PHOTOS_PER_USER - (PHOTOS_PER_USER - j));

      userPhotos.push({
        id: crypto.randomUUID(),
        title: j % 3 === 0 ? null : `foto por ${p.author}`,
        description: j % 2 === 0 ? null : `imagen de ${p.author}`,
        url,
        width,
        height,
        userId,
        createdAt,
        updatedAt: createdAt,
      });
    }

    await db.insert(photo).values(userPhotos);
    console.log(`  Added ${userPhotos.length} photos`);
  }

  console.log("\nSeed complete!");
  await client.end();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
