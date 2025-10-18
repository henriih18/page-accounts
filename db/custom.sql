--
-- Table structure for table `CreditRecharge`
--

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `CreditRecharge`;
CREATE TABLE `CreditRecharge` (
    `id` VARCHAR(255) NOT NULL PRIMARY KEY,
    `userId` VARCHAR(255) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `method` VARCHAR(255) NOT NULL,
    `reference` VARCHAR(255),
    `status` VARCHAR(255) NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME NOT NULL,
    CONSTRAINT `CreditRecharge_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;;

--
-- Dumping data for table `CreditRecharge`
--

INSERT INTO `CreditRecharge` (id, userId, amount, method, reference, status, createdAt, updatedAt) VALUES ('cmgtoy17d0001pefn5dfsmvan', 'cmgtosoe90000pe3p1r57c838', 5000.0, 'Administración', '', 'COMPLETED', 1760635545242, 1760635545242);

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
CREATE TABLE `User` (
    `id` VARCHAR(255) NOT NULL PRIMARY KEY,
    `email` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255),
    `role` VARCHAR(255) NOT NULL DEFAULT 'USER',
    `avatar` VARCHAR(255),
    `phone` VARCHAR(255),
    `credits` DOUBLE NOT NULL DEFAULT 0,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME NOT NULL
, `password` VARCHAR(255)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;;

--
-- Dumping data for table `User`
--

INSERT INTO `User` (id, email, name, role, avatar, phone, credits, createdAt, updatedAt, password) VALUES ('cmgtlp5hy0006pe5ojpue3kr3', 'admin@streamhub.com', 'Administrador', 'ADMIN', NULL, NULL, 1000.0, 1760630092055, 1760641927375, '$2b$10$O5T386gnap/RGm/Wzohk0eAa5SfMqos99IneCBipastrmVmVcMNzS');
INSERT INTO `User` (id, email, name, role, avatar, phone, credits, createdAt, updatedAt, password) VALUES ('cmgtosoe90000pe3p1r57c838', 'hernandezhenry58@gmail.com', 'henry', 'USER', NULL, NULL, 5000.0, 1760635295361, 1760635545244, '$2b$10$3.OXPsu9tjBMgrlLJjwNWeiUMcWW2UXcz7NrPPQfO8m8/0npvl6fu');
INSERT INTO `User` (id, email, name, role, avatar, phone, credits, createdAt, updatedAt, password) VALUES ('cmgtovj7i0001ped8vnbwy7fi', 'user@streamhub.com', 'Usuario', 'USER', NULL, NULL, 100.0, 1760635428606, 1760641927367, '$2b$10$CbyYtIR0iaqmkSM6IuIYReMMPjAXOM4NHzLWlNh/3H0qQe.JoCADO');
INSERT INTO `User` (id, email, name, role, avatar, phone, credits, createdAt, updatedAt, password) VALUES ('cmgtovj7k0002ped8rapo3bpj', 'demo@streamhub.com', 'Demo User', 'USER', NULL, NULL, 50.0, 1760635428609, 1760641927371, NULL);

--
-- Table structure for table `StreamingType`
--

DROP TABLE IF EXISTS `StreamingType`;
CREATE TABLE `StreamingType` (
    `id` VARCHAR(255) NOT NULL PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255),
    `icon` VARCHAR(255),
    `color` VARCHAR(255),
    `active` TINYINT(1) NOT NULL DEFAULT true,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;;

--
-- Dumping data for table `StreamingType`
--

INSERT INTO `StreamingType` (id, name, description, icon, color, active, createdAt, updatedAt) VALUES ('cmgtrtavd0000pe07xmhwelds', 'Netflix', 'Streaming de películas y series', '🎬', '#E50914', 1, 1760640363338, 1760641374209);
INSERT INTO `StreamingType` (id, name, description, icon, color, active, createdAt, updatedAt) VALUES ('cmgtrtavk0001pe07v8qwqc4w', 'Disney+', 'Contenido Disney, Pixar, Marvel, Star Wars', '🏰', '#113CCF', 1, 1760640363344, 1760641374210);
INSERT INTO `StreamingType` (id, name, description, icon, color, active, createdAt, updatedAt) VALUES ('cmgtrtavl0002pe07y47dzuxv', 'HBO Max', 'Series HBO, películas Warner Bros', '🎭', '#B535F6', 1, 1760640363346, 1760641374211);
INSERT INTO `StreamingType` (id, name, description, icon, color, active, createdAt, updatedAt) VALUES ('cmgtrtavm0003pe07mna5qm73', 'Amazon Prime', 'Streaming de Amazon con contenido variado', '📦', '#00A8E1', 1, 1760640363347, 1760641374212);
INSERT INTO `StreamingType` (id, name, description, icon, color, active, createdAt, updatedAt) VALUES ('cmgtrtavo0004pe07gusv7bau', 'Paramount+', 'Contenido Paramount, CBS, Nickelodeon', '⭐', '#0064FF', 1, 1760640363348, 1760641374213);
INSERT INTO `StreamingType` (id, name, description, icon, color, active, createdAt, updatedAt) VALUES ('cmgtrtavp0005pe076fhfsusg', 'Apple TV+', 'Contenido original de Apple', '🍎', '#000000', 1, 1760640363349, 1760641374214);
INSERT INTO `StreamingType` (id, name, description, icon, color, active, createdAt, updatedAt) VALUES ('cmgtrtavq0006pe0788f37czs', 'Star+', 'Contenido deportivo y entretenimiento', '⚡', '#0063E5', 1, 1760640363350, 1760641374215);

--
-- Table structure for table `AccountProfile`
--

DROP TABLE IF EXISTS `AccountProfile`;
CREATE TABLE `AccountProfile` (
    `id` VARCHAR(255) NOT NULL PRIMARY KEY,
    `streamingAccountId` VARCHAR(255) NOT NULL,
    `profileName` VARCHAR(255) NOT NULL,
    `profilePin` VARCHAR(255),
    `isAvailable` TINYINT(1) NOT NULL DEFAULT true,
    `soldToUserId` VARCHAR(255),
    `soldAt` DATETIME,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME NOT NULL,
    CONSTRAINT `AccountProfile_streamingAccountId_fkey` FOREIGN KEY (`streamingAccountId`) REFERENCES `StreamingAccount` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `AccountProfile_soldToUserId_fkey` FOREIGN KEY (`soldToUserId`) REFERENCES `User` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;;

--
-- Dumping data for table `AccountProfile`
--

INSERT INTO `AccountProfile` (id, streamingAccountId, profileName, profilePin, isAvailable, soldToUserId, soldAt, createdAt, updatedAt) VALUES ('cmgtrug630001pe6nox4zjjtg', 'netflix-premium', 'Usuario 1', '1234', 1, NULL, NULL, 1760640416860, 1760640416860);
INSERT INTO `AccountProfile` (id, streamingAccountId, profileName, profilePin, isAvailable, soldToUserId, soldAt, createdAt, updatedAt) VALUES ('cmgtrug6q0003pe6nc6am78pj', 'netflix-premium', 'Usuario 2', '5678', 1, NULL, NULL, 1760640416882, 1760640416882);
INSERT INTO `AccountProfile` (id, streamingAccountId, profileName, profilePin, isAvailable, soldToUserId, soldAt, createdAt, updatedAt) VALUES ('cmgtrug6r0005pe6n59awr2fk', 'netflix-premium', 'Usuario 3', '9012', 1, NULL, NULL, 1760640416884, 1760640416884);
INSERT INTO `AccountProfile` (id, streamingAccountId, profileName, profilePin, isAvailable, soldToUserId, soldAt, createdAt, updatedAt) VALUES ('cmgtrug6s0007pe6n03bhns1p', 'netflix-premium', 'Niños', '3456', 1, NULL, NULL, 1760640416885, 1760640416885);
INSERT INTO `AccountProfile` (id, streamingAccountId, profileName, profilePin, isAvailable, soldToUserId, soldAt, createdAt, updatedAt) VALUES ('cmgtrug6u0009pe6nx95u761x', 'disney-plus-premium', 'Adulto 1', '1111', 1, NULL, NULL, 1760640416886, 1760640416886);
INSERT INTO `AccountProfile` (id, streamingAccountId, profileName, profilePin, isAvailable, soldToUserId, soldAt, createdAt, updatedAt) VALUES ('cmgtrug6v000bpe6n8x99qbgu', 'disney-plus-premium', 'Adulto 2', '2222', 1, NULL, NULL, 1760640416887, 1760640416887);
INSERT INTO `AccountProfile` (id, streamingAccountId, profileName, profilePin, isAvailable, soldToUserId, soldAt, createdAt, updatedAt) VALUES ('cmgtrug6w000dpe6nvzmkhpdb', 'disney-plus-premium', 'Niños', '3333', 1, NULL, NULL, 1760640416888, 1760640416888);
INSERT INTO `AccountProfile` (id, streamingAccountId, profileName, profilePin, isAvailable, soldToUserId, soldAt, createdAt, updatedAt) VALUES ('cmgtrug6x000fpe6n4f86ynqo', 'hbo-max', 'Principal', '4444', 1, NULL, NULL, 1760640416890, 1760640416890);
INSERT INTO `AccountProfile` (id, streamingAccountId, profileName, profilePin, isAvailable, soldToUserId, soldAt, createdAt, updatedAt) VALUES ('cmgtrug6z000hpe6nalnw99u1', 'hbo-max', 'Secundario', '5555', 1, NULL, NULL, 1760640416891, 1760640416891);
INSERT INTO `AccountProfile` (id, streamingAccountId, profileName, profilePin, isAvailable, soldToUserId, soldAt, createdAt, updatedAt) VALUES ('cmgtrug70000jpe6ngg8ye7tr', 'hbo-max', 'Invitado', NULL, 1, NULL, NULL, 1760640416892, 1760640416892);
INSERT INTO `AccountProfile` (id, streamingAccountId, profileName, profilePin, isAvailable, soldToUserId, soldAt, createdAt, updatedAt) VALUES ('cmgtrug71000lpe6num5lq98x', 'amazon-prime-video', 'Usuario Principal', '6666', 1, NULL, NULL, 1760640416893, 1760640416893);
INSERT INTO `AccountProfile` (id, streamingAccountId, profileName, profilePin, isAvailable, soldToUserId, soldAt, createdAt, updatedAt) VALUES ('cmgtrug72000npe6n4zo09iur', 'amazon-prime-video', 'Usuario Secundario', '7777', 1, NULL, NULL, 1760640416894, 1760640416894);
INSERT INTO `AccountProfile` (id, streamingAccountId, profileName, profilePin, isAvailable, soldToUserId, soldAt, createdAt, updatedAt) VALUES ('cmgtrug73000ppe6nxrrl25mt', 'paramount-plus', 'Adulto', '8888', 1, NULL, NULL, 1760640416895, 1760640416895);
INSERT INTO `AccountProfile` (id, streamingAccountId, profileName, profilePin, isAvailable, soldToUserId, soldAt, createdAt, updatedAt) VALUES ('cmgtrug77000rpe6nuogw9odm', 'paramount-plus', 'Niño', '9999', 1, NULL, NULL, 1760640416899, 1760640416899);
INSERT INTO `AccountProfile` (id, streamingAccountId, profileName, profilePin, isAvailable, soldToUserId, soldAt, createdAt, updatedAt) VALUES ('cmgtrug79000tpe6no0rmtycp', 'apple-tv-plus', 'Usuario 1', NULL, 1, NULL, NULL, 1760640416902, 1760640416902);
INSERT INTO `AccountProfile` (id, streamingAccountId, profileName, profilePin, isAvailable, soldToUserId, soldAt, createdAt, updatedAt) VALUES ('cmgtrug7a000vpe6n2sx0c77d', 'apple-tv-plus', 'Usuario 2', NULL, 1, NULL, NULL, 1760640416903, 1760640416903);

--
-- Table structure for table `Cart`
--

DROP TABLE IF EXISTS `Cart`;
CREATE TABLE `Cart` (
    `id` VARCHAR(255) NOT NULL PRIMARY KEY,
    `userId` VARCHAR(255) NOT NULL,
    `totalAmount` DOUBLE NOT NULL DEFAULT 0,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME NOT NULL,
    CONSTRAINT `Cart_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;;

--
-- Dumping data for table `Cart`
--

INSERT INTO `Cart` (id, userId, totalAmount, createdAt, updatedAt) VALUES ('cmgts29mf0001pe21mnjsyomm', 'cmgtosoe90000pe3p1r57c838', 67.37, 1760640781623, 1760641514237);

--
-- Table structure for table `CartItem`
--

DROP TABLE IF EXISTS `CartItem`;
CREATE TABLE `CartItem` (
    `id` VARCHAR(255) NOT NULL PRIMARY KEY,
    `cartId` VARCHAR(255) NOT NULL,
    `streamingAccountId` VARCHAR(255) NOT NULL,
    `quantity` INT NOT NULL DEFAULT 1,
    `saleType` VARCHAR(255) NOT NULL DEFAULT 'FULL',
    `priceAtTime` DOUBLE NOT NULL,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME NOT NULL,
    CONSTRAINT `CartItem_cartId_fkey` FOREIGN KEY (`cartId`) REFERENCES `Cart` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `CartItem_streamingAccountId_fkey` FOREIGN KEY (`streamingAccountId`) REFERENCES `StreamingAccount` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;;

--
-- Dumping data for table `CartItem`
--

INSERT INTO `CartItem` (id, cartId, streamingAccountId, quantity, saleType, priceAtTime, createdAt, updatedAt) VALUES ('cmgts29mi0003pe213teq1ljh', 'cmgts29mf0001pe21mnjsyomm', 'paramount-plus', 4, 'FULL', 4.49, 1760640781626, 1760641430323);
INSERT INTO `CartItem` (id, cartId, streamingAccountId, quantity, saleType, priceAtTime, createdAt, updatedAt) VALUES ('cmgtsd2hh0001pekgeeuhgiwa', 'cmgts29mf0001pe21mnjsyomm', 'apple-tv-plus', 9, 'FULL', 5.49, 1760641285589, 1760641514235);

--
-- Table structure for table `Order`
--

DROP TABLE IF EXISTS `Order`;
CREATE TABLE `Order` (
    `id` VARCHAR(255) NOT NULL PRIMARY KEY,
    `userId` VARCHAR(255) NOT NULL,
    `streamingAccountId` VARCHAR(255) NOT NULL,
    `accountEmail` VARCHAR(255) NOT NULL,
    `accountPassword` VARCHAR(255) NOT NULL,
    `profileName` VARCHAR(255),
    `saleType` VARCHAR(255) NOT NULL DEFAULT 'FULL',
    `quantity` INT NOT NULL DEFAULT 1,
    `status` VARCHAR(255) NOT NULL DEFAULT 'PENDING',
    `totalPrice` DOUBLE NOT NULL,
    `expiresAt` DATETIME NOT NULL,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME NOT NULL,
    CONSTRAINT `Order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `Order_streamingAccountId_fkey` FOREIGN KEY (`streamingAccountId`) REFERENCES `StreamingAccount` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;;

--
-- Table structure for table `StreamingAccount`
--

DROP TABLE IF EXISTS `StreamingAccount`;
CREATE TABLE `StreamingAccount` (
    `id` VARCHAR(255) NOT NULL PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `price` DOUBLE NOT NULL,
    `type` VARCHAR(255) NOT NULL,
    `duration` VARCHAR(255) NOT NULL,
    `quality` VARCHAR(255) NOT NULL,
    `screens` INT NOT NULL,
    `active` TINYINT(1) NOT NULL DEFAULT true,
    `image` VARCHAR(255),
    `saleType` VARCHAR(255) NOT NULL DEFAULT 'FULL',
    `maxProfiles` INT,
    `pricePerProfile` DOUBLE,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME NOT NULL,
    CONSTRAINT `StreamingAccount_type_fkey` FOREIGN KEY (`type`) REFERENCES `StreamingType` (`name`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;;

--
-- Dumping data for table `StreamingAccount`
--

INSERT INTO `StreamingAccount` (id, name, description, price, type, duration, quality, screens, active, image, saleType, maxProfiles, pricePerProfile, createdAt, updatedAt) VALUES ('cmgtlp5hr0000pe5oaa1k1pys', 'Netflix Premium', 'Acceso completo a Netflix con calidad 4K y 4 pantallas simultáneas', 9.99, 'Netflix', '1 mes', '4K UHD', 4, 1, 'netflix', 'FULL', NULL, NULL, 1760630092048, 1760630092048);
INSERT INTO `StreamingAccount` (id, name, description, price, type, duration, quality, screens, active, image, saleType, maxProfiles, pricePerProfile, createdAt, updatedAt) VALUES ('cmgtlp5ht0001pe5os427m34r', 'Disney+ Premium', 'Todo el contenido de Disney, Pixar, Marvel, Star Wars y National Geographic', 7.99, 'Disney+', '1 mes', '4K UHD', 4, 1, 'disney', 'FULL', NULL, NULL, 1760630092049, 1760630092049);
INSERT INTO `StreamingAccount` (id, name, description, price, type, duration, quality, screens, active, image, saleType, maxProfiles, pricePerProfile, createdAt, updatedAt) VALUES ('cmgtlp5hu0002pe5oe0klghi9', 'HBO Max', 'Acceso a todo el contenido de HBO, Warner Bros y mucho más', 8.99, 'HBO Max', '1 mes', '4K UHD', 3, 1, 'hbo', 'FULL', NULL, NULL, 1760630092050, 1760630092050);
INSERT INTO `StreamingAccount` (id, name, description, price, type, duration, quality, screens, active, image, saleType, maxProfiles, pricePerProfile, createdAt, updatedAt) VALUES ('cmgtlp5hv0003pe5osrvg62va', 'Amazon Prime Video', 'Miles de películas, series y contenido exclusivo de Amazon', 5.99, 'Prime Video', '1 mes', '4K UHD', 3, 1, 'amazon', 'FULL', NULL, NULL, 1760630092051, 1760630092051);
INSERT INTO `StreamingAccount` (id, name, description, price, type, duration, quality, screens, active, image, saleType, maxProfiles, pricePerProfile, createdAt, updatedAt) VALUES ('cmgtlp5hw0004pe5ow46mspyv', 'Spotify Premium', 'Música sin anuncios y descargas ilimitadas', 4.99, 'Spotify', '1 mes', '320kbps', 1, 1, 'spotify', 'FULL', NULL, NULL, 1760630092052, 1760630092052);
INSERT INTO `StreamingAccount` (id, name, description, price, type, duration, quality, screens, active, image, saleType, maxProfiles, pricePerProfile, createdAt, updatedAt) VALUES ('cmgtlp5hw0005pe5o031aj2x5', 'YouTube Premium', 'YouTube sin anuncios y reproducción en segundo plano', 6.99, 'YouTube', '1 mes', '1080p', 1, 1, 'youtube', 'FULL', NULL, NULL, 1760630092053, 1760630092053);
INSERT INTO `StreamingAccount` (id, name, description, price, type, duration, quality, screens, active, image, saleType, maxProfiles, pricePerProfile, createdAt, updatedAt) VALUES ('netflix-premium', 'Netflix Premium', 'Cuenta premium de Netflix con acceso a todo el catálogo', 5.99, 'Netflix', 'mes', '4K', 4, 1, NULL, 'FULL', NULL, NULL, 1760640363567, 1760641374408);
INSERT INTO `StreamingAccount` (id, name, description, price, type, duration, quality, screens, active, image, saleType, maxProfiles, pricePerProfile, createdAt, updatedAt) VALUES ('disney-plus-premium', 'Disney+ Premium', 'Cuenta premium de Disney+ con todo el contenido', 4.99, 'Disney+', 'mes', '4K', 4, 1, NULL, 'FULL', NULL, NULL, 1760640363569, 1760641374410);
INSERT INTO `StreamingAccount` (id, name, description, price, type, duration, quality, screens, active, image, saleType, maxProfiles, pricePerProfile, createdAt, updatedAt) VALUES ('hbo-max', 'HBO Max', 'Cuenta de HBO Max con series y películas exclusivas', 6.99, 'HBO Max', 'mes', '4K', 3, 1, NULL, 'FULL', NULL, NULL, 1760640363570, 1760641374411);
INSERT INTO `StreamingAccount` (id, name, description, price, type, duration, quality, screens, active, image, saleType, maxProfiles, pricePerProfile, createdAt, updatedAt) VALUES ('amazon-prime-video', 'Amazon Prime Video', 'Cuenta de Amazon Prime con beneficios adicionales', 3.99, 'Amazon Prime', 'mes', '4K', 3, 1, NULL, 'FULL', NULL, NULL, 1760640363572, 1760641374412);
INSERT INTO `StreamingAccount` (id, name, description, price, type, duration, quality, screens, active, image, saleType, maxProfiles, pricePerProfile, createdAt, updatedAt) VALUES ('paramount-plus', 'Paramount+', 'Cuenta de Paramount+ con contenido exclusivo', 4.49, 'Paramount+', 'mes', 'HD', 3, 1, NULL, 'FULL', NULL, NULL, 1760640363573, 1760641374413);
INSERT INTO `StreamingAccount` (id, name, description, price, type, duration, quality, screens, active, image, saleType, maxProfiles, pricePerProfile, createdAt, updatedAt) VALUES ('apple-tv-plus', 'Apple TV+', 'Cuenta de Apple TV+ con contenido original', 5.49, 'Apple TV+', 'mes', '4K', 6, 1, NULL, 'FULL', NULL, NULL, 1760640363574, 1760641374414);

--
-- Table structure for table `Account`
--

DROP TABLE IF EXISTS `Account`;
CREATE TABLE `Account` (
    `id` VARCHAR(255) NOT NULL PRIMARY KEY,
    `userId` VARCHAR(255) NOT NULL,
    `type` VARCHAR(255) NOT NULL,
    `provider` VARCHAR(255) NOT NULL,
    `providerAccountId` VARCHAR(255) NOT NULL,
    `refresh_token` VARCHAR(255),
    `access_token` VARCHAR(255),
    `expires_at` INT,
    `token_type` VARCHAR(255),
    `scope` VARCHAR(255),
    `id_token` VARCHAR(255),
    `session_state` VARCHAR(255),
    CONSTRAINT `Account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;;

--
-- Table structure for table `Session`
--

DROP TABLE IF EXISTS `Session`;
CREATE TABLE `Session` (
    `id` VARCHAR(255) NOT NULL PRIMARY KEY,
    `sessionToken` VARCHAR(255) NOT NULL,
    `userId` VARCHAR(255) NOT NULL,
    `expires` DATETIME NOT NULL,
    CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;;

--
-- Table structure for table `VerificationToken`
--

DROP TABLE IF EXISTS `VerificationToken`;
CREATE TABLE `VerificationToken` (
    `identifier` VARCHAR(255) NOT NULL,
    `token` VARCHAR(255) NOT NULL,
    `expires` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;;

SET FOREIGN_KEY_CHECKS = 1;

