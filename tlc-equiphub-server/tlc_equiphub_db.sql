-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 16, 2026 at 09:37 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tlc_equiphub_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `items`
--

CREATE TABLE `items` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `category` varchar(50) NOT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `description` text DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `is_available` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `items`
--

INSERT INTO `items` (`id`, `name`, `category`, `stock`, `description`, `image_url`, `is_available`, `created_at`) VALUES
(1, 'Projector ', 'Audio & Visual', 4, 'Full HD projector with HDMI input', NULL, 1, '2026-11-03 13:43:03'),
(2, 'JBL Sound System', 'Audio & Visual', 0, 'Portable PA system with wireless mic', NULL, 0, '2026-11-03 13:43:03'),
(3, 'Monoblock Chair', 'Furniture & Setup', 350, 'White plastic stackable chair', NULL, 1, '2026-11-03 13:43:03'),
(4, 'Extension Wire', 'Wires', 50, 'Wall too far? Take one for your equipment', NULL, 1, '2026-11-15 13:44:23'),
(5, 'Monitor', 'Audio & Visual', 30, 'Philips Monitor for school events that needs a monitor.', NULL, 1, '2026-11-15 13:44:23');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `reservation_id` int(11) DEFAULT NULL,
  `subject` varchar(150) DEFAULT NULL,
  `body` text DEFAULT NULL,
  `sent_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reservations`
--

CREATE TABLE `reservations` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `status` enum('Pending','Accepted','Declined','Cancelled','Returned') DEFAULT 'Pending',
  `decline_reason` text DEFAULT NULL,
  `notified` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `reservation_date` date DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reservations`
--

INSERT INTO `reservations` (`id`, `user_id`, `item_id`, `quantity`, `status`, `decline_reason`, `notified`, `created_at`, `reservation_date`, `start_time`, `end_time`) VALUES
(1, 6, 3, 5, 'Cancelled', 'Sorry no more na pala :(', 0, '2026-11-07 02:52:10', NULL, NULL, NULL),
(2, 4, 1, 1, 'Cancelled', 'nope', 0, '2026-11-13 02:53:29', NULL, NULL, NULL),
(3, 6, 2, 1, 'Declined', 'cant', 0, '2026-11-14 05:19:26', NULL, NULL, NULL),
(4, 6, 2, 1, 'Declined', 'w', 0, '2026-11-15 02:47:36', NULL, NULL, NULL),
(5, 6, 2, 1, 'Cancelled', 'Cancelled by user', 0, '2026-11-15 03:41:24', NULL, NULL, NULL),
(8, 6, 2, 1, 'Declined', 'Tst', 0, '2026-11-15 10:19:21', NULL, NULL, NULL),
(9, 6, 3, 1, 'Declined', 'test', 0, '2026-11-15 10:19:21', NULL, NULL, NULL),
(11, 6, 3, 1, 'Declined', 'Testing', 0, '2026-11-15 10:19:45', NULL, NULL, NULL),
(14, 6, 2, 1, 'Declined', 'because testing', 0, '2026-11-15 10:51:12', NULL, NULL, NULL),
(16, 6, 1, 1, 'Accepted', NULL, 0, '2026-11-15 13:21:37', '2026-11-16', '10:30:00', '11:30:00'),
(17, 6, 4, 1, 'Pending', NULL, 0, '2026-11-15 14:13:04', '2026-11-16', '10:30:00', '11:30:00'),
(18, 6, 1, 1, 'Pending', NULL, 0, '2026-11-15 14:13:04', '2026-11-16', '10:30:00', '11:30:00'),
(19, 6, 2, 1, 'Pending', NULL, 0, '2026-11-15 14:13:04', '2026-11-16', '10:30:00', '11:30:00'),
(20, 6, 2, 3, 'Accepted', NULL, 0, '2026-11-16 07:18:54', '2026-11-18', '17:00:00', '18:00:00'),
(23, 8, 4, 1, 'Pending', NULL, 0, '2026-11-16 08:11:54', '2026-11-13', '17:12:00', '17:13:00');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `ID` int(11) NOT NULL,
  `UserName` varchar(100) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `role` varchar(20) NOT NULL DEFAULT 'client',
  `messenger_psid` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`ID`, `UserName`, `Email`, `Password`, `role`, `messenger_psid`) VALUES
(2, 'Zennie', 'Zennie@gmail.com', '979764643131', 'faculty', NULL),
(3, 'Mandie', 'mandie@thelewiscollege.edu.ph', '646419558', 'student', NULL),
(4, 'admin', 'admin@tlc.edu.ph', 'admin123', 'admin', NULL),
(5, 'Juan Dela Cruz', 'juan@tlc.edu.ph', 'juan123', 'client', NULL),
(6, 'aamon', 'A@gmail.com', '12321', 'student', NULL),
(7, 'Mimon', 'Mi@test', '1', 'client', NULL),
(8, 'c-2024-0247', 'AD@gmail.com', '1', 'client', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_msg_user` (`user_id`),
  ADD KEY `fk_msg_res` (`reservation_id`);

--
-- Indexes for table `reservations`
--
ALTER TABLE `reservations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_res_user` (`user_id`),
  ADD KEY `fk_res_item` (`item_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `items`
--
ALTER TABLE `items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reservations`
--
ALTER TABLE `reservations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `fk_msg_res` FOREIGN KEY (`reservation_id`) REFERENCES `reservations` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_msg_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`ID`) ON DELETE CASCADE;

--
-- Constraints for table `reservations`
--
ALTER TABLE `reservations`
  ADD CONSTRAINT `fk_res_item` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_res_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`ID`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
