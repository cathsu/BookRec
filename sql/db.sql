-- example sql file from lab 9
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


DROP TABLE IF EXISTS `featured_books`;
CREATE TABLE `featured_books` (
  `ISBN` bigint(13) NOT NULL,
  `title` varchar(40) COLLATE utf8_unicode_ci NOT NULL,
  `description` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `img` varchar(100) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;



INSERT INTO `featured_books` (`ISBN`, `title`, `description`, `img`) VALUES
(9780544115552, 'The Hobbit', 'A timeless classic, from the father of the high fantasy genre.', 'https://m.media-amazon.com/images/I/5187PQgDScL._SY346_.jpg'),
(9781781100486, 'Harry Potter and the Sorcerer''s Stone', 'The novel that started a generation of magic and adventure.', 'https://m.media-amazon.com/images/I/41lnLrvBnML.jpg'),
(9780441013593, 'Dune', 'A triumph of the imagination and one of the bestselling science fiction novels of all time.', 'https://i2.wp.com/www.tor.com/wp-content/uploads/2019/07/Dune-cover-1.jpg?type=vertical&ssl=1'),
(9781409077688, 'The Count of Monte Cristo', 'A dramatic tale of adventure, revenge, and romance', 'https://images-na.ssl-images-amazon.com/images/I/41jRw4Gj-lL._SX323_BO1,204,203,200_.jpg');


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
(9780544115552, 'Connor', "Temporary Hobbit review for testing.", '2020-04-10 12:45:54', 0),
(9781781100486, 'Connor', "Temporary Harry Potter review for testing.", '2020-04-10 12:45:54', 0),
(9780441013593, 'Connor', "Temporary Dune review for testing.", '2020-04-10 12:45:54', 0),
(9780375760303, 'Connor', "Temporary CoMC review for testing.", '2020-04-10 12:45:54', 0),
(9781593278519, 'Connor', 'Lorem ipsum dolor sit amet, est ex wisi dicta oportere, pro cu duis luptatum. Per ea ullum ubique suscipit. Id affert disputando per, id odio vocent omittantur vix, erat illum aperiam mel et. Ei putant erroribus efficiendi cum, pri viris vulputate no, ludus munere ei cum. Munere doctus in eum.', '2020-04-10 10:05:54', 0),
(9781593278519, 'Admin', 'Lorem ipsum dolor sit amet, est ex wisi dicta oportere, pro cu duis luptatum. Per ea ullum ubique suscipit. Id affert disputando per, id odio vocent omittantur vix, erat illum aperiam mel et. Ei putant erroribus efficiendi cum, pri viris vulputate no, ludus munere ei cum. Munere doctus in eum.', '2020-04-28 09:45:09', 0),
(9781593278519, 'Cathy', 'Lorem ipsum dolor sit amet, est ex wisi dicta oportere, pro cu duis luptatum. Per ea ullum ubique suscipit. Id affert disputando per, id odio vocent omittantur vix, erat illum aperiam mel et. Ei putant erroribus efficiendi cum, pri viris vulputate no, ludus munere ei cum. Munere doctus in eum.', '2020-04-16 07:25:54', 0);


DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `username` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `admin` BOOLEAN, 
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


INSERT INTO `users` (`username`, `password`, `admin`) VALUES 
('Admin', 'Admin', 1),
('Cathy1', 'Cathy1', 1),
('Cathy2', 'Cathy1', 1),
('Cathy3', 'Cathy1', 1),
('Cathy4', 'Cathy1', 1),
('Cathy5', 'Cathy1', 1),
('Cathy6', 'Cathy1', 1),
('Cathy7', 'Cathy1', 1),
('Cathy8', 'Cathy1', 1),
('Cathy9', 'Cathy1', 1),
('Cathy10', 'Cathy1', 1),
('Connor1', 'Connor1', 1),
('Connor2', 'Connor1', 1),
('Connor3', 'Connor1', 1),
('Connor4', 'Connor1', 1),
('Connor5', 'Connor1', 1),
('Connor6', 'Connor1', 1),
('Connor7', 'Connor1', 1),
('Connor8', 'Connor1', 1),
('Connor9', 'Connor1', 1);
COMMIT;