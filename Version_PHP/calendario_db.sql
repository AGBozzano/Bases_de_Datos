-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 10-02-2018 a las 01:32:10
-- Versión del servidor: 10.1.13-MariaDB
-- Versión de PHP: 5.6.23

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `calendario_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `eventos`
--

CREATE TABLE `eventos` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `titulo` varchar(100) CHARACTER SET utf8 COLLATE utf8_spanish_ci NOT NULL,
  `fecha_inicio` date NOT NULL,
  `hora_inicio` time NOT NULL,
  `fecha_fin` date NOT NULL,
  `hora_fin` time NOT NULL,
  `dia_completo` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci;

--
-- Volcado de datos para la tabla `eventos`
--

INSERT INTO `eventos` (`id`, `user_id`, `titulo`, `fecha_inicio`, `hora_inicio`, `fecha_fin`, `hora_fin`, `dia_completo`) VALUES
(93, 1, 'Partido de futbol', '2018-01-17', '12:00:00', '2018-01-17', '14:00:00', 0),
(94, 2, 'jornada laboral', '2018-01-21', '00:00:00', '0000-00-00', '00:00:00', 0),
(96, 1, 'Torneo de boxeo', '2018-01-10', '07:00:00', '2018-01-13', '07:00:00', 0),
(97, 1, 'cumple de mama', '2018-01-06', '00:00:00', '0000-00-00', '00:00:00', 0),
(99, 3, 'VACACIONES', '2018-01-23', '00:00:00', '0000-00-00', '00:00:00', 0),
(104, 2, 'CumpleaÃ±os Ricardo', '2018-01-12', '00:00:00', '0000-00-00', '00:00:00', 0),
(105, 2, 'Carnaval de Verano', '2018-01-14', '07:00:00', '2018-01-18', '07:00:00', 0),
(106, 2, 'Franco', '2018-01-27', '00:00:00', '0000-00-00', '00:00:00', 0),
(107, 1, 'Franco', '2018-01-28', '00:00:00', '0000-00-00', '00:00:00', 0),
(108, 1, 'Semana de la Dulzura', '2018-01-22', '07:00:00', '2018-01-26', '07:00:00', 0),
(109, 1, 'Franco', '2018-01-20', '00:00:00', '0000-00-00', '00:00:00', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) COLLATE latin1_spanish_ci NOT NULL,
  `email` varchar(100) COLLATE latin1_spanish_ci NOT NULL,
  `clave` varchar(255) COLLATE latin1_spanish_ci NOT NULL,
  `nacimiento` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `email`, `clave`, `nacimiento`) VALUES
(1, 'Usuario 1', 'usuario1@gmail.com', '$2y$10$ucnBTgP1nni.OxuByW2fjOoyjhjKht0t..30wKi4IjiEJhCsk7YTm', '2018-02-09'),
(2, 'Usuario 2', 'usuario2@gmail.com', '$2y$10$WEWsf4w69jVwZ30ndYt6EeGXJ4xkLMWvijTaU95uBrlqyFUOGi1we', '2018-02-09'),
(3, 'Usuario 3', 'usuario3@gmail.com', '$2y$10$8Aa1j35fhQob0ozYO4lpeOWofxy.bN1clssbaBuEhFoXhceS9QQX2', '2018-02-09');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `eventos`
--
ALTER TABLE `eventos`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `relacion_eventos_usuarios` (`user_id`) USING BTREE;

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `eventos`
--
ALTER TABLE `eventos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=114;
--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `eventos`
--
ALTER TABLE `eventos`
  ADD CONSTRAINT `relacion_eventos_usuarios` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
