-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 04-07-2026 a las 05:08:17
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
-- Estructura de tabla para la tabla `cuentas`
--

CREATE TABLE `cuentas` (
  `id` varchar(20) NOT NULL,
  `dni_titular` varchar(8) DEFAULT NULL,
  `tipo_cuenta` varchar(50) NOT NULL,
  `saldo_disponible` decimal(12,2) NOT NULL,
  `saldo_wawaditos` decimal(12,2) DEFAULT 0.00,
  `cci` varchar(24) NOT NULL,
  `estado` varchar(20) DEFAULT 'ACTIVO'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cuentas`
--

INSERT INTO `cuentas` (`id`, `dni_titular`, `tipo_cuenta`, `saldo_disponible`, `saldo_wawaditos`, `cci`, `estado`) VALUES
('191-72345-0-01', '72345678', 'SUELDO', 5400.00, 200.00, 'CCI-002-191-0072345001-9', 'ACTIVO'),
('191-72345-1-02', '72345678', 'AH_DOL', 1200.00, 0.00, 'CCI-002-191-0072345102-4', 'ACTIVO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empresas_afiliadas`
--

CREATE TABLE `empresas_afiliadas` (
  `id_empresa` varchar(30) NOT NULL,
  `nombre_empresa` varchar(100) NOT NULL,
  `categoria` varchar(50) NOT NULL,
  `codigo_recaudacion` varchar(50) NOT NULL,
  `monto_deuda` decimal(10,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `empresas_afiliadas`
--

INSERT INTO `empresas_afiliadas` (`id_empresa`, `nombre_empresa`, `categoria`, `codigo_recaudacion`, `monto_deuda`) VALUES
('REC-MOVISTAR', 'Movistar Recargas', 'RECARGAS', '999888777', 0.00),
('SERV-LUZ-LDS', 'Luz del Sur', 'LUZ', '1029384', 156.40),
('SERV-UNI-UTP', 'Universidad Tecnologica del Peru', 'EDUCACION', 'U20261011', 890.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historial_transacciones`
--

CREATE TABLE `historial_transacciones` (
  `id_tx` int(11) NOT NULL,
  `cuenta_origen` varchar(50) DEFAULT NULL,
  `cuenta_destino` varchar(50) DEFAULT NULL,
  `tipo_operacion` varchar(50) DEFAULT NULL,
  `monto` decimal(12,2) NOT NULL,
  `moneda` varchar(3) DEFAULT 'PEN',
  `detalle` varchar(150) DEFAULT NULL,
  `comprobante_id` varchar(20) DEFAULT NULL,
  `fecha_registro` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `historial_transacciones`
--

INSERT INTO `historial_transacciones` (`id_tx`, `cuenta_origen`, `cuenta_destino`, `tipo_operacion`, `monto`, `moneda`, `detalle`, `comprobante_id`, `fecha_registro`) VALUES
(1, '191-72345-0-01', 'RESTAURANTE-SABORES', 'COMPRA_TARJETA', 45.50, 'PEN', 'Pago en Rústica Centro de Lima', 'VOUCH-882910', '2026-07-03 22:07:09'),
(2, 'EMPRESA-NOMINA', '191-72345-0-01', 'ABONO_HABERES', 3500.00, 'PEN', 'Abono de Planilla BCP', 'VOUCH-102938', '2026-07-03 22:07:09');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inversiones_seguros`
--

CREATE TABLE `inversiones_seguros` (
  `id_producto` varchar(20) NOT NULL,
  `dni_cliente` varchar(8) DEFAULT NULL,
  `tipo_producto` varchar(40) DEFAULT NULL,
  `monto_invertido_prima` decimal(12,2) NOT NULL,
  `rentabilidad_acumulada` decimal(10,2) DEFAULT 0.00,
  `estado` varchar(20) DEFAULT 'ACTIVO'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `prestamos`
--

CREATE TABLE `prestamos` (
  `id_prestamo` varchar(20) NOT NULL,
  `dni_cliente` varchar(8) DEFAULT NULL,
  `monto_capital` decimal(12,2) NOT NULL,
  `cuotas_totales` int(11) NOT NULL,
  `cuotas_pagadas` int(11) DEFAULT 0,
  `monto_cuota` decimal(10,2) NOT NULL,
  `estado` varchar(20) DEFAULT 'VIGENTE'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `simulaciones_credito`
--

CREATE TABLE `simulaciones_credito` (
  `id_solicitud` varchar(20) NOT NULL,
  `monto_solicitado` decimal(12,2) NOT NULL,
  `cuotas_pactadas` int(11) NOT NULL,
  `tcea_aplicada` decimal(5,2) NOT NULL,
  `monto_cuota` decimal(10,2) NOT NULL,
  `estado_solicitud` varchar(30) DEFAULT 'SIMULADO_ONLINE'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tarjetas`
--

CREATE TABLE `tarjetas` (
  `id_tarjeta` varchar(16) NOT NULL,
  `cuenta_id` varchar(20) DEFAULT NULL,
  `tipo_tarjeta` varchar(20) DEFAULT NULL,
  `linea_credito_total` decimal(12,2) DEFAULT 0.00,
  `linea_credito_disponible` decimal(12,2) DEFAULT 0.00,
  `deuda_fecha_total` decimal(12,2) DEFAULT 0.00,
  `deuda_fecha_minima` decimal(12,2) DEFAULT 0.00,
  `fecha_vencimiento` date DEFAULT NULL,
  `pin_cajero` varchar(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tarjetas`
--

INSERT INTO `tarjetas` (`id_tarjeta`, `cuenta_id`, `tipo_tarjeta`, `linea_credito_total`, `linea_credito_disponible`, `deuda_fecha_total`, `deuda_fecha_minima`, `fecha_vencimiento`, `pin_cajero`) VALUES
('4551230000101111', '191-72345-0-01', 'DEBITO', 0.00, 0.00, 0.00, 0.00, '2030-12-31', '4321'),
('5221880099204444', '191-72345-0-01', 'CREDITO_VISA', 10000.00, 8500.00, 1500.00, 120.00, '2029-05-15', '9876');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `dni` varchar(8) NOT NULL,
  `numero_tarjeta` varchar(16) NOT NULL,
  `clave_internet` varchar(6) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `telefono` varchar(9) NOT NULL,
  `dispositivo_vinculado` varchar(100) DEFAULT 'Desconocido',
  `token_digital_seed` varchar(64) NOT NULL,
  `otp_actual` varchar(6) DEFAULT NULL,
  `perfil` varchar(20) DEFAULT 'NATURAL_REGULAR'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`dni`, `numero_tarjeta`, `clave_internet`, `nombre`, `correo`, `telefono`, `dispositivo_vinculado`, `token_digital_seed`, `otp_actual`, `perfil`) VALUES
('72345678', '4551230000101111', '123456', 'JUAN ALEXIS ULLOA TORRES', 'juan.ulloa@bcp.com.pe', '999888777', 'iPhone 15 Pro de Juan', 'SEED_OAUTH_BCP_9921', '123456', 'VIP');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `cuentas`
--
ALTER TABLE `cuentas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `cci` (`cci`),
  ADD KEY `dni_titular` (`dni_titular`);

--
-- Indices de la tabla `empresas_afiliadas`
--
ALTER TABLE `empresas_afiliadas`
  ADD PRIMARY KEY (`id_empresa`);

--
-- Indices de la tabla `historial_transacciones`
--
ALTER TABLE `historial_transacciones`
  ADD PRIMARY KEY (`id_tx`),
  ADD UNIQUE KEY `comprobante_id` (`comprobante_id`);

--
-- Indices de la tabla `inversiones_seguros`
--
ALTER TABLE `inversiones_seguros`
  ADD PRIMARY KEY (`id_producto`),
  ADD KEY `dni_cliente` (`dni_cliente`);

--
-- Indices de la tabla `prestamos`
--
ALTER TABLE `prestamos`
  ADD PRIMARY KEY (`id_prestamo`),
  ADD KEY `dni_cliente` (`dni_cliente`);

--
-- Indices de la tabla `simulaciones_credito`
--
ALTER TABLE `simulaciones_credito`
  ADD PRIMARY KEY (`id_solicitud`);

--
-- Indices de la tabla `tarjetas`
--
ALTER TABLE `tarjetas`
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
-- AUTO_INCREMENT de la tabla `historial_transacciones`
--
ALTER TABLE `historial_transacciones`
  MODIFY `id_tx` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `cuentas`
--
ALTER TABLE `cuentas`
  ADD CONSTRAINT `cuentas_ibfk_1` FOREIGN KEY (`dni_titular`) REFERENCES `usuarios` (`dni`) ON DELETE CASCADE;

--
-- Filtros para la tabla `inversiones_seguros`
--
ALTER TABLE `inversiones_seguros`
  ADD CONSTRAINT `inversiones_seguros_ibfk_1` FOREIGN KEY (`dni_cliente`) REFERENCES `usuarios` (`dni`) ON DELETE CASCADE;

--
-- Filtros para la tabla `prestamos`
--
ALTER TABLE `prestamos`
  ADD CONSTRAINT `prestamos_ibfk_1` FOREIGN KEY (`dni_cliente`) REFERENCES `usuarios` (`dni`) ON DELETE CASCADE;

--
-- Filtros para la tabla `tarjetas`
--
ALTER TABLE `tarjetas`
  ADD CONSTRAINT `tarjetas_ibfk_1` FOREIGN KEY (`cuenta_id`) REFERENCES `cuentas` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
