import "dotenv/config";

import { faker } from "@faker-js/faker";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { hash } from "argon2";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const USER_COUNT = 10;
const POST_COUNT = 40;
const COMMENTS_PER_POST = 20;
const DEFAULT_PASSWORD = "123";

const TAG_NAMES = [
  "Technology",
  "Design",
  "Business",
  "Lifestyle",
  "Culture",
  "Science",
  "Productivity",
  "Travel",
] as const;

type TagName = (typeof TAG_NAMES)[number];

// ---------- Image Helpers ----------

/**
 * Generates a clean, HD Picsum photo URL, explicitly disabling any default
 * blur or grayscale filters that might be added unexpectedly by Faker.
 */
function cleanPicsumPhoto(width = 1280, height = 720): string {
  return faker.image.urlPicsumPhotos({
    width,
    height,
    grayscale: false, // Explicitly disable grayscale
    blur: 0, // Explicitly disable blur (0 is the "off" value)
  });
}

// ---------- Shared helpers ----------

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]+/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// ---------- Title generation ----------

// Topic pools keyed by tag so titles feel topical, not random.
const TOPICS: Record<TagName, string[]> = {
  Technology: [
    "AI",
    "WebAssembly",
    "Edge Computing",
    "Open Source",
    "Quantum Computing",
    "APIs",
    "Rust",
    "Kubernetes",
  ],
  Design: [
    "Design Systems",
    "Typography",
    "Accessibility",
    "Color Theory",
    "UX Research",
    "Motion Design",
    "Grid Systems",
  ],
  Business: [
    "Bootstrapping",
    "Remote Teams",
    "Product Strategy",
    "Venture Capital",
    "B2B Sales",
    "Pricing",
    "OKRs",
  ],
  Lifestyle: [
    "Minimalism",
    "Morning Routines",
    "Digital Detox",
    "Slow Living",
    "Journaling",
    "Home Cooking",
  ],
  Culture: [
    "Indie Film",
    "Street Photography",
    "Vinyl Revival",
    "Fan Culture",
    "Modern Folklore",
    "Zine Making",
  ],
  Science: [
    "CRISPR",
    "Dark Matter",
    "Mycelium Networks",
    "Ocean Currents",
    "Sleep Science",
    "Exoplanets",
  ],
  Productivity: [
    "Deep Work",
    "Time Blocking",
    "Second Brains",
    "Async Communication",
    "Focus Rituals",
    "Task Batching",
  ],
  Travel: [
    "Slow Travel",
    "Overnight Trains",
    "Island Hopping",
    "Street Food",
    "Van Life",
    "Hidden Villages",
  ],
};

const ADJECTIVES = [
  "unexpected",
  "practical",
  "quiet",
  "bold",
  "fragile",
  "stubborn",
  "underrated",
  "messy",
  "deliberate",
  "restless",
  "patient",
  "curious",
  "modest",
  "radical",
  "everyday",
  "half-finished",
];

const VERBS = [
  "Rethink",
  "Rebuild",
  "Simplify",
  "Question",
  "Redesign",
  "Untangle",
  "Reframe",
  "Reclaim",
  "Master",
  "Outgrow",
  "Sketch",
  "Bend",
];

const NOUNS = [
  "Workflow",
  "Habit",
  "Craft",
  "Signal",
  "Pattern",
  "Toolkit",
  "Ritual",
  "Framework",
  "Story",
  "Blueprint",
  "Rhythm",
  "Shortcut",
];

const TEMPLATES: ((topic: string) => string)[] = [
  (t) => `The Future of ${t}`,
  (t) => `A Practical Guide to ${t}`,
  (t) => `Why ${t} Matters More Than Ever`,
  (t) => `Rethinking ${t} from Scratch`,
  (t) => `What Nobody Tells You About ${t}`,
  (t) => `Inside the World of ${t}`,
  (t) => `${t}, Reconsidered`,
  (t) => `The Quiet Rise of ${t}`,
  (t) => `How ${t} Actually Works`,
  (t) => `Notes on ${t}`,
  (t) => `The Case Against ${t}`,
  (t) => `The Case for ${t}`,
  (t) => `Small Experiments with ${t}`,
  (t) => `Lessons Learned from ${t}`,
  (t) => `${t}: A Field Report`,
  (t) => `Beyond ${t}`,
];

const ADJECTIVE_TEMPLATES: ((adj: string, noun: string) => string)[] = [
  (a, n) => `The ${a} ${n}`,
  (a, n) => `A ${a} Approach to ${n}`,
  (a, n) => `${n}s That Feel ${a}`,
  (a, n) => `On ${a} ${n}s`,
];

