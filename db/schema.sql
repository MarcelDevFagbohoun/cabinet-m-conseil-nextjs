-- =====================================================================
--  Cabinet M Conseils : schéma MySQL 8
--  Encodage utf8mb4, contraintes FK, index de recherche.
-- =====================================================================


-- ---------------------------------------------------------------------
-- Comptes administrateurs (mot de passe haché bcrypt, jamais en clair)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id`             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `email`          VARCHAR(190) NOT NULL,
  `password_hash`  VARCHAR(255) NOT NULL,
  `full_name`      VARCHAR(120) NOT NULL,
  `role`           ENUM('admin','editor') NOT NULL DEFAULT 'admin',
  `is_active`      TINYINT(1) NOT NULL DEFAULT 1,
  `failed_attempts` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  `locked_until`   DATETIME NULL,
  `last_login_at`  DATETIME NULL,
  `created_at`     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_admin_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Biens immobiliers
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `properties` (
  `id`            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `slug`          VARCHAR(190) NOT NULL,
  `title`         VARCHAR(190) NOT NULL,
  `type`          ENUM('parcelle','maison','appartement','immeuble','bureau','autre') NOT NULL DEFAULT 'parcelle',
  `transaction`   ENUM('vente','location') NOT NULL DEFAULT 'vente',
  `status`        ENUM('disponible','reserve','vendu','loue') NOT NULL DEFAULT 'disponible',
  `price`         DECIMAL(14,2) NULL,
  `price_unit`    VARCHAR(30) NOT NULL DEFAULT 'FCFA',
  `price_on_request` TINYINT(1) NOT NULL DEFAULT 0,
  `area_sqm`      DECIMAL(10,2) NULL,
  `city`          VARCHAR(120) NULL,
  `district`      VARCHAR(120) NULL,
  `address`       VARCHAR(255) NULL,
  `latitude`      DECIMAL(10,7) NULL,
  `longitude`     DECIMAL(10,7) NULL,
  -- détails maison / bâti
  `bedrooms`      TINYINT UNSIGNED NULL,
  `bathrooms`     TINYINT UNSIGNED NULL,
  `floors`        TINYINT UNSIGNED NULL,
  `year_built`    SMALLINT UNSIGNED NULL,
  `amenities`     JSON NULL,
  -- contenu
  `excerpt`       VARCHAR(320) NULL,
  `description`   MEDIUMTEXT NULL,
  `legal_notes`   TEXT NULL,
  `cover_image`   VARCHAR(255) NULL,
  `is_published`  TINYINT(1) NOT NULL DEFAULT 0,
  `is_featured`   TINYINT(1) NOT NULL DEFAULT 0,
  `meta_title`    VARCHAR(190) NULL,
  `meta_description` VARCHAR(320) NULL,
  `created_by`    INT UNSIGNED NULL,
  `created_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_property_slug` (`slug`),
  KEY `idx_property_filters` (`is_published`,`type`,`transaction`,`status`),
  KEY `idx_property_city` (`city`),
  CONSTRAINT `fk_property_author` FOREIGN KEY (`created_by`)
    REFERENCES `admin_users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Galerie photos
CREATE TABLE IF NOT EXISTS `property_images` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `property_id` INT UNSIGNED NOT NULL,
  `url`         VARCHAR(255) NOT NULL,
  `alt`         VARCHAR(190) NULL,
  `position`    SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  `created_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_img_property` (`property_id`,`position`),
  CONSTRAINT `fk_image_property` FOREIGN KEY (`property_id`)
    REFERENCES `properties`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Documents (titre foncier, plan, convention…)
CREATE TABLE IF NOT EXISTS `property_documents` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `property_id` INT UNSIGNED NOT NULL,
  `label`       VARCHAR(190) NOT NULL,
  `doc_type`    ENUM('titre_foncier','plan','convention','attestation','autre') NOT NULL DEFAULT 'autre',
  `url`         VARCHAR(255) NOT NULL,
  `is_public`   TINYINT(1) NOT NULL DEFAULT 0,
  `created_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_doc_property` (`property_id`),
  CONSTRAINT `fk_doc_property` FOREIGN KEY (`property_id`)
    REFERENCES `properties`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Blog
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `posts` (
  `id`            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `slug`          VARCHAR(190) NOT NULL,
  `title`         VARCHAR(190) NOT NULL,
  `category`      VARCHAR(80) NOT NULL DEFAULT 'Juridique',
  `excerpt`       VARCHAR(320) NULL,
  `content`       MEDIUMTEXT NOT NULL,
  `cover_image`   VARCHAR(255) NULL,
  `is_published`  TINYINT(1) NOT NULL DEFAULT 0,
  `published_at`  DATETIME NULL,
  `meta_title`    VARCHAR(190) NULL,
  `meta_description` VARCHAR(320) NULL,
  `created_by`    INT UNSIGNED NULL,
  `created_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_post_slug` (`slug`),
  KEY `idx_post_pub` (`is_published`,`published_at`),
  CONSTRAINT `fk_post_author` FOREIGN KEY (`created_by`)
    REFERENCES `admin_users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Messages du formulaire de contact
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `contact_messages` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`        VARCHAR(120) NOT NULL,
  `email`       VARCHAR(190) NOT NULL,
  `phone`       VARCHAR(40) NULL,
  `subject`     VARCHAR(190) NULL,
  `message`     TEXT NOT NULL,
  `property_id` INT UNSIGNED NULL,
  `ip_hash`     CHAR(64) NULL,
  `is_read`     TINYINT(1) NOT NULL DEFAULT 0,
  `created_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_msg_read` (`is_read`,`created_at`),
  CONSTRAINT `fk_msg_property` FOREIGN KEY (`property_id`)
    REFERENCES `properties`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
