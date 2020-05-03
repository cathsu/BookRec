-- MySQL dump 10.13  Distrib 5.5.62, for Linux (x86_64)
--
-- Host: localhost    Database: bookrec_db
-- ------------------------------------------------------
-- Server version	5.5.62

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `featured_books`
--

DROP TABLE IF EXISTS `featured_books`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `featured_books` (
  `ISBN` bigint(13) NOT NULL,
  `title` varchar(40) COLLATE utf8_unicode_ci NOT NULL,
  `description` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `img` varchar(300) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `featured_books`
--

LOCK TABLES `featured_books` WRITE;
/*!40000 ALTER TABLE `featured_books` DISABLE KEYS */;
INSERT INTO `featured_books` VALUES (9780544115552,'The Hobbit','A timeless classic, from the father of the high fantasy genre.','https://m.media-amazon.com/images/I/5187PQgDScL._SY346_.jpg'),(9781781100486,'Harry Potter and the Sorcerer\'s Stone','The novel that started a generation of magic and adventure.','https://m.media-amazon.com/images/I/41lnLrvBnML.jpg'),(9780441013593,'Dune','A triumph of the imagination and one of the bestselling science fiction novels of all time.','https://i2.wp.com/www.tor.com/wp-content/uploads/2019/07/Dune-cover-1.jpg?type=vertical&ssl=1'),(9781409077688,'The Count of Monte Cristo','A dramatic tale of adventure, revenge, and romance','https://images-na.ssl-images-amazon.com/images/I/41jRw4Gj-lL._SX323_BO1,204,203,200_.jpg'),(9788180320996,'Ulysses','An undisputed modernist classic, which propelled James Joyce to international renown','https://s26162.pcdn.co/wp-content/uploads/2015/06/1922-first-edition-2.jpg'),(9780393972832,'Moby Dick','The story of a man whose obsession pits him against the vast ocean','https://www.mvtimes.com/mvt/uploads/2020/01/DSC_8865892.jpg'),(9781101656952,'Red Sorghum','The acclaimed novel of love and resistance during late 1930s China','https://images-na.ssl-images-amazon.com/images/I/71oaLmAfyuL.jpg'),(9780803235830,'Nadirs','A depiction of life and the violent, oppressive atmosphere of Romania in the mid-20th century.','https://images-na.ssl-images-amazon.com/images/I/71NPJjT6pyL.jpg'),(9780802195449,'A Personal Matter','One of the great short novels of the 20th century','https://images-na.ssl-images-amazon.com/images/I/41O4rD-kZFL.jpg'),(9780307806772,'The Dreams',' These stories telescope epic tales into tersely haunting miniatures','https://images-na.ssl-images-amazon.com/images/I/81Zlr-BQhVL.jpg'),(9789389440379,'The Sound and the Fury','Faulkner’s first major novel describes the decay and fall of a social order','https://covers.openlibrary.org/b/id/8292206-L.jpg'),(9780345448163,'The Mists of Avalon','A monumental reimagining of the Arthurian legends','https://m.media-amazon.com/images/I/41II-qq8gpL.jpg'),(9780141192451,'Treasure Island','A mistress of the inn and her son find a treasure map that leads them to a pirate\'s fortune.','https://thediaryoftheliteratureman.files.wordpress.com/2016/02/treasure-island.jpg?w=705'),(9780141198965,'Frankenstein','Marie Shelley\'s Frankenstein gave birth to the modern science fiction novel.','https://images-na.ssl-images-amazon.com/images/I/41dj%2BxC%2BzWL.jpg'),(9781517453145,'Tao Te Ching','The Tao Te Ching is fundamental to the Taoist school of Chinese philosophy','https://images-na.ssl-images-amazon.com/images/I/516YnkEJD2L._SX331_BO1,204,203,200_.jpg'),(9780099511656,'Beloved','A heartbreaking testimony to the ongoing ravages of slavery','https://www.penguin.co.uk/content/dam/prh/books/103/1032964/9780099511656.jpg.transform/PRHDesktopWide_small/image.jpg'),(9780141439846,'Dracula','A masterpiece of the horror genre, Dracula also probes identity, sanity','https://www.penguin.co.uk/content/dam/prh/books/556/55632/9780141439846.jpg.transform/PRHDesktopWide_small/image.jpg'),(9780553213133,'Anne of Green Gables','A classic in children’s literature and a heartwarming tale of love, friendship, and found families','https://images-na.ssl-images-amazon.com/images/I/51cS+FHLCJL._SX346_BO1,204,203,200_.jpg'),(9780143039433,'The Grapes of Wrath','A realistic depiction of life during the Great Depression in the Dustbowl','https://images-na.ssl-images-amazon.com/images/I/51zdzn8cO3L._SX323_BO1,204,203,200_.jpg'),(9781101158104,'Lord of the Flies','Devoid of adult supervision or rules, boys attempt to forge their own society, failing, however, in the face of terror, sin, and evil.','https://images-na.ssl-images-amazon.com/images/I/81WUAoL-wFL.jpg');
/*!40000 ALTER TABLE `featured_books` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reviews` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `ISBN` bigint(13) NOT NULL,
  `username` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `review` varchar(500) COLLATE utf8_unicode_ci NOT NULL,
  `date` datetime NOT NULL,
  `edit` int(11) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (1,9780544115552,'Connor1','Temporary Hobbit review for testing.','2020-04-10 12:45:54',0),(2,9781781100486,'Connor1','Temporary Harry Potter review for testing.','2020-04-10 12:45:54',0),(3,9780441013593,'Connor1','Temporary Dune review for testing.','2020-04-10 12:45:54',0),(4,9781409077688,'Connor2','Temporary CoMC review for testing.','2020-04-10 12:45:54',0),(5,9781409077688,'Connor3','Temporary CoMC review for testing.','2020-04-10 12:45:54',0),(6,9781409077688,'Connor4','Temporary CoMC review for testing.','2020-04-10 12:45:54',0),(7,9781409077688,'Connor5','Temporary CoMC review for testing.','2020-04-10 12:45:54',0),(8,9781409077688,'Connor6','Temporary CoMC review for testing.','2020-04-10 12:45:54',0),(9,9781409077688,'Connor7','Temporary CoMC review for testing.','2020-04-10 12:45:54',0),(10,9781409077688,'Connor8','Temporary CoMC review for testing.','2020-04-10 12:45:54',0),(11,9781409077688,'Connor9','Temporary CoMC review for testing.','2020-04-10 12:45:54',0),(12,9781409077688,'Cathy1','Temporary CoMC review for testing.','2020-04-10 12:45:54',0),(13,9781409077688,'Cathy2','Temporary CoMC review for testing.','2020-04-10 12:45:54',0),(14,9781409077688,'Cathy3','Temporary CoMC review for testing.','2020-04-10 12:45:54',0),(15,9781409077688,'Cathy4','Temporary CoMC review for testing.','2020-04-10 12:45:54',0),(16,9781409077688,'Cathy5','Temporary CoMC review for testing.','2020-04-10 12:45:54',0),(17,9781409077688,'Cathy6','Temporary CoMC review for testing.','2020-04-10 12:45:54',0),(18,9781409077688,'Cathy7','Temporary CoMC review for testing.','2020-04-10 12:45:54',0),(19,9781593278519,'Cathy8','Lorem ipsum dolor sit amet, est ex wisi dicta oportere, pro cu duis luptatum. Per ea ullum ubique suscipit. Id affert disputando per, id odio vocent omittantur vix, erat illum aperiam mel et. Ei putant erroribus efficiendi cum, pri viris vulputate no, ludus munere ei cum. Munere doctus in eum.','2020-04-10 10:05:54',0),(20,9781593278519,'Cathy1','Lorem ipsum dolor sit amet, est ex wisi dicta oportere, pro cu duis luptatum. Per ea ullum ubique suscipit. Id affert disputando per, id odio vocent omittantur vix, erat illum aperiam mel et. Ei putant erroribus efficiendi cum, pri viris vulputate no, ludus munere ei cum. Munere doctus in eum.','2020-04-16 07:25:54',0);
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `username` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `admin` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('Admin','Admin',NULL),('Cathy1','Cathy1',NULL),('Cathy10','Cathy1',NULL),('Cathy2','Cathy1',NULL),('Cathy3','Cathy1',NULL),('Cathy4','Cathy1',NULL),('Cathy5','Cathy1',NULL),('Cathy6','Cathy1',NULL),('Cathy7','Cathy1',NULL),('Cathy8','Cathy1',NULL),('Cathy9','Cathy1',NULL),('Connor1','Connor1',NULL),('Connor2','Connor1',NULL),('Connor3','Connor1',NULL),('Connor4','Connor1',NULL),('Connor5','Connor1',NULL),('Connor6','Connor1',NULL),('Connor7','Connor1',NULL),('Connor8','Connor1',NULL),('Connor9','Connor1',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-05-03 23:43:01
