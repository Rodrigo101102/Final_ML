const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Definir rutas base
const BASE_DIR = path.dirname(path.dirname(__filename)); // directorio backend
const CREADOS_DIR = path.join(BASE_DIR, 'creados'); // carpeta creados en backend
const FLOWMETER_DIR = path.join(BASE_DIR,'flowmeter'); // carpeta flowmeter en backend

// Asegurarse de que la carpeta 'creados' exista, si no, crearla
if (!fs.existsSync(CREADOS_DIR)) {
    try {
        fs.mkdirSync(CREADOS_DIR, { recursive: true });
    } catch (err) {
        console.error(`Error al crear la carpeta 'creados': ${err.message}`);
        process.exit(1);
    }
}

// Obtener el archivo .pcap a procesar desde los argumentos o buscar el más reciente en 'creados'
let pcapFileArg = process.argv[2];
let pcapFile;
if (!pcapFileArg) {
    // Buscar el archivo .pcap más reciente en la carpeta 'creados'
    if (!fs.existsSync(CREADOS_DIR)) {
        console.error("No existe la carpeta 'creados'.");
        process.exit(1);
    }
    const files = fs.readdirSync(CREADOS_DIR)
        .filter(f => f.endsWith('.pcap'))
        .map(f => ({
            name: f,
            time: fs.statSync(path.join(CREADOS_DIR, f)).mtime.getTime()
        }))
        .sort((a, b) => b.time - a.time);
    if (files.length === 0) {
        console.error('No se encontró ningún archivo .pcap en la carpeta creados.');
        process.exit(1);
    }
    pcapFile = path.join(CREADOS_DIR, files[0].name);
} else {
    pcapFile = path.isAbsolute(pcapFileArg) ? pcapFileArg : path.resolve(process.cwd(), pcapFileArg);
}
const outputDir = path.dirname(pcapFile);

// Ruta al archivo .bat de CICFlowMeter (dentro de flowmeter)
const cfmPath = path.join(FLOWMETER_DIR, 'bin', 'cfm.bat');
// Ruta donde están las bibliotecas nativas de jnetpcap
const javaLibraryPath = path.join(FLOWMETER_DIR, 'lib', 'native');

// Verificar si el archivo .bat existe en la ruta especificada
if (!fs.existsSync(cfmPath)) {
    console.error(`Error: El archivo CICFlowMeter no se encuentra en la ruta especificada: ${cfmPath}`);
    process.exit(1);
}

// Verificar si las bibliotecas nativas están presentes
if (!fs.existsSync(javaLibraryPath)) {
    console.error(`Error: Las bibliotecas nativas de jnetpcap no se encuentran en la ruta especificada: ${javaLibraryPath}`);
    process.exit(1);
}

function processWithFlowmeter(pcapFile) {
    // Generar nombre del archivo CSV de salida
    let pcapName = path.basename(pcapFile);
    if (pcapName.endsWith('.pcap')) {
        pcapName = pcapName.slice(0, -5);
    }
    pcapName = pcapName.replace(/\.|\s|\/|\\/g, '_');
    const csvFileName = `${pcapName}_Flow.csv`;
    // Usar solo el directorio como salida para evitar que CICFlowMeter cree carpetas
    const out = CREADOS_DIR;

    const checkAndMoveCsv = () => {
        // Buscar el archivo CSV generado directamente en CREADOS_DIR
        const expectedCsvPath = path.join(CREADOS_DIR, csvFileName);
        
        if (fs.existsSync(expectedCsvPath)) {
            console.log(`✓ Archivo CSV generado exitosamente: ${csvFileName}`);
            return true;
        } else {
            // Buscar cualquier archivo CSV recién creado en el directorio
            const files = fs.readdirSync(CREADOS_DIR).filter(f => f.endsWith('.csv') && f.includes('Flow'));
            if (files.length > 0) {
                // Tomar el archivo más reciente
                const recentFile = files.sort((a, b) => {
                    return fs.statSync(path.join(CREADOS_DIR, b)).mtime - fs.statSync(path.join(CREADOS_DIR, a)).mtime;
                })[0];
                
                if (recentFile !== csvFileName) {
                    // Renombrar al nombre esperado
                    try {
                        fs.renameSync(path.join(CREADOS_DIR, recentFile), expectedCsvPath);
                        console.log(`✓ Archivo CSV renombrado: ${recentFile} -> ${csvFileName}`);
                    } catch (e) {
                        console.log(`Advertencia: No se pudo renombrar archivo: ${e.message}`);
                    }
                }
                return true;
            } else {
                console.error(`❌ No se encontró archivo CSV generado`);
                return false;
            }
        }
    };
    
    if (!fs.existsSync(pcapFile)) {
        console.error(`Error: El archivo de entrada ${pcapFile} no existe.`);
        process.exit(1);
    }
    const command = spawn('cmd', ['/c', `set JAVA_OPTS=-Djava.library.path=${javaLibraryPath} && ${cfmPath}`, pcapFile, out]);
    
    command.stdout.on('data', (data) => {
        // Silenciar salida detallada de CICFlowMeter
    });
    
    command.stderr.on('data', (data) => {
        console.error(`Error CICFlowMeter: ${data}`);
    });
    
    command.on('exit', (code) => {
        // Esperar un poco para que Java termine completamente
        setTimeout(() => {
            const success = checkAndMoveCsv();
            if (code === 0 && success) {
                console.log(`✓ Archivo CSV generado exitosamente`);
            } else {
                console.error(`❌ Error: Problema en la generación del CSV (código: ${code}, éxito: ${success})`);
                process.exit(1);
            }
        }, 3000); // Esperar 3 segundos
    });
}

processWithFlowmeter(pcapFile);
