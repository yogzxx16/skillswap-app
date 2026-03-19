import { db } from '../firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  addDoc, 
  updateDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';

/**
 * Generate a consistent chat ID between two users.
 */
export const getChatId = (uid1, uid2) => {
  return uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;
};

/**
 * Creates a new chat or returns existing one.
 */
export const createOrGetChat = async (currentUser, targetUser, initialMessage = null) => {
  const chatId = getChatId(currentUser.uid, targetUser.uid);
  const chatRef = doc(db, 'chats', chatId);
  
  const chatSnap = await getDoc(chatRef);
  
  if (!chatSnap.exists()) {
    const chatData = {
      chatId,
      participants: [currentUser.uid, targetUser.uid],
      participantNames: {
        [currentUser.uid]: currentUser.displayName,
        [targetUser.uid]: targetUser.displayName
      },
      participantAvatars: {
        [currentUser.uid]: currentUser.photoURL || null,
        [targetUser.uid]: targetUser.photoURL || null
      },
      lastMessage: initialMessage || 'Chat started',
      lastMessageTimestamp: serverTimestamp(),
      unreadCount: {
        [currentUser.uid]: 0,
        [targetUser.uid]: initialMessage ? 1 : 0
      },
      createdAt: serverTimestamp()
    };
    
    await setDoc(chatRef, chatData);
    
    if (initialMessage) {
      await sendMessage(chatId, currentUser.uid, currentUser.displayName, initialMessage);
    }
  } else if (initialMessage) {
    // If chat exists, just send the initial auto-message
    await sendMessage(chatId, currentUser.uid, currentUser.displayName, initialMessage);
  }
  
  return chatId;
};

/**
 * Send a message in a specific chat.
 */
export const sendMessage = async (chatId, senderId, senderName, text) => {
  const messagesRef = collection(db, 'chats', chatId, 'messages');
  const chatRef = doc(db, 'chats', chatId);
  
  // 1. Add the message document
  await addDoc(messagesRef, {
    text,
    senderId,
    senderName,
    timestamp: serverTimestamp(),
    read: false
  });
  
  // 2. Update the chat document with last message details
  // First, get the chat to increment the unread count appropriately
  const chatSnap = await getDoc(chatRef);
  if (chatSnap.exists()) {
    const chatData = chatSnap.data();
    const otherParticipantId = chatData.participants.find(p => p !== senderId);
    
    await updateDoc(chatRef, {
      lastMessage: text,
      lastMessageTimestamp: serverTimestamp(),
      [`unreadCount.${otherParticipantId}`]: (chatData.unreadCount?.[otherParticipantId] || 0) + 1
    });
  }
};

/**
 * Subscribe to the authenticated user's chat list.
 */
export const subscribeToChats = (uid, callback) => {
  const chatsQuery = query(
    collection(db, 'chats'),
    where('participants', 'array-contains', uid),
    orderBy('lastMessageTimestamp', 'desc')
  );
  
  return onSnapshot(chatsQuery, (snapshot) => {
    const chats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(chats);
  });
};

/**
 * Subscribe to messages in a particular chat.
 */
export const subscribeToMessages = (chatId, callback) => {
  const messagesQuery = query(
    collection(db, 'chats', chatId, 'messages'),
    orderBy('timestamp', 'asc')
  );
  
  return onSnapshot(messagesQuery, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // convert serverTimestamp to ISO string or fallback if pending
      timestamp: doc.data().timestamp?.toDate().toISOString() || new Date().toISOString()
    }));
    callback(messages);
  });
};

/**
 * Target user marked the chat as read.
 */
export const markChatAsRead = async (chatId, currentUserId) => {
  const chatRef = doc(db, 'chats', chatId);
  await updateDoc(chatRef, {
    [`unreadCount.${currentUserId}`]: 0
  });
};

/**
 * Call this periodically or on app interactions to update presence
 */
export const updateUserPresence = async (uid) => {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    lastSeen: serverTimestamp()
  });
};

/**
 * Subscribe to the users collection to check the online status.
 */
export const subscribeToUsersPresence = (callback) => {
  const usersQuery = query(collection(db, 'users'));
  return onSnapshot(usersQuery, (snapshot) => {
    const presenceMap = {};
    snapshot.forEach(doc => {
      const data = doc.data();
      presenceMap[doc.id] = data.lastSeen?.toDate() || null;
    });
    callback(presenceMap);
  });
};
