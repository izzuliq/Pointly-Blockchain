-- Insert dummy data for Users table
INSERT INTO Users (email, password, name, phone, address, dob, profile_image, role, tier, total_points, available_points)
VALUES
    ('user1@example.com', '$2y$10$wnMjQpwEVS4ABiPBdmIuk.EnpbYPrpgNjug.68BdMWpelhVlNGV1G', 'John Doe', '1234567890', '123 Main St, City', '1990-01-01', 'profile1.jpg', 'user', 'Quartz', 100, 50),
    ('user2@example.com', '$2y$10$eOGizmeRkTXoejJL59.lMeZ0ubgFOSy.JhKP6JTJTKEE6sqCtishW', 'Jane Smith', '1234567891', '456 Oak St, City', '1992-02-02', 'profile2.jpg', 'user', 'Gold', 200, 100),
    ('user3@example.com', '$2y$10$aDGQf56uUuIv/RTLIqievOnVpRD.r0CRn4b4G3xOWJG//PzHMIySq', 'Alice Johnson', '1234567892', '789 Pine St, City', '1993-03-03', 'profile3.jpg', 'user', 'Platinum', 300, 150),
    ('user4@example.com', '$2y$10$f6jjKRA2mLgUX8D23ZZ0f.KfNirkMWGll0Z53F0rNdp.lYQ5br.qG', 'Bob Brown', '1234567893', '101 Maple St, City', '1994-04-04', 'profile4.jpg', 'user', 'Silver', 50, 25),


-- Insert dummy data for Activities table
INSERT INTO Activities (user_id, description)
VALUES
    (1, 'Completed survey'),
    (2, 'Redeemed reward'),
    (3, 'Made a purchase'),
    (4, 'Joined promotion'),

-- Insert dummy data for Rewards table
INSERT INTO Rewards (name, description, points_required, img_src, expiration_date, terms, companies_id)
VALUES
    ('Gift Card', 'Redeemable gift card for online store', 100, 'gift_card.jpg', '2025-12-31', 'Valid for one-time use', 1),
    ('Coffee Mug', 'Custom branded coffee mug', 50, 'coffee_mug.jpg', '2025-06-30', 'Non-refundable', 2),
    ('Headphones', 'Noise-cancelling headphones', 200, 'headphones.jpg', '2025-11-30', 'No exchanges', 3),
    ('T-shirt', 'Custom branded T-shirt', 75, 'tshirt.jpg', '2025-09-30', 'Limited stock', 4),

-- Insert dummy data for Transactions table
INSERT INTO Transactions (user_id, points_change, transaction_type, description)
VALUES
    (1, 100, 'Earned', 'Completed survey'),
    (2, -50, 'Redeemed', 'Redeemed Coffee Mug'),
    (3, 200, 'Earned', 'Made a purchase'),
    (4, -75, 'Redeemed', 'Redeemed T-shirt'),

-- Insert dummy data for Reward_Redemptions table
INSERT INTO Reward_Redemptions (user_id, reward_id)
VALUES
    (1, 1),
    (2, 2),
    (3, 3),
    (4, 4),

-- Insert dummy data for Companies table
INSERT INTO Companies (name, address, industry, logo)
VALUES
    ('TechCorp', '123 Tech St, City', 'Technology', 'techcorp_logo.png'),
    ('HealthPlus', '456 Health Ave, City', 'Healthcare', 'healthplus_logo.png'),
    ('EduWorld', '789 Education Rd, City', 'Education', 'eduworld_logo.png'),
    ('GreenFoods', '101 Green Blvd, City', 'Food & Beverage', 'greenfoods_logo.png'),

-- Insert dummy data for Admins table
INSERT INTO Admins (email, password, name, phone, profile_image, role, company_id)
VALUES
    ('admin1@techcorp.com', '$2y$10$O9Xqk4KHQNXCQXWuswX0I.heTRsdKmgei/3CTxFq2Ol0dDhzCJyA6', 'Alice Adams', '1234567890', 'admin1.jpg', 'admin', 1),
    ('admin2@healthplus.com', '$2y$10$O9Xqk4KHQNXCQXWuswX0I.heTRsdKmgei/3CTxFq2Ol0dDhzCJyA6', 'Bob Brown', '1234567891', 'admin2.jpg', 'admin', 2),
    ('admin3@eduworld.com', '$2y$10$6v7IjnmjrZFSFoUVsQzI1OaRdFhLoaImXU5bUb4ClTCRCIz.G2BeC', 'Charlie Clark', '1234567892', 'admin3.jpg', 'admin', 3),
    ('admin4@greenfoods.com', '$2y$10$MzMSzcZnohCBmcJ2cF8hBODoR8kMvQrdUVIL1GIsDVnBMHOTQrDiC', 'David Davis', '1234567893', 'admin4.jpg', 'admin', 4),

-- Insert dummy data for AdminCompanyRelationship table
INSERT INTO AdminCompanyRelationship (admin_id, company_id)
VALUES
    (1, 1),
    (2, 2),
    (3, 3),
    (4, 4),
