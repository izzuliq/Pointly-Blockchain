USE Pointly;

-- Users Table (Authentication & Profile Information)
CREATE TABLE Users (
    id INT IDENTITY(1,1) PRIMARY KEY,  -- Changed AUTO_INCREMENT to IDENTITY
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    address TEXT,
    dob DATE,
    profile_image VARCHAR(255),
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    tier VARCHAR(50) DEFAULT 'Quartz',
    total_points INT DEFAULT 0,        -- Points associated directly with the user
    available_points INT DEFAULT 0      -- Available points for redemption
);

-- Activities Table (User Activity Tracking)
CREATE TABLE Activities (
    id INT IDENTITY(1,1) PRIMARY KEY,  -- Changed AUTO_INCREMENT to IDENTITY
    user_id INT NOT NULL,
    description VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- Changed TIMESTAMP to DATETIME
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- Rewards Table (Available Rewards for Redemption)
CREATE TABLE Rewards (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    points_required INT NOT NULL,
    img_src VARCHAR(255),
    expiration_date DATE NOT NULL,
    terms TEXT,
    companies_id INT NOT NULL,  -- New column for vendor association
    FOREIGN KEY (companies_id) REFERENCES Companies(id)  -- Foreign key reference to Companies
);


-- Transactions Table (Tracking Points Earned and Redeemed)
CREATE TABLE Transactions (
    id INT IDENTITY(1,1) PRIMARY KEY,  -- Changed AUTO_INCREMENT to IDENTITY
    user_id INT NOT NULL,
    points_change INT NOT NULL,
    transaction_type VARCHAR(50) CHECK (transaction_type IN ('Earned', 'Redeemed')) NOT NULL,
    description VARCHAR(255),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, -- Changed TIMESTAMP to DATETIME
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- Reward Redemptions Table (Tracking User Reward Redemptions)
CREATE TABLE Reward_Redemptions (
    id INT IDENTITY(1,1) PRIMARY KEY,  -- Changed AUTO_INCREMENT to IDENTITY
    user_id INT NOT NULL,
    reward_id INT NOT NULL,
    redemption_date DATETIME DEFAULT CURRENT_TIMESTAMP, -- Changed TIMESTAMP to DATETIME
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (reward_id) REFERENCES Rewards(id)
);

-- Companies Table (Company Information)
CREATE TABLE Companies (
    id INT IDENTITY(1,1) PRIMARY KEY,  -- Changed AUTO_INCREMENT to IDENTITY
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    industry VARCHAR(255),
    logo VARCHAR(255)
);

-- Admins Table (Similar to Users but with Vendor-Side Privileges)
CREATE TABLE Admins (
    id INT IDENTITY(1,1) PRIMARY KEY,  -- Auto-incremented ID for the admin
    email VARCHAR(255) NOT NULL UNIQUE, -- Unique email for the admin
    password VARCHAR(255) NOT NULL,     -- Password field (hashed for security)
    name VARCHAR(255) NOT NULL,         -- Admin's full name
    phone VARCHAR(20),                  -- Optional phone number field
    profile_image VARCHAR(255),         -- Path or URL for the profile image
    role VARCHAR(50) NOT NULL DEFAULT 'admin',  -- Role indicating admin access
    company_id INT,                     -- Foreign key for associated company
    FOREIGN KEY (company_id) REFERENCES Companies(id)  -- Reference to the Companies table
);

-- Admin-Company Relationship Table (to associate admins with companies)
CREATE TABLE AdminCompanyRelationship (
    id INT IDENTITY(1,1) PRIMARY KEY,  -- Changed AUTO_INCREMENT to IDENTITY
    admin_id INT NOT NULL,
    company_id INT NOT NULL,
    FOREIGN KEY (admin_id) REFERENCES Admins(id),  -- Reference to the Admins table
    FOREIGN KEY (company_id) REFERENCES Companies(id)
);
