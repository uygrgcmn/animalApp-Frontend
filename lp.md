🐾 I built a full-stack pet care marketplace from scratch.

AnimalApp connects pet owners with caregivers and pet shops — think Rover + Airbnb for pets, with real-time messaging and a multi-role marketplace.

Here's what it's built with 👇

━━━━━━━━━━━━━━━━━━━━━━━
📱 FRONTEND — React Native (Expo) + TypeScript
━━━━━━━━━━━━━━━━━━━━━━━
→ Expo Router (file-based navigation)
→ React Query + Zustand (server + client state)
→ React Hook Form + Zod (type-safe validation)
→ Runs on iOS, Android & Web from a single codebase

━━━━━━━━━━━━━━━━━━━━━━━
⚙️ BACKEND — NestJS + TypeScript
━━━━━━━━━━━━━━━━━━━━━━━
→ PostgreSQL 16 + PostGIS (geospatial queries)
→ Prisma ORM
→ Socket.io + Redis adapter (real-time, horizontally scalable)
→ BullMQ for async notification queuing
→ Presigned S3 uploads (media bypasses the API server entirely)
→ Docker Compose for full local infrastructure

━━━━━━━━━━━━━━━━━━━━━━━
🔒 AUTH & SECURITY
━━━━━━━━━━━━━━━━━━━━━━━
→ JWT access/refresh token rotation (15min / 30day)
→ Permission-based RBAC across 3 user roles
→ Global Redis rate limiting guard

━━━━━━━━━━━━━━━━━━━━━━━

3 architectural decisions I'm proud of:

1. WebSockets backed by Redis adapter — messaging scales horizontally with no session affinity issues

2. Presigned S3 uploads — files go directly from device to storage, zero load on the API server

3. Feature-based module structure on both ends — every feature (auth, listings, caregiver, petshop) is fully isolated

This is my 3rd personal project and the most production-oriented one I've built. Every decision was made with real-world scale in mind.

Special thanks to my teammate Recep Yüksel for his collaboration throughout this project. 🤝

Currently open to React Native, Full-Stack, or Backend roles.
Feel free to reach out or connect!

#ReactNative #NestJS #TypeScript #Expo #MobileAppDevelopment #FullStackDeveloper #OpenToWork #SoftwareDeveloper

---
💬 İLK YORUM (GitHub linkleri buraya):
GitHub — Frontend: https://github.com/uygrgcmn/animalApp-Frontend
GitHub — Backend: [backend repo linki]
