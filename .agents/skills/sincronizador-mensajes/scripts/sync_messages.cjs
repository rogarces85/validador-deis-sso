const fs = require('fs');
const path = require('path');

const sourcePath = path.join(process.cwd(), 'data', 'Rules_nuevas.json');
const targetsDir = path.join(process.cwd(), 'data', 'rules');
const targetFiles = ['base.json', 'hospital.json', 'posta.json', 'samu.json'];

async function syncMessages() {
    try {
        console.log('📖 Cargando mensajes de origen desde Rules_nuevas.json...');
        const sourceData = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));

        // Crear mapa de mensajes por ID
        const messageMap = new Map();
        for (const sheet in sourceData.validaciones) {
            sourceData.validaciones[sheet].forEach(rule => {
                messageMap.set(rule.id, rule.mensaje);
            });
        }

        console.log('🔄 Sincronizando archivos de destino...');

        targetFiles.forEach(file => {
            const filePath = path.join(targetsDir, file);
            if (!fs.existsSync(filePath)) {
                console.warn(`⚠️ Archivo no encontrado: ${file}`);
                return;
            }

            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            let updateCount = 0;

            for (const sheet in data.validaciones) {
                data.validaciones[sheet].forEach(rule => {
                    if (messageMap.has(rule.id)) {
                        rule.mensaje = messageMap.get(rule.id);
                        // Limpieza de campo mensaje_original para consistencia
                        delete rule.mensaje_original;
                        updateCount++;
                    }
                });
            }

            fs.writeFileSync(filePath, JSON.stringify(data, null, 4), 'utf8');
            console.log(`✅ ${file}: ${updateCount} mensajes actualizados.`);
        });

        console.log('\n✨ Sincronización global completada con éxito.');

    } catch (e) {
        console.error('❌ Error durante la sincronización:', e.message);
    }
}

syncMessages();
