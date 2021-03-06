-- example sql file from lab 9
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


DROP TABLE IF EXISTS `featured_books`;
CREATE TABLE `featured_books` (
  `ISBN` bigint(13) NOT NULL,
  `title` varchar(40) COLLATE utf8_unicode_ci NOT NULL,
  `description` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `img` varchar(300) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;



INSERT INTO `featured_books` (`ISBN`, `title`, `description`, `img`) VALUES
(9780544115552, 'The Hobbit', 'A timeless classic, from the father of the high fantasy genre.', 'https://m.media-amazon.com/images/I/5187PQgDScL._SY346_.jpg'),
(9781781100486, 'Harry Potter and the Sorcerer''s Stone', 'The novel that started a generation of magic and adventure.', 'https://m.media-amazon.com/images/I/41lnLrvBnML.jpg'),
(9780441013593, 'Dune', 'A triumph of the imagination and one of the bestselling science fiction novels of all time.', 'https://i2.wp.com/www.tor.com/wp-content/uploads/2019/07/Dune-cover-1.jpg?type=vertical&ssl=1'),
(9781409077688, 'The Count of Monte Cristo', 'A dramatic tale of adventure, revenge, and romance', 'https://images-na.ssl-images-amazon.com/images/I/41jRw4Gj-lL._SX323_BO1,204,203,200_.jpg'),
(9788180320996, 'Ulysses','An undisputed modernist classic, which propelled James Joyce to international renown','https://s26162.pcdn.co/wp-content/uploads/2015/06/1922-first-edition-2.jpg'),
(9780393972832, 'Moby Dick','The story of a man whose obsession pits him against the vast ocean','https://www.mvtimes.com/mvt/uploads/2020/01/DSC_8865892.jpg'),
(9781101656952, 'Red Sorghum','The acclaimed novel of love and resistance during late 1930s China','https://images-na.ssl-images-amazon.com/images/I/71oaLmAfyuL.jpg'),
(9780803235830, 'Nadirs','A depiction of life and the violent, oppressive atmosphere of Romania in the mid-20th century.','https://images-na.ssl-images-amazon.com/images/I/71NPJjT6pyL.jpg'),
(9780802195449, 'A Personal Matter','One of the great short novels of the 20th century','https://images-na.ssl-images-amazon.com/images/I/41O4rD-kZFL.jpg'),
(9780307806772, 'The Dreams',' These stories telescope epic tales into tersely haunting miniatures','https://images-na.ssl-images-amazon.com/images/I/81Zlr-BQhVL.jpg'),
(9789389440379, 'The Sound and the Fury','Faulkner’s first major novel describes the decay and fall of a social order','https://covers.openlibrary.org/b/id/8292206-L.jpg'),
(9780345448163, 'The Mists of Avalon','A monumental reimagining of the Arthurian legends','https://m.media-amazon.com/images/I/41II-qq8gpL.jpg'),
(9780141192451, 'Treasure Island',"A mistress of the inn and her son find a treasure map that leads them to a pirate's fortune.",'https://thediaryoftheliteratureman.files.wordpress.com/2016/02/treasure-island.jpg?w=705'),
(9780141198965, 'Frankenstein',"Marie Shelley's Frankenstein gave birth to the modern science fiction novel.",'https://images-na.ssl-images-amazon.com/images/I/41dj%2BxC%2BzWL.jpg'),
(9781517453145, 'Tao Te Ching','The Tao Te Ching is fundamental to the Taoist school of Chinese philosophy','https://images-na.ssl-images-amazon.com/images/I/516YnkEJD2L._SX331_BO1,204,203,200_.jpg'),
(9780099511656, 'Beloved','A heartbreaking testimony to the ongoing ravages of slavery','https://www.penguin.co.uk/content/dam/prh/books/103/1032964/9780099511656.jpg.transform/PRHDesktopWide_small/image.jpg'),
(9780141439846, 'Dracula','A masterpiece of the horror genre, Dracula also probes identity, sanity','https://www.penguin.co.uk/content/dam/prh/books/556/55632/9780141439846.jpg.transform/PRHDesktopWide_small/image.jpg'),
(9780553213133, 'Anne of Green Gables', 'A classic in children’s literature and a heartwarming tale of love, friendship, and found families', 'https://images-na.ssl-images-amazon.com/images/I/51cS+FHLCJL._SX346_BO1,204,203,200_.jpg'), 
(9780143039433, 'The Grapes of Wrath', 'A realistic depiction of life during the Great Depression in the Dustbowl','https://images-na.ssl-images-amazon.com/images/I/51zdzn8cO3L._SX323_BO1,204,203,200_.jpg'), 
(9781101158104, 'Lord of the Flies', 'Devoid of adult supervision or rules, boys attempt to forge their own society, failing, however, in the face of terror, sin, and evil.', 'https://images-na.ssl-images-amazon.com/images/I/81WUAoL-wFL.jpg');
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
(9780544115552, 'Connor1', "Temporary Hobbit review for testing.", '2020-04-10 12:45:54', 0),
(9781781100486, 'Connor1', "Temporary Harry Potter review for testing.", '2020-04-10 12:45:54', 0),
(9780441013593, 'Connor1', "Temporary Dune review for testing.", '2020-04-10 12:45:54', 0),
(9781409077688, 'Connor2', "Temporary CoMC review for testing.", '2020-04-10 12:45:54', 0),
(9781409077688, 'Connor3', "Temporary CoMC review for testing.", '2020-04-10 12:45:54', 0),
(9781409077688, 'Connor4', "Temporary CoMC review for testing.", '2020-04-10 12:45:54', 0),
(9781409077688, 'Connor5', "Temporary CoMC review for testing.", '2020-04-10 12:45:54', 0),
(9781409077688, 'Connor6', "Temporary CoMC review for testing.", '2020-04-10 12:45:54', 0),
(9781409077688, 'Connor7', "Temporary CoMC review for testing.", '2020-04-10 12:45:54', 0),
(9781409077688, 'Connor8', "Temporary CoMC review for testing.", '2020-04-10 12:45:54', 0),
(9781409077688, 'Connor9', "Temporary CoMC review for testing.", '2020-04-10 12:45:54', 0),
(9781409077688, 'Cathy1', "Temporary CoMC review for testing.", '2020-04-10 12:45:54', 0),
(9781409077688, 'Cathy2', "Temporary CoMC review for testing.", '2020-04-10 12:45:54', 0),
(9781409077688, 'Cathy3', "Temporary CoMC review for testing.", '2020-04-10 12:45:54', 0),
(9781409077688, 'Cathy4', "Temporary CoMC review for testing.", '2020-04-10 12:45:54', 0),
(9781409077688, 'Cathy5', "Temporary CoMC review for testing.", '2020-04-10 12:45:54', 0),
(9781409077688, 'Cathy6', "Temporary CoMC review for testing.", '2020-04-10 12:45:54', 0),
(9781409077688, 'Cathy7', "Temporary CoMC review for testing.", '2020-04-10 12:45:54', 0),
(9781593278519, 'Cathy8', 'Lorem ipsum dolor sit amet, est ex wisi dicta oportere, pro cu duis luptatum. Per ea ullum ubique suscipit. Id affert disputando per, id odio vocent omittantur vix, erat illum aperiam mel et. Ei putant erroribus efficiendi cum, pri viris vulputate no, ludus munere ei cum. Munere doctus in eum.', '2020-04-10 10:05:54', 0),
(9781593278519, 'Cathy1', 'Lorem ipsum dolor sit amet, est ex wisi dicta oportere, pro cu duis luptatum. Per ea ullum ubique suscipit. Id affert disputando per, id odio vocent omittantur vix, erat illum aperiam mel et. Ei putant erroribus efficiendi cum, pri viris vulputate no, ludus munere ei cum. Munere doctus in eum.', '2020-04-16 07:25:54', 0);


DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `username` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `admin` BOOLEAN, 
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


INSERT INTO `users` (`username`, `password`) VALUES 
('Admin', 'Admin'),
('Cathy1', 'Cathy1'),
('Cathy2', 'Cathy1'),
('Cathy3', 'Cathy1'),
('Cathy4', 'Cathy1'),
('Cathy5', 'Cathy1'),
('Cathy6', 'Cathy1'),
('Cathy7', 'Cathy1'),
('Cathy8', 'Cathy1'),
('Cathy9', 'Cathy1'),
('Cathy10', 'Cathy1'),
('Connor1', 'Connor1'),
('Connor2', 'Connor1'),
('Connor3', 'Connor1'),
('Connor4', 'Connor1'),
('Connor5', 'Connor1'),
('Connor6', 'Connor1'),
('Connor7', 'Connor1'),
('Connor8', 'Connor1'),
('Connor9', 'Connor1');
COMMIT;