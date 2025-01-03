-- Insert dummy data for Users table
INSERT INTO Users (email, password, name, phone, address, dob, profile_image, role, tier, total_points, available_points)
VALUES
    ('user1@example.com', 'password1', 'John Doe', '1234567890', '123 Main St, City', '1990-01-01', 'profile1.jpg', 'user', 'Quartz', 100, 50),
    ('user2@example.com', 'password2', 'Jane Smith', '1234567891', '456 Oak St, City', '1992-02-02', 'profile2.jpg', 'user', 'Gold', 200, 100),
    ('user3@example.com', 'password3', 'Alice Johnson', '1234567892', '789 Pine St, City', '1993-03-03', 'profile3.jpg', 'user', 'Platinum', 300, 150),
    ('user4@example.com', 'password4', 'Bob Brown', '1234567893', '101 Maple St, City', '1994-04-04', 'profile4.jpg', 'user', 'Silver', 50, 25),
    ('user5@example.com', 'password5', 'Charlie Davis', '1234567894', '202 Birch St, City', '1995-05-05', 'profile5.jpg', 'user', 'Quartz', 150, 75),
    ('user6@example.com', 'password6', 'Daniel Lee', '1234567895', '303 Cedar St, City', '1996-06-06', 'profile6.jpg', 'user', 'Gold', 250, 125),
    ('user7@example.com', 'password7', 'Eva Martinez', '1234567896', '404 Elm St, City', '1997-07-07', 'profile7.jpg', 'user', 'Platinum', 350, 175),
    ('user8@example.com', 'password8', 'Frank Wilson', '1234567897', '505 Pine St, City', '1998-08-08', 'profile8.jpg', 'user', 'Silver', 75, 40),
    ('user9@example.com', 'password9', 'Grace Taylor', '1234567898', '606 Oak St, City', '1999-09-09', 'profile9.jpg', 'user', 'Quartz', 120, 60),
    ('user10@example.com', 'password10', 'Henry Anderson', '1234567899', '707 Maple St, City', '2000-10-10', 'profile10.jpg', 'user', 'Gold', 220, 110),
    ('user11@example.com', 'password11', 'Irene Moore', '1234567900', '808 Birch St, City', '2001-11-11', 'profile11.jpg', 'user', 'Platinum', 320, 160),
    ('user12@example.com', 'password12', 'Jack Taylor', '1234567901', '909 Cedar St, City', '2002-12-12', 'profile12.jpg', 'user', 'Silver', 80, 45),
    ('user13@example.com', 'password13', 'Katherine Harris', '1234567902', '1010 Pine St, City', '2003-01-13', 'profile13.jpg', 'user', 'Quartz', 130, 65),
    ('user14@example.com', 'password14', 'Liam Clark', '1234567903', '2020 Oak St, City', '2004-02-14', 'profile14.jpg', 'user', 'Gold', 230, 115),
    ('user15@example.com', 'password15', 'Mia Walker', '1234567904', '3030 Elm St, City', '2005-03-15', 'profile15.jpg', 'user', 'Platinum', 330, 165),
    ('user16@example.com', 'password16', 'Noah Lewis', '1234567905', '4040 Maple St, City', '2006-04-16', 'profile16.jpg', 'user', 'Silver', 90, 50),
    ('user17@example.com', 'password17', 'Olivia Young', '1234567906', '5050 Birch St, City', '2007-05-17', 'profile17.jpg', 'user', 'Quartz', 140, 70),
    ('user18@example.com', 'password18', 'Paul Scott', '1234567907', '6060 Cedar St, City', '2008-06-18', 'profile18.jpg', 'user', 'Gold', 240, 120),
    ('user19@example.com', 'password19', 'Quinn Adams', '1234567908', '7070 Pine St, City', '2009-07-19', 'profile19.jpg', 'user', 'Platinum', 340, 170),
    ('user20@example.com', 'password20', 'Riley Nelson', '1234567909', '8080 Oak St, City', '2010-08-20', 'profile20.jpg', 'user', 'Silver', 100, 55);

