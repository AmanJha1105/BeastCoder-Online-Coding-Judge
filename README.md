# BeastCoder-Online-Coding-Judge

An Online Judge system that facilitates code submissions and feedback. The platform supports multiple programming languages, user profiles, and features like a leaderboard, admin pages, and discussion forums. Developed with React JS, Tailwind CSS, Node.js, Express.js, and MongoDB, it uses Docker for secure, isolated code compilation and is deployed on Vercel, Render, and AWS.Users can view their submission to a problem, view solutions and discussions for that problem.

## Table of Contents

1. [Key Features](#key-features)
    - [User Management](#user-management)
    - [Problem Management](#problem-management)
    - [Code Submission](#code-submission)
    - [Problem Discussions](#problem-discussion)
        - [Solutions](#solutions)
        - [Discuss](#discuss)
    - [Profile Management](#profile-management)
    - [Search Question by Name or Topics](#search-problem-by-name-or-topics)
    - [Leaderboard](#leaderboard)
    - [All Submissions](#allSubmissions)
2. [Technologies Used](#technologies-used)
    - [Frontend](#frontend)
    - [Backend](#backend)
    - [Containerization](#containerization)
    - [Security](#security)
    - [Deployment](#deployment)
3. [Acknowledgements](#acknowledgements)
4. [Screenshots](#screenshots)

## Key Features

### User Management
- **User Registration and Authentication**: Secure user registration and authentication using JWT tokens.
- **User Roles**: Two distinct roles - User and Admin, each with specific privileges.

### Problem Management
- **Curated Problem List**: A curated list of coding problems covering various difficulty levels and topics.
- **Detailed Problem Descriptions**: Detailed problem statements, input/output specifications,example test cases and constraints.
- **Like or Dislike Problem**: Users can vote for a particular question to like or dislike it.
 
### Code Submission
- **Code Execution Environment**: Dockerized compiler for secure and isolated code execution.
- **Languages**: Code can be written in C++, C, Java and Python .
- **Run or Submit**: Code can be run on input testcase or custom testcases and code can also be submitted for evaluation.
- **Submission Evaluation**: Automatic evaluation of submitted code with verdicts provided based on correctness, time limits, and compilation errors.
- **Verdicts**:
  - **Accepted**: Code produces the expected output for all test cases.
  - **Wrong Answer**: Code produces incorrect output for one or more test cases.
  - **Time Limit Exceeded (TLE)**: Code exceeds the time constraints set for execution.
  - **Runtime Error**: Error occurs during code compilation.
- **Publish Solution**: Submissions with Accepted Verdict can be published for other users to see.
- **Submissions**: Users can see all of their submission for a given problem with verdicts.

### Problem Discussions

#### Solutions
- **All Solutions Posted For a Question**: Users can view all the solutions posted for that problem by various users. Get detailed info about a specific solution as well.
- **Reply and Like**: Users can reply and ask questions for a solution and like them.

#### Discuss
- **All Discussions for a Problem**: Users can view all the discussions for that problem by various users and share their views on that problem.
- **Reply and Like**: Users can reply and like a discussion. Users can reply to a reply and also like them.

### Profile Management
- **Personalized User Profiles**: Personal profiles for users to track solved problems, submission history, and overall performance. Users can see their all time submissions and monthly track daily submissions using Heat Map. they can view their recent accepted submissions and recent published solutions, can edit their profiles, add their info along with their profile picture. Users can also view profile of other users and track their progress but cannot edit them.
- **Browse Other User Profiles**: Users can also view profile of other users and track their progress but cannot edit them. They can view their submissions heat map, problems solved, their recent accepted submissions and published solutions.

### Search Question by Name or Topics
- **Search Question by Name**:   Questions can be searched by their name.
- **Search Question by Topics**: You can choose the topics on which you would like to solve questions.

### Leaderboard
- **Performance Tracking**: Leaderboard displaying top problem solvers based on their performance.

### All Submissions
- **View all Submissions**: All of users submissions are displayed with vercit, runtime, submission time, problem name. Users can also view specific submissions by clicking on them.
  
## Technologies Used

### Frontend
- **React**: JavaScript library for building responsive user interfaces.
- **Tailwind CSS**: Utility-first CSS framework for designing clean and customizable UI components.

### Backend
- **Node.js**: JavaScript runtime for building scalable server-side applications.
- **Express.js**: Web application framework for Node.js.
- **MongoDB**: NoSQL database for storing user data, problem information, and submissions.
- **Cloudinary||Multer**: Cloudinary and Multer used for storing user profile images over the cloud.

### Containerization
- **Docker**: Platform for containerizing code compilers to ensure security and scalability.

### Security
- **JWT Authentication**: Secure authentication mechanism to protect user data and ensure privacy.
- **Docker Isolation**: Utilize Docker's isolation features to prevent malicious code from affecting the host system.

### Deployment
- **AWS EC2**: Deploy compiler services on Amazon EC2 instances for reliable performance.
- **AWS ECR**: Container registry service for securely storing Docker images.
- **Vercel**: Deploy frontend applications with ease using Vercel's platform.
- **Render**: Deploy backend applications with ease using Render's platform.

## Acknowledgements

This platform provides a comprehensive environment for users to practice coding, participate in competitions, and track their progress effectively and communicate with other coders.

## ScreenShots

- **Home Page**

![Home Page](https://github.com/AmanJha1105/BeastCoder-Online-Coding-Judge/assets/125438101/a91fb22f-5a77-4c0a-ade6-0293faae1a77)

- **Problem Description**
![Problem Description](https://github.com/AmanJha1105/BeastCoder-Online-Coding-Judge/assets/125438101/810b5221-9751-4968-ba53-e64a2cf650ee)

- **Submissions**
![Submissions](https://github.com/AmanJha1105/BeastCoder-Online-Coding-Judge/assets/125438101/a49d26f3-e482-4513-a083-1f5cbeb9f111)

- **Solutions**
![Solutions](https://github.com/AmanJha1105/BeastCoder-Online-Coding-Judge/assets/125438101/fff30b36-c327-44a6-bb78-e40292beaf5a)

- **Specific Solution**

![Screenshot 2024-06-17 132613](https://github.com/AmanJha1105/BeastCoder-Online-Coding-Judge/assets/125438101/2ddc55a0-6cfd-41ee-9d8e-4904c880ffdf)


- **Discuss**

![Discussions](https://github.com/AmanJha1105/BeastCoder-Online-Coding-Judge/assets/125438101/cbf2811c-4ace-4ff0-8b95-bbfa611de673)

- **LeaderBoard**

![LeaderBoard](https://github.com/AmanJha1105/BeastCoder-Online-Coding-Judge/assets/125438101/1caf55cb-5b16-47d5-9fa0-9da20080b9a6)

- **All Submissions**
![Screenshot 2024-06-17 131818](https://github.com/AmanJha1105/BeastCoder-Online-Coding-Judge/assets/125438101/3a8129fb-5baa-4e85-b865-1f5e08905683)

- **User Profile**
![Screenshot 2024-06-17 132053](https://github.com/AmanJha1105/BeastCoder-Online-Coding-Judge/assets/125438101/b0831210-c759-4327-85e4-f85e141510df)
![Screenshot 2024-06-17 132139](https://github.com/AmanJha1105/BeastCoder-Online-Coding-Judge/assets/125438101/198e09e0-97d0-4a9f-95bb-ef2f541e2e8f)

- **Publish Solution**

![Screenshot 2024-06-17 132329](https://github.com/AmanJha1105/BeastCoder-Online-Coding-Judge/assets/125438101/5c15ccd9-de1e-4b63-9765-c4b59289062c)

- **Update Profile**
![Screenshot 2024-06-17 132442](https://github.com/AmanJha1105/BeastCoder-Online-Coding-Judge/assets/125438101/8eb267bd-3622-41cd-bd5c-968f0907fb21)


