# 🚀 Pushlab – AI-Powered GitHub Developer Tool

A full-stack AI-powered GitHub developer assistant built with **Next.js 15**, **Google Gemini AI**, **Shadcn UI**, and **Stripe**.  
This tool helps developers interact with repositories intelligently, manage projects, and integrate payments — all in one platform.

**🔗 Live Demo:** [View Here](https://push-lab.vercel.app)  


---

## ✨ Features

- **⚡ Next.js 15 App Router** – Leveraging the latest Next.js features.
- **🤖 Google Gemini AI API** – AI-powered language model for repo interaction.
- **💳 Stripe Payments** – Seamless credit purchase and usage tracking.
- **🎨 Shadcn UI + Tailwind CSS** – Beautiful, responsive UI components.
- **🗄️ NeonDB & Prisma ORM** – Efficient, scalable database handling.
- **📂 GitHub RAG Pipeline** – Intelligent retrieval-augmented generation for repo queries.
- **🎤 AssemblyAI Integration** – Audio transcription & processing.
- **🔐 Clerk Auth** – Secure authentication and user management.
- **☁️ Vercel Deployment** – Fast, production-grade hosting.

---

## 🛠️ Tech Stack

| Frontend        | Backend        | Database   | AI/ML       | Payments | Auth     | Hosting |
|----------------|---------------|-----------|------------|----------|----------|---------|
| Next.js 15     | Node.js       | NeonDB    | Google Gemini AI | Stripe   | Clerk    | Vercel |
| Shadcn UI      | Prisma ORM    | PostgreSQL| AssemblyAI |          |          |         |
| Tailwind CSS   | tRPC API      |           |            |          |          |         |

---

## 📦 Installation

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/dionysus.git
cd pushlab
npm install
# or
yarn install
```
.env
```
DATABASE_URL=""
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/sync-user
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/sync-user
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
GITHUB_TOKEN=
GEMINI_API_KEY=
GOOGLE_API_KEY=
UPLOADTHING_TOKEN=
UPLOADTHING_SECRETKEY=
ASSEMBLYAI_API_KEY=
STRIPE_API_KEY=
STRIPE_SECRETE_KEY=
STRIpe_WEBHOOK_SCECRET=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
```
npm run dev
```
🙌 Acknowledgements
This project is inspired by the full-stack AI GitHub developer tool tutorial by Elliott Chong.
Special thanks to the open-source community.