-- Insert dummy data for Activities table
INSERT INTO Activities (user_id, description)
VALUES
    (1, 'Completed survey'),
    (2, 'Redeemed reward'),
    (3, 'Made a purchase'),
    (4, 'Joined promotion'),
    (5, 'Completed quiz'),
    (6, 'Participated in event'),
    (7, 'Watched a video'),
    (8, 'Reviewed product'),
    (9, 'Earned points'),
    (10, 'Shared referral'),
    (11, 'Logged in'),
    (12, 'Purchased reward'),
    (13, 'Completed survey'),
    (14, 'Redeemed points'),
    (15, 'Earned reward'),
    (16, 'Completed challenge'),
    (17, 'Visited site'),
    (18, 'Signed up'),
    (19, 'Referred a friend'),
    (20, 'Updated profile');

-- Insert dummy data for Rewards table
INSERT INTO Rewards (name, description, points_required, img_src, expiration_date, terms)
VALUES
    ('Gift Card', 'Redeemable gift card for online store', 100, 'gift_card.jpg', '2025-12-31', 'Valid for one-time use'),
    ('Coffee Mug', 'Custom branded coffee mug', 50, 'coffee_mug.jpg', '2025-06-30', 'Non-refundable'),
    ('Headphones', 'Noise-cancelling headphones', 200, 'headphones.jpg', '2025-11-30', 'No exchanges'),
    ('T-shirt', 'Custom branded T-shirt', 75, 'tshirt.jpg', '2025-09-30', 'Limited stock'),
    ('Backpack', 'Stylish backpack', 150, 'backpack.jpg', '2025-08-15', 'One per user'),
    ('Laptop Stand', 'Ergonomic laptop stand', 300, 'laptop_stand.jpg', '2025-07-10', 'Free shipping'),
    ('Water Bottle', 'Reusable water bottle', 50, 'water_bottle.jpg', '2025-06-25', 'Not redeemable for cash'),
    ('Bluetooth Speaker', 'Portable Bluetooth speaker', 120, 'bluetooth_speaker.jpg', '2025-12-15', 'Limited availability'),
    ('Smartwatch', 'Fitness tracking smartwatch', 250, 'smartwatch.jpg', '2025-11-01', 'No returns'),
    ('Tablet', '7-inch tablet', 400, 'tablet.jpg', '2025-09-30', 'Batteries not included'),
    ('Gift Voucher', 'Store-wide gift voucher', 200, 'gift_voucher.jpg', '2025-10-01', 'Valid in-store and online'),
    ('Game Console', 'Gaming console bundle', 500, 'game_console.jpg', '2025-12-20', 'One per user'),
    ('Movie Tickets', 'Two tickets for a movie', 80, 'movie_tickets.jpg', '2025-07-20', 'Valid for one-time use'),
    ('E-book Reader', 'Portable e-book reader', 180, 'ebook_reader.jpg', '2025-11-10', 'Non-transferable'),
    ('Travel Voucher', 'Voucher for travel booking', 600, 'travel_voucher.jpg', '2025-06-01', 'Expires in 1 year'),
    ('Amazon Echo', 'Voice assistant smart speaker', 220, 'amazon_echo.jpg', '2025-10-05', 'One per user'),
    ('Camera', 'Digital camera', 350, 'camera.jpg', '2025-09-01', 'Limited stock'),
    ('Fitness Tracker', 'Track your health with this fitness tracker', 140, 'fitness_tracker.jpg', '2025-08-10', 'Non-refundable'),
    ('Portable Charger', 'Portable power bank', 60, 'portable_charger.jpg', '2025-07-15', 'Limited edition');

