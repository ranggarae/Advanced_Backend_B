-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 08, 2025 at 10:46 AM
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
-- Database: `movieapp`
--

-- --------------------------------------------------------

--
-- Table structure for table `email_verification`
--

CREATE TABLE `email_verification` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `token` varchar(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `email_verification`
--

INSERT INTO `email_verification` (`id`, `user_id`, `token`, `created_at`) VALUES
(3, 5, '0480982b-7d7f-478f-bbe6-cbe9c0786f72', '2025-06-08 15:06:09');

-- --------------------------------------------------------

--
-- Table structure for table `list_continue`
--

CREATE TABLE `list_continue` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `image1` varchar(255) DEFAULT NULL,
  `progress` int(11) DEFAULT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `list_continue`
--

INSERT INTO `list_continue` (`id`, `title`, `image`, `image1`, `progress`, `metadata`) VALUES
(1, 'Don\'t Look Up', 'Type=31.png', 'Number=20.png', 50, NULL),
(2, 'Blue Lock', 'Type=5.png', 'Number=20.png', 75, NULL),
(3, 'The Batman', 'Type=12.png', 'Number=20.png', 30, NULL),
(4, 'A Man Called Otto', 'Type=9.png', 'Number=20.png', 90, NULL),
(5, 'Guardian Of The Galaxy', 'Type=16.png', 'Number=20.png', 90, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `movies`
--

CREATE TABLE `movies` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `image1` varchar(255) DEFAULT NULL,
  `rating` decimal(2,1) DEFAULT NULL,
  `duration` varchar(50) DEFAULT NULL,
  `progress` int(11) DEFAULT NULL,
  `genres` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`genres`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `movies`
--

INSERT INTO `movies` (`id`, `title`, `image`, `image1`, `rating`, `duration`, `progress`, `genres`) VALUES
(1, 'Don\'t Look Up', 'Type=31.png', 'Number=20.png', 4.5, '2j 18m', 50, '[\"Drama\",\"Komedi\",\"Sci-Fi\"]'),
(2, 'Blue Lock', 'Type=5.png', 'Number=5.png', 4.6, '24m', 75, '[\"Anime\",\"Olahraga\"]'),
(3, 'The Batman', 'Type=12.png', 'Number=8.png', 4.2, '2j 55m', 30, '[\"Aksi\",\"Kriminal\",\"Drama\"]'),
(4, 'A Man Called Otto', 'Type=9.png', 'Number=10.png', 4.4, '2j 6m', 90, '[\"Drama\",\"Komedi\"]'),
(5, 'Guardian Of The Galaxy', 'Type=16.png', 'Number=30.png', 4.4, '2j 6m', 90, '[\"Drama\",\"Komedi\"]'),
(6, 'Shazam', 'Type=2.png', 'Number=2.png', 4.4, '2j 6m', 90, '[\"Aksi\",\"Komedi\"]'),
(7, 'Megan', 'Type=20.png', 'Number=15.png', 4.4, '2j 6m', 90, '[\"Aksi\",\"Komedi\"]'),
(8, 'Suzume', 'Type=11.png', 'Number=14.png', 4.4, '2j 6m', 90, '[\"Aksi\",\"Komedi\"]'),
(9, 'My Hero Academia', 'Type=26.png', 'Number=18.png', 4.4, '2j 6m', 90, '[\"Aksi\",\"Komedi\"]'),
(10, 'Doctor Strange', 'Type=27.png', 'Number=19.png', 4.4, '2j 6m', 90, '[\"Aksi\",\"Komedi\"]'),
(11, 'Black adam', 'Type=28.png', 'Number=21.png', 4.4, '2j 6m', 90, '[\"Aksi\",\"Komedi\"]'),
(12, 'The Devil All the Time', 'Type=29.png', 'Number=22.png', 4.4, '2j 6m', 90, '[\"Aksi\",\"Komedi\"]'),
(13, 'Ted Lasso', 'Type=30.png', 'Number=23.png', 4.4, '2j 6m', 90, '[\"Aksi\",\"Komedi\"]'),
(14, 'Stuart Little', 'Type=13.png', 'Number=24.png', 4.4, '2j 6m', 90, '[\"Aksi\",\"Komedi\"]'),
(15, 'Dilan 1991', 'Type=22.png', 'Number=27.png', 4.4, '2j 6m', 90, '[\"Aksi\",\"Komedi\"]'),
(21, 'Doctor Strange', 'Type=27.png', 'Number=19.png', 4.4, '2j 6m', 90, '[\"Aksi\",\"Komedi\"]'),
(22, 'Suzume', 'Type=11.png', 'Number=14.png', 4.4, '2j 6m', 90, '[\"Aksi\",\"Komedi\"]'),
(23, 'Don\'t Look Up', 'Type=31.png', 'Number=20.png', 4.5, '2j 18m', 50, '[\"Drama\",\"Komedi\",\"Sci-Fi\"]'),
(24, 'Guardian Of The Galaxy', 'Type=16.png', 'Number=30.png', 4.4, '2j 6m', 90, '[\"Drama\",\"Komedi\"]');

-- --------------------------------------------------------

--
-- Table structure for table `mylist`
--

CREATE TABLE `mylist` (
  `user_id` int(11) NOT NULL,
  `movie_id` int(11) NOT NULL,
  `added_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mylist`
--

INSERT INTO `mylist` (`user_id`, `movie_id`, `added_at`) VALUES
(1, 23, '2025-06-08 06:58:44');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `avatar`, `password`) VALUES
(1, 'kehed', 'kehed@gmail.com', '/uploads/1-1749371847186.jpg', '$2b$10$Vp7X7v9vqypER6Jyqnd3f.bA4ZCGW4828LdKcVGvRlUK8DIOXwq8m'),
(5, 'masterkehed', 'masterkehed78@gmail.com', NULL, '$2b$10$jheQDUgpZtDe.Fn/F1MDJ.ZrTOuw7oXYBCVkVzu7Awpld88w7JBSW');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `email_verification`
--
ALTER TABLE `email_verification`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_token` (`token`),
  ADD KEY `fk_ev_user` (`user_id`);

--
-- Indexes for table `list_continue`
--
ALTER TABLE `list_continue`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `movies`
--
ALTER TABLE `movies`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `mylist`
--
ALTER TABLE `mylist`
  ADD PRIMARY KEY (`user_id`,`movie_id`),
  ADD KEY `fk_mylist_movie` (`movie_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `email_verification`
--
ALTER TABLE `email_verification`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `list_continue`
--
ALTER TABLE `list_continue`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `movies`
--
ALTER TABLE `movies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `email_verification`
--
ALTER TABLE `email_verification`
  ADD CONSTRAINT `fk_ev_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `mylist`
--
ALTER TABLE `mylist`
  ADD CONSTRAINT `fk_mylist_movie` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_mylist_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
