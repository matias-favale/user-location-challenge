import express from 'express';
import { Pool } from 'pg';

const app = express();
const port = 3000;

const pool = new Pool({
    user: "sa",
    host: "localhost",
    database: "user_location",
    port: 5432
})

app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
})