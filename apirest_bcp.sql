-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 03-07-2026 a las 20:42:32
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `apirest_bcp`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auditoria_accesos`
--

CREATE TABLE `auditoria_accesos` (
  `id_auditoria` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `accion` varchar(100) NOT NULL,
  `fecha_evento` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `auditoria_accesos`
--

INSERT INTO `auditoria_accesos` (`id_auditoria`, `username`, `accion`, `fecha_evento`) VALUES
(1, '72345678', 'LOGIN_EXITOSO', '2026-07-03 13:41:07');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `compras_tarjeta`
--

CREATE TABLE `compras_tarjeta` (
  `id_compra` varchar(50) NOT NULL,
  `tarjeta_id` varchar(50) DEFAULT NULL,
  `establecimiento` varchar(100) NOT NULL,
  `monto_total` decimal(10,2) NOT NULL,
  `fecha_transaccion` date NOT NULL,
  `estado` varchar(50) DEFAULT 'ROTATIVO'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `compras_tarjeta`
--

INSERT INTO `compras_tarjeta` (`id_compra`, `tarjeta_id`, `establecimiento`, `monto_total`, `fecha_transaccion`, `estado`) VALUES
('TX-COMPRA-01', '4551-2300-0010-1111', 'IAG SHOP PERU (Sillas Gamer)', 1200.00, '2026-06-15', 'ROTATIVO'),
('TX-COMPRA-02', '4551-2300-0010-1111', 'SAGA FALABELLA JOCKEY', 450.00, '2026-06-22', 'ROTATIVO'),
('TX-COMPRA-03', '4557-8812-3394-3920', 'APPLE STORE ONLINE', 4999.00, '2026-06-29', 'ROTATIVO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cuentas`
--

