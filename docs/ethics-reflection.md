# Ethics Reflection

## Thomas Crossman

### Part 1 - Design impact analysis

Designing and implementing this software system will have impacts across several dimensions of society and culture. 

#### 1. Cultural Impact

 We are a social society and rely on interaction with others. On a positive note, his application will help to connect users with differeing backgrounds together. Messaging like this can make it easier for people to remain in contact if they can't be together physically. A negative impact is there can be some miscommunication relating to intent with text messaging, as it is more difficult to convey inflections and meaning. This is a insignificant negative impact that is true for all messaging applications. 

#### 2. Economic Impact

This messenger application is barebones, so it is not going to have a significant overhead cost to run or be used by an organizaiton. Its server and database needs are very dependent on usage, so someone running the sotware would have a price scalable to groups sizes and active users. These are positive because the messenger application should not have a economic impact on those using it. One nevative impact is if the proejct runs beyone its November 2nd delivery date, it could cause the project to run over budget and will cost more for the stakeholders. This can be mitigated by adhering to strict scope constraints and scheduling. 

#### 3. Environmental Impact

This application does not have any significant impact on the environment other than the resources required to run the server, like electricity. This can have a slight negative impact depending on how the electricity is generated. To help reduce this, unnecessary features and processes should be remvoed to reduce compute resources. 

#### 4. Global Impact

The messenger application can have a positive global impact as it is able to connect peopel in different locations together. This supports collaboration and information exchange across the world. However, this comes with negative impacts as well. For example, this system is designed by one person, with one worldview. This means the system might not work the same for someone in a different culture or way of communicating. This is not really possible to mitigate other than a thorough analysis of the product to ensure it is not intentionally excluding someone. 

#### 5. Pubic Health Impact

It can have a positive health impact because people distanced can still communicate with each other. This is important for us as social beings. Groups can also coordinate events and activites, as they can reach many people at once. However, there are social pressures involving instant messaging can drive people to feel they need to respond quickly. Additionally, repeated notifications can be distraction. Mitigating these issues are on the user to have self-dicipline and not the responsibility of the owner or developer. 

#### 6. Public Safety Impact

This system doesn't help public safety other than it logs who sends what messages, so if someone is sending something problematic it can be tracked. On the negative side, if an attacker was able to gain access to the server and view/send messages on user's behalf, this is a significant issue. This could harm relationships, hurt people, and even get people into trouble. Mitigating this problem is reliant on robust authorization enforcement and practices good security principles. 

#### 7. Public Welfare Impact

It can help public welfare by connecting communities, families, and groups. People can exchange information without needing to physically be together. A potential negative impact is bad actors can harrass, bully, or spam people using this system. Because there is no banning mechanism, it can be difficult to stop. Mitigating this potential issue is relaint on members removing themselves from chats or telling the group owner to remove someone. 

#### 8. Social Impact

Again, as social beings we need communication to be happy. This system can help us exercise that need by supporting message exchanges. This can help people maintain relationships and groups manage informing large numbers of people important information. The negative potential impact is similar to the welfare impact, as people can misue the system to spread misinformation or try to hurt people. 

### Part 2 - Connect ethics to engineering

#### 1. Unauthorized access to messages

**Stakeholder:** End users using the system. 

**Potential harm:** Private information could be leaked and spread aound to people who should not have access to it. This can hurt people's mental health and cause serious distress. 

**Mitigation:** Use authorizaiton checkpoints for every server side request from a client, and impose all the usual protections of a database to prevent attacks like SQL injection or similar issues. The idea is to make the user's password the weakest link to accessing their messages. 

**Engineering impact:** This directly relates to FR-03 and 17, NFR-01 and 02. 

This is an ethical concern because the system must be secure for users to comfortably be able to share messages with each other that might relate to confidential topics. 

#### 2. Online bullying

**Stakeholder:** End users. 

**Potential harm:** Bad actors can use the system to spread hate speech with the intent of hurting a group of people. 

**Mitigation:** The software will not have a global reporting system, so the impacted users will have to take matters into their own hands. In group chats, they will have to ask the owner to remove the person or they should remove themselves. In private chatting, they would have to block the user to stop receiving messages. 

**Engineering impact:** This relates to FR-11 and 12, and has lead to the creating of FR-18, allowing users to remove themselves from private chats. 

This ethical concern is important becuase of the prevalance of cyber-bullying and those wanting to hurt other people. 

### Part 3 - AI-Assisted Work

In this assignment, AI tools were used to generate the different diagrams used through the docuemnts. For example, to create the gantt chart, I gave the tool a prompt specifying the start and end dates of the project, and I specified the different day breakdowns for adding the features/functional requirements. I did this because with specific instructions, they are good at making clean diagrams with effectively convey the message to a reviewer. 

