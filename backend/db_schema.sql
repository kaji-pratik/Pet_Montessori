-- CREATE DATABASE
CREATE DATABASE IF NOT EXISTS `pet_montessori_db`;
USE `pet_montessori_db`;

-- USERS TABLE
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(255) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) NOT NULL DEFAULT 'user',
  `phone` VARCHAR(50) NULL,
  `address` TEXT NULL,
  `avatar` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- PETS TABLE
CREATE TABLE IF NOT EXISTS `pets` (
  `id` VARCHAR(255) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `type` VARCHAR(50) NOT NULL,
  `breed` VARCHAR(255) NOT NULL,
  `age` VARCHAR(50) NOT NULL,
  `gender` VARCHAR(50) NOT NULL,
  `price` DECIMAL(10, 2) DEFAULT 0.00,
  `fee` DECIMAL(10, 2) DEFAULT 0.00,
  `vaccination` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `images` LONGTEXT NOT NULL, -- JSON array of image strings
  `status` VARCHAR(50) DEFAULT 'Pending',
  `purpose` VARCHAR(50) DEFAULT 'adoption',
  `ownerName` VARCHAR(255) NULL,
  `ownerEmail` VARCHAR(255) NULL,
  `ownerPhone` VARCHAR(255) NULL,
  `user_id` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ADOPTION REQUESTS TABLE
CREATE TABLE IF NOT EXISTS `adoption_requests` (
  `id` VARCHAR(255) PRIMARY KEY,
  `petId` VARCHAR(255) NOT NULL,
  `petName` VARCHAR(255) NOT NULL,
  `applicantName` VARCHAR(255) NOT NULL,
  `applicantEmail` VARCHAR(255) NOT NULL,
  `applicantPhone` VARCHAR(255) NOT NULL,
  `applicantAddress` VARCHAR(255) NOT NULL,
  `experience` TEXT NULL,
  `homeType` VARCHAR(255) NULL,
  `status` VARCHAR(50) DEFAULT 'Pending',
  `userId` VARCHAR(255) NULL,
  `date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`petId`) REFERENCES `pets` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS `products` (
  `id` VARCHAR(255) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `type` VARCHAR(50) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `price` DECIMAL(10, 2) NOT NULL,
  `rating` DECIMAL(3, 2) DEFAULT 5.00,
  `stock` INT NOT NULL DEFAULT 0,
  `image` TEXT NULL,
  `description` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ORDERS TABLE
CREATE TABLE IF NOT EXISTS `orders` (
  `id` VARCHAR(255) PRIMARY KEY,
  `userId` VARCHAR(255) NULL,
  `items` LONGTEXT NOT NULL, -- JSON array of ordered products
  `totalAmount` DECIMAL(10, 2) NOT NULL,
  `paymentGateway` VARCHAR(50) NOT NULL, -- renamed from paymentMethod to match frontend JS
  `paymentStatus` VARCHAR(50) DEFAULT 'Pending',
  `status` VARCHAR(50) DEFAULT 'Pending',
  `buyerName` VARCHAR(255) NOT NULL,     -- renamed from name to match frontend JS
  `buyerEmail` VARCHAR(255) NOT NULL,    -- renamed from email to match frontend JS
  `buyerPhone` VARCHAR(255) NOT NULL,    -- renamed from phone to match frontend JS
  `address` TEXT NOT NULL,
  `txnId` VARCHAR(255) NULL,
  `type` VARCHAR(50) DEFAULT 'accessory',
  `date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS `bookings` (
  `id` VARCHAR(255) PRIMARY KEY,
  `userId` VARCHAR(255) NULL,
  `petName` VARCHAR(255) NOT NULL,
  `petType` VARCHAR(50) NOT NULL,
  `breed` VARCHAR(255) NOT NULL,
  `age` VARCHAR(50) NOT NULL,
  `ownerName` VARCHAR(255) NOT NULL,
  `ownerPhone` VARCHAR(255) NOT NULL,
  `ownerEmail` VARCHAR(255) NOT NULL,
  `checkIn` VARCHAR(50) NOT NULL,         -- stored as YYYY-MM-DD string
  `checkOut` VARCHAR(50) NOT NULL,        -- stored as YYYY-MM-DD string
  `daysCount` INT NOT NULL,
  `totalCost` DECIMAL(10, 2) NOT NULL,
  `specialInstructions` TEXT NULL,        -- renamed to match frontend JS
  `paymentGateway` VARCHAR(50) NOT NULL,  -- renamed to match frontend JS
  `paymentStatus` VARCHAR(50) DEFAULT 'Pending',
  `status` VARCHAR(50) DEFAULT 'Pending',
  `date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- DONATIONS TABLE
CREATE TABLE IF NOT EXISTS `donations` (
  `id` VARCHAR(255) PRIMARY KEY,
  `userId` VARCHAR(255) NULL,
  `amount` DECIMAL(10, 2) NOT NULL,
  `paymentGateway` VARCHAR(50) NOT NULL,
  `paymentStatus` VARCHAR(50) DEFAULT 'Pending',
  `donorName` VARCHAR(255) NOT NULL,
  `donorEmail` VARCHAR(255) NOT NULL,
  `message` TEXT NULL,
  `date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TESTIMONIALS TABLE
CREATE TABLE IF NOT EXISTS `testimonials` (
  `id` VARCHAR(255) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `role` VARCHAR(255) NOT NULL,
  `content` TEXT NOT NULL,
  `rating` INT NOT NULL DEFAULT 5,
  `avatar` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- FAQS TABLE
CREATE TABLE IF NOT EXISTS `faqs` (
  `id` VARCHAR(255) PRIMARY KEY,
  `question` TEXT NOT NULL,
  `answer` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` VARCHAR(255) PRIMARY KEY,
  `userId` VARCHAR(255) NOT NULL, -- Can be 'all' or a specific user_id
  `title` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `is_read` BOOLEAN DEFAULT FALSE,
  `date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================================
-- SEED DATA
-- =========================================================================

-- Seed Users
-- admin123 hash: $2a$10$W5iZs/WcaUNeilLvkh4nLOwGCdCCXr4CQhkoRaVCcunnwwqGpjo4y
-- user123 hash:  $2a$10$xOiGJrE98AJfuMtIK2./juQE0q2cqIpWe9yKmo5BNihGyFIr5iFTK
INSERT IGNORE INTO `users` (`id`, `name`, `email`, `password`, `role`, `phone`, `address`, `avatar`) VALUES
('user-admin', 'Pet Montessori Administrator', 'admin@petmontessori.com', '$2a$10$W5iZs/WcaUNeilLvkh4nLOwGCdCCXr4CQhkoRaVCcunnwwqGpjo4y', 'admin', '+977-9801122334', 'Bakhundole, Lalitpur, Nepal', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'),
('user-customer', 'Sita Thapa', 'sita@gmail.com', '$2a$10$xOiGJrE98AJfuMtIK2./juQE0q2cqIpWe9yKmo5BNihGyFIr5iFTK', 'user', '+977-9841123456', 'Kathmandu, Nepal', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100');

-- Seed Pets
INSERT IGNORE INTO `pets` (`id`, `name`, `type`, `breed`, `age`, `gender`, `price`, `fee`, `vaccination`, `description`, `images`, `status`, `purpose`, `ownerName`, `ownerEmail`, `ownerPhone`) VALUES
('pet-1', 'Milo', 'dog', 'Golden Retriever', '2 Years', 'Male', 0.00, 0.00, 'Fully Vaccinated', 'Extremely friendly, energetic, loves retrieving balls, and gets along wonderfully with kids and other pets.', '[\"/assets/golden_retriever.jpg\", \"https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?auto=format&fit=crop&q=80&w=800\"]', 'Approved', 'adoption', 'Pet Montessori Shelter', 'shelter@petmontessori.com', '+977-9801234567'),
('pet-2', 'Luna', 'cat', 'Siamese Cat', '1 Year', 'Female', 0.00, 0.00, 'Fully Vaccinated', 'Vocal, affectionate, loves cuddling in warm blankets, and enjoys playing with feather wands.', '[\"/assets/siamese_cat.jpg\", \"https://images.unsplash.com/photo-1574158622643-69d34d72650a?auto=format&fit=crop&q=80&w=800\"]', 'Approved', 'adoption', 'Lina KC', 'lina@gmail.com', '+977-9841987654'),
('pet-3', 'Rocky', 'dog', 'German Shepherd', '3 Years', 'Male', 0.00, 0.00, 'Fully Vaccinated', 'Highly intelligent, protective, obedient, and trained in basic guard duties. Ideal for active families.', '[\"https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&q=80&w=800\"]', 'Approved', 'adoption', 'Pet Montessori Shelter', 'shelter@petmontessori.com', '+977-9801234567'),
('pet-4', 'Bella', 'cat', 'Persian Cat', '6 Months', 'Female', 0.00, 1500.00, 'First Dose Administered', 'Very calm and quiet kitty with premium long white coat. Requires grooming every few days.', '[\"https://images.unsplash.com/photo-1618826411640-d6df44dd3f7a?auto=format&fit=crop&q=80&w=800\"]', 'Approved', 'adoption', 'Subash Sharma', 'subash@hotmail.com', '+977-9813245678'),
('pet-5', 'Charlie', 'dog', 'Beagle', '3 Months', 'Male', 25000.00, 0.00, 'Fully Vaccinated', 'Playful Beagle pup, purebred, paper-certified, excellent health and temperament. Looking for an active home.', '[\"https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?auto=format&fit=crop&q=80&w=800\", \"/assets/golden_retriever.jpg\"]', 'Approved', 'sale', 'Himalayan Kennels', 'himalayan@gmail.com', '+977-9851122334'),
('pet-6', 'Daisy', 'cat', 'British Shorthair', '4 Months', 'Female', 35000.00, 0.00, 'Fully Vaccinated', 'Gorgeous chubby cheeks British Shorthair, lilac colored. Very independent and playful.', '[\"https://images.unsplash.com/photo-1574158622643-69d34d72650a?auto=format&fit=crop&q=80&w=800\", \"https://images.unsplash.com/photo-1513360309081-36f5e878fc9e?auto=format&fit=crop&q=80&w=800\"]', 'Approved', 'sale', 'Katmandu Cats', 'ktmcats@gmail.com', '+977-9860445566'),
('pet-7', 'Max', 'dog', 'Boxer Dog', '8 Months', 'Male', 32000.00, 0.00, 'Fully Vaccinated', 'Well-built Boxer puppy, highly social, responsive to voice commands. Loves running.', '[\"https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&q=80&w=800\", \"https://images.unsplash.com/photo-1531804055935-76f44d7c3621?auto=format&fit=crop&q=80&w=800\"]', 'Approved', 'sale', 'Niranjan Thapa', 'niranjan@gmail.com', '+977-9849556677'),
('pet-8', 'Cleo', 'cat', 'Bengal Cat', '5 Months', 'Female', 45000.00, 0.00, 'Fully Vaccinated', 'Stunning rosetted coat Bengal kitten. Very active, curious, and loves climbing and even water!', '[\"https://images.unsplash.com/photo-1513360309081-36f5e878fc9e?auto=format&fit=crop&q=80&w=800\"]', 'Approved', 'sale', 'Exotic Felines Nepal', 'exotic@felines.com', '+977-9818889990');

-- Seed Products
INSERT IGNORE INTO `products` (`id`, `name`, `type`, `category`, `price`, `rating`, `stock`, `image`, `description`) VALUES
('prod-1', 'Premium Dog Kibble (3kg)', 'dog', 'Food', 2800.00, 4.80, 15, '/assets/dog_food_bag.jpg', 'High-protein, grain-free puppy and adult formula for strong muscle growth.'),
('prod-2', 'Orthopedic memory foam dog bed', 'dog', 'Beds', 4200.00, 4.90, 8, 'https://images.unsplash.com/photo-1541599540903-216a46ca1ad0?auto=format&fit=crop&q=80&w=400', 'Ultra-soft memory foam dog bed for joint support and maximum comfort.'),
('prod-3', 'Stainless Steel Double Bowl Set', 'dog', 'Bowls', 1500.00, 4.50, 20, 'https://images.unsplash.com/photo-1576082761138-0cc29390119c?auto=format&fit=crop&q=80&w=400', 'Anti-skid base steel feeding bowls, easy to wash and rust-resistant.'),
('prod-4', 'Interactive Squeaker Rubber Toy', 'dog', 'Toys', 850.00, 4.60, 35, 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80&w=400', 'Indestructible dog chew toy made from non-toxic natural rubber.'),
('prod-5', 'Adjustable Heavy Duty Harness & Leash', 'dog', 'Leashes', 2200.00, 4.70, 12, 'https://images.unsplash.com/photo-1601758124540-1e90500743a8?auto=format&fit=crop&q=80&w=400', 'No-pull dog harness with reflective thread for night safety.'),
('prod-6', 'Professional Grooming Nail & Hair Clipper Kit', 'dog', 'Grooming Kits', 3100.00, 4.40, 10, 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=400', 'Low-noise rechargeable clippers with multiple combs and stainless steel blades.'),
('prod-7', 'Premium Anti-Itch Oatmeal Shampoo', 'dog', 'Shampoo', 1100.00, 4.70, 18, '/assets/dog_food_bag.jpg', 'Organic formulas with aloe vera for soothing dry, sensitive skin.'),
('prod-8', 'Windproof Warm Winter Puppy Jacket', 'dog', 'Clothes', 1800.00, 4.50, 6, 'https://images.unsplash.com/photo-1608454367599-c1139c7198a2?auto=format&fit=crop&q=80&w=400', 'Padded coat with zipper, perfect for cold morning walks.'),
('prod-9', 'Premium Salmon Dry Cat Food (1.5kg)', 'cat', 'Food', 1950.00, 4.90, 22, 'https://images.unsplash.com/photo-1569591159212-b02ea8a9f239?auto=format&fit=crop&q=80&w=400', 'Rich in Omega-3 and Omega-6 for shiny skin and healthy immune system.'),
('prod-10', 'Plush Round Igloo Cat Bed', 'cat', 'Beds', 3500.00, 4.80, 9, 'https://images.unsplash.com/photo-1541599540903-216a46ca1ad0?auto=format&fit=crop&q=80&w=400', 'Cozy hooded sleeping cave, perfect for cats that love security.'),
('prod-11', 'Catnip Filled Fish Toy Set', 'cat', 'Toys', 650.00, 4.60, 40, 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80&w=400', 'Crinkle soft toys containing natural premium organic catnip.'),
('prod-12', 'Multi-Level Sisal Cat Scratching Post', 'cat', 'Scratching Posts', 5800.00, 4.90, 4, 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80&w=400', '65cm scratching pillar with hanging mouse toy, made of premium sisal.'),
('prod-13', 'Hooded Odor-Control Litter Box', 'cat', 'Litter Boxes', 2900.00, 4.70, 11, 'https://images.unsplash.com/photo-1608454367599-c1139c7198a2?auto=format&fit=crop&q=80&w=400', 'Enclosed design with active carbon filters to trap smells and reduce litter track.'),
('prod-14', 'Premium Self-Cleaning Slicker Brush', 'cat', 'Grooming Brushes', 1200.00, 4.60, 15, 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=400', 'Gently removes loose undercoat, tangles, and dander with a click clean release button.'),
('prod-15', 'Airline Approved Pet Travel Carrier', 'cat', 'Carriers', 4600.00, 4.80, 7, 'https://images.unsplash.com/photo-1608454367599-c1139c7198a2?auto=format&fit=crop&q=80&w=400', 'Breathable mesh canvas carrier with comfortable fleece mattress pad.'),
('prod-16', 'Slow Feeder Ceramic Bowl', 'cat', 'Bowls', 1400.00, 4.40, 16, 'https://images.unsplash.com/photo-1576082761138-0cc29390119c?auto=format&fit=crop&q=80&w=400', 'Eco-friendly heavy ceramic bowl to prevent whisker fatigue and fast eating.'),
('prod-17', 'Cute Striped Cotton Cat Sweater', 'cat', 'Clothes', 1100.00, 4.30, 5, 'https://images.unsplash.com/photo-1608454367599-c1139c7198a2?auto=format&fit=crop&q=80&w=400', 'Breathable, elastic pet clothes for indoor kittens.');

-- Seed Testimonials
INSERT IGNORE INTO `testimonials` (`id`, `name`, `role`, `content`, `rating`, `avatar`) VALUES
('test-1', 'Rohan Shrestha', 'Pet Parent of Rocky', 'Pet Montessori booking service is amazing. I left my German Shepherd Rocky here for 5 days while I was out of town. The daily video updates and clean environment gave me total peace of mind!', 5, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100'),
('test-2', 'Priya Adhikari', 'Adopted Milo', 'We adopted Milo (Golden Retriever) through Pet Montessori. The verification process was quick, transparent, and we are so glad we could give this sweet boy a forever home. Recommended platform!', 5, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100'),
('test-3', 'Sanjay Pandey', 'Cat Owner', 'Ordered cat litter and accessories. They arrived in Lalitpur within 24 hours. The Cash on Delivery process is super easy and the customer service is very responsive.', 4, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100');

-- Seed FAQs
INSERT IGNORE INTO `faqs` (`id`, `question`, `answer`) VALUES
('faq-1', 'How do I book pet care services?', 'Go to the Pet Care Booking page, input your pet details, check-in and check-out dates. The system will calculate the total cost at Rs. 500 per day. Select your payment gateway (eSewa, Khalti, or COD for retail items) to complete the booking.'),
('faq-2', 'Is adoption free of charge?', 'Most adoptions on Pet Montessori are completely free. However, in some cases of pedigree breeds listed by rescuers, a nominal shelter maintenance fee may apply to support other rescue operations.'),
('faq-3', 'How can I sell or donate a pet?', 'Registered users can visit the "Sell Pets" or "Donate Pets" page, fill in the comprehensive form detailing the pet breed, age, vaccination status, contact information, and upload images. An administrator will review and approve the listing before it goes live.'),
('faq-4', 'What payment methods are supported?', 'We support local payment options: eSewa and Khalti digital wallets for bookings and marketplace products. Cash on Delivery (COD) is supported for accessories and items only.');

-- Seed Notifications
INSERT IGNORE INTO `notifications` (`id`, `userId`, `title`, `message`, `is_read`) VALUES
('not-1', 'all', 'Welcome to Pet Montessori!', 'Explore our adoption lists, shop, and professional pet boarding services.', FALSE);