-- Insert dummy data for Transactions table
INSERT INTO Transactions (user_id, points_change, transaction_type, description)
VALUES
    (1, 100, 'Earned', 'Completed survey'),
    (2, -50, 'Redeemed', 'Redeemed Coffee Mug'),
    (3, 200, 'Earned', 'Made a purchase'),
    (4, -75, 'Redeemed', 'Redeemed T-shirt'),
    (5, 150, 'Earned', 'Completed quiz'),
    (6, -100, 'Redeemed', 'Redeemed Gift Card'),
    (7, 300, 'Earned', 'Participated in event'),
    (8, -120, 'Redeemed', 'Redeemed Bluetooth Speaker'),
    (9, 50, 'Earned', 'Watched a video'),
    (10, -80, 'Redeemed', 'Redeemed Movie Tickets'),
    (11, 200, 'Earned', 'Referred a friend'),
    (12, -150, 'Redeemed', 'Redeemed Backpack'),
    (13, 100, 'Earned', 'Completed survey'),
    (14, -100, 'Redeemed', 'Redeemed Coffee Mug'),
    (15, 200, 'Earned', 'Completed challenge'),
    (16, -90, 'Redeemed', 'Redeemed Water Bottle'),
    (17, 75, 'Earned', 'Signed up'),
    (18, -50, 'Redeemed', 'Redeemed Headphones'),
    (19, 50, 'Earned', 'Referred a friend'),
    (20, -200, 'Redeemed', 'Redeemed Laptop Stand');

-- Insert dummy data for Reward_Redemptions table
INSERT INTO Reward_Redemptions (user_id, reward_id)
VALUES
    (1, 1),
    (2, 2),
    (3, 3),
    (4, 4),
    (5, 5),
    (6, 6),
    (7, 7),
    (8, 8),
    (9, 9),
    (10, 10),
    (11, 11),
    (12, 12),
    (13, 13),
    (14, 14),
    (15, 15),
    (16, 16),
    (17, 17),
    (18, 18),
    (19, 19),
    (20, 20);

-- Insert dummy data for Vendor_Metrics table
INSERT INTO Vendor_Metrics (vendor_id, total_redemptions, active_promotions, revenue_generated)
VALUES
    (1, 20, 5, 1000.00),
    (2, 15, 3, 500.00),
    (3, 25, 8, 1500.00),
    (4, 10, 2, 200.00),
    (5, 18, 4, 800.00),
    (6, 30, 6, 1200.00),
    (7, 40, 7, 1700.00),
    (8, 22, 5, 600.00),
    (9, 14, 3, 400.00),
    (10, 35, 9, 2000.00),
    (11, 28, 5, 1300.00),
    (12, 38, 8, 1600.00),
    (13, 24, 4, 1100.00),
    (14, 19, 2, 500.00),
    (15, 33, 7, 1400.00),
    (16, 27, 6, 1300.00),
    (17, 15, 3, 350.00),
    (18, 21, 4, 800.00),
    (19, 17, 2, 600.00),
    (20, 23, 5, 900.00);

-- Insert dummy data for Companies table
INSERT INTO Companies (name, address, industry, logo)
VALUES
    ('TechCorp', '123 Tech St, City', 'Technology', 'techcorp_logo.png'),
    ('HealthPlus', '456 Health Ave, City', 'Healthcare', 'healthplus_logo.png'),
    ('EduWorld', '789 Education Rd, City', 'Education', 'eduworld_logo.png'),
    ('GreenFoods', '101 Green Blvd, City', 'Food & Beverage', 'greenfoods_logo.png'),
    ('MediCare', '202 Health Pkwy, City', 'Healthcare', 'medicare_logo.png'),
    ('AutoMotive', '303 Car St, City', 'Automotive', 'automotive_logo.png'),
    ('RetailHub', '404 Retail Rd, City', 'Retail', 'retailhub_logo.png'),
    ('TravelMate', '505 Travel St, City', 'Travel', 'travelmate_logo.png'),
    ('FinServe', '606 Finance Blvd, City', 'Finance', 'finserve_logo.png'),
    ('EcoTech', '707 Green Rd, City', 'Technology', 'ecotech_logo.png'),
    ('SuperMart', '808 Shop St, City', 'Retail', 'supermart_logo.png'),
    ('Foodies', '909 Food Blvd, City', 'Food & Beverage', 'foodies_logo.png'),
    ('TechSavvy', '1010 Tech Park, City', 'Technology', 'techsavvy_logo.png'),
    ('AutoZone', '1111 Car Ave, City', 'Automotive', 'autozone_logo.png'),
    ('FitPro', '1212 Fitness Rd, City', 'Fitness', 'fitpro_logo.png'),
    ('SmartLife', '1313 Smart St, City', 'Technology', 'smartlife_logo.png'),
    ('GadgetLab', '1414 Tech Blvd, City', 'Technology', 'gadgetlab_logo.png'),
    ('DesignHub', '1515 Design Rd, City', 'Design', 'designhub_logo.png'),
    ('GameZone', '1616 Game Blvd, City', 'Entertainment', 'gamezone_logo.png');