CREATE TABLE `cuentas` (
  `id` varchar(50) NOT NULL,
  `tipo_cuenta` varchar(100) NOT NULL,
  `saldo_disponible` decimal(12,2) NOT NULL,
  `saldo_wawaditos` decimal(12,2) DEFAULT 0.00,
  `moneda` varchar(5) DEFAULT 'PEN',
  `estado` varchar(20) DEFAULT 'ACTIVO'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cuentas`
--

INSERT INTO `cuentas` (`id`, `tipo_cuenta`, `saldo_disponible`, `saldo_wawaditos`, `moneda`, `estado`) VALUES
('CTA-101', 'CUENTA SUELDO BCP', 8400.00, 200.00, 'PEN', 'ACTIVO'),
('CTA-102', 'CUENTA DE AHORROS SOL DE ORO', 15750.50, 600.00, 'PEN', 'ACTIVO'),
('CTA-103', 'CUENTA CORRIENTE JURIDICA', 980.00, 0.00, 'PEN', 'ACTIVO'),
('CTA-999', 'CUENTA DESTINO TERCEROS CCE', 120.00, 0.00, 'PEN', 'ACTIVO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historial_movimientos`
--

CREATE TABLE `historial_movimientos` (
  `id_movimiento` int(11) NOT NULL,
  `cuenta_id` varchar(50) DEFAULT NULL,
  `detalle` varchar(100) NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `fecha_registro` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `historial_movimientos`
--

INSERT INTO `historial_movimientos` (`id_movimiento`, `cuenta_id`, `detalle`, `monto`, `fecha_registro`) VALUES
(1, 'CTA-101', 'RETIRO EN EFECTIVO CAJERO SJM', -200.00, '2026-07-03 13:38:08'),
(2, 'CTA-101', 'YAPE RECIBIDO DE CARLOS MENDOZA', 45.00, '2026-07-03 13:38:08'),
(3, 'CTA-101', 'ABONO REMUNERACION EMPRESA SAC', 5000.00, '2026-07-03 13:38:08'),
(4, 'CTA-102', 'TRANSFERENCIA INTERBANCARIA RECIBIDA', 15000.00, '2026-07-03 13:38:08');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servicios_publicos`
--

CREATE TABLE `servicios_publicos` (
  `id_servicio` varchar(50) NOT NULL,
  `empresa` varchar(100) NOT NULL,
  `categoria` varchar(50) NOT NULL,
  `codigo_suministro` varchar(50) NOT NULL,
  `monto_deuda` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `servicios_publicos`
--

INSERT INTO `servicios_publicos` (`id_servicio`, `empresa`, `categoria`, `codigo_suministro`, `monto_deuda`) VALUES
('SERV-AGUA', 'SEDAPAL', 'AGUA', '7463521', 42.10),
('SERV-LUZ', 'LUZ DEL SUR', 'LUZ', '1029384', 156.40),
('SERV-TEL', 'CLARO POSTPAGO', 'TELEFONIA', '999888777', 79.90),
('SERV-UNI', 'UNIVERSIDAD TECNOLOGICA DEL PERU', 'EDUCACION', 'U20261011', 890.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `simulaciones_credito`
--

CREATE TABLE `simulaciones_credito` (
  `id_solicitud` varchar(50) NOT NULL,
  `monto_solicitado` decimal(10,2) NOT NULL,
  `cuotas_pactadas` int(11) NOT NULL,
  `tcea_aplicada` decimal(5,2) NOT NULL,
  `monto_cuota` decimal(10,2) NOT NULL,
  `estado_solicitud` varchar(50) DEFAULT 'SIMULADO_ONLINE'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `simulaciones_credito`
--

INSERT INTO `simulaciones_credito` (`id_solicitud`, `monto_solicitado`, `cuotas_pactadas`, `tcea_aplicada`, `monto_cuota`, `estado_solicitud`) VALUES
('PREST-CAMP-TEST', 3000.00, 12, 45.50, 280.00, 'DESEMBOLSADO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tarjetas_config`
--

CREATE TABLE `tarjetas_config` (
  `id_tarjeta` varchar(50) NOT NULL,
  `cuenta_id` varchar(50) DEFAULT NULL,
  `pin_cajero` varchar(4) NOT NULL,
  `compras_internet` tinyint(1) DEFAULT 0,
  `compras_extranjero` tinyint(1) DEFAULT 0,
  `cvv_estatico` varchar(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tarjetas_config`
--

INSERT INTO `tarjetas_config` (`id_tarjeta`, `cuenta_id`, `pin_cajero`, `compras_internet`, `compras_extranjero`, `cvv_estatico`) VALUES
('4551-2300-0010-1111', 'CTA-101', '4321', 1, 0, '482'),
('4557-8812-3394-3920', 'CTA-102', '9876', 1, 1, '109');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `dni` varchar(8) NOT NULL,
  `numero_tarjeta` varchar(16) NOT NULL,
  `clave` varchar(6) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `tipo_perfil` varchar(20) DEFAULT 'CLIENTE_NATURAL'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`dni`, `numero_tarjeta`, `clave`, `nombre`, `tipo_perfil`) VALUES
('40556677', '4557881233943', '654321', 'PEDRO RAMIREZ CASAS', 'CLIENTE_NATURAL'),
('72345678', '4551230000101', '123456', 'JUAN ALEXIS ULLOA TORRES', 'CLIENTE_VIP');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `auditoria_accesos`
--
ALTER TABLE `auditoria_accesos`
  ADD PRIMARY KEY (`id_auditoria`);

--
-- Indices de la tabla `compras_tarjeta`
--
ALTER TABLE `compras_tarjeta`
  ADD PRIMARY KEY (`id_compra`),
  ADD KEY `tarjeta_id` (`tarjeta_id`);

--
-- Indices de la tabla `cuentas`
--
ALTER TABLE `cuentas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `historial_movimientos`
--
ALTER TABLE `historial_movimientos`
  ADD PRIMARY KEY (`id_movimiento`),
  ADD KEY `cuenta_id` (`cuenta_id`);

--
-- Indices de la tabla `servicios_publicos`
--
ALTER TABLE `servicios_publicos`
  ADD PRIMARY KEY (`id_servicio`);

--
-- Indices de la tabla `simulaciones_credito`
--
ALTER TABLE `simulaciones_credito`
  ADD PRIMARY KEY (`id_solicitud`);

--
-- Indices de la tabla `tarjetas_config`
--
ALTER TABLE `tarjetas_config`
  ADD PRIMARY KEY (`id_tarjeta`),
  ADD KEY `cuenta_id` (`cuenta_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`dni`),
  ADD UNIQUE KEY `numero_tarjeta` (`numero_tarjeta`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `auditoria_accesos`
--
ALTER TABLE `auditoria_accesos`
  MODIFY `id_auditoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `historial_movimientos`
--
ALTER TABLE `historial_movimientos`
  MODIFY `id_movimiento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `compras_tarjeta`
--
ALTER TABLE `compras_tarjeta`
  ADD CONSTRAINT `compras_tarjeta_ibfk_1` FOREIGN KEY (`tarjeta_id`) REFERENCES `tarjetas_config` (`id_tarjeta`) ON DELETE CASCADE;

--
-- Filtros para la tabla `historial_movimientos`
--
ALTER TABLE `historial_movimientos`
  ADD CONSTRAINT `historial_movimientos_ibfk_1` FOREIGN KEY (`cuenta_id`) REFERENCES `cuentas` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `tarjetas_config`
--
ALTER TABLE `tarjetas_config`
  ADD CONSTRAINT `tarjetas_config_ibfk_1` FOREIGN KEY (`cuenta_id`) REFERENCES `cuentas` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
