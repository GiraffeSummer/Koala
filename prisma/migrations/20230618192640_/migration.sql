-- CreateTable
CREATE TABLE `User` (
    `uid` VARCHAR(45) NOT NULL,
    `name` LONGTEXT NULL,
    `lvl` INTEGER NULL DEFAULT 0,
    `reputation` INTEGER NULL DEFAULT 0,
    `toLvl` INTEGER NULL DEFAULT 11,
    `married` BOOLEAN NULL DEFAULT false,
    `admin` BOOLEAN NULL DEFAULT false,
    `status` LONGTEXT NULL DEFAULT 'Hey there!',
    `timestamp` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `lvlMessage` LONGTEXT NULL DEFAULT '',
    `bot` BOOLEAN NULL DEFAULT false,
    `balance` BIGINT NULL DEFAULT 1000,
    `lootTimer` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `guessTimer` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `partnerId` VARCHAR(191) NULL,
    `selectedBadge` INTEGER NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`uid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `badge_inventory` (
    `userid` VARCHAR(191) NOT NULL,
    `badgeid` INTEGER NOT NULL,

    PRIMARY KEY (`userid`, `badgeid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Badge` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NULL,
    `badge` VARCHAR(100) NULL,
    `description` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `item_inventory` (
    `userid` VARCHAR(191) NOT NULL,
    `itemid` INTEGER NOT NULL,
    `amount` INTEGER NULL,

    PRIMARY KEY (`userid`, `itemid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Item` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NULL,
    `symbol` VARCHAR(100) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Reward` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NULL,
    `badge` INTEGER NULL,
    `exp` INTEGER NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `aboutus` (
    `id` VARCHAR(20) NOT NULL,
    `nickname` VARCHAR(100) NULL,
    `order` INTEGER NULL DEFAULT 999,
    `jobs` VARCHAR(100) NULL,
    `details` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Command` (
    `_id` INTEGER NOT NULL AUTO_INCREMENT,
    `command` VARCHAR(100) NULL,
    `description` TEXT NULL,
    `type` VARCHAR(100) NULL DEFAULT 'CHAT_INPUT',
    `exp` INTEGER NOT NULL DEFAULT 1,
    `ephemeral` BOOLEAN NULL DEFAULT false,
    `noDefer` BOOLEAN NULL DEFAULT false,

    PRIMARY KEY (`_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `command_options` (
    `commandid` INTEGER NOT NULL,
    `optionid` INTEGER NOT NULL,

    PRIMARY KEY (`commandid`, `optionid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CommandOptions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(100) NULL,
    `name` VARCHAR(100) NULL,
    `description` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fortune` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fortune_line` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `magic8` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `message` VARCHAR(100) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pickup` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pickup` TEXT NULL,
    `includename` BOOLEAN NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `topics` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `topic` VARCHAR(250) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `warnings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userid` VARCHAR(45) NULL,
    `guildid` VARCHAR(45) NULL,
    `admin` VARCHAR(45) NULL,
    `reason` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Guild` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `lvlmessages` BOOLEAN NULL DEFAULT true,
    `lvlChannel` VARCHAR(45) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `suggestions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `suggestion` LONGTEXT NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` ENUM('unread', 'accepted', 'hold', 'rejected', 'WIP') NOT NULL DEFAULT 'unread',
    `deleted` DATETIME(3) NULL,

    INDEX `suggestions_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pronoun_list` (
    `userid` VARCHAR(191) NOT NULL,
    `pronounId` INTEGER NOT NULL,

    PRIMARY KEY (`userid`, `pronounId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pronouns` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NULL,
    `symbol` VARCHAR(100) NULL,
    `emoji` VARCHAR(100) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `commandLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `command` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `options` LONGTEXT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wouldyourather` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `question` LONGTEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `neverhaveiever` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `question` LONGTEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `paranoia` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `question` LONGTEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `truth` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `question` LONGTEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dare` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `question` LONGTEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_partnerId_fkey` FOREIGN KEY (`partnerId`) REFERENCES `User`(`uid`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_selectedBadge_fkey` FOREIGN KEY (`selectedBadge`) REFERENCES `Badge`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `badge_inventory` ADD CONSTRAINT `badge_inventory_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `User`(`uid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `badge_inventory` ADD CONSTRAINT `badge_inventory_badgeid_fkey` FOREIGN KEY (`badgeid`) REFERENCES `Badge`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `item_inventory` ADD CONSTRAINT `item_inventory_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `User`(`uid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `item_inventory` ADD CONSTRAINT `item_inventory_itemid_fkey` FOREIGN KEY (`itemid`) REFERENCES `Item`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reward` ADD CONSTRAINT `Reward_badge_fkey` FOREIGN KEY (`badge`) REFERENCES `Badge`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `command_options` ADD CONSTRAINT `command_options_commandid_fkey` FOREIGN KEY (`commandid`) REFERENCES `Command`(`_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `command_options` ADD CONSTRAINT `command_options_optionid_fkey` FOREIGN KEY (`optionid`) REFERENCES `CommandOptions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `suggestions` ADD CONSTRAINT `suggestions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`uid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pronoun_list` ADD CONSTRAINT `pronoun_list_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `User`(`uid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pronoun_list` ADD CONSTRAINT `pronoun_list_pronounId_fkey` FOREIGN KEY (`pronounId`) REFERENCES `pronouns`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `commandLog` ADD CONSTRAINT `commandLog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`uid`) ON DELETE RESTRICT ON UPDATE CASCADE;