const LIST_TEMPLATES: ((n: number, verb: string, noun: string) => string)[] = [
  (n, v, noun) => `${n} Ways to ${v} Your ${noun}`,
  (n, v, noun) => `${n} ${noun} Habits Worth ${v}ing`,
  (n, v, noun) => `${n} Lessons on ${v}ing Your ${noun}`,
];

function generateTitle(tagName: TagName): string {
  const topic = pick(TOPICS[tagName]);
  const roll = Math.random();

  let title: string;
  if (roll < 0.55) {
    title = pick(TEMPLATES)(topic);
  } else if (roll < 0.8) {
    title = pick(ADJECTIVE_TEMPLATES)(pick(ADJECTIVES), pick(NOUNS));
  } else {
    title = pick(LIST_TEMPLATES)(
      faker.number.int({ min: 3, max: 12 }),
      pick(VERBS),
      pick(NOUNS),
    );
  }

  if (Math.random() < 0.25) {
    title = `${title} in ${topic}`;
  }

  return title.charAt(0).toUpperCase() + title.slice(1);
}

// ---------- Content generation ----------

const THINGS = [
  "the whole process",
  "this workflow",
  "the setup",
  "my routine",
  "the tool",
  "the plan",
  "the habit",
  "the system",
  "this approach",
  "the whole thing",
];

const OBSERVATIONS = [
  "took way longer than I expected",
  "turned out to be pretty simple",
  "was harder than it looked",
  "kind of fell apart after a week",
  "worked fine until it didn't",
  "ended up being worth it",
  "was mostly a waste of time",
  "surprised me",
  "made a bigger difference than I thought",
  "solved a problem I didn't know I had",
];

const TRANSITIONS = [
  "Honestly,",
  "At first,",
  "Looking back,",
  "Turns out,",
  "In practice,",
  "Of course,",
  "That said,",
  "For what it's worth,",
  "To be fair,",
  "The thing is,",
];

const ACTIONS = [
  "start small",
  "write it down",
  "ask someone else",
  "timebox it",
  "cut the scope in half",
  "do it badly first",
  "pick one thing",
  "stop when it's good enough",
  "keep a log",
  "come back to it later",
];

const SMALL_TALK = [
  "I didn't think it would matter.",
  "I was wrong about that.",
  "Nobody warns you about this part.",
  "It's not complicated, just tedious.",
  "This is the part people skip.",
  "I still do this today.",
  "I've since stopped.",
  "It depends on what you want.",
  "Your mileage may vary.",
  "Same idea, different tools.",
];

const HEADINGS = [
  "What I actually tried",
  "The part that surprised me",
  "Where it fell apart",
  "How I'd do it again",
  "The boring answer",
  "What this doesn't fix",
  "A small example",
  "Why this is harder than it sounds",
  "The shortcut I stopped taking",
  "What changed",
  "Okay, but does it scale?",
  "The bit nobody mentions",
];

const QUOTES = [
  "You don't need a better system. You need to start.",
  "Most of this is just paying attention.",
  "The hard part isn't the tool, it's the habit.",
  "Simple beats clever almost every time.",
  "If it's not working, the scope is probably too big.",
  "None of this is new, it's just forgotten.",
  "Do the boring version first.",
];

const CLOSERS = [
  "That's about it, really.",
  "Anyway, that's where I landed.",
  "Not sure it'll work for you, but it worked for me.",
  "Worth a shot if you're stuck.",
  "Nothing groundbreaking, just what I noticed.",
  "Take it or leave it.",
  "I'll keep doing it for now.",
];

const COMMENT_TEMPLATES = [
  "This is exactly what I needed.",
  "Not sure I agree, but interesting.",
  "Been doing this for years, works great.",
  "Saved. Thanks for writing this up.",
  "Huh, I never thought about it that way.",
  "Okay but what about edge cases?",
  "The part about the habit really hit home.",
  "I tried this last month and bounced off it.",
  "Great writeup, more of this please.",
  "Do you have a follow-up on this?",
  "This matches my experience exactly.",
  "Counterpoint: it depends a lot on your setup.",
  "Simple and true.",
  "Bookmarking this for later.",
  "I wish I'd read this a year ago.",
];

function sentence(): string {
  const roll = Math.random();

  if (roll < 0.3) {
    return `${pick(TRANSITIONS)} ${pick(THINGS)} ${pick(OBSERVATIONS)}.`;
  }
  if (roll < 0.5) {
    return `The best advice I got was to ${pick(ACTIONS)}.`;
  }
  if (roll < 0.65) {
    return pick(SMALL_TALK);
  }
  if (roll < 0.8) {
    return `If you only do one thing, ${pick(ACTIONS)}.`;
  }
  return `${cap(pick(THINGS))} ${pick(OBSERVATIONS)}, and that changed how I ${pick(
    ["work", "plan", "think about it", "handle it"],
  )}.`;
}

function paragraph(min = 2, max = 5): string {
  const count = faker.number.int({ min, max });
  return Array.from({ length: count }, () => sentence()).join(" ");
}

