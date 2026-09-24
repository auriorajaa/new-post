# The Journal

> A full-stack editorial blog platform where authenticated writers publish articles, manage drafts, and readers discover, like, and comment on stories — powered by a NestJS GraphQL API and a Next.js App Router frontend.

## Table of Contents

- [Features](#features)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Project Structure](#project-structure)
- [Database Schema & Relationships](#database-schema--relationships)
- [Sequence Diagrams](#sequence-diagrams)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Application Routes / API Endpoints](#application-routes--api-endpoints)
- [Business Logic](#business-logic)
- [Access Control](#access-control)
- [Third-Party Integrations](#third-party-integrations)
- [Deployment](#deployment)
- [Key Design Decisions](#key-design-decisions)
- [Seed Data & Default Credentials](#seed-data--default-credentials)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Email/password authentication** — Users register and sign in through the API; passwords are hashed with **Argon2** before they ever touch the database.
- **Google OAuth2 sign-in (SSO)** — One-click sign-in via Google, with automatic account creation (find-or-create by email).
- **Dual-token session model** — The API issues a short-lived **JWT access token**; the frontend wraps it in a **7-day signed `session` cookie** (HS256 via `jose`) that carries the user profile for every request.
- **Protected dashboard routes** — Next.js `middleware.ts` intercepts every `/user/*` request and redirects anonymous visitors to the sign-in page.
- **Post authoring with drafts** — Writers create, edit, and delete their own posts; the `published` flag lets them save a draft and publish later.
- **Tag support** — Posts connect to tags with an *connect-or-create* strategy: tags are created on the fly if they do not exist yet, and re-synced on every update.
- **Post likes** — Authenticated users can like/unlike a post exactly once (enforced with a unique `(userId, postId)` constraint). The frontend applies **optimistic updates** via TanStack React Query.
- **Commenting** — Signed-in users leave comments on posts; the list is **paginated (12 per page)**, ordered newest-first, and shows the author's avatar and name.
- **Thumbnail uploads** — Post thumbnails are uploaded from the Next.js server action directly to **Supabase Storage** (public bucket `thumbnail-bucket-for-new-post`) and stored as public URLs.
- **Safe HTML rendering** — Post bodies are sanitized client-side with **isomorphic-dompurify** before being injected via `dangerouslySetInnerHTML`.
- **Server-side form validation** — Every form (sign-up, sign-in, post, comment) is validated with **zod** server actions; the API re-validates inputs with `class-validator`.
- **Pagination throughout** — Home feed and the "Your posts" dashboard paginate with `skip`/`take` (default page size **12**).
- **Responsive editorial UI** — Tailwind CSS v4 + shadcn/ui (Base UI) component library, HugeIcons, dark-mode ready, with mobile drawer navigation.
- **Realistic seed data** — A deterministic-looking seed script generates 10 users, 8 tags, 40 topical articles with unique titles/slugs, and 20 comments per post.

## Screenshots

| Page | Screenshot |
|------|------------|
| Home / article feed | <img width="3840" height="6136" alt="image" src="https://github.com/user-attachments/assets/132a3a76-b4de-4c9e-8ec6-e853f51ca52b" /> |
| Article detail with like & comments | <img width="1920" height="3539" alt="image" src="https://github.com/user-attachments/assets/6d2120a5-8bb8-4019-a9da-f2b8cce7518d" /> <img width="3840" height="1902" alt="image" src="https://github.com/user-attachments/assets/e5b906ee-2305-4159-8289-0f6e81b62c54" /> <img width="3840" height="1902" alt="image" src="https://github.com/user-attachments/assets/82d7aa45-e0c5-4622-b055-3df162cbfa11" /> |
| Sign in / Sign up | <img width="3840" height="2048" alt="image" src="https://github.com/user-attachments/assets/fa7e1e51-0849-4e15-a0f0-2359ff458966" /> <img width="3840" height="2048" alt="image" src="https://github.com/user-attachments/assets/ed479b71-8c54-4f17-86a9-48213ccb7652" /> |
| Create / edit post | <img width="4702" height="2810" alt="image" src="https://github.com/user-attachments/assets/50ce6142-6dad-4203-a9b3-c4022e3f0634" /> <img width="4702" height="3558" alt="image" src="https://github.com/user-attachments/assets/438c1a7d-f774-4b51-a85b-bc4b2f84bb9e" /> |
| Your posts dashboard | <img width="3840" height="1922" alt="image" src="https://github.com/user-attachments/assets/4a760303-a28e-49d0-ab43-2b1639bdfc85" /> |

## Tech Stack

| Layer | Technology | Version (declared) |
|-------|-----------|---------------------|
| Monorepo tooling | Turborepo | `^2.10.12` |
| Package manager | pnpm | `12.3.3` (package.json `packageManager`) |
| Language | TypeScript | API `^6.0.2` · Front `^5` |
| **API — framework** | NestJS (`@nestjs/core`, `@nestjs/common`) | `^12.0.1` |
| API — GraphQL server | Apollo Server (`@apollo/server`) | `^5.5.1` |
| API — GraphQL integration | `@nestjs/graphql` / `@nestjs/apollo` | `^14.0.0` |
| API — GraphQL core | `graphql` | `^17.0.2` |
| API — ORM | `@prisma/client` + `prisma` | `^7.10.0` |
| API — PostgreSQL driver adapter | `@prisma/adapter-pg` | `^7.10.0` |
| API — Auth (JWT) | `@nestjs/jwt`, `passport-jwt` | `^12.0.1` / `^4.0.1` |
| API — Auth (Google) | `passport-google-oauth20`, `@nestjs/passport` | `^2.0.0` / `^12.0.0` |
| API — Password hashing | `argon2` | `^0.45.1` |
| API — Validation | `class-validator`, `class-transformer` | `^0.15.1` / `^0.5.1` |
| API — Observability | `@nestjs/observe` | `^0.1.8` |
| API — Tests | Vitest (`vitest`) | `^4.1.2` |
| API — Linting | oxlint | `^1.58.0` |
| **Front — framework** | Next.js | `16.3.4` |
| Front — UI runtime | React / react-dom | `19.2.8` |
| Front — Styling | Tailwind CSS + `@tailwindcss/postcss` | `^4` |
| Front — Component library | shadcn (`shadcn` CLI), `@base-ui/react` | `^4.21.0` / `^1.8.0` |
| Front — Icons | HugeIcons | `^1.1.10` |
| Front — Data fetching | TanStack React Query | `^5.102.8` |
| Front — Storage client | `@supabase/supabase-js` | `^2.116.0` |
| Front — Sessions | `jose` | `^6.2.12` |
| Front — Validation | `zod` | `^4.5.4` |
| Front — Sanitization | `isomorphic-dompurify` | `^2.22.0` |
| Front — Toasts | `sonner` | `^2.0.8` |
| Front — Theming | `next-themes` | `^0.4.6` |

> All versions above are the ranges pinned in each app's `package.json`. The exact resolved versions live in `pnpm-lock.yaml`.

## Architecture Overview

```mermaid
graph TB
    subgraph Browser["Browser / Client"]
        UI["Next.js App (Server & Client Components)"]
        SW["Server Actions (signUp, signIn, saveNewPost, saveComment, likePost, ...)"]
        RQ["TanStack React Query (like & comments islands)"]
    end

    subgraph Front["apps/front — Next.js 16 on :3000"]
        MW["middleware.ts — protects /user/*"]
        SES["lib/session.ts — jose session cookie (7d)"]
        GQLC["lib/fetchGraphQL.ts — public / authenticated GraphQL client"]
        UP["lib/upload.ts — Supabase Storage upload"]
        RR["API Routes (google/callback, signout)"]
    end

    subgraph API["apps/api — NestJS on :8080"]
        REST["AuthController (REST)"]
        GRAPHQL["GraphQLModule (Apollo driver, code-first)"]
        GUARDS["Passport guards / strategies (JWT + Google)"]
        RES["Resolvers (Post, User, Comment, Like, Auth)"]
        SVC["Services + PrismaService (PrismaPg adapter)"]
    end

    subgraph Data["Data & External Services"]
        PG[("PostgreSQL — Neon (Prisma migrations)")]
        SB["Supabase Storage (thumbnail-bucket-for-new-post)"]
        GOOGLE["Google OAuth2 (accounts.google.com)"]
        OBS["NestJS Observe (optional instrument)"]
    end

    UI --> MW
    MW --> SES
    UI --> SW
    SW --> GQLC
    SW --> UP
    UI --> RQ --> GQLC
    RQ --> SES
    SW --> RR
    RR --> REST
    UI -->|"GET /auth/google/login · callback"| REST

    GQLC -->|"POST /graphql (Bearer token from session)"| GRAPHQL
    GRAPHQL --> GUARDS
    GUARDS --> RES
    RES --> SVC
    SVC -->|"Prisma Client + PrismaPg adapter"| PG
    UP --> SB
    REST -->|"OAuth2 redirect"| GOOGLE
    SVC -.->|"telemetry (placeholder key)"| OBS
```

## Project Structure

```
new-post/
├── package.json                 # Root manifest — scripts delegate to Turborepo
├── pnpm-workspace.yaml          # pnpm workspaces: apps/* + packages/* (+ allowed build scripts)
├── turbo.json                   # Pipeline: build deps order, lint, dev; env passthrough
├── pnpm-lock.yaml
├── .gitignore
│
└── apps/
    ├── api/                     # NestJS GraphQL backend
    │   ├── package.json         # nest/vitest/prisma scripts, dependencies
    │   ├── nest-cli.json        # Nest CLI config
    │   ├── tsconfig.json        # module: nodenext, strict, decorators, target ES2023
    │   ├── tsconfig.build.json
    │   ├── prisma.config.ts     # Prisma 7 config — schema path, migrations, seed, DATABASE_URL
    │   ├── .prettierrc
    │   ├── oxlint.json          # oxlint rules (no-explicit-any off, no-floating-promises warn)
    │   ├── vitest.config.ts     # unit tests: **/*.spec.ts
    │   ├── vitest.config.e2e.ts # e2e tests: **/*.e2e-spec.ts
    │   ├── prisma/
    │   │   ├── schema.prisma    # User, Post, Comment, Tag, Like (+ PostTags m2m)
    │   │   ├── migrations/      # 20260915072539_init, 20260917032721_update_cascade_delete
    │   │   └── seed.ts          # 10 users, 8 tags, 40 posts, 20 comments each (password "123")
    │   ├── test/
    │   │   └── app.e2e-spec.ts  # supertest e2e for GET /
    │   └── src/
    │       ├── main.ts          # bootstrap, CORS (FRONTEND_URL), ValidationPipe, PORT ?? 8080
    │       ├── app.module.ts    # GraphQL (Apollo, autoSchemaFile), Observe, feature modules
    │       ├── constants.ts     # DEFAULT_PAGE_SIZE = 12
    │       ├── graphql/schema.gql  # Auto-generated schema (do not modify)
    │       ├── prisma/          # PrismaService + module (PrismaPg driver adapter)
    │       ├── auth/            # controller (REST), resolver (GraphQL), service, jwt & google
    │       │                    # strategies, guards, DTOs, AuthPayload entity, AuthJwtPayload type
    │       ├── user/            # user.resolver (createUser), user.service (argon2 hash), DTOs, entity
    │       ├── post/            # post.resolver/service — CRUD + ownership checks, tags m2m
    │       ├── comment/         # comment.resolver/service — list + create, paginated, newest first
    │       ├── like/            # like.resolver/service — like/unlike/count/status
    │       ├── tag/             # tag.module (empty — placeholder scaffolding only)
    │       └── common/types.ts  # Circular<T> helper type
    │
    └── front/                   # Next.js 16 App Router frontend
        ├── package.json
        ├── next.config.ts       # serverExternalPackages (jsdom, dompurify) + image remote patterns
        ├── postcss.config.mjs   # @tailwindcss/postcss
        ├── components.json      # shadcn config (base-rhea style, hugeicons)
        ├── tsconfig.json        # @/* path alias
        ├── eslint.config.mjs    # next/core-web-vitals + typescript
        ├── middleware.ts        # guards /user/* — redirects to /auth/signin when no session
        ├── public/              # favicon, web manifest, apple-touch-icon
        ├── lib/
        │   ├── constants.ts     # BACKEND_URL (throws when missing), DEFAULT_PAGE_SIZE
        │   ├── session.ts       # createSession/getSession/deleteSession (jose, 7d cookie)
        │   ├── fetchGraphQL.ts  # fetchGraphQL + authFetchGraphQL helpers
        │   ├── gqlQueries.ts    # all GraphQL document strings (graphql-tag)
        │   ├── upload.ts        # Supabase thumbnail upload → public URL
        │   ├── helpers.ts       # transformTakeSkip (page → skip/take)
        │   ├── zodSchemas/      # signUp, signIn, post, comment schemas
        │   ├── actions/         # server actions: auth, postActions, commentActions, like
        │   └── types/           # modelTypes, formState
        ├── components/          # hero, posts, postCard, navbar, profile, signInPanel, ui/* (shadcn)
        └── app/
            ├── layout.tsx       # fonts, metadata, Providers (React Query), navbars, Toaster
            ├── providers.tsx    # QueryClientProvider
            ├── page.tsx         # Home — Hero + paginated latest posts
            ├── api/
            │   └── auth/        # google/callback (route), signout (route)
            ├── auth/            # layout (brand split), signin/, signup/
            ├── blog/[slug]/[id]/  # article page + _components (safeHtml, like, comments, ...)
            └── user/            # layout, posts/ (dashboard), create-post/, posts/[id]/update/
```

## Database Schema & Relationships

### Models overview

| Model | Description | Key fields |
|-------|-------------|------------|
| `User` | Authenticated author/reader. `email` is unique; `password` nullable (Google users have none). | `id` (PK), `name`, `email` (unique), `bio?`, `avatar?`, `password?`, `createdAt`, `updatedAt` |
| `Post` | Article written by a `User`; `published` toggles draft/publish; `slug` unique (only set by the seed script). | `id` (PK), `slug?` (unique), `title`, `content`, `thumbnail?`, `published`, `authorId` (FK) |
| `Comment` | Reader comment on a `Post`; deleted with its post (`onDelete: Cascade`). | `id` (PK), `content`, `postId` (FK, cascade), `authorId` (FK) |
| `Tag` | Reusable label; `name` unique. Shares an implicit `_PostTags` many-to-many with `Post`. | `id` (PK), `name` (unique) |
| `Like` | "Heart" on a post; unique per `(userId, postId)`; deleted with its post (`onDelete: Cascade`). | `id` (PK), `userId` (FK), `postId` (FK, cascade), `@@unique([userId, postId])` |

> Migration `20260917032721_update_cascade_delete` changed the FK behavior of `Comment.postId` and `Like.postId` from `RESTRICT` to `CASCADE` (deleting a post deletes its comments and likes). `Post.authorId`, `Comment.authorId`, and `Like.userId` remain `RESTRICT`.

### Entity-relationship diagram

```mermaid
erDiagram
    User ||--o{ Post : "writes"
    User ||--o{ Comment : "authors"
    User ||--o{ Like : "gives"
    Post ||--o{ Comment : "receives"
    Post ||--o{ Like : "receives"
    Post }o--o{ Tag : "tagged with (PostTags)"

    User {
        int id PK
        string name
        string email UK
        string bio
        string avatar
        string password
        datetime createdAt
        datetime updatedAt
    }
    Post {
        int id PK
        string slug UK
        string title
        string content
        string thumbnail
        boolean published
        int authorId FK
        datetime createdAt
        datetime updatedAt
    }
    Comment {
        int id PK
        string content
        int postId FK
        int authorId FK
        datetime createdAt
        datetime updatedAt
    }
    Tag {
        int id PK
        string name UK
    }
    Like {
        int id PK
        int userId FK
        int postId FK
        datetime createdAt
        datetime updatedAt
    }
```

### Relationship details

| Relationship | Type | Cardinality | Notes |
|--------------|------|-------------|-------|
| `User` → `Post` | One-to-many | 1 : N | `Post.authorId` FK; delete restricted |
| `User` → `Comment` | One-to-many | 1 : N | `Comment.authorId` FK; delete restricted |
| `User` → `Like` | One-to-many | 1 : N | `Like.userId` FK; delete restricted |
| `Post` → `Comment` | One-to-many | 1 : N | `Comment.postId` FK; **onDelete: Cascade** |
| `Post` → `Like` | One-to-many | 1 : N | `Like.postId` FK; **onDelete: Cascade**; unique `(userId, postId)` |
| `Post` ↔ `Tag` | Many-to-many | N : N | Implicit join table `_PostTags`; cascade on both sides |

## Sequence Diagrams

### 1. Email sign-up

```mermaid
sequenceDiagram
    actor U as Reader
    participant F as Next.js (signup page)
    participant A as Server Action signUp
    participant G as GraphQL API
    participant S as UserService
    participant DB as Prisma/PostgreSQL

    U->>F: Submit sign-up form
    F->>A: formData
    A->>A: zod validation (password: 8+, letter, number, special)
    A->>G: Mutation createUser(name, email, password)
    G->>S: createUserInput
    S->>S: argon2.hash(password)
    S->>DB: INSERT user (hashed password)
    DB-->>S: user
    S-->>G: user
    G-->>A: user
    A-->>U: redirect("/auth/signin")
```

### 2. Email sign-in & protected-dashboard access

```mermaid
sequenceDiagram
    actor U as User
    participant F as Next.js (signin page)
    participant A as Server Action signIn
    participant G as GraphQL API (AuthResolver)
    participant AS as AuthService
    participant DB as Prisma/PostgreSQL
    participant SES as session.ts
    participant MW as middleware.ts

    U->>F: Submit credentials
    F->>A: email + password
    A->>G: Mutation signIn
    G->>AS: validateLocalUser(email, password)
    AS->>DB: findUnique user by email
    AS->>AS: argon2.verify(password hash)
    AS->>AS: JwtService.signAsync({ sub: userId })
    AS-->>A: { id, name, avatar, accessToken }
    A->>SES: createSession({ user, accessToken })
    SES->>SES: SignJWT(HS256, exp 7d) → httpOnly cookie
    A-->>U: redirect("/")
    U->>MW: GET /user/posts
    MW->>SES: getSession()
    SES-->>MW: session?.user
    MW-->>U: allow /user/posts
```

### 3. Google OAuth2 sign-in

```mermaid
sequenceDiagram
    participant U as User
    participant F as Next.js sign-in page
    participant APIREST as NestJS AuthController
    participant GOOGLE as Google OAuth2
    participant STRAT as GoogleStrategy
    participant AS as AuthService
    participant DB as Prisma/PostgreSQL
    participant RR as Next.js /api/auth/google/callback
    participant SES as session.ts

    U->>F: Click "Sign in with Google"
    F->>APIREST: GET /auth/google/login (302)
    APIREST->>GOOGLE: authorize redirect (client_id, scope)
    GOOGLE-->>APIREST: GET /auth/google/callback?code=
    APIREST->>STRAT: validate(email, name, avatar)
    STRAT->>AS: validateGoogleUser({email, name, avatar, password:""})
    AS->>DB: findUnique by email → create if missing
    AS-->>STRAT: authUser (password stripped)
    APIREST->>APIREST: login() → sign accessToken
    APIREST-->>F: 302 {FRONTEND_URL}/api/auth/google/callback?accessToken=&userId=&name=&avatar=
    F->>RR: GET callback (query params)
    RR->>APIREST: GET /auth/verify-token (Authorization: Bearer)
    APIREST-->>RR: 200 ok
    RR->>SES: createSession({ user, accessToken })
    RR-->>U: redirect("/")
```

### 4. Create a post (with thumbnail upload)

```mermaid
sequenceDiagram
    actor W as Writer
    participant F as create-post page
    participant SA as Server Action saveNewPost
    participant Z as zod (PostFormSchema)
    participant SB as Supabase Storage
    participant G as GraphQL API
    participant S as PostService
    participant DB as Prisma/PostgreSQL

    W->>F: Fill title, content, tags, thumbnail, publish toggle
    F->>SA: formData
    SA->>Z: safeParse (title 2–100, content ≥5, tags csv)
    alt thumbnail provided
        SA->>SB: upload(`${Date.now()}_${file.name}`)
        SB-->>SA: public URL
    end
    SA->>G: Mutation createPost ({...fields, tags, thumbnail})
    G->>S: create({createPostInput, authorId})
    S->>DB: create post + tags connectOrCreate
    DB-->>S: post
    G-->>SA: post
    SA-->>W: toast success → redirect /user/posts
```

### 5. Like a post (optimistic UI)

```mermaid
sequenceDiagram
    participant R as Reader (client)
    participant C as Like button (client island)
    participant RQ as TanStack React Query
    participant SA as Server Action likePost
    participant G as GraphQL API
    participant S as LikeService
    participant DB as Prisma/PostgreSQL

    R->>C: Click heart
    C->>RQ: mutate(true)
    RQ->>RQ: onMutate — optimistic likeCount+1, userLikedPost=true
    RQ->>SA: likePost(postId)
    SA->>G: Mutation likePost(postId) [Bearer]
    G->>S: likePost({postId, userId})
    S->>DB: INSERT Like (unique userId_postId)
    DB-->>S: created
    S-->>G: true
    G-->>SA: true
    SA-->>RQ: true
    RQ->>RQ: onSettled — invalidate GET_POST_LIKE_DATA
    RQ-->>C: re-render with server count
    alt duplicate like
        S-->>G: BadRequestException("You already liked this post")
        RQ->>RQ: onError — rollback to previous state
    end
```

### 6. Edit / delete a post (ownership check)

```mermaid
sequenceDiagram
    participant W as Writer
    participant P as /user/posts dashboard
    participant SA as Server Action updatePost / deletePost
    participant G as GraphQL API
    participant S as PostService
    participant DB as Prisma/PostgreSQL

    W->>P: Choose Edit or Delete
    alt Update
        P->>SA: updatePost(formData, postId)
        SA->>G: Mutation updatePost
        G->>S: update({userId, updatePostInput})
        S->>DB: findUnique(id + authorId)
        alt owner
            S->>DB: update + tags set:[] + connectOrCreate
            DB-->>S: updated post
        else not the owner
            S-->>G: UnauthorizedException
        end
        G-->>SA: post / error
        SA-->>W: toast → redirect /user/posts
    else Delete
        P->>SA: deletePost(postId)
        SA->>G: Mutation deletePost
        G->>S: delete({postId, userId})
        S->>DB: findUnique(id + authorId) → delete (cascade comments & likes)
        DB-->>S: deleted
        G-->>SA: true
        SA-->>W: toast → router.refresh()
    end
```

## Environment Variables

No `.env.example` files exist in the repository. Every variable below is read directly from `process.env` in the code and is required unless marked optional. Missing required variables either throw at startup or break a feature at runtime.

### `apps/api/.env`

| Variable | Required | Description | Used in |
|----------|----------|-------------|---------|
| `DATABASE_URL` | Yes | PostgreSQL connection string used by the Prisma driver adapter (`PrismaPg`) and `prisma` CLI (migrations + seed) | `prisma.config.ts`, `prisma.service.ts`, `prisma/seed.ts` |
| `JWT_SECRET` | Yes | Secret for signing/verifying API access tokens (`@nestjs/jwt`) | `auth.module.ts`, `jwt.strategy.ts` |
| `JWT_EXPIRES_IN` | No | Access-token lifetime (default `"24h"`) | `auth.module.ts` |
| `GOOGLE_CLIENT_ID` | Yes (Google SSO) | Google OAuth2 client ID | `google.strategy.ts` |
| `GOOGLE_CLIENT_SECRET` | Yes (Google SSO) | Google OAuth2 client secret | `google.strategy.ts` |
| `GOOGLE_CALLBACK_URL` | Yes (Google SSO) | Redirect URI registered in the Google console, e.g. `http://localhost:8080/auth/google/callback` | `google.strategy.ts` |
| `FRONTEND_URL` | Yes | Allowed CORS origin and OAuth post-return destination, e.g. `http://localhost:3000` | `main.ts`, `auth.controller.ts` |
| `PORT` | No | API listen port (default `8080`) | `main.ts` |

```dotenv
# apps/api/.env
# PostgreSQL (e.g. Neon). Used by Prisma driver adapter, migrate, and seed.
DATABASE_URL="postgresql://user:password@host:5432/db?sslmode=require"

# JWT authentication
JWT_SECRET="<generate-a-long-random-string>"
JWT_EXPIRES_IN=24h

# Google OAuth2 (https://console.cloud.google.com/apis/credentials)
GOOGLE_CLIENT_ID="<your-client-id>.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="<your-client-secret>"
GOOGLE_CALLBACK_URL="http://localhost:8080/auth/google/callback"

# Frontend origin for CORS + post-OAuth redirect
FRONTEND_URL="http://localhost:3000"
```

### `apps/front/.env`

| Variable | Required | Description | Used in |
|----------|----------|-------------|---------|
| `BACKEND_URL` | Yes | API base URL; the code **throws** if it is missing | `lib/constants.ts` |
| `SESSION_SECRET_KEY` | Yes | Secret used by `jose` to sign/verify the `session` cookie (`HS256`) | `lib/session.ts` |
| `SUPABASE_URL` | Yes (upload feature) | Supabase project URL for the storage client | `lib/upload.ts` |
| `SUPABASE_API_KEY` | Yes (upload feature) | Supabase anon/key for the storage client (upload + getPublicUrl) | `lib/upload.ts` |

```dotenv
# apps/front/.env
# NestJS API origin (no trailing slash needed)
BACKEND_URL="http://localhost:8080"

# Secret for the jose HS256 session cookie (independent from the API JWT secret)
SESSION_SECRET_KEY="<generate-a-long-random-string>"

# Supabase project for thumbnail storage (https://supabase.com/dashboard)
SUPABASE_URL="https://your-project-ref.supabase.co"
SUPABASE_API_KEY="<your-supabase-anon-key>"
```

> `turbo.json` declares `BACKEND_URL`, `SESSION_SECRET_KEY`, `SUPABASE_URL`, and `SUPABASE_API_KEY` as env passthrough for the build task, so they must be present in the environment (`apps/front/.env`) for a production build to succeed.

## Getting Started

### Prerequisites

- **Node.js** ≥ 20 (the repo declares `packageManager: pnpm@12.3.3`; the API targets ES2023)
- **pnpm 12.3.3** — install with `corepack enable` or `npm i -g pnpm@12.3.3`
- **PostgreSQL** — any reachable instance (local, Docker, or a serverless option like **Neon**, which the sample env uses)
- **Google Cloud project** — only if you want Google sign-in: create OAuth credentials and configure the redirect URIs
- **Supabase project** — only if you want thumbnail uploads: create a public storage bucket named `thumbnail-bucket-for-new-post`

### Installation

```bash
git clone https://github.com/auriorajaa/new-post.git
cd new-post
pnpm install
```

`pnpm install` runs `prisma generate` through the API's `postinstall` script.

### Environment setup

1. Copy the samples from [Environment Variables](#environment-variables) into `apps/api/.env` and `apps/front/.env`, filling in real values.
2. Set `FRONTEND_URL=http://localhost:3000` and `GOOGLE_CALLBACK_URL=http://localhost:8080/auth/google/callback` for local development.

### Database migration & seed

```bash
cd apps/api
pnpm prisma migrate deploy        # apply existing migrations to your DATABASE_URL
pnpm db:seed                      # 10 users, 8 tags, 40 posts, 20 comments each
```

> Use `pnpm prisma migrate dev` instead when you change `prisma/schema.prisma` and want to create a new migration.

### Google OAuth setup (optional)

1. In the [Google Cloud console](https://console.cloud.google.com/apis/credentials), create an **OAuth 2.0 Client ID** of type *Web application*.
2. Add an authorized redirect URI: `http://localhost:8080/auth/google/callback` (and your production variant).
3. Put the client ID / secret in `apps/api/.env`.
4. Frontend route `/auth/signin` already links to `BACKEND_URL/auth/google/login` — no frontend change needed.

### Supabase storage setup (optional)

1. Create a Supabase project.
2. Create a **public** storage bucket named exactly `thumbnail-bucket-for-new-post` (the code references it verbatim in `lib/upload.ts`).
3. Fill `SUPABASE_URL` and `SUPABASE_API_KEY` in `apps/front/.env`.

### Run the stack

From the repository root (Turborepo runs both apps in watch mode):

```bash
pnpm dev
```

- Frontend: `http://localhost:3000`
- API GraphQL playground: `http://localhost:8080/graphql`
- API health probe: `http://localhost:8080/` → `Hello World!`

## Available Scripts

### Root (`new-post`)

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `turbo run dev` | Start both apps (`api` watch + `front` dev) with cache disabled |
| `build` | `turbo run build` | Build all apps in dependency order |
| `lint` | `turbo run lint` | Lint all apps |

### `apps/api`

| Script | Command | Description |
|--------|---------|-------------|
| `build` | `nest build` | Compile TypeScript to `dist/` |
| `deploy` | `nest deploy` | Deploy via NestJS Mau (requires Mau setup) |
| `format` | `prettier --write "src/**/*.ts" "test/**/*.ts"` | Format backend sources |
| `start` | `nest start` | Run the app |
| `dev` | `nest start --watch` | Run in watch mode |
| `start:debug` | `nest start --debug --watch` | Run with Node.js inspector |
| `start:prod` | `node dist/main` | Run the production build |
| `lint` | `oxlint src/ test/` | Lint with oxlint |
| `test` | `vitest run` | Run unit tests (`**/*.spec.ts`) |
| `test:watch` | `vitest` | Run unit tests in watch mode |
| `test:cov` | `vitest run --coverage` | Run unit tests with coverage |
| `test:debug` | `vitest --inspect-brk --no-file-parallelism` | Run unit tests under the inspector |
| `test:e2e` | `vitest run --config ./vitest.config.e2e.ts` | Run e2e tests (`**/*.e2e-spec.ts`) |
| `postinstall` | `prisma generate` | Regenerate Prisma Client after install |
| `db:seed` | `tsx ./prisma/seed.ts` | Seed the database |

### `apps/front`

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `next dev` | Start the dev server |
| `build` | `next build` | Production build (needs the env vars listed in `turbo.json`) |
| `start` | `next start` | Serve the production build |
| `lint` | `eslint` | Lint with `next/core-web-vitals` + TypeScript rules |

## Application Routes / API Endpoints

### Frontend routes (Next.js App Router)

| Route | Auth | Description |
|-------|------|-------------|
| `/` | Public | Home — Hero section + latest posts, paginated via `?page=` |
| `/auth/signin` | Public | Sign-in form (email/password) + "Continue with Google" |
| `/auth/signup` | Public | Registration form |
| `/blog/[slug]/[id]` | Public (engagements auth) | Article page — sanitized body, tags, like button, paginated comments |
| `/user/posts` | Protected | Writer dashboard — manage own posts (view, edit, delete) |
| `/user/create-post` | Protected | Create a new post (or save as draft) |
| `/user/posts/[id]/update` | Protected | Edit an existing post with pre-filled values |
| `/api/auth/google/callback` | Public (origin-restricted data) | Verifies the JWT returned by the API, creates the session, redirects to `/` |
| `/api/auth/signout` | Public | Deletes the session cookie and redirects to `/` |

> The middleware `config.matcher` is `/user/:path*`; all `/user/*` routes 302 → `/auth/signin` when no valid session exists.

### Rest API (NestJS)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/` | — | Health probe, returns `"Hello World!"` |
| `GET` | `/auth/google/login` | Google OAuth | Starts the Google OAuth2 flow (passport-google-oauth20) |
| `GET` | `/auth/google/callback` | Google OAuth | OAuth callback; exchanges the profile for a JWT and redirects to `FRONTEND_URL/api/auth/google/callback?...` |
| `GET` | `/auth/verify-token` | Bearer JWT (`JwtAuthGuard`) | Returns `"ok"`; used by the frontend to validate a Google-flow access token |
| `POST` | `/graphql` | Mixed (per resolver) | GraphQL endpoint — see table below |

### GraphQL schema (`apps/api/src/graphql/schema.gql`)

**Queries**

| Query | Auth | Description |
|-------|------|-------------|
| `posts(skip, take)` | Public | Paginated list of all posts (default `take` = 12) |
| `postCount` | Public | Total number of posts (for pagination) |
| `getPostById(id)` | Public | Single post incl. `author`, `tags` |
| `getUserPosts(skip, take)` | **JWT** | Current user's posts with `_count { likes, comments }` |
| `userPostCount` | **JWT** | Number of posts owned by the current user |
| `getPostComments(postId, take = 12, skip = 0)` | Public | Comments for a post, newest first, incl. `author` |
| `postCommentCount(postId)` | Public | Total comments on a post |
| `postLikesCount(postId)` | Public | Total likes on a post |
| `userLikedPost(postId)` | **JWT** | Whether the current user liked the post |

**Mutations**

| Mutation | Auth | Description |
|----------|------|-------------|
| `signIn(signInInput)` | Public | Validates email/password (Argon2) and returns `{ id, name, avatar, accessToken }` |
| `createUser(createUserInput)` | Public | Registers a user (server hashes password with Argon2) |
| `createPost(createPostInput)` | **JWT** | Creates a post as the current user; tags via connect-or-create |
| `updatePost(updatePostInput)` | **JWT** | Updates a post **owned by the current user**; re-syncs tags |
| `deletePost(postId)` | **JWT** | Deletes a post **owned by the current user** (cascades comments & likes) |
| `createComment(createCommentInput)` | **JWT** | Adds a comment to a post as the current user |
| `likePost(postId)` | **JWT** | Likes a post; errors with `400` if already liked |
| `unlikePost(postId)` | **JWT** | Removes the like; errors with `400` if the like does not exist |

## Business Logic

### Authentication & sessions

- **Registration** hashes the password server-side with `argon2.hash()` before `prisma.user.create`. GraphQL never returns the `password` field.
- **Sign-in** looks the user up by email, runs `argon2.verify()`, then signs a JWT containing `{ sub: userId }` (expiry from `JWT_EXPIRES_IN`). The returned profile never includes the password hash.
- **Sessions** are frontend-owned: the access token plus a lightweight user snapshot (`id`, `name`, `avatar`) are packed into a `jose` HS256 JWT stored in an `httpOnly`/`sameSite=lax` cookie named `session`, expiring in 7 days. Every protected GraphQL call re-attaches `Authorization: Bearer <accessToken>`.
- **Google flow** never stores a password. `validateGoogleUser` finds the user by email or creates one (with an empty password), then strips the password before returning. The API hands the JWT back to the frontend via a redirect query string, which the frontend double-checks against `GET /auth/verify-token` before issuing its cookie.

### Post ownership & mutation rules

- `updatePost` and `deletePost` first assert the target post matches the current user (`findUnique({ id, authorId })`). Any mismatch throws `UnauthorizedException` — a user can never edit or delete another user's post.
- **Tags** are stored as a many-to-many relation. On create, `connectOrCreate` upserts each tag by its unique `name`. On update, the relation is fully replaced: `set: []` clears old links, then `connectOrCreate` re-adds all submitted tags.
- **Slugs** are optional in the schema and only produced by the seed script's `generateSlug()`; the API/CRUD layer does not compute slugs, and routing resolves posts by numeric `id` under `/blog/[slug]/[id]`.

### Likes

- A database-level unique constraint `@@unique([userId, postId])` guarantees a user likes a post at most once. A duplicate insert is caught and rethrown as `BadRequestException("You already liked this post")`; a missing like on unlike becomes `BadRequestException("Like not found")`.
- Like counts and the current user's like status come from `postLikesCount` / `userLikedPost` and are cached client-side by React Query, with an optimistic update that rolls back on error.

### Comments

- Only authenticated users can create comments; the list is public.
- Comments are fetched newest-first (`orderBy createdAt desc`) with `take`/`skip` pagination, default page size 12 (`DEFAULT_PAGE_SIZE`).
- Comment authors are embedded server-side (`include: { author: true }`), so the UI renders name + avatar without extra round-trips.

### Publishing & content rendering

- `published` is a boolean the author chooses at write time ("Publish now" or save as a draft). Draft state is surfaced as a badge in the "Your posts" dashboard. Note: the public `findAll`/`posts` query does **not** filter on `published`, so all posts appear in the public feed.
- Post content is authored as markdown-like text and sanitized on the client with `isomorphic-dompurify` before rendering, mitigating XSS from stored HTML.

### Frontend data flow

- All background IO happens in **server actions** (`lib/actions/*`) that fetch the GraphQL API with `fetch`; public data uses `fetchGraphQL`, user-scoped data uses `authFetchGraphQL` which reads the session cookie and injects the bearer token.
- Interactive islands (Like button, Comments) call those server actions through TanStack React Query, which provides optimistic updates, cancellation, and invalidation; forms use React's `useActionState` + `sonner` toasts.

## Access Control

There are exactly two roles: **anonymous** and **authenticated (any signed-in user)**. There is no admin role or role hierarchy in the code.

| Route / resource | Anonymous | Authenticated |
|------------------|-----------|---------------|
| `/`, `/blog/[slug]/[id]` | Read | Read |
| `/auth/signin`, `/auth/signup` | Use | — |
| `/user/*` (all) | Redirected to `/auth/signin` (middleware) | Access |
| Read posts & counts | Yes | Yes |
| Read comments & like counts | Yes | Yes |
| `userLikedPost` | — | Yes |
| Create/update/delete post | — | Yes (owner only for update/delete) |
| Create comment | — | Yes |
| Like / unlike post | — | Yes |
| Sign in / sign up / Google SSO | Yes | — |

| Resolver | Guard |
|----------|-------|
| `getUserPosts`, `userPostCount`, `createPost`, `updatePost`, `deletePost` | `JwtAuthGuard` (`@UseGuards`) |
| `createComment`, `likePost`, `unlikePost`, `userLikedPost` | `JwtAuthGuard` (`@UseGuards`) |
| `posts`, `postCount`, `getPostById`, `getPostComments`, `postCommentCount`, `postLikesCount`, `createUser`, `signIn` | Public |
| `GET /auth/verify-token` | `JwtAuthGuard` (REST) |
| `GET /auth/google/login`, `GET /auth/google/callback` | `GoogleAuthGuard` |

> `JwtAuthGuard` is a GraphQL-aware wrapper (`getRequest` extracts `req` from the GraphQL context) around the Passport JWT strategy.

## Third-Party Integrations

| Integration | Purpose | Flow |
|-------------|---------|------|
| **Supabase Storage** | Post thumbnail hosting | The `saveNewPost`/`updatePost` server action uploads the image to the public bucket `thumbnail-bucket-for-new-post` with a timestamped filename, then stores the returned public URL in the post's `thumbnail` field. The bucket name is hard-coded in `lib/upload.ts`. |
| **Google OAuth2** | Social sign-in | Passport `google-oauth20` strategy on the API. Browser → `/auth/google/login` (302 to Google) → `/auth/google/callback` → API exchanges profile for a JWT → redirect to the frontend callback route → frontend verifies the token against `/auth/verify-token` → writes the session cookie. |
| **PostgreSQL (Neon)** | Primary datastore | Prisma 7 with the `pg` driver adapter (`PrismaPg`). `DATABASE_URL` points at a Neon pooled instance in the sample env; migrations live in `apps/api/prisma/migrations`. |
| **NestJS Observe** | (Optional) Observability | `createObserveModule()` instruments the app; configured in `app.module.ts` with placeholder `YOUR_APP_KEY`/`YOUR_APP_SECRET` and `serviceId: "api"`. Wiring exists out of the box but is inert until real credentials are supplied. |

## Deployment

### Checklist

- [ ] Build both apps: `pnpm build` (verify all env vars from `turbo.json` are set on the host).
- [ ] Migrations applied: `pnpm prisma migrate deploy` against the production `DATABASE_URL`.
- [ ] Seed/verify data: run `pnpm db:seed` if the production DB should be populated.
- [ ] API: set `FRONTEND_URL` to the deployed frontend origin; enable CORS for it.
- [ ] Google OAuth: add the production `GOOGLE_CALLBACK_URL` (e.g. `https://api.example.com/auth/google/callback`) to the Google console authorized redirect URIs.
- [ ] Supabase: bucket `thumbnail-bucket-for-new-post` must exist and be **public**; the `SUPABASE_*` vars must point at the production project.
- [ ] Session/API secrets: rotate `SESSION_SECRET_KEY` and `JWT_SECRET` (they are stored in non-committed `.env` files and must never enter version control).
- [ ] Frontend: set `metadataBase`/site URL in `app/layout.tsx` to the production domain (`https://the-post-journal.vercel.app` is hard-coded today).
- [ ] Set the `PORT` for the API if not `8080`.

### Platform recommendation

- **Frontend** → **Vercel** (the project is already Vercel-ready: `.vercel` is gitignored, Next 16 output works out of the box). Configure the four frontend env vars in the Vercel dashboard.
- **API** → **Railway / Render / Fly.io** (Node 20+). Run `pnpm install --prod && pnpm build && node dist/main` (or the Dockerized equivalent). Managed PostgreSQL works here as well.
- **Database** → **Neon** (serverless Postgres, already reflected in the sample connection string) or any managed Postgres.
- Kept lightweight by design: no queue workers, no redis, no CDN beyond the image host + Supabase public URLs, so a two-service deploy above is sufficient.

## Key Design Decisions

1. **Turborepo + pnpm workspaces** — Two independently versioned apps share one lockfile and a single `turbo run` fan-out for `dev`/`build`/`lint`; there is no shared `packages/*` package today despite the workspace glob.
2. **Code-first GraphQL over REST for CRUD** — NestJS `@Resolver`/`@ObjectType`/`@InputType` decorators auto-generate `schema.gql` at runtime; the REST surface is reserved for OAuth callbacks and health/token checks. DTOs double as both `class-validator` and GraphQL input types.
3. **Prisma driver adapters (`PrismaPg`)** — The API uses the engine-optional `@prisma/adapter-pg`, passing `DATABASE_URL` to the pg adapter rather than a classic prism url in the schema datasource block (Prisma 7 style).
4. **Frontend-owned session wrapping API JWTs** — Rather than storing the bearer token in JS-accessible storage, the frontend signs its own `httpOnly` HS256 cookie that embeds both the user profile and the API access token. The JWT remains the only credential the API trusts.
5. **All writes go through Next.js server actions** — Forms never hit GraphQL directly from the browser; each mutation is validated with **zod**, does optional Supabase I/O, then calls the API with the session token. This concentrates validation, auth, and side effects in one layered server action per use case.
6. **Optimistic engagement UI** — Likes/comments are client islands using TanStack React Query with cancel-on-mutate, optimistic `onMutate` updates, rollback on error, and `invalidateQueries` on settle — giving an instant feel while staying eventually consistent with `postLikesCount`/`postCommentCount`.
7. **Security posture is put inline** — Argon2 hashing, GraphQL-aware JWT guards, ownership assertions per mutation, unique constraints for likes, plus server- and client-side sanitization (`DOMPurify`) of rendered post content.
8. **Seed is a miniature content engine** — Instead of static fixtures, `seed.ts` procedurally composes topical titles, conversational Markdown bodies, unique slugs, and comment threads from tag-keyed word pools, producing believable demo content deterministically per run.

## Seed Data & Default Credentials

Run `pnpm db:seed` inside `apps/api` to populate the database with:

| Entity | Quantity | Details |
|--------|----------|---------|
| Users | 10 | Faker names/bios/avatars, emails at `example{i}.test`, **all with password `123`** (Argon2-hashed) |
| Tags | 8 | `Technology`, `Design`, `Business`, `Lifestyle`, `Culture`, `Science`, `Productivity`, `Travel` |
| Posts | 40 | Topical titles w/ unique slugs, procedural Markdown content, Picsum thumbnails, `published` with ~85% probability, 1–3 tags each |
| Comments | 20 per post (~800) | Random real-feeling comment templates from 15 rotating authors |

**Default credentials:**

| Field | Value |
|-------|-------|
| Email | any seeded user, e.g. the first generated user at `example0.test` |
| Password | `123` |

> The exact seeded email addresses are random per run; check your database after seeding, or use a Google account via OAuth.

## Contributing

1. Install: `pnpm install`
2. Open both apps in development: `pnpm dev`
3. Keep things green before submitting:
   - Lint: `pnpm lint` (oxlint for the API, ESLint `next/core-web-vitals` for the frontend)
   - Type-check/build: `pnpm build`
   - Tests (API): `pnpm --filter api test` and `pnpm --filter api test:e2e`

Formatting is handled by Prettier (`pnpm --filter api format`); the API's tsconfig uses `module: nodenext`, so relative imports in `apps/api` are written with an explicit `.js` extension.

## License

This repository is licensed under the ISC license (root `package.json`). The `apps/api` package declares `"license": "UNLICENSED"` and is marked `private`; the `apps/front` package is `private` with no declared license.
