# Pointly

**"Points Simplified"**

Pointly is a loyalty reward application designed to simplify the management of reward points across various vendors. Users can integrate, track, and redeem rewards effortlessly while vendors can manage their rewards, promotions, and business analytics.

---

## Features

### User Side:
- **Centralized Rewards**: Manage all loyalty points from different vendors in one place.
- **Easy Redemption**: Redeem points for exclusive rewards and discounts.
- **Progress Tracking**: Monitor your accumulated points and reward milestones.
- **User-Friendly Dashboard**: View your rewards, transaction history, and profile.

### Vendor Side:
- **Manage Rewards**: Create and update rewards for users.
- **Promotional Banners**: Display and manage promotional banners for users.
- **Business Analytics**: View insights into transactions and reward usage.
- **Order Management**: Track and manage orders or redemptions made by users.

---

## Tech Stack

### Frontend:
- React (with Vite for bundling)
- Tailwind CSS for styling
- React Router for navigation

### Backend:
- Node.js (Express.js framework)
- Axios for handling API requests

### Database:
- Microsoft SQL Server

### Tools:
- DBeaver for database management
- Virtual Machine (VM) for hosting SQL Server

---

## Project Setup

### Prerequisites:
- Node.js and npm installed.
- DBeaver for database management.
- Virtualization software (e.g., VirtualBox or VMware) with a properly configured VM hosting SQL Server.
- SQL Server Management Studio (optional).

### Getting Started

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/azriy-nazariee/pointly.git
    cd pointly
    ```

2. **Install Dependencies**:
    Navigate to both the frontend and backend folders and run:
    ```bash
    npm install
    ```

3. **Configure the Database**:
    - Ensure your SQL Server is running on the VM.
    - Open port 1433 and enable TCP/IP connections on the SQL Server.
    - Update the `server.js` configuration in the backend:
      ```javascript
      const dbConfig = {
          host: '10.0.2.15', // Replace with your VM's IP address
          port: 1433,
          user: '<your-database-username>',
          password: '<your-database-password>',
          database: '<your-database-name>'
      };
      ```
    - Test the database connection using DBeaver or a similar tool.

4. **Run the Application**:

    **Backend**:
    ```bash
    cd backend
    npx nodemon server.js
    ```

    **Frontend**:
    ```bash
    cd frontend
    npm run dev
    ```

    Access the app at [http://localhost:5000](http://localhost:5000).

---

## Folder Structure

### Frontend:
- `src/components/` - Contains reusable React components (e.g., Navbar, Footer).
- `src/pages/` - Contains main pages (e.g., Home, Dashboard, Profile).

### Backend:
- `server.js` - Main server file for handling API requests.
- `routes/` - Contains API route definitions.
- `models/` - Defines database models and interactions.

---

## Key Features Implementation

### Vendor Promotional Banners:
- Vendors can upload banners through the dashboard.
- Banners are displayed dynamically on user-facing pages.

### Order and Reward Management:
- Vendors track reward redemptions and orders through a dashboard.
- Users can view available rewards and redeem them seamlessly.

---

## Troubleshooting

### Common Issues:

#### Database Connection Timeout:
- Ensure the VM and local machine are on the same network.
- Check firewall settings to allow connections to port 1433.

#### Frontend/Backend Not Communicating:
- Verify API endpoints in the frontend.
- Ensure the backend is running on the correct port.

#### Promiscuous Mode Settings on VM:
- Enable Bridged Adapter with Promiscuous Mode set to "Allow All."

---

## Contributing

1. Fork the repository.
2. Create a new branch:
    ```bash
    git checkout -b feature/your-feature-name
    ```
3. Commit your changes:
    ```bash
    git commit -m "Add your message here"
    ```
4. Push the branch:
    ```bash
    git push origin feature/your-feature-name
    ```
5. Open a pull request.

---
