---
id: week-01-physical-ai-overview
title: Week 1: Physical AI Overview
---

# Hackathon I: Create a Textbook for Teaching Physical AI & Humanoid Robotics Course

The future of work will be a partnership between **people, intelligent agents (AI software), and robots**. This shift won't eliminate jobs but will change what humans do, leading to a massive demand for new skills.  

We have already written a book on AI agents. Therefore, this textbook will teach a course in **Physical AI & Humanoid Robotics**.

---

## Excel in the Hackathon and Launch Your Journey 🚀

We’ve recently launched **Panaversity** ([panaversity.org](https://panaversity.org)), an initiative focused on teaching cutting-edge AI courses.  

Our milestones:
- Build a portal for **AI-native textbooks**.
- Embed AI agents inside textbooks for interactive learning.
- Publish O/A Level, Science, Engineering, and Medical AI-native books.

Perform well in this hackathon and you could be invited to **join Panaversity’s core team** and even **become a startup founder**.

---

## Hackathon Requirements

### 1. AI/Spec-Driven Book Creation
- Write a textbook using **Docusaurus**.
- Deploy it to **GitHub Pages**.
- Use **Spec-Kit Plus** ([GitHub](https://github.com/panaversity/spec-kit-plus)) and **Claude Code** ([Claude Code](https://www.claude.com/product/claude-code)).

### 2. Integrated RAG Chatbot
- Embed a **Retrieval-Augmented Generation chatbot** in the book.
- Stack: OpenAI Agents/ChatKit SDKs, FastAPI, Neon Serverless Postgres, Qdrant Cloud Free Tier.
- Chatbot should answer questions about **selected text** in the book.

### 3. Scoring
- Base functionality: 100 points.
- Bonus points:
  - **50 points** for reusable intelligence via **Claude Code Subagents & Agent Skills**.
  - **50 points** for **Signup/Signin with Better Auth**.
  - **50 points** for **personalized content per user**.
  - **50 points** for **Urdu translation**.

---

## Course Details: Physical AI & Humanoid Robotics

**Theme:** AI Systems in the Physical World – **Embodied Intelligence**  
**Goal:** Bridge the gap between the digital brain and physical body.  

Students will learn to **design, simulate, and deploy humanoid robots** capable of natural human interactions using:
- ROS 2  
- Gazebo  
- NVIDIA Isaac  

---

### Module Overview

#### Module 1: The Robotic Nervous System (ROS 2)
- Middleware for robot control
- ROS 2 Nodes, Topics, Services
- Python Agents → ROS controllers using `rclpy`
- URDF for humanoids

#### Module 2: The Digital Twin (Gazebo & Unity)
- Physics simulation & environment building
- High-fidelity rendering in Unity
- Simulating sensors: LiDAR, Depth Cameras, IMUs

#### Module 3: The AI-Robot Brain (NVIDIA Isaac)
- Isaac Sim: Photorealistic simulation, synthetic data
- Isaac ROS: Hardware-accelerated VSLAM & navigation
- Nav2: Path planning for humanoids

#### Module 4: Vision-Language-Action (VLA)
- Voice-to-Action with OpenAI Whisper
- Cognitive planning with LLMs
- Capstone: Autonomous Humanoid completing multi-step tasks

---

### Learning Outcomes
By the end of the course, students will:
1. Understand **Physical AI principles & embodied intelligence**  
2. Master **ROS 2**  
3. Simulate robots in **Gazebo & Unity**  
4. Develop with **NVIDIA Isaac AI platform**  
5. Design humanoid robots for **natural interaction**  
6. Integrate **GPT models** for conversational robotics  

---

### Weekly Breakdown

**Weeks 1-2: Introduction**
- Foundations of Physical AI  
- From Digital AI → Physical AI  
- Humanoid robotics landscape  
- Sensor systems: LiDAR, cameras, IMUs, force/torque sensors  

**Weeks 3-5: ROS 2 Fundamentals**
- ROS 2 architecture, nodes, topics, services, actions  
- Building ROS 2 packages with Python  
- Launch files & parameter management  

**Weeks 6-7: Gazebo Simulation**
- Setup Gazebo  
- URDF & SDF robot description  
- Physics & sensor simulation  
- Unity visualization  

**Weeks 8-10: NVIDIA Isaac Platform**
- Isaac SDK & Isaac Sim  
- AI-powered perception & manipulation  
- Reinforcement learning  
- Sim-to-real transfer  

**Weeks 11-12: Humanoid Robot Development**
- Kinematics & dynamics  
- Bipedal locomotion & balance  
- Manipulation & grasping  
- Human-robot interaction  

**Week 13: Conversational Robotics**
- GPT integration  
- Speech recognition & NLU  
- Multi-modal interaction  

---

### Hardware Requirements

**Digital Twin Workstation (Required)**
| Component | Recommendation |
|-----------|----------------|
| GPU | NVIDIA RTX 4070 Ti (12GB VRAM) or higher |
| CPU | Intel Core i7 (13th Gen+) or AMD Ryzen 9 |
| RAM | 64 GB DDR5 |
| OS | Ubuntu 22.04 LTS |

**Physical AI Edge Kit**
| Component | Model | Notes |
|-----------|-------|------|
| Brain | NVIDIA Jetson Orin Nano / NX | Runs ROS 2 inference |
| Eyes | Intel RealSense D435i / D455 | RGB + Depth |
| Inner Ear | USB IMU (BNO055) | For balance & SLAM |
| Voice | USB Mic/Speaker (ReSpeaker) | Whisper integration |

**Robot Lab Options**
1. Proxy: Quadruped/robotic arm (Unitree Go2 Edu)  
2. Miniature Humanoid: Hiwonder TonyPi Pro / Robotis OP3  
3. Premium: Full humanoid (Unitree G1)

**Cloud Lab Option (Ether Lab)**
- AWS/Azure GPU instances for Isaac Sim  
- Local Jetson for physical deployment  

**Economy Jetson Student Kit (~$700)**  
- Jetson Orin Nano 8GB  
- Intel RealSense D435i  
- ReSpeaker USB Mic Array v2.0  
- SD Card + Jumper Wires  

---

### Notes
- Simulating in cloud is good for training, but **control a real robot from cloud = latency danger**.  
- Best practice: train in cloud → deploy model weights to **local Jetson kit**.  
