# Project Requirements

## Thomas Crossman

### Part 1 - System context

The messenger application is a that features chat communication between users and group chats among three or more users. The system boundary is it contains private chats, group chats, user registration and authentication, user lookup, message history, and input validation. 

It doesn't include voice calls, screensharing, file transfer, friending, or mobile app support. 

| Actor/External System | Interaction |
| ----------------------|-------------|
| User | Needs to authenticate, see conversations, send messages, see message history, and manage their account. |
| Client | Reviews requirements, answers questions, accepts the final deliverable. |
| Database | External database for storage of user accounts, message history, and other metadata. |

### Part 2 - Functional requirements

| Number | Requirment | Description | 
|-------|------------|--------------|
| FR-01 | User registration | Anyone can register for an account by filling out the 'Create Account' form. |
| FR-02 | Unique usernames | Any new account cannot reuse an exsiting user's username. |
| FR-03 | User authentication | A user must authenticate with the system to access their account and chats. |
| FR-04 | Logout | A logged in user can log out. |
| FR-05 | User Identifation | A user's username must be visible in any chat, tying them to the message. |
| FR-06 | Private chats | A logged in user can create a private chat with an existing user. |
| FR-07 | Private chatting | A logged in user can send messages to an exsiting user. |
| FR-08 | Message history | All messages sent are recorded in the database with the sender, chat, and message. |
| FR-09 | Group chatting | A user can create a group chat of three or more people. |
| FR-10 | Adding memebers to group chats | The group owner can add existing users to the group chat. |
| FR-11 | Removing members from group chats | The group owner can remove members from the group chat. |
| FR-12 | Leaving a group chat | A user can remove themselves from a group chat. |
| FR-13 | Group chatting | A member in a group chat can send a message in it. |
| FR-14 | Group message history | All messages sent are recorded in the database with the sender, chat, and message. |
| FR-15 | List of conversations | A logged in user can see a list of chats they are a part of. |
| FR-16 | Chat members | A member of a group chat can see other users in the chat. |
| FR-17 | Authentication handling | Unauthroized users cannot access any system resources besides accessing the account creation form. 
| FR-18 | Leaving private chats | A user can leave a private chat and no longer receive messages from that user. |

### Part 3 - Non-functional requirements

| Number | Requirment | Description |
|--------|------------|-------------|
| NFR-01 | Password hashing | The password will be hashed in the database. |
| NFR-02 | Authorization checks | Anytime a user attempts to access server resources, authroization checks are required. |
| NFR-03 | Data persistence | The database must store a history of messages, including the chat they are associated with and the user that sent them. |
| NFR-04 | Data integrity | The data must be consistent in the database, with no unauthored messages or unassociated data. |
| NFR-05 | Scope | The system must implement the agreed upon functionality. |

### Part 4 - Acceptance criteria

#### AC-01: Account registraion and authroization

1. From a new browser, a user register a new account after filling out the registration from. 
2. Another user cannot sucessfully create a new account with an existing username, this is caught and conveyed to the user. 
3. The user can log into their newly created account. 
4. Incorrect credientials result in a rejected login attempt. 
5. Logging out unauthenticates a user. 

#### AC-02: Private messaging

1. Two registered users can create a private chat. 
2. User A can send a message, and user B can view it. 
3. The message history is persistent across sessions. 
4. No other user has access to the chat. 

#### AC-03: Group messaging

1. A logged in user can create a group chat, and is the owner. 
2. The owner can add at least 2 other users to the group. 
3. Members of the group can see and send messages in the group chat. 
4. The owner can remove a member, and they can't send messages anymore. 
5. A member can remove themselves from a group. 
6. All mesages display the username of the member who sent it. 

#### AC-04: Authorization and validation

1. An unathorized attempt to view a chat is denied. 
2. A unauthenticated user cannot view any chats. 
3. A non-member request for a group conversation is denied. 
4. An invalid message provides a descriptive error and is not persistent. 

### Part 5 - Assumptions and unresolved questions

#### Assumptions

1. This system is a web application only, no mobile app support. 
2. Messages are text only, no images/file/emojis. 
3. Usernames serve as the unique identifier for distinguishing accounts. 
4. The user who creates a group is the group owner and can add/remove members. 
5. The tech stack has not been decided upon, and is up the developers choice. 

#### Unresolved Questions

1. What fields need to be in the registration from besides username and password?
2. Is password recovery required?
3. Is password authentication sufficient?
4. Is letting users search by username good?
5. What happens if a group owner leaves a group?
6. What is the final deployment environemnt?
7. Is profile deletion needed?

#### Conflicts/ambiguities

The description provided only specifies group and private messaging. It mentions nothing about authentication, message history, group roles, or tech stack. Any stakeholder change should be reflected in an updated statement of work. 

### Part 6 - Traceability

| Requirement | Source/reason for requirement |
|-------------|--------|
| FR-01 | Having user accounts is the best way to manage saving chats and assocating messages with a user. |
| FR-02 | In order for accounts to be distinguishable, they must have unique usernames. |
| FR-03 | For assocating messages with a user to have any meaning, only that user should be able to access their account. |
| FR-04 | To protect user's data, they must be able to log out. |
| FR-05 | To give context to other users, a user's message should be displayed with their username. |
| FR-06 | This is a requirement from the stakeholder. |
| FR-07 | This is a requirement from the stakeholder. |
| FR-08 | In order to give chats context and for message review, it is very helpful to have chat history. |
| FR-09 | This is a requirement from the stakeholder. |
| FR-10 | In order to have a group chat, you must be able to add members to it. |
| FR-11 | This is a feature that gives more usability to the system and enhances user expierence. |
| FR-12 | This is another feature that makes the system better for the user. |
| FR-13 | This is a requirement from the stakeholder. |
| FR-14 | This is important so users can see older messages and review chats if they were not online when the conversation happened. |
| FR-15 | This is a requirement from the stakeholder. |
| FR-16 | This feature enables a better user expiereence because users can see who they are sending messages to. |
| FR-17 | This makes the system secure, as chats remain private. |
| NFR-01 | Password hashing is a necessary security feature. |
| NFR-02 | In order to ensure FR-05 is that user, this is important. |
| NFR-03 | For FR-08, FR-14, NFR-01, FR-02, FR-15, and FR-16, data persistance is vital to keeping chats private and accounts accounted for. |
| NFR-04 | For messages to have any meaning, the reciepient has to have with only unfounded doubt that it is the real user sending the messages. |
| NFR-05 | The system must provide what is laid out in the statement of work. | 