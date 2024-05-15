# User Location Challenge

## Description

Summary
Create a 1-page website that allows users to enter their position and a desired distance. The website will then display all other users within that distance from the entered position.

Requirements
User Input:
Users can enter:
- A username (must be unique across all users).
- A position (representing the user's current position). The position can be either:
- Latitude/Longitude (if using this, the distance should be in miles).
- X/Y coordinates (if using this, the distance can be unitless).
- A distance.
- The website will persist the username and position entered.

Functionality:
- When a user enters their information, in addition to persisting it, the website will display the usernames of all other users whose positions are within the given distance from the entered position.
- The search results should exclude the user who performed the search.
- Each browser session represents a single user:
- The first entry of user information will add a new user.
- Subsequent entries will update the existing user's information.
- Refreshing the page will clear any session information, effectively treating it as a new user.

Notes
If you choose to do lat/long, you can use this docker-compose file if you'd like to get postgis up and running.

```yml
version: '2'

services:
    db:
        image: 'postgis/postgis:11-3.3-alpine'
        container_name: db
        environment:
            - POSTGRES_DB=db
            - POSTGRES_USER=postgres
            - POSTGRES_PASSWORD=postgres
            - TZ=UTC
            - PGTZ=UTC
        volumes:
            - ./docker/postgres/docker-entrypoint-initdb.d:/docker-entrypoint-initdb.d
            - postgres:/var/lib/postgresql/data
        ports:
            - '5432:5432'

volumes:
    postgres:
```