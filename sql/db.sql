-- example sql file from lab 9
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


DROP TABLE IF EXISTS `featured_books`;
CREATE TABLE `featured_books` (
  `ISBN` bigint(13) NOT NULL,
  `title` varchar(40) COLLATE utf8_unicode_ci NOT NULL,
  `description` varchar(100) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;



INSERT INTO `featured_books` (`ISBN`, `title`, `description`) VALUES
(9780544115552, 'The Hobbit', 'A timeless classic, from the father of the high fantasy genre.'),
(9781781100486, 'Harry Potter and the Sorcerer''s Stone', 'The novel that started a generation of magic and adventure.'),
(9780441013593, 'Dune', 'A triumph of the imagination and one of the bestselling science fiction novels of all time.'),
(9780375760303, 'The Count of Monte Cristo', 'A dramatic tale of adventure, revenge, and romance');


DROP TABLE IF EXISTS `reviews`;

CREATE TABLE `reviews` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `ISBN` bigint(13) NOT NULL,
  `username` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `review` varchar(500) COLLATE utf8_unicode_ci NOT NULL,
  `date` date NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


INSERT INTO `reviews` (`ISBN`, `username`, `review`, `date`) VALUES
(9780544115552, 'Connor', "Temporary Hobbit review for testing.", '20-04-14'),
(9781781100486, 'Connor', "Temporary Harry Potter review for testing.", '20-04-14'),
(9780441013593, 'Connor', "Temporary Dune review for testing.", '20-04-14'),
(9780375760303, 'Connor', "Temporary CoMC review for testing.", '20-04-14');


DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `username` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


INSERT INTO `users` (`username`, `password`) VALUES
('connor', 'connor'),
('cathy', 'cathy'),
('admin', 'admin');

COMMIT;