function heading(): string {
  return `## ${pick(HEADINGS)}`;
}

function bulletItem(): string {
  return Math.random() < 0.6
    ? `${cap(pick(ACTIONS))}.`
    : `${cap(pick(THINGS))} ${pick(OBSERVATIONS)}.`;
}

function bulletList(): string {
  const count = faker.number.int({ min: 3, max: 5 });
  return Array.from({ length: count }, () => `- ${bulletItem()}`).join("\n");
}

function numberedList(): string {
  const count = faker.number.int({ min: 3, max: 5 });
  return Array.from(
    { length: count },
    (_, i) => `${i + 1}. ${bulletItem()}`,
  ).join("\n");
}

function blockquote(): string {
  return `> ${pick(QUOTES)}`;
}

// Builds a varied, conversational body. No lorem ipsum.
function generateContent(tagName: TagName): string {
  const topic = pick(TOPICS[tagName]).toLowerCase();
  const parts: string[] = [];

  // Intro — sometimes name-drop the topic, sometimes just start talking.
  parts.push(
    Math.random() < 0.5
      ? `I've been thinking about ${topic} a lot lately. ${paragraph(2, 4)}`
      : paragraph(3, 5),
  );

  // 2–4 middle sections with mixed blocks
  const sections = faker.number.int({ min: 2, max: 4 });
  for (let i = 0; i < sections; i++) {
    if (Math.random() < 0.65) parts.push(heading());

    parts.push(paragraph());

    const blockRoll = Math.random();
    if (blockRoll < 0.3) {
      parts.push(bulletList());
    } else if (blockRoll < 0.5) {
      parts.push(numberedList());
    } else if (blockRoll < 0.65) {
      parts.push(blockquote());
    }

    if (Math.random() < 0.5) parts.push(paragraph(1, 3));
  }

  // Casual sign-off
  parts.push(
    Math.random() < 0.3 ? `${pick(CLOSERS)}` : `${pick(CLOSERS)} ${sentence()}`,
  );

  return parts.join("\n\n");
}

// ---------- Seeding ----------

async function seedUsers() {
  const password = await hash(DEFAULT_PASSWORD);

  const users = Array.from({ length: USER_COUNT }, (_, i) => ({
    name: faker.person.fullName(),
    email: faker.internet.email({ provider: `example${i}.test` }),
    bio: faker.lorem.sentence(),
    avatar: faker.image.avatar(),
    password,
  }));

  const createdUsers = await Promise.all(
    users.map((user) => prisma.user.create({ data: user })),
  );

  console.log(`Seeded ${createdUsers.length} users`);
  return createdUsers;
}

async function seedTags() {
  const tags = await Promise.all(
    TAG_NAMES.map((name) => prisma.tag.create({ data: { name } })),
  );

  console.log(`Seeded ${tags.length} tags`);
  return tags;
}

async function seedPosts(
  userIds: number[],
  tags: { id: number; name: string }[],
) {
  // Ensure unique titles and slugs across this run.
  const usedTitles = new Set<string>();
  const usedSlugs = new Set<string>();

  for (let i = 0; i < POST_COUNT; i++) {
    const tag = pick(tags);
    const tagName = tag.name as TagName;

    // Retry a few times if the title collides.
    let title = generateTitle(tagName);
    let attempts = 0;
    while (usedTitles.has(title) && attempts < 10) {
      title = generateTitle(tagName);
      attempts++;
    }
    if (usedTitles.has(title)) title = `${title} (${i})`;
    usedTitles.add(title);

    let slug = generateSlug(title);
    if (usedSlugs.has(slug)) slug = `${slug}-${i}`;
    usedSlugs.add(slug);

    // Connect 1–3 tags, always including the topic tag.
    const extraTags = faker.helpers
      .arrayElements(tags, { min: 0, max: 2 })
      .filter((t) => t.id !== tag.id);
    const connectTags = [tag, ...extraTags].map((t) => ({ id: t.id }));

    await prisma.post.create({
      data: {
        title,
        slug,
        content: generateContent(tagName),
        thumbnail: cleanPicsumPhoto(),
        authorId: pick(userIds),
        published: faker.datatype.boolean({ probability: 0.85 }),
        tags: { connect: connectTags },
        comments: {
          createMany: {
            data: Array.from({ length: COMMENTS_PER_POST }, () => ({
              content: pick(COMMENT_TEMPLATES),
              authorId: pick(userIds),
            })),
          },
        },
      },
    });
  }

  console.log(`Seeded ${POST_COUNT} posts with comments`);
}

async function main() {
  const users = await seedUsers();
  const userIds = users.map((u) => u.id);

  const tags = await seedTags();

  await seedPosts(userIds, tags);

  console.log("Seeding completed");
}

main()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
