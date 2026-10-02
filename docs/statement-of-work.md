# Statement of Work

## Thomas Crossman

### Part 1 - Project Purpose and Objectives

The purpose of this project is to develop a software system called Messenger. This will be a communication application similar to Discord. This project takes a broad concept into a constrained system. It will be delivered by November 2nd, 2026 to the client. 

The software seeks to fulfill several objectives:
* Have a user account creation and secure login
* Feature private user to user chats with history preserved
* Group chats with three ore more users
* Limit conversation access to only logged-in users. 

### Part 2 - Stakeholders

| Stakeholder | Relationship to Project | 
|-------------|-------------------------|
| Client | Defines the specifications and receives the software system after completion. They will answer specification questions, be updated on milestones, and confirm priorities. |
| End Users | The users who will use the product after it's release. They are interested in ease of use and reliable message communication. |
| Development Team | Those who are actually building the software system, and are responsible for its design and technical debt. They work with the client and agree on a schedule and scope of the product. |
| Deployment Team | Responsible for communicating with the Development Team to ensure the product is able run in the environment it is going in. |

### Part 3 - Scope

This project has a November 2nd deadline, which limits some of the features that are in-scope. 

#### In-scope features

* Users will have the ability to create and login to accounts. 
* Users can search for other users to chat with by searching their username. 
* Direct messaging between two users will be supported. 
* Group chats can be made for three or more users. 
* A GUI will display a logged in user their chats and direct messages. 
* Messages history will be stored for all chats. 
* Passwords will be hashed in the database. 

#### Out of scope features

* File/image transfer
* Emojis
* Voice calls or screen sharing 
* App support 
* Public group chats
* End-to-End encryption beyond TLS


### Part 4 - Deliverables

| Deliverable | Contents/Outcome | Evidence |
|-------------|------------------|----------|
| Statement of Work and Requirements | These documents show the project scope, timetable of delivery, and acceptance criteria. | The documents are reviewed by the client. |
| Diagrams/Analysis | This document shows the architecture, data flows, and deployment from a top level perspective. | It is reviewed and approved by the client. |
| Test Release 1 | This version of the software will demonstrate basic chat functionality and testing deployment. | Messages are able to be sent between accounts. |
| Testing package | A testing suite that has good code coverage and can help create a list of bugs to fix and remaining features to implement. | Core tests pass and failed tests are documented. |
| Deployment and handoff | The completed software system is handed off to the client. | Client receives and is able to run the system. |


### Part 5 - Assumptions, Constraints, and Dependencies

#### Assumptions

* The project will have one central server that multiple users can connect to. 
* The client will review progress and answer questions that come up. 
* The software is limited to a handful of users and not suitable for commercial deployment. 
* It will just be a web-based version, no mobile app support. 

#### Constraints

* The final delivery date is set to November 2nd, 2026, and cannot be pushed back. This constraints the development cycle. 
* The project is limited to free-tier products, meaning no Azure database or VM for deployment. 


#### Dependencies

* Hosting the code, the environment, and final deployment. 
* Libraries/frameworks used by the code. 
* 

### Part 6 - Milestones and schedule



### Part 7 - Acceptance

The product is marked as complete when the project's purpose and objectives are met via the agreed upon deliverables. This includes handing off deliverables during the product's development phase to the client, including the statement of work, requirements, diagrams and analysis, and final software system. Because of frequent communication between the client and the development team, the actual final deliverable's scope might change a bit depending on meetings during its development. 