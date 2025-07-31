
# 📝 MiniBlog - Microblogging App on AWS (Microservices + Secure Auth)

**MiniBlog** is a cloud-native microblogging platform deployed entirely on AWS using microservices architecture, Docker containers, and secure authentication. It is fully compatible with the **AWS Free Tier**.

Users can create, view, edit, and delete posts. User registration and login are managed by separate microservices, with encrypted communication.

---

## 🎯 Features

- 🧑‍💻 Secure user registration & login (separate auth microservice)
- 🔐 Passwords transmitted **encrypted in transit** (SHA-256)
- 🗂️ Auth & Blog services as independent Docker containers
- 📝 CRUD for microblog posts (title, body, timestamps)
- 📦 Deployed on ECS + Fargate
- 🗄️ Aurora Serverless v2 as backend database
- 🖼️ Frontend hosted on S3 (React or HTML)
- ⚙️ Infrastructure as Code via CloudFormation (YAML)
