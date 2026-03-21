import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import {
    doc, getDoc, updateDoc, onSnapshot,
    collection, addDoc, serverTimestamp
} from 'firebase/firestore';
import PageTransition from '../components/PageTransition';

export default function SessionRoomPage() {
    const { swapId } = useParams();
    const { user, profile, updateProfile } = useAuth();
    const navigate = useNavigate();

    const [swap, setSwap] = useState(null);
    const [loading, setLoading] = useState(true);
    const [callActive, setCallActive] = useState(false);
    const [completing, setCompleting] = useState(false);
    const [iMarkedComplete, setIMarkedComplete] = useState(false);
    const [toast, setToast] = useState('');

    const roomName = `skillswap-${swapId}`;
    const jitsiUrl = `https://meet.jit.si/${roomName}`;

    useEffect(() => {
        if (!swapId) return;
        const unsub = onSnapshot(doc(db, 'swapRequests', swapId), (snap) => {
            if (snap.exists()) {
                const data = { id: snap.id, ...snap.data() };
                setSwap(data);
                // Check if current user already marked complete
                if (data.completedBy?.includes(user?.uid)) {
                    setIMarkedComplete(true);
                }
                // Both marked complete — finalize!
                if (
                    data.completedBy?.length === 2 &&
                    data.status !== 'completed'
                ) {
                    finalizeSwap(data);
                }
            }
            setLoading(false);
        });
        return () => unsub();
    }, [swapId, user]);

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(''), 3000);
    };

    const finalizeSwap = async (swapData) => {
        try {
            // Mark swap as completed
            await updateDoc(doc(db, 'swapRequests', swapId), {
                status: 'completed',
                completedAt: serverTimestamp(),
            });

            // Award XP + coins to both users
            const xpReward = 100;
            const coinReward = 50;

            const updateUser = async (uid, name) => {
                const userRef = doc(db, 'users', uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    const userData = userSnap.data();
                    const newXP = (userData.xp || 0) + xpReward;
                    const newCoins = (userData.coins || 0) + coinReward;
                    const newSwapCount = (userData.swapCount || 0) + 1;

                    // Calculate level
                    let level = 'Beginner';
                    if (newXP >= 3000) level = 'Master';
                    else if (newXP >= 1500) level = 'Expert';
                    else if (newXP >= 500) level = 'Intermediate';

                    // Check badges
                    const existingBadges = userData.badges || [];
                    const newBadges = [...existingBadges];

                    const addBadge = (id, name, icon) => {
                        if (!newBadges.find(b => b.id === id)) {
                            newBadges.push({ id, name, icon });
                        }
                    };

                    if (newSwapCount >= 1) addBadge('first_swap', 'First Swap', '🤝');
                    if (newSwapCount >= 5) addBadge('skill_trader', 'Skill Trader', '⚡');
                    if (newSwapCount >= 10) addBadge('swap_master', 'Swap Master', '🏆');
                    if (newXP >= 500) addBadge('intermediate', 'Intermediate', '📈');
                    if (newXP >= 1500) addBadge('expert', 'Expert', '🎯');
                    if (newXP >= 3000) addBadge('master', 'Master', '👑');

                    await updateDoc(userRef, {
                        xp: newXP,
                        coins: newCoins,
                        level,
                        badges: newBadges,
                        swapCount: newSwapCount,
                    });
                }
            };

            await updateUser(swapData.fromUid, swapData.fromName);
            await updateUser(swapData.toUid, swapData.toName);

            // Add to activity feed
            await addDoc(collection(db, 'activity'), {
                userName: swapData.fromName,
                userCity: '',
                action: `completed a skill swap with ${swapData.toName}! 🤝`,
                timestamp: serverTimestamp(),
            });

            // Update local profile if current user
            if (updateProfile) {
                const userRef = doc(db, 'users', user.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    const d = userSnap.data();
                    updateProfile({
                        xp: d.xp,
                        coins: d.coins,
                        level: d.level,
                        badges: d.badges,
                        swapCount: d.swapCount,
                    });
                }
            }
        } catch (err) {
            console.error('Finalize error:', err);
        }
    };

    const handleMarkComplete = async () => {
        if (iMarkedComplete || completing) return;
        setCompleting(true);
        try {
            const swapRef = doc(db, 'swapRequests', swapId);
            const swapSnap = await getDoc(swapRef);
            const existing = swapSnap.data()?.completedBy || [];

            if (!existing.includes(user.uid)) {
                await updateDoc(swapRef, {
                    completedBy: [...existing, user.uid],
                });
            }

            setIMarkedComplete(true);
            const otherName = swap.fromUid === user.uid ? swap.toName : swap.fromName;
            showToast(`✅ Marked complete! Waiting for ${otherName} to confirm...`);
        } catch (err) {
            console.error('Error marking complete:', err);
        } finally {
            setCompleting(false);
        }
    };

    const isMe = (uid) => uid === user?.uid;
    const partnerName = swap
        ? isMe(swap.fromUid) ? swap.toName : swap.fromName
        : '';
    const mySkill = swap
        ? isMe(swap.fromUid) ? swap.offeredSkill : swap.wantedSkill
        : '';
    const theirSkill = swap
        ? isMe(swap.fromUid) ? swap.wantedSkill : swap.offeredSkill
        : '';

    const swapCompleted = swap?.status === 'completed';

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!swap) {
        return (
            <div className="text-center py-20">
                <p className="text-slate-400 font-headline uppercase">Session not found</p>
                <button onClick={() => navigate('/swaps')} className="mt-4 px-6 py-2 bg-primary/20 text-primary font-headline text-xs uppercase border border-primary/30">
                    Back to Swaps
                </button>
            </div>
        );
    }

    return (
        <PageTransition className="space-y-6 pb-12">

            {/* Toast */}
            {toast && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-primary text-on-primary-fixed px-6 py-3 font-headline font-black uppercase tracking-widest text-xs rounded-full shadow-2xl">
                    {toast}
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="material-symbols-outlined text-tertiary text-xs">swap_horiz</span>
                        <span className="font-mono text-[10px] tracking-[0.3em] text-tertiary uppercase">Skill Session</span>
                    </div>
                    <h1 className="font-headline font-black text-3xl uppercase italic tracking-tighter">
                        Session with <span className="text-primary">{partnerName}</span>
                    </h1>
                </div>
                <button
                    onClick={() => navigate('/swaps')}
                    className="glass-panel px-4 py-2 border border-white/10 font-mono text-[10px] uppercase tracking-widest hover:bg-white/5 transition-all flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Back
                </button>
            </div>

            {/* Skill Exchange Info */}
            <div className="glass-panel p-6 rounded-2xl border border-white/5">
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-center">
                    <div className="space-y-1">
                        <p className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">You teach</p>
                        <div className="px-6 py-3 bg-primary/10 border border-primary/30 rounded-xl">
                            <span className="font-headline font-black text-lg text-primary uppercase">{mySkill}</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <span className="material-symbols-outlined text-4xl text-slate-700">swap_horiz</span>
                        <span className="font-mono text-[8px] text-slate-600 uppercase">exchange</span>
                    </div>
                    <div className="space-y-1">
                        <p className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">You learn</p>
                        <div className="px-6 py-3 bg-secondary/10 border border-secondary/30 rounded-xl">
                            <span className="font-headline font-black text-lg text-secondary uppercase">{theirSkill}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Completed State */}
            {swapCompleted ? (
                <div className="glass-panel p-12 rounded-2xl border border-primary/30 text-center space-y-6">
                    <div className="w-24 h-24 rounded-full border-4 border-primary mx-auto flex items-center justify-center shadow-[0_0_40px_rgba(133,173,255,0.3)]">
                        <span className="material-symbols-outlined text-5xl text-primary">celebration</span>
                    </div>
                    <div className="space-y-2">
                        <h2 className="font-headline font-black text-4xl uppercase italic text-primary">Swap Complete! 🎉</h2>
                        <p className="text-slate-400 font-body">Both you and {partnerName} have confirmed the session.</p>
                    </div>
                    <div className="flex items-center justify-center gap-8">
                        <div className="text-center">
                            <p className="font-headline font-black text-3xl text-primary">+100 XP</p>
                            <p className="font-mono text-[9px] text-slate-500 uppercase">Earned</p>
                        </div>
                        <div className="text-center">
                            <p className="font-headline font-black text-3xl text-secondary">+50 🪙</p>
                            <p className="font-mono text-[9px] text-slate-500 uppercase">Coins</p>
                        </div>
                    </div>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => navigate('/practice')}
                            className="px-8 py-3 bg-primary text-on-primary-fixed font-headline font-black uppercase tracking-widest text-xs hover:scale-105 transition-all"
                        >
                            Practice {theirSkill}
                        </button>
                        <button
                            onClick={() => navigate('/explore')}
                            className="px-8 py-3 glass-panel border border-white/10 font-headline font-black uppercase tracking-widest text-xs hover:bg-white/5 transition-all"
                        >
                            Find More Swaps
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    {/* Video Call Section */}
                    <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
                        <div className="p-4 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${callActive ? 'bg-green-400 animate-pulse' : 'bg-slate-600'}`} />
                                <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400">
                                    {callActive ? 'Video call active' : 'Video call — click Start Call'}
                                </span>
                            </div>
                            <div className="flex gap-3">
                                {!callActive ? (
                                    <button
                                        onClick={() => setCallActive(true)}
                                        className="px-6 py-2 bg-primary text-on-primary-fixed font-headline font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all flex items-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-sm">video_call</span>
                                        Start Video Call
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setCallActive(false)}
                                        className="px-6 py-2 bg-error/20 text-error border border-error/30 font-headline font-black uppercase tracking-widest text-[10px] hover:bg-error/30 transition-all flex items-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-sm">call_end</span>
                                        End Call
                                    </button>
                                )}

                                <a
                                    href={jitsiUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-2 glass-panel border border-white/10 font-headline font-black uppercase tracking-widest text-[10px] hover:bg-white/5 transition-all flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                                    Open in new tab
                                </a>
                            </div>
                        </div>

                        {callActive ? (
                            <div className="w-full" style={{ height: '500px' }}>
                                <iframe
                                    src={`https://meet.jit.si/${roomName}#userInfo.displayName="${encodeURIComponent(profile?.displayName || 'User')}"&config.prejoinPageEnabled=false&config.startWithVideoMuted=false&config.startWithAudioMuted=false`}
                                    style={{ width: '100%', height: '100%', border: 'none' }}
                                    allow="camera; microphone; fullscreen; display-capture"
                                    title="Skill Session Video Call"
                                />
                            </div>
                        ) : (
                            <div className="h-64 flex flex-col items-center justify-center gap-4 text-center p-8">
                                <span className="material-symbols-outlined text-6xl text-slate-700">video_call</span>
                                <div>
                                    <p className="font-headline font-black text-xl uppercase text-slate-400">Ready to teach {theirSkill}?</p>
                                    <p className="font-mono text-[10px] text-slate-600 uppercase tracking-widest mt-1">
                                        Click "Start Video Call" to begin your session with {partnerName}
                                    </p>
                                </div>
                                <div className="glass-panel px-4 py-2 border border-white/5 rounded-xl">
                                    <p className="font-mono text-[9px] text-slate-500">
                                        Share this room code with {partnerName}: <span className="text-primary font-bold">{roomName}</span>
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Session Tips */}
                    <div className="grid md:grid-cols-3 gap-4">
                        {[
                            { icon: 'tips_and_updates', title: 'Teaching Tips', desc: `Start with basics of ${mySkill}. Use examples, be patient, check understanding.` },
                            { icon: 'school', title: 'Learning Tips', desc: `Ask questions about ${theirSkill} freely. Take notes. Practice what you learn.` },
                            { icon: 'schedule', title: 'Session Length', desc: 'Aim for 30-60 minutes. Short focused sessions work better than long ones.' },
                        ].map((tip, i) => (
                            <div key={i} className="glass-panel p-5 rounded-xl border border-white/5 space-y-2">
                                <span className="material-symbols-outlined text-tertiary">{tip.icon}</span>
                                <p className="font-headline font-bold text-sm uppercase">{tip.title}</p>
                                <p className="text-slate-500 text-xs font-body leading-relaxed">{tip.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Mark Complete Section */}
                    <div className={`glass-panel p-8 rounded-2xl border-2 transition-all ${iMarkedComplete ? 'border-primary/40' : 'border-white/10'}`}>
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="space-y-2">
                                <h3 className="font-headline font-black text-xl uppercase italic">
                                    Session Done?
                                </h3>
                                <p className="text-slate-400 text-sm font-body">
                                    Once both you and {partnerName} mark the session complete,
                                    you'll both receive <span className="text-primary font-bold">+100 XP</span> and <span className="text-secondary font-bold">+50 coins</span>!
                                </p>
                                {/* Completion status */}
                                <div className="flex gap-4 mt-2">
                                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono uppercase ${iMarkedComplete ? 'border-primary/40 text-primary bg-primary/10' : 'border-white/10 text-slate-500'}`}>
                                        <span className="material-symbols-outlined text-xs">
                                            {iMarkedComplete ? 'check_circle' : 'radio_button_unchecked'}
                                        </span>
                                        You {iMarkedComplete ? '✓' : ''}
                                    </div>
                                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono uppercase ${swap?.completedBy?.length === 2 || (swap?.completedBy?.length === 1 && !swap?.completedBy?.includes(user?.uid))
                                        ? 'border-secondary/40 text-secondary bg-secondary/10'
                                        : 'border-white/10 text-slate-500'
                                        }`}>
                                        <span className="material-symbols-outlined text-xs">
                                            {swap?.completedBy?.find(id => id !== user?.uid) ? 'check_circle' : 'radio_button_unchecked'}
                                        </span>
                                        {partnerName} {swap?.completedBy?.find(id => id !== user?.uid) ? '✓' : ''}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleMarkComplete}
                                disabled={iMarkedComplete || completing}
                                className={`px-10 py-4 font-headline font-black uppercase tracking-widest text-sm transition-all flex items-center gap-3 shrink-0 ${iMarkedComplete
                                    ? 'bg-primary/20 text-primary border border-primary/30 cursor-default'
                                    : 'bg-primary text-on-primary-fixed hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(133,173,255,0.3)]'
                                    }`}
                            >
                                <span className="material-symbols-outlined">
                                    {iMarkedComplete ? 'check_circle' : 'task_alt'}
                                </span>
                                {completing ? 'Saving...' : iMarkedComplete ? 'Marked Complete!' : 'Mark Session Complete'}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </PageTransition>
    );
}