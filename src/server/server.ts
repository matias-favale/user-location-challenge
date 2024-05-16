import express from 'express';
import session from 'express-session'
import {Column, DataSource, Entity, PrimaryGeneratedColumn} from "typeorm";

const app = express();
const port = 3000;

const log = (message: string, ...rest: any[]) => {
    console.log(`${new Date()} ${message}`, ...rest)
}

const logError = (message: string, ...rest: any[]) => {
    console.error(`${new Date()} ${message}`, ...rest)
}

@Entity()
class UserLocation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column({ unique: true })
    sessionId: string;
}

const datasource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '',
    database: 'user_location',
    entities: [UserLocation],
    synchronize: true,
    dropSchema: true,
})

const userLocationRepository = datasource.getRepository(UserLocation)

datasource.initialize()
    .then(() => {
        log("Data source has been initialized.")
    })
    .catch((err) => {
        logError("Error initializing datasource", err)
    })


// Get session middleware
app.use(session({
    secret: '1234567890',
    resave: true,
    saveUninitialized: true
}))

app.use(express.json())

// Custom middleware to intercept all requests
app.use((req, _res, next) => {
    log(`${req.method.toLocaleUpperCase()} - ${req.url}`, req.body || {})
    next();
})

app.get('/', (_req, res) => {
    res.send('Hello, how are you?');
});

app.get('/login', async (req, res) => {
    log(`Looking for user data for user session ${req.sessionID}`)
    try {
        const userData = await userLocationRepository.findOneBy({sessionId: req.sessionID})
        if (userData) {
            log(`Found user data ${userData}`)
            res.json(userData)
        } else {
            log(`User data not found.`)
            res.status(404).json()
        }
    } catch(error) {
        logError("Error retrieving data", error)
        res.status(500).json()
    }
})

app.post('/register', async (req, res) => {
    log(`Creating user for user session ${req.sessionID}`)
    // Check if user already registered from the session
    let userLocation = await userLocationRepository.findOneBy({sessionId: req.sessionID})
    if(userLocation) {
        res.json({
            error: "User was already registered. For updating data use /updateLocation."
        })
        return
    }

    // New user
    userLocation = new UserLocation()
    userLocation.username = req.body.username
    userLocation.sessionId = req.sessionID

    try {
        const userData = await userLocationRepository.save(userLocation)
        log(`User data saved: ${userData}`)
        res.json(userData)
    } catch(error) {
        logError("Error creating user", error)
        res.status(500).json()
    }
})

app.post('/updateLocation', async (req, res) => {
    log(`Updating location for user session ${req.sessionID}`)
    // Check if user already registered from the session
    let userLocation = await userLocationRepository.findOneBy({sessionId: req.sessionID})
    if(!userLocation) {
        res.json({
            error: "User could not be found. Make sure to /register first."
        })
        return
    }

    // set location

    try {
        const userData = await userLocationRepository.save(userLocation)
        log(`User location saved: ${userData}`)
        res.json(userData)
    } catch(error) {
        logError("Error creating user", error)
        res.status(500).json()
    }
})



app.listen(port, () => {
    log(`Server running on port ${port}.`);
})