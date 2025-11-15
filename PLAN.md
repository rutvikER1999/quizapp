# Quiz Management Application - Project Overview

## 📌 Introduction

This project is a **Quiz Management Application** built using **React** for the frontend and **Node.js** for the backend. The system allows an **admin** to create quizzes and users to attempt them. The goal is to implement a fully functional prototype within a short time (around 2 hours), focusing on core features first and adding enhancements if time permits.

---

## 🎯 Features

### **1. Admin Features**

* Create quizzes
* Add different types of questions
* View all quizzes
* (Optional, later) Backend pagination

### **2. User Features**

* Attempt quiz questions one by one
* Select/enter answers based on question type
* View results/logged output on submission

---

## 🧩 Question Types

A quiz can contain **three question types**:

### **1. MCQ (Multiple Choice Questions)**

* **Options:** Array of strings
* **Answer:** One correct string

### **2. Boolean (True/False)**

* **Options:** `[true, false]`
* **Answer:** `true` or `false`

### **3. Text Input**

* **Options:** Not required
* **Answer:** String entered manually

Each question object will contain:

* `type` (mcq | boolean | text)
* `question` (string)
* `options` (array/string depending on type)
* `answer` (correct answer)

---

## 🏗️ Development Approach

### **Step 1: Create React Application**

* Set up React project
* Build an **Admin Panel** to create quizzes
* Add UI to support all three question types

### **Step 2: Build User Quiz Attempt Interface**

* Fetch one question at a time
* Render UI dynamically based on question type
* Store user-selected answers in React state
* On submit, log all selected answers (for now)

### **Step 3: Backend Setup (Node.js + Express)**

* Create a simple **authentication API**

  * Dummy email & password
  * Allows admin login
* Create an API to:

  * Save a quiz
  * Fetch all quizzes
* Initially, **pagination will be done on the frontend**

### **Step 4: Enhancements (If Time Allows)**

* Move pagination to backend
* Store quizzes in a real database
* Add quiz result evaluation
* Add edit/delete quiz features
* Add user authentication tokens

---

## ⏱️ Time Management Strategy

Since the project must be completed within **2 hours**, the focus is:

1. Core quiz creation form
2. User attempt flow
3. Basic backend APIs
4. Frontend pagination

Enhancements will be added only if time remains.

---

## 🚀 Conclusion

This Markdown file outlines the complete plan for the Quiz Management App, including question structure, admin features, user flow, backend plan, and priority-based development approach. This provides a solid foundation to implement the project quickly and efficiently.
