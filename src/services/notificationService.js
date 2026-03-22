// ── Notification Service ─────────────────────────────────────
// Uses browser's built-in Notifications API — 100% free!

// src/services/notificationService.js

export const requestNotificationPermission = async () => {
    if (typeof Notification === 'undefined') return false;

    if (Notification.permission === 'granted') return true;

    if (Notification.permission === 'denied') return false;

    const permission = await Notification.requestPermission();
    return permission === 'granted';
};
export const sendNotification = (title, body, options = {}) => {
    if (!('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;

    const notification = new Notification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: options.tag || 'skillswap',
        requireInteraction: options.requireInteraction || false,
        ...options,
    });

    // Auto close after 5 seconds
    setTimeout(() => notification.close(), 5000);

    // Click opens the app
    notification.onclick = () => {
        window.focus();
        if (options.url) window.location.href = options.url;
        notification.close();
    };

    return notification;
};

// Specific notification types
export const notifyNewSwapRequest = (fromName, skill) => {
    sendNotification(
        '🤝 New Swap Request!',
        `${fromName} wants to swap ${skill} with you!`,
        { tag: 'swap-request', url: '/swaps', requireInteraction: true }
    );
};

export const notifySwapAccepted = (byName) => {
    sendNotification(
        '✅ Swap Accepted!',
        `${byName} accepted your swap request! Start your session now.`,
        { tag: 'swap-accepted', url: '/swaps', requireInteraction: true }
    );
};

export const notifyNewMessage = (fromName, message) => {
    sendNotification(
        `💬 ${fromName}`,
        message.length > 60 ? message.substring(0, 60) + '...' : message,
        { tag: 'new-message', url: '/chat' }
    );
};

export const notifySwapComplete = (partnerName, xpEarned) => {
    sendNotification(
        '🎉 Swap Complete!',
        `You and ${partnerName} completed a swap! +${xpEarned} XP earned!`,
        { tag: 'swap-complete', url: '/profile' }
    );
};

export const notifyStreakReminder = (streak) => {
    sendNotification(
        '🔥 Keep your streak alive!',
        `You have a ${streak} day streak! Login tomorrow to keep it going.`,
        { tag: 'streak-reminder' }
    );
};