-- Insert dummy data for Admins table
INSERT INTO Admins (email, password, name, phone, profile_image, role, company_id)
VALUES
    ('admin1@techcorp.com', 'adminpass1', 'Alice Adams', '1234567890', 'admin1.jpg', 'admin', 1),
    ('admin2@healthplus.com', 'adminpass2', 'Bob Brown', '1234567891', 'admin2.jpg', 'admin', 2),
    ('admin3@eduworld.com', 'adminpass3', 'Charlie Clark', '1234567892', 'admin3.jpg', 'admin', 3),
    ('admin4@greenfoods.com', 'adminpass4', 'David Davis', '1234567893', 'admin4.jpg', 'admin', 4),
    ('admin5@medicare.com', 'adminpass5', 'Eva Evans', '1234567894', 'admin5.jpg', 'admin', 5),
    ('admin6@automotive.com', 'adminpass6', 'Frank Foster', '1234567895', 'admin6.jpg', 'admin', 6),
    ('admin7@retailhub.com', 'adminpass7', 'Grace Green', '1234567896', 'admin7.jpg', 'admin', 7),
    ('admin8@travelmate.com', 'adminpass8', 'Hank Harris', '1234567897', 'admin8.jpg', 'admin', 8),
    ('admin9@finserve.com', 'adminpass9', 'Irene Irving', '1234567898', 'admin9.jpg', 'admin', 9),
    ('admin10@ecotech.com', 'adminpass10', 'Jack Johnson', '1234567899', 'admin10.jpg', 'admin', 10),
    ('admin11@supermart.com', 'adminpass11', 'Kim Kelly', '1234567900', 'admin11.jpg', 'admin', 11),
    ('admin12@foodies.com', 'adminpass12', 'Liam Lee', '1234567901', 'admin12.jpg', 'admin', 12),
    ('admin13@techsavvy.com', 'adminpass13', 'Mona Mitchell', '1234567902', 'admin13.jpg', 'admin', 13),
    ('admin14@autozone.com', 'adminpass14', 'Nathan Nelson', '1234567903', 'admin14.jpg', 'admin', 14),
    ('admin15@fitpro.com', 'adminpass15', 'Olivia Owens', '1234567904', 'admin15.jpg', 'admin', 15),
    ('admin16@smartlife.com', 'adminpass16', 'Paul Peterson', '1234567905', 'admin16.jpg', 'admin', 16),
    ('admin17@gadgetlab.com', 'adminpass17', 'Quincy Quinn', '1234567906', 'admin17.jpg', 'admin', 17),
    ('admin18@designhub.com', 'adminpass18', 'Riley Rogers', '1234567907', 'admin18.jpg', 'admin', 18),
    ('admin19@gamezone.com', 'adminpass19', 'Samantha Scott', '1234567908', 'admin19.jpg', 'admin', 19),
    ('admin20@techcorp.com', 'adminpass20', 'Tom Taylor', '1234567909', 'admin20.jpg', 'admin', 1);

-- Insert dummy data for AdminCompanyRelationship table
INSERT INTO AdminCompanyRelationship (admin_id, company_id)
VALUES
    (1, 1),
    (2, 2),
    (3, 3),
    (4, 4),
    (5, 5),
    (6, 6),
    (7, 7),
    (8, 8),
    (9, 9),
    (10, 10),
    (11, 11),
    (12, 12),
    (13, 13),
    (14, 14),
    (15, 15),
    (16, 16),
    (17, 17),
    (18, 18),
    (19, 19),
    (20, 20);
