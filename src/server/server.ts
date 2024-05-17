import express from 'express';
import session from 'express-session'
import cors from 'cors'
import {
    Column,
    DataSource,
    Entity,
    IsNull,
    JoinColumn,
    LessThanOrEqual,
    ManyToOne,
    Not,
    PrimaryGeneratedColumn,
    Unique
} from "typeorm";

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

    @Column({nullable: false, unique: true})
    username: string;

    @Column({unique: true})
    sessionId: string;

    @Column({nullable: true})
    positionX: number;

    @Column({nullable: true})
    positionY: number;

    @Column({nullable: true})
    distance: number;
}

@Entity()
@Unique(["userOne", "userTwo"])
class UsersDistance {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => UserLocation)
    @JoinColumn()
    userOne: UserLocation

    @ManyToOne(() => UserLocation)
    @JoinColumn()
    userTwo: UserLocation

    @Column({nullable: false, type: "float"})
    distance: number
}

const datasource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '',
    database: 'user_location',
    entities: [UserLocation, UsersDistance],
    synchronize: true,
    // dropSchema: true,
    logging: true
})

const userLocationRepository = datasource.getRepository(UserLocation)
const usersDistanceRepository = datasource.getRepository(UsersDistance)

datasource.initialize()
    .then(() => {
        log("Data source has been initialized.")
    })
    .catch((err) => {
        logError("Error initializing datasource", err)
    })

app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true
}))

// Get session middleware
app.use(session({
    secret: '1234567890',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000*60*60,
    }
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
    } catch (error) {
        logError("Error retrieving data", error)
        res.status(500).json()
    }
})

/**
 * Register a new user
 *
 * Example request payload:
 * {
 *     "username": "johndoe"
 * }
 */
app.post('/register', async (req, res) => {
    // Check if user already registered from the session
    if (await userLocationRepository.existsBy({sessionId: req.sessionID})) {
        res.json({
            error: "User was already registered. For updating data use /updateLocation."
        })
        return
    }

    if (await userLocationRepository.existsBy({username: req.body.username})) {
        res.json({
            error: "Username was already taken, please user another one."
        })
        return
    }

    // New user
    let newUser = new UserLocation()
    newUser.username = req.body.username
    newUser.sessionId = req.sessionID

    try {
        const userData = await userLocationRepository.save(newUser)
        log(`User ${userData.username} registered successfully.`)
        res.status(201).json(userData)
    } catch (error) {
        logError("Error creating user", error)
        res.status(500).json()
    }
})

/**
 * Returns a list of users that are near me based on my position and distance.
 */
app.get('/usersnearme', async (req, res) => {
    let currentUser = await userLocationRepository.findOneBy({sessionId: req.sessionID})
    if (!currentUser) {
        res.json({
            error: "User could not be found. Make sure to /register first."
        })
        return
    }
    log(`Looking for users near ${currentUser.username} . . .`)

    const nearUsers = await usersDistanceRepository
        .createQueryBuilder("ud")
        .select(["ud.distance", "u1.username", "u1.positionX", "u1.positionY", "u2.username", "u2.positionX", "u2.positionY"])
        .leftJoin("ud.userOne", "u1")
        .leftJoin("ud.userTwo", "u2")
        .where({distance: LessThanOrEqual(currentUser.distance)})
        .andWhere([
            {userOne: currentUser},
            {userTwo: currentUser}
        ])
        .execute()

    log(`Found ${nearUsers.length} users near ${currentUser.username}`)
    res.json(nearUsers)
})

/**
 * Update user location
 *
 * Example payload:
 * {
 *     "positionX": 10,
 *     "positionY": 20,
 *     "distance": 30
 * }
 */
app.post('/updateLocation', async (req, res) => {
    // Check if user already registered from the session
    let currentUser = await userLocationRepository.findOneBy({sessionId: req.sessionID})
    if (!currentUser) {
        res.json({
            error: "User could not be found. Make sure to /register first."
        })
        return
    }
    log(`Updating location for user ${currentUser.username}`)

    // If position or desired distance didn't change, do nothing
    if (currentUser.positionX === req.body.positionX
        && currentUser.positionY === req.body.positionY
        && currentUser.distance === req.body.distance) {
        log("User Location parameters didn't change, skipping.")
        res.status(301).json()
        return
    }

    // set location data
    currentUser.positionX = req.body.positionX
    currentUser.positionY = req.body.positionY
    currentUser.distance = req.body.distance

    try {
        const userData = await userLocationRepository.save(currentUser)
        log(`User location saved: ${JSON.stringify(userData, null, 4)}`)
        res.json(userData)
    } catch (error) {
        logError("Error creating user", error)
        res.status(500).json()
    }

    // Saving user location at this point is done, from now on these update tasks can and should be done in an async
    // operation due to its heavy load that is increasingly more heavy the more amount of existing users in the DB
    await updateUserDistanceToOtherUsers(currentUser)
})

app.listen(port, () => {
    log(`Server running on port ${port}.`);
})

const updateUserDistanceToOtherUsers = async (currentUser: UserLocation) => {
    log(`Deleting existing calculated distanced for ${currentUser.username}`)
    // Delete all existing distances from UsersDistance table
    await usersDistanceRepository.createQueryBuilder().delete()
        .where([{userOne: currentUser},
            {userTwo: currentUser}])
        .execute()

    // Update UsersDistance with all distances from this user to all other users
    let allOtherUsers = await userLocationRepository.find({
        where: {
            id: Not(currentUser.id),
            positionY: Not(IsNull()),
            positionX: Not(IsNull()),
            distance: Not(IsNull()),
        }
    })

    let distanceToOtherUsers: UsersDistance[] = []
    allOtherUsers.forEach((otherUser: UserLocation) => {
        let usersDistance = new UsersDistance()
        usersDistance.userOne = currentUser
        usersDistance.userTwo = otherUser
        usersDistance.distance = calculateDistance(currentUser, otherUser)
        distanceToOtherUsers.push(usersDistance)
    })

    log(`Creating distance from ${currentUser.username} to all other users: `, JSON.stringify(distanceToOtherUsers, null, 4))

    // Save all distances in one operation
    await usersDistanceRepository.save(distanceToOtherUsers)
}


/**
 * Calculates the distance between two users
 *
 * This is probably one of the most important operations of the challenge. There are lots of
 * distance algorythms, but for the sake of simplicity I am going to apply the Euclidean distance.
 *
 * The formula for calculating distance between 2 points:
 *
 * d = √[(x2 – x1)^2 + (y2 – y1)^2]
 *
 * @param userOne
 * @param userTwo
 * @return the distance between users
 */
const calculateDistance = (userOne: UserLocation, userTwo: UserLocation): number => {
    return Math.sqrt(((userOne.positionX - userTwo.positionX) ** 2) + ((userOne.positionY - userTwo.positionY) ** 2))
}