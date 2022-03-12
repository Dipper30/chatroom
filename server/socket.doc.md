[toc]

# Canvas-2D-Game Styled Chatroom Socket.IO Solutions

## Abstract: How socket.io works in Node Express and React

## Situations where socket.io is applied

### 1. Each map of the game will use an independent namespace of the socket

Assuming we are expecting 3 different "Halls" / "Maps" in our game, our system will create 3 namespaces, so users are separated by theses halls. 

This is how the socket broadcast the frame information for each user in a certain map.
``` js
// for users in hall1
sokcet.of('/hall1').broadcast();

// for users in hall2
sokcet.of('/hall2').broadcast();
```

### 2. Users will create chatrooms in a map

In each Map, users can create their own chatrooms. Notice that one user can join only one chatroom a time.

Here is how we create a room with an id. The id can be offered by the user or simply uses timestamp combined with the user id.
``` js
const roomId = 'some room'
io.on('connection', socket => {
  socket.join(roomId);
});
```

### 3. Dynamic namespace

Still figuring out...

In my imagination, a user will request a private 'Map' of the game. For example, a user is requesting a private meeting room, and the server will generate a route(namespace) in database record, assuming it is '/meetingroom/[encrpted_meeting_room_id_with_user_id]', where it consists of a dynamic route(namespace): '/meetingroom/:mid'. Note that '/meetingroom' alone is supposed to be the general/reserved namespace for the 'MeetingRoom Map', while with the assigned url, it should be private and take the user id included in the encrypted url as the admin user. Correct passwords will be required for other users to join in. This namespace, however, should be temporary, with an expire date/time.

When a user is trying to connect the socket with private namespace, the server will search the db for the namespace and check his/her id or password. If all information is correct, the user will successfully connect to the sokcet. If the user fail to exit the "Map" before the expiration time, he / she will be forced to exit.