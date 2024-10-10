-- Creación de la base de datos
CREATE SCHEMA trailerflix
DEFAULT CHARACTER SET utf8;

-- Utilizamos la base de datos creada
USE trailerflix;

-- Creamos las tablas necesarias individualmente

CREATE TABLE IF NOT EXISTS `categorias` (
	`id` int NOT NULL AUTO_INCREMENT,
	`nombre_categoria` varchar(255) DEFAULT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `generos` (
	`id` int NOT NULL AUTO_INCREMENT,
	`nombre_genero` varchar(255) DEFAULT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `actores` (
	`id` int NOT NULL AUTO_INCREMENT,
	`nombre_actor` varchar(255) DEFAULT NULL,
    `apellido_actor` varchar(255) DEFAULT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `contenido_actores` (
	`actor_id` int NOT NULL,
	`contenido_id` int NOT NULL,
	PRIMARY KEY (`actor_id`, `contenido_id`)
);

CREATE TABLE IF NOT EXISTS `contenido` (
	`id` int NOT NULL AUTO_INCREMENT,
	`poster` varchar(255) DEFAULT NULL,
	`titulo` varchar(255) DEFAULT NULL,
	`busqueda` text,
	`resumen` text,
	`temporadas` int,
    `duracion` varchar(255) DEFAULT NULL,
	`trailer` varchar(255) DEFAULT NULL,
	`categoria_id` int NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `contenido_generos` (
	`genero_id` int NOT NULL,
	`contenido_id` int NOT NULL,
	PRIMARY KEY (`genero_id`, `contenido_id`)
);

-- Definimos las relaciones (Foreign Keys) Controlando restricciones para manejar la eliminación entre tablas dependientes
ALTER TABLE `contenido_actores` 
  ADD CONSTRAINT `contenido_actores_fk0` FOREIGN KEY (`actor_id`) REFERENCES `actores`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `contenido_actores` 
  ADD CONSTRAINT `contenido_actores_fk1` FOREIGN KEY (`contenido_id`) REFERENCES `contenido`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `contenido` 
  ADD CONSTRAINT `contenido_fk7` FOREIGN KEY (`categoria_id`) REFERENCES `categorias`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `contenido_generos` 
  ADD CONSTRAINT `contenido_generos_fk0` FOREIGN KEY (`genero_id`) REFERENCES `generos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `contenido_generos` 
  ADD CONSTRAINT `contenido_generos_fk1` FOREIGN KEY (`contenido_id`) REFERENCES `contenido`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;