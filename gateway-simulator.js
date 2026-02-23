import { connect } from 'mqtt';

// 1. Connexion au Broker MQTT
const client = connect('mqtt://broker.emqx.io'); 

const topic = "upride/motor/01/data";

client.on('connect', () => {
    console.log("✅ Connecté au Broker MQTT !");
    
    // Lancer l'envoi des données une fois connecté
    setInterval(() => {
        const payload = {
            timestamp: new Date().toISOString(),
            motor_id: "MOTOR_01",
            vibration: generateVibration(),
            temperature: (60 + Math.random() * 2).toFixed(1)
        };

        // 2. Envoyer (Publish) les données au format JSON
        client.publish(topic, JSON.stringify(payload), { qos: 1 }, (err) => {
            if (!err) {
                console.log("📤 MQTT Sent:", payload);
            }
        });

    }, 500);
});

// Ta fonction de simulation reste la même
function generateVibration() {
    const now = Date.now() / 1000;
    
    // 1. Base stable (vibration normale du moteur)
    const baseVib = 2.0;

    // 2. Oscillation principale (ex: rotation à 1Hz)
    const primaryWave = Math.sin(now * 1.5) * 0.6;

    // 3. Micro-vibrations haute fréquence (bruit de roulement)
    const jitter = Math.sin(now * 15) * 0.15;

    // 4. Bruit blanc (aléatoire pur)
    const noise = (Math.random() - 0.5) * 0.4;

    // 5. Simulation de "Spikes" (chocs aléatoires toutes les ~10 secondes)
    let spike = 0;
    if (Math.random() > 0.98) {
        spike = Math.random() * 2.5; // Un pic soudain
    }

    const totalVibration = baseVib + primaryWave + jitter + noise + spike;

    // On s'assure de ne jamais descendre en dessous de 0
    return Math.max(0, totalVibration).toFixed(2);
}