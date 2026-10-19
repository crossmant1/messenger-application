import { Router } from 'express';
import { Chat } from '../models/Chat.js';
import { requireAuth } from '../middleware/requireAuth.js';


export const chatRouter = Router();

function viewChat(chat) {
    return {
        id: chat._id.toString(),
        chat: chat.chatName || 'Private chat',//something
        isGroupChat: chat.isGroupChat, 
        participants: chat.participants,

        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt
    };
}

chatRouter.get('/', requireAuth, async (req, res, next) =>{
    try{
        const currentUserID = req.user.id;

        const chats = await Chat.find({participants: currentUserID}).populate('participants', 'username').sort({updatedAt: -1});

        return res.status(200).json({chats: chats.map(viewChat)});
    } catch (err){
        next(err);
    }
});


chatRouter.get('/:chatId', requireAuth, async (req, res, next) => {
    try {
        const currentUserId = req.user.id;
        const { chatId } = req.params;

        const chat = await Chat.findById(chatId)
            .populate('participants', 'username');

        if (!chat) {
            return res.status(404).json({ error: 'chat not found' });
        }

        const isParticipant = chat.participants.some(
            participant => participant._id.toString() === currentUserId
        );

        if (!isParticipant) {
            return res.status(403).json({ error: 'not authorized to view this chat' });
        }

        return res.status(200).json({
            chat: viewChat(chat)
        });
    } catch (err) {
        next(err);
    }
});

