
# JSON Schema Builder

A dynamic JSON Schema Builder built using **React**, **React Hook Form**, and **Ant Design**, developed by **Aryan0393** as part of the **HROne Frontend Intern Hiring Task**.

This application allows users to create a nested JSON schema visually by adding, editing, and removing fields with live JSON preview functionality.

---

## 🔧 Features

- Add new fields dynamically
- Edit field names and types (String, Number, Nested)
- Delete individual fields
- Support for **nested fields** recursively under the "Nested" type
- Real-time **JSON preview** tab to reflect the schema structure
- Clean UI using **Ant Design**

---

## 🛠️ Tech Stack

- **React** (Vite + TypeScript)
- **React Hook Form** – for form state and validation
- **Ant Design (AntD)** – for UI components
- **CSS Modules** – for scoped styling (optional if used)
- **Vercel** – for deployment

---

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Aryan0393/JSON-Schema-Builder.git
   cd JSON-Schema-Builder
Install dependencies

bash
Copy
Edit
npm install
Start development server

bash
Copy
Edit
npm run dev
Open in browser
Visit http://localhost:5173 to use the app.

🚀 Deployment
This project is deployed using Vercel.
🔗 Live Demo: https://json-schema-builder-beta.vercel.app/

🧠 How It Works
Users can create fields with types: String, Number, or Nested.

When the type is Nested, a sub-form appears allowing recursive schema creation.

All changes are synced to a central state and reflected in the live JSON viewer panel.

Default values:

String → "example"

Number → 0

Nested → { ... }

📌 Author
Aryan Sikchi

📃 License
This project is for assessment purposes only and not licensed for commercial use.
