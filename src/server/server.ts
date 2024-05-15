import express from 'express';
import {DataSource} from "typeorm";
import {UserLocation} from "./user-location";

const app = express();
const port = 3000;

const datasource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '',
    database: 'user_location',
    entities: [UserLocation],
    synchronize: true
})

datasource.initialize()
    .then(() => {
        console.log("Data source has been initialized.")
    })
    .catch((err) => {
        console.error("Error initializing datasource", err)
    })

app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
})