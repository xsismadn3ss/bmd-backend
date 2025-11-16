# bmd-backend

Backend built with NestJS to manage bitcoin meetups in El Salvador, including user registration, interactive map visualization, comments, and POAP minting.

## 🚀 Main Features

### 🔑 Login & Registration
- Create an account with name, email, and password.
- Log in using email and password.

### 🗺️ Meetup Map
- View the country map with upcoming or ongoing meetups.
- Click on a meetup to see details:
  - Organizer’s nameType of meeting
  - Short description
  - Date range and duration
  - Optional contact information
- Search meetups by:
  - Type
  - Date range
  - Municipality
- Map updates dynamically based on search results.
- Users can comment on meetups.

### 📅 Meetup Registration
Any user can register a meetup by filling out a form with:

- Type of meeting
- Short description
- Date and duration
- Contact information
- Users can edit or cancel their meetups.

### 🪙 POAP Minting
Users can mint a POAP to add to their profile and show they attended an event.

## ⚙️ Installation & Setup

**Clone the repository**: git clone https://github.com/xsismadn3ss/bmd-backend.git

**Enter the project directory**: cd bmd-backend

**Install dependencies**: npm install

**Development**: npm run start:dev

**Production**: npm run start:prod

**Testing**:
- npm run test
- npm run test:e2e

## 📂 Tech Stack

- **NestJS** – Progressive Node.js framework
- **TypeScript** – Static typing
- **Prisma**  Database ORM
- **POAP** – Proof of Attendance Protocol

## 📌 Roadmap<br>
- [x] User registration & login
- [ ] Meetup registration & editing
- [ ] Meetup map visualization
- [ ] Meetup comments
- [ ] POAP minting

## 🤝 Contributing
Contributions are welcome! Please open an issue or pull request for suggestions and improvements.

## 📜 License
This project is licensed under the MIT License.
