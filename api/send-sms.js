const axios = require('axios');

// Función para enviar SMS
async function sendSms(accessToken, from, to, message) {
    const url = 'https://api.goto.com/messaging/v1/messages';

    const data = {
        ownerPhoneNumber: from,
        contactPhoneNumbers: [to],
        body: message
    };

    const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.post(url, data, { headers });
        console.log('SMS enviado:', response.data);
        return { success: true, data: response.data };
    } catch (error) {
        console.error('Error enviando SMS:', error.response?.data || error.message);
        return { success: false, error: error.response?.data || error.message };
    }
}

// Endpoint de Vercel
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método no permitido' });
    }

    const { inputFields } = req.body;
    const to = inputFields?.phone;
    const message = inputFields?.message;
    const from = '+17869802021';
    const accessToken = process.env.GOTO_ACCESS_TOKEN;

    if (!to || !message) {
        return res.status(400).json({ message: 'Faltan el número de teléfono o el mensaje' });
    }

    const result = await sendSms(accessToken, from, to, message);

    if (result.success) {
        return res.status(200).json({ message: 'SMS enviado correctamente' });
    } else {
        return res.status(500).json({ message: 'Error al enviar el SMS', error: result.error });
    }
}
