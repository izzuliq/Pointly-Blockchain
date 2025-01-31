# Pointly

**"Points Simplified"**

Pointly is a blockchain-based loyalty reward application designed to simplify the management of reward points across various vendors. Users can integrate, track, and redeem rewards effortlessly while vendors can manage their rewards, promotions, and business analytics entirely using smart contracts.

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

### Backend (Blockchain):
- Ethereum Smart Contracts (written in Solidity)
- Truffle for smart contract development and testing
- Web3.js for frontend-backend integration with the blockchain

### Tools:
- Ganache for local blockchain simulation
- Truffle for contract deployment and testing
- MetaMask for connecting to the Ethereum network

---

## Project Setup

### Prerequisites:
- Node.js and npm installed.
- Ganache or an Ethereum node running (for local or testnet development).
- MetaMask installed for managing Ethereum accounts and connecting to the app.
- Truffle Suite installed for contract development and management.

### Getting Started

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/azriy-nazariee/pointly.git
    cd Pointly-Blockchain
    ```

2. **Install Dependencies**:
    Navigate to both the frontend and backend folders and run:
    ```bash
    npm install
    ```

3. **Set Up the Blockchain**:
    - Use Ganache or a test network (e.g., Rinkeby) for local blockchain development.
    - In the `truffle-config.js` file, configure the network settings to point to your local or test network.
    - Deploy the smart contracts by running:
      ```bash
      truffle migrate --network <network-name>
      ```

4. **Run the Application**:

    **Frontend**:
    ```bash
    npm run dev
    ```

    **Backend (Blockchain)**:
    - The backend is built on Ethereum smart contracts; no traditional backend is required.
    - The contracts are already deployed during the migration process.
    - Access the app at [http://localhost:5000](http://localhost:5000).

---

## Folder Structure

### Frontend:
- `src/components/` - Contains reusable React components (e.g., Navbar, Footer).
- `src/pages/` - Contains main pages (e.g., Home, Dashboard, Profile).

### Blockchain:
- `contracts/` - Contains Solidity smart contracts for managing rewards, points, and vendor interactions.
- `migrations/` - Contains Truffle migration files for deploying the smart contracts to the Ethereum network.
- `truffle-config.js` - Truffle configuration file for managing the networks and contracts.

---

## Key Features Implementation

### Vendor Promotional Banners:
- Vendors can upload banners through the dashboard.
- Banners are displayed dynamically on user-facing pages.

### Order and Reward Management:
- Vendors track reward redemptions and orders through the blockchain.
- Users can view available rewards and redeem them seamlessly using smart contracts.

---

## Troubleshooting

### Common Issues:

#### Blockchain Network Issues:
- Ensure that Ganache or the connected Ethereum network is running.
- Check that your MetaMask is connected to the correct network (e.g., local, Rinkeby).

#### Frontend/Blockchain Not Communicating:
- Ensure Web3.js is properly configured in your frontend.
- Check that the smart contracts are deployed to the correct network and that MetaMask is connected.

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
