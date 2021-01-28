# Water_My_Plants_Back_End
API that works with Front End to deliver an application which helps a user log their plants and the plants' watering schedule so that they can make sure to water the plants on time. 

## API 
- Base url: https://water-my-plants-backend-node.herokuapp.com/

# Authentication 
| Endpoint | Description | Required In Body | Optional In Body |
| -------- | ----------- | --------------- | ----------| 
| POST /auth/register | Registers a new user in the database and returns a JWT | username, password | firstname, lastname, phone, email |
| POST /auth/login | Logs in a registered user and returns a JWT | username, password | n/a |

# Users 
| Endpoint | Description | Required In Header | Optional |
| -------- | ----------- | --------------- | ----- |
| GET /users/getByUsername | Returns a registered user's information except for the password | authorization: {JWT (json web token)} | n/a |
| PUT /users/editUser | Edits a registered user's information | authorization: {JWT (json web token)} | In body - tag followed by the new change. Ex. To edit the email: {email: email_to_change_to} | 
| DEL /users/ | Removes registered user from database | authorization: {JWT (json web token)} | n/a |

# Plants
| Endpoint | Description | Required In Header | Optional |
| -------- | ----------- | --------------- | ----- |
| GET /plants | Returns the user's plants | authorization: {JWT (json web token)} | n/a |
| POST /plants/addPlant | Adds plant for the user | authorization: {JWT (json web token)} | Body: name, water_frequency, species - optional, image - optional | 
| PUT /plants/editPlant/:plantId | Edits the user's plant based on given plant id | authorization: {JWT (json web token)} | In body - tag followed by the new change. Ex. To edit the name: {name: name_to_change_to} |
| DEL /plants/:plantId | Deletes the plant with the given id from the user's plant list | authorization: {JWT (json web token)} | n/a |