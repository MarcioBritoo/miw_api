import mysql from 'mysql2';
import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors'; // Importando o cors

dotenv.config();

const app = express();
const port = 3000;

app.use(cors()); 
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true'
    }
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL com SSL');
});

app.post('/leads', (req, res) => {
    console.log(req.body);
    const {
        rtkcid,
        first_name,
        last_name,
        email,
        phone_number,
        campaign_id,
        adset_id,
        ad_id,
        ad_name,
        campaign_name,
        adset_name
    } = req.body;

    const conversion_time = new Date(); 

    const query = `
        INSERT INTO miw_leads (
           rtkcid, first_name, last_name, email, phone_number, ad_name,
            campaign_id, adset_id, ad_id, campaign_name, adset_name, conversion_time
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [
        rtkcid, first_name, last_name, email, phone_number, ad_name,
        campaign_id, adset_id, ad_id, campaign_name, adset_name, conversion_time
    ], (err, result) => {
        if (err) {
            console.error('Erro ao inserir lead:', err);
            return res.status(500).send('Erro ao inserir lead');
        }
        res.status(201).send('Lead inserido com sucesso!');
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
