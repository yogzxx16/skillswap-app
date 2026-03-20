import { db } from '../firebase';
import {
  collection, doc, setDoc, getDoc, addDoc,
  updateDoc, onSnapshot, query, where,
  orderBy, serverTimestamp
} from 'firebase/firestore';

export const getChatId = (uid1, uid2) =>
  uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;

export const createOrGetChat = async (currentUser, targetUser, initialMessage = null) => {
  const chatId = getChatId(currentUser.uid, targetUser.uid);
  const chatRef = doc(db, 'chats', chatId);
  const chatSnap = await getDoc(chatRef);

  if (!chatSnap.exists()) {
    // ✅ Only create + send message if chat is BRAND NEW
    await setDoc(chatRef, {
      chatId,
      participants: [currentUser.uid, targetUser.uid],
      participantNames: {
        [currentUser.uid]: currentUser.displayName,
        [targetUser.uid]: targetUser.displayName,
      },
      participantAvatars: {
        [currentUser.uid]: currentUser.photoURL || null,
        [targetUser.uid]: targetUser.photoURL || null,
      },
      lastMessage: initialMessage || 'Chat started',
      lastMessageTimestamp: serverTimestamp(),
      unreadCount: {
        [currentUser.uid]: 0,
        [targetUser.uid]: initialMessage ? 1 : 0,
      },
      createdAt: serverTimestamp(),
    });

    if (initialMessage) {
      await sendMessage(chatId, currentUser.uid, currentUser.displayName, initialMessage);
    }
  }
  // ✅ If chat already exists — just return chatId, NO duplicate messages!
  return chatId;
};

export const sendMessage = async (chatId, senderId, senderName, text) => {
  const messagesRef = collection(db, 'chats', chatId, 'messages');
  const chatRef = doc(db, 'chats', chatId);

  await addDoc(messagesRef, {
    text, senderId, senderName,
    timestamp: serverTimestamp(),
    read: false,
  });

  const chatSnap = await getDoc(chatRef);
  if (chatSnap.exists()) {
    const chatData = chatSnap.data();
    const otherId = chatData.participants.find(p => p !== senderId);
    await updateDoc(chatRef, {
      lastMessage: text,
      lastMessageTimestamp: serverTimestamp(),
      [`unreadCount.${otherId}`]: (chatData.unreadCount?.[otherId] || 0) + 1,
    });
  }
};

export const subscribeToChats = (uid, callback) => {
  const q = query(
    collection(db, 'chats'),
    where('participants', 'array-contains', uid)
  );
  return onSnapshot(q, snapshot => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  });
};

export const subscribeToMessages = (chatId, callback) => {
  const q = query(
    collection(db, 'chats', chatId, 'messages'),
    orderBy('timestamp', 'asc')
  );
  return onSnapshot(q, snapshot => {
    callback(snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate().toISOString() ?? new Date().toISOString(),
    })));
  });
};

export const markChatAsRead = async (chatId, uid) => {
  await updateDoc(doc(db, 'chats', chatId), {
    [`unreadCount.${uid}`]: 0,
  });
};

export const updateUserPresence = async (uid) => {
  await updateDoc(doc(db, 'users', uid), {
    lastSeen: serverTimestamp(),
  });
};

export const subscribeToUsersPresence = (callback) => {
  return onSnapshot(query(collection(db, 'users')), snapshot => {
    const map = {};
    snapshot.forEach(doc => {
      map[doc.id] = doc.data().lastSeen?.toDate() || null;
    });
    callback(map);
  });
};