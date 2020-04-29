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
  `date` datetime NOT NULL,
  `edit` int NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


INSERT INTO `reviews` (`ISBN`, `username`, `review`, `date`, `edit`) VALUES
(9780544115552, 'connor', "Temporary Hobbit review for testing.", '2020-04-10 12:45:54', 0),
(9781781100486, 'connor', "Temporary Harry Potter review for testing.", '2020-04-10 12:45:54', 0),
(9780441013593, 'connor', "Temporary Dune review for testing.", '2020-04-10 12:45:54', 0),
(9780375760303, 'connor', "Temporary CoMC review for testing.", '2020-04-10 12:45:54', 0),
(9781593278519, 'cathy', 'Lorem ipsum dolor sit amet, est ex wisi dicta oportere, pro cu duis luptatum. Per ea ullum ubique suscipit. Id affert disputando per, id odio vocent omittantur vix, erat illum aperiam mel et. Ei putant erroribus efficiendi cum, pri viris vulputate no, ludus munere ei cum. Munere doctus in eum.', '2020-04-10 10:05:54', 0),
(9781593278519, 'connor', 'Lorem ipsum dolor sit amet, est ex wisi dicta oportere, pro cu duis luptatum. Per ea ullum ubique suscipit. Id affert disputando per, id odio vocent omittantur vix, erat illum aperiam mel et. Ei putant erroribus efficiendi cum, pri viris vulputate no, ludus munere ei cum. Munere doctus in eum.', '2020-04-28 09:45:09', 0),
(9781593278519, 'admin', 'Lorem ipsum dolor sit amet, est ex wisi dicta oportere, pro cu duis luptatum. Per ea ullum ubique suscipit. Id affert disputando per, id odio vocent omittantur vix, erat illum aperiam mel et. Ei putant erroribus efficiendi cum, pri viris vulputate no, ludus munere ei cum. Munere doctus in eum.', '2020-04-16 07:25:54', 0);


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
