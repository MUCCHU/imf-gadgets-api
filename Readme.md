 # 🎩 IMF GADGET API: MISSION SUCCESSFUL
 
 
 > 🚨 **WARNING:** Unauthorized personnel attempting to access this repository will trigger an automatic self-destruct sequence.
 
 ## 🎯 **Mission Objectives**
 tHE assignment is to create an API using **Node.js, Express, and PostgreSQL**, with JWT-based authentication.
 
 - 🔹 **Manage classified gadgets**
 - 🔹 **Secure endpoint access**
 - 🔹 **Self-destruct gadgets if compromised**
 - 🔹 **Deploy API for global operations**
 
 ## 📡 **Tech Stack & Arsenal**
 - 🟢 **Node.js** (Express.js for API operations)
 - 🗄️ **PostgreSQL** (Secured database for gadget storage)
 - 🔐 **JWT Authentication** (To ensure only authorized agents access data)
 - 🚀 **Sequelize ORM** (For efficient database management)
 - 🔥 **Swagger UI** (For API documentation)
 
 ## 🌍 **Mission Deployment**
 The **IMF Gadget API** is successfully deployed on **Render** and is accessible at:
 
 🔗 [IMF Gadget API](https://imf-gadgets-api.onrender.com/)
 
 All database operations are securely handled in the **Render-hosted PostgreSQL database**.
 
 ## 🕶️ **Mission Control: API Endpoints**
 
 ### 🛠️ **Authentication (Classified Access)**
 - ` POST /auth/register` → Register a new agent.
 - ` POST /auth/login` → Authenticate and receive a mission token (JWT).
 
 ### 🕵️ **Gadget Operations**
 - ` GET /gadgets` → Retrieve all gadgets (+random mission success probability).
 - ` POST /gadgets` → Deploy a new classified gadget.
 - ` PATCH /gadgets/{id}` → Modify gadget details (unless decommissioned).
 - ` DELETE /gadgets/{id}` → **Mark** gadget as "Decommissioned".
 - ` POST /gadgets/{id}/self-destruct` → **Trigger self-destruction** (irreversible).
 
 ## 📜 **Swagger Documentation**
 - View all endpoints at: [`https://imf-gadgets-api.onrender.com/api-docs`](https://imf-gadgets-api.onrender.com/api-docs)
 - Includes **JWT authorization** for secured operations.
 
 ## 🎖️ **Mission Security & Authentication**
 - **Every agent must authenticate** using JWT before accessing classified endpoints.
 - Use the `"Authorize"` button in Swagger UI to enter your **JWT token**.
 - Tokens expire after **X hours** (configurable in JWT settings).
 
 ## 🛡️ **Self-Destruct Protocols**
 - **Decommissioned gadgets cannot be modified.**
 - **Destroyed gadgets are permanently disabled.**
 - **Unauthorized attempts are logged & reported.**
 
 ## 🛠️ **Setting Up on a Local Device**
 
 > **Phase 1: Local Setup**
 
 1️⃣ **Clone this repository**:
 ```sh
 git clone https://github.com/your-repo/imf-gadget-api.git
 cd imf-gadget-api
 ```
 
 2️⃣ **Install dependencies**:
 ```sh
 npm install
 ```
 
 3️⃣ **Create a `.env` file** with secret credentials:
 ```plaintext
 PORT=5000
 DATABASE_URL=your_postgres_database_url
 JWT_SECRET=your_super_secret_key
 ```
 
 4️⃣ **Run database migrations**:
 ```sh
 npx sequelize-cli db:migrate
 ```
 
 5️⃣ **Start the server**:
 ```sh
 npm run dev
 ```
 
 Your **local API** is now operational at `http://localhost:5000` 🔥
 
 ## 🏆 **Mission Success Criteria**
 ✅ API **fully operational**.
 ✅ **Secure deployment** with JWT authentication.
 ✅ **All Swagger documentation completed**.
 ✅ **Database migrations automated**.
 ✅ **Live API available on Render**.
 
 ---

