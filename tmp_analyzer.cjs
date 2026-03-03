const fs = require('fs');

const fromImage = [
    { codigo: '123010', nombre: 'Dirección Servicio Salud Osorno', comuna: '10301' },
    { codigo: '123011', nombre: 'PRAIS', comuna: '10301' },
    { codigo: '123012', nombre: 'Clínica Dental Móvil (Osorno)', comuna: '10301' },
    { codigo: '123030', nombre: 'Departamento de Atención Integral Funcionarios', comuna: '10301' },
    { codigo: '123100', nombre: 'Hospital Base San José de Osorno', comuna: '10301' },
    { codigo: '123101', nombre: 'Hospital de Purranque Dr. Juan Hepp Dubiau', comuna: '10303' },
    { codigo: '123102', nombre: 'Hospital de Río Negro', comuna: '10305' },
    { codigo: '123103', nombre: 'Hospital de Puerto Octay', comuna: '10302' },
    { codigo: '123104', nombre: 'Hospital Futa Sruka Lawenche Kunko Mapu Mo', comuna: '10306' },
    { codigo: '123105', nombre: 'Hospital Pu Mulen Quilacahuín', comuna: '10307' },
    { codigo: '123201', nombre: 'Hospital Misión San Juan de la Costa', comuna: '10306' },
    { codigo: '123202', nombre: 'Hospital Del Perpetuo Socorro de Quilacahuín (San Pablo)', comuna: '10307' },
    { codigo: '123203', nombre: 'Clínica Alemana Osorno', comuna: '10301' },
    { codigo: '123207', nombre: 'Centro de Rehabilitación de Minusválidos', comuna: '10303' },
    { codigo: '123300', nombre: 'Centro de Salud Familiar Dr. Pedro Jáuregui', comuna: '10301' },
    { codigo: '123301', nombre: 'Centro de Salud Familiar Dr. Marcelo Lopetegui Adams', comuna: '10301' },
    { codigo: '123302', nombre: 'Centro de Salud Familiar Ovejería', comuna: '10301' },
    { codigo: '123303', nombre: 'Centro de Salud Familiar Rahue Alto', comuna: '10301' },
    { codigo: '123304', nombre: 'Centro de Salud Familiar Entre Lagos', comuna: '10304' },
    { codigo: '123305', nombre: 'Centro de Salud Familiar San Pablo', comuna: '10307' },
    { codigo: '123306', nombre: 'Centro de Salud Familiar Pampa Alegre', comuna: '10301' },
    { codigo: '123307', nombre: 'Centro de Salud Familiar Purranque', comuna: '10303' },
    { codigo: '123309', nombre: 'Centro de Salud Familiar Practicante Pablo Araya', comuna: '10305' },
    { codigo: '123310', nombre: 'Centro de Salud Familiar Quinto Centenario', comuna: '10301' },
    { codigo: '123311', nombre: 'Centro de Salud Familiar Bahía Mansa', comuna: '10306' },
    { codigo: '123312', nombre: 'Centro de Salud Familiar Puaucho', comuna: '10306' },
    { codigo: '123402', nombre: 'Posta de Salud Rural Cuinco', comuna: '10306' },
    { codigo: '123404', nombre: 'Posta de Salud Rural Pichi Damas', comuna: '10301' },
    { codigo: '123406', nombre: 'Posta de Salud Rural Puyehue', comuna: '10304' },
    { codigo: '123407', nombre: 'Posta de Salud Rural Desagüe Rupanco', comuna: '10304' },
    { codigo: '123408', nombre: 'Posta de Salud Rural Ñadi Pichi-Damas', comuna: '10304' },
    { codigo: '123410', nombre: 'Posta de Salud Rural Tres Esteros', comuna: '10305' },
    { codigo: '123411', nombre: 'Centro Comunitario de Salud Familiar Corte Alto', comuna: '10303' },
    { codigo: '123412', nombre: 'Posta de Salud Rural Crucero ( Purranque )', comuna: '10303' },
    { codigo: '123413', nombre: 'Posta de Salud Rural Coligual', comuna: '10303' },
    { codigo: '123414', nombre: 'Posta de Salud Rural Hueyusca', comuna: '10303' },
    { codigo: '123415', nombre: 'Posta de Salud Rural Concordia', comuna: '10303' },
    { codigo: '123416', nombre: 'Posta de Salud Rural Colonia Ponce', comuna: '10303' },
    { codigo: '123417', nombre: 'Posta de Salud Rural La Naranja', comuna: '10303' },
    { codigo: '123419', nombre: 'Posta de Salud Rural San Pedro de Purranque', comuna: '10303' },
    { codigo: '123420', nombre: 'Posta de Salud Rural Collihuinco', comuna: '10303' },
    { codigo: '123422', nombre: 'Posta de Salud Rural Rupanco', comuna: '10302' },
    { codigo: '123423', nombre: 'Posta de Salud Rural Cascadas', comuna: '10302' },
    { codigo: '123424', nombre: 'Posta de Salud Rural Piedras Negras', comuna: '10302' },
    { codigo: '123425', nombre: 'Posta de Salud Rural Cancura', comuna: '10301' },
    { codigo: '123426', nombre: 'Posta de Salud Rural Pellinada', comuna: '10302' },
    { codigo: '123427', nombre: 'Posta de Salud Rural La Calo', comuna: '10302' },
    { codigo: '123428', nombre: 'Posta de Salud Rural Coihueco (Puerto Octay)', comuna: '10302' },
    { codigo: '123430', nombre: 'Posta de Salud Rural Purrehuín', comuna: '10306' },
    { codigo: '123431', nombre: 'Posta de Salud Rural Aleucapi', comuna: '10306' },
    { codigo: '123432', nombre: 'Posta de Salud Rural La Poza', comuna: '10307' },
    { codigo: '123434', nombre: 'Posta de Salud Rural Huilma', comuna: '10305' },
    { codigo: '123435', nombre: 'Posta de Salud Rural Pucopio', comuna: '10307' },
    { codigo: '123436', nombre: 'Posta de Salud Rural Chanco ( San Pablo )', comuna: '10307' },
    { codigo: '123437', nombre: 'Posta de Salud Rural Currimahuida', comuna: '10307' },
    { codigo: '123700', nombre: 'Centro Comunitario de Salud Familiar Murrinumo', comuna: '10301' },
    { codigo: '123701', nombre: 'Centro Comunitario de Salud Familiar Manuel Rodriguez', comuna: '10301' },
    { codigo: '123705', nombre: 'Centro Comunitario de Salud Familiar El Encanto', comuna: '10304' },
    { codigo: '123709', nombre: 'Centro Comunitario de Salud Familiar Riachuelo', comuna: '10305' },
    { codigo: '123800', nombre: 'SAPU Dr. Pedro Jáuregui', comuna: '10301' },
    { codigo: '123801', nombre: 'SAPU Rahue Alto', comuna: '10301' },
    { codigo: '200085', nombre: 'SAPU Dr. Marcelo Lopetegui Adams', comuna: '10301' },
    { codigo: '200209', nombre: 'COSAM Rahue', comuna: '10301' },
    { codigo: '200248', nombre: 'CDR de Adultos Mayores con Demencia', comuna: '10301' },
    { codigo: '200445', nombre: 'COSAM Oriente', comuna: '10301' },
    { codigo: '200455', nombre: 'Centro Comunitario de Salud Familiar Barrio Estación', comuna: '10303' },
    { codigo: '200477', nombre: 'Unidad de Memoria AYEKAN', comuna: '10301' },
    { codigo: '200490', nombre: 'Posta de Salud Rural Chamilco', comuna: '10306' },
    { codigo: '200539', nombre: 'Centro Referencia Diagnóstico Médico Osorno', comuna: '10301' },
    { codigo: '200556', nombre: 'Hospital Digital', comuna: '10301' },
    { codigo: '200747', nombre: 'SAPU Entre Lagos', comuna: '10304' },
    { codigo: '200748', nombre: 'SUR San Pablo', comuna: '10307' },
    { codigo: '200749', nombre: 'SUR Bahía Mansa', comuna: '10306' },
    { codigo: '200750', nombre: 'SUR Puaucho', comuna: '10306' },
    { codigo: '201055', nombre: 'Terapéutica Peulla Ambulatoria', comuna: '10301' },
    { codigo: '201056', nombre: 'Terapéutica Peulla Residencial', comuna: '10301' },
    { codigo: '201483', nombre: 'Centro Comunitario de Salud Familiar Las Cascadas', comuna: '10302' },
    { codigo: '201667', nombre: 'Posta de Salud Rural Chan Chan Río Negro', comuna: '10305' },
    { codigo: '202043', nombre: 'Posta de Salud Rural Pucatrihue', comuna: '10306' },
];

const catalog = JSON.parse(fs.readFileSync('data/establishments.catalog.json', 'utf8'));
const inSystem = catalog.establecimientos.reduce((acc, e) => {
    acc[e.codigo] = e;
    return acc;
}, {});

const faltantes = [];

fromImage.forEach(item => {
    if (!inSystem[item.codigo]) {
        faltantes.push(item);
    }
});

console.log(JSON.stringify(faltantes, null, 2));
