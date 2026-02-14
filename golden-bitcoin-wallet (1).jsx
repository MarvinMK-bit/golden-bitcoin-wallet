import { useState, useEffect, useCallback } from "react";

const GOLD_DARK = "#8b6914";
const GOLD_MID = "#b8860b";
const GOLD_BRIGHT = "#ffd700";
const GOLD_ACCENT = "#daa520";
const BG_DARK = "#1a1408";
const BG_CARD = "#231c0e";

function formatSats(s) {
  if (s >= 100_000_000) return `${(s / 100_000_000).toFixed(2)} BTC`;
  if (s >= 100_000) return `${(s / 1_000).toFixed(0)}k sats`;
  return `${s.toLocaleString()} sats`;
}

function GoldenCoin({ sats, size = 76, onClick, selected, isNew, delay = 0, disabled }) {
  const [hovered, setHovered] = useState(false);
  const active = hovered || selected;

  return (
    <button
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle at 32% 28%, ${GOLD_BRIGHT}, ${GOLD_MID} 50%, ${GOLD_DARK} 90%)`,
        boxShadow: selected
          ? `0 0 28px rgba(255,215,0,0.7), 0 0 60px rgba(255,215,0,0.25), inset 0 2px 6px rgba(255,255,255,0.4)`
          : active
          ? `0 0 20px rgba(255,215,0,0.4), 0 6px 18px rgba(0,0,0,0.5), inset 0 2px 5px rgba(255,255,255,0.3)`
          : `0 4px 14px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.2)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: disabled ? "default" : "pointer",
        transform: selected
          ? "scale(1.12) translateY(-4px)"
          : active
          ? "scale(1.06) translateY(-2px)"
          : "scale(1)",
        transition: "transform 0.2s cubic-bezier(.4,0,.2,1), box-shadow 0.25s",
        border: selected
          ? `3px solid ${GOLD_BRIGHT}`
          : `2.5px solid ${GOLD_ACCENT}`,
        userSelect: "none",
        position: "relative",
        flexShrink: 0,
        animation: isNew ? `materialize 0.65s ease-out ${delay}ms both` : "none",
        outline: "none",
        padding: 0,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <div
        style={{
          fontSize: size * 0.38,
          fontWeight: 900,
          fontFamily: "'Georgia', serif",
          color: GOLD_DARK,
          textShadow: `1px 1px 0 ${GOLD_BRIGHT}, -0.5px -0.5px 0 ${GOLD_DARK}`,
          lineHeight: 1,
          pointerEvents: "none",
        }}
      >
        B
      </div>
      <div
        style={{
          fontSize: Math.max(9, size * 0.13),
          color: GOLD_DARK,
          fontFamily: "monospace",
          fontWeight: 700,
          marginTop: 2,
          textShadow: `0.5px 0.5px 0 rgba(255,215,0,0.4)`,
          pointerEvents: "none",
        }}
      >
        {formatSats(sats)}
      </div>
      <div
        style={{
          position: "absolute",
          inset: -1,
          borderRadius: "50%",
          border: `1px dashed rgba(139,105,20,0.25)`,
          pointerEvents: "none",
        }}
      />
    </button>
  );
}

function CoinPouch({ title, coins, onCoinClick, selectedIdx, emptyMessage, isNew, disabled }) {
  return (
    <div
      style={{
        background: BG_CARD,
        borderRadius: 16,
        padding: "20px 24px",
        border: `1px solid rgba(218,165,32,0.15)`,
        minHeight: 130,
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontFamily: "monospace",
          color: GOLD_ACCENT,
          marginBottom: 14,
          textTransform: "uppercase",
          letterSpacing: 2,
          opacity: 0.7,
        }}
      >
        {title}
      </div>
      <div
        style={{
          display: "flex",
          gap: 14,
          flexWrap: "wrap",
          alignItems: "center",
          minHeight: 76,
        }}
      >
        {coins.length === 0 && (
          <div
            style={{
              color: "rgba(218,165,32,0.25)",
              fontFamily: "'Georgia', serif",
              fontStyle: "italic",
              fontSize: 14,
            }}
          >
            {emptyMessage}
          </div>
        )}
        {coins.map((sats, i) => (
          <GoldenCoin
            key={`${i}-${coins.length}`}
            sats={sats}
            onClick={() => onCoinClick?.(i)}
            selected={selectedIdx === i}
            isNew={isNew}
            delay={i * 100}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
}

function SendButton({ onClick, label, disabled }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        width: "100%",
        padding: "14px 24px",
        border: disabled
          ? `2px dashed rgba(218,165,32,0.12)`
          : `2px solid ${hovered ? GOLD_BRIGHT : GOLD_ACCENT}`,
        borderRadius: 14,
        background: disabled
          ? "transparent"
          : hovered
          ? "rgba(255,215,0,0.1)"
          : "rgba(255,215,0,0.03)",
        color: disabled ? "rgba(218,165,32,0.25)" : hovered ? GOLD_BRIGHT : GOLD_ACCENT,
        fontFamily: "monospace",
        fontSize: 14,
        fontWeight: 600,
        cursor: disabled ? "default" : "pointer",
        transition: "all 0.25s",
        outline: "none",
        letterSpacing: 1,
        boxShadow: hovered && !disabled ? `0 0 20px rgba(255,215,0,0.12)` : "none",
      }}
    >
      {label}
    </button>
  );
}

function TransactionLog({ log }) {
  if (log.length === 0) return null;
  return (
    <div
      style={{
        background: BG_CARD,
        borderRadius: 12,
        padding: "14px 18px",
        border: `1px solid rgba(218,165,32,0.1)`,
        maxHeight: 130,
        overflowY: "auto",
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontFamily: "monospace",
          color: "rgba(218,165,32,0.4)",
          marginBottom: 8,
          textTransform: "uppercase",
          letterSpacing: 2,
        }}
      >
        Transaction Log
      </div>
      {log.map((entry, i) => (
        <div
          key={i}
          style={{
            fontSize: 12,
            fontFamily: "monospace",
            color: "rgba(218,165,32,0.65)",
            padding: "3px 0",
            borderBottom:
              i < log.length - 1 ? "1px solid rgba(218,165,32,0.06)" : "none",
          }}
        >
          <span style={{ color: GOLD_BRIGHT }}>*</span>{" "}
          {formatSats(entry.sats)} moved to {entry.to}{" "}
          <span style={{ opacity: 0.35 }}>{entry.time}</span>
        </div>
      ))}
    </div>
  );
}

const INITIAL_COINS = [1_000, 1_000, 1_000, 1_000, 1_000];

export default function GoldenBitcoinWallet() {
  const [myCoins, setMyCoins] = useState(INITIAL_COINS);
  const [friendCoins, setFriendCoins] = useState([]);
  const [selectedMy, setSelectedMy] = useState(null);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [sending, setSending] = useState(false);
  const [log, setLog] = useState([]);
  const [friendNew, setFriendNew] = useState(false);
  const [myNew, setMyNew] = useState(false);

  const totalMine = myCoins.reduce((a, b) => a + b, 0);
  const totalFriend = friendCoins.reduce((a, b) => a + b, 0);

  const sendToFriend = useCallback(() => {
    if (selectedMy === null || selectedMy >= myCoins.length || sending) return;
    const sats = myCoins[selectedMy];
    const idx = selectedMy;
    setSelectedMy(null);
    setSending(true);
    setMyCoins((prev) => prev.filter((_, i) => i !== idx));
    setTimeout(() => {
      setFriendCoins((prev) => [...prev, sats]);
      setFriendNew(true);
      setTimeout(() => setFriendNew(false), 800);
      setSending(false);
      setLog((prev) =>
        [
          { sats, to: "Friend", time: new Date().toLocaleTimeString() },
          ...prev,
        ].slice(0, 20)
      );
    }, 500);
  }, [selectedMy, myCoins, sending]);

  const sendToMe = useCallback(() => {
    if (selectedFriend === null || selectedFriend >= friendCoins.length || sending) return;
    const sats = friendCoins[selectedFriend];
    const idx = selectedFriend;
    setSelectedFriend(null);
    setSending(true);
    setFriendCoins((prev) => prev.filter((_, i) => i !== idx));
    setTimeout(() => {
      setMyCoins((prev) => [...prev, sats]);
      setMyNew(true);
      setTimeout(() => setMyNew(false), 800);
      setSending(false);
      setLog((prev) =>
        [
          { sats, to: "You", time: new Date().toLocaleTimeString() },
          ...prev,
        ].slice(0, 20)
      );
    }, 500);
  }, [selectedFriend, friendCoins, sending]);

  const reset = () => {
    setMyCoins(INITIAL_COINS);
    setFriendCoins([]);
    setSelectedMy(null);
    setSelectedFriend(null);
    setLog([]);
    setSending(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(170deg, ${BG_DARK} 0%, #0d0a04 50%, #1a1408 100%)`,
        color: "#fff",
        fontFamily: "'Georgia', 'Palatino', serif",
        padding: "28px 16px",
        position: "relative",
      }}
    >
      <style>{`
        @keyframes materialize {
          0% { transform: scale(2.5) rotate(25deg); opacity: 0; filter: blur(8px) brightness(3); }
          50% { filter: blur(0) brightness(1.8); }
          100% { transform: scale(1) rotate(0); opacity: 1; filter: blur(0) brightness(1); }
        }
        @keyframes shimmer {
          0%, 100% { opacity: 0.03; }
          50% { opacity: 0.07; }
        }
      `}</style>

      <div
        style={{
          position: "fixed",
          inset: 0,
          background: `radial-gradient(ellipse at 30% 20%, rgba(255,215,0,0.04) 0%, transparent 60%),
                       radial-gradient(ellipse at 70% 80%, rgba(184,134,11,0.03) 0%, transparent 50%)`,
          pointerEvents: "none",
          animation: "shimmer 4s ease-in-out infinite",
        }}
      />

      <div
        style={{
          maxWidth: 520,
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              fontSize: 10,
              fontFamily: "monospace",
              color: GOLD_ACCENT,
              letterSpacing: 4,
              textTransform: "uppercase",
              marginBottom: 8,
              opacity: 0.5,
            }}
          >
            Golden Bitcoin Wallet
          </div>
          <h1
            style={{
              fontSize: 26,
              fontWeight: 400,
              color: GOLD_BRIGHT,
              margin: 0,
              textShadow: `0 0 40px rgba(255,215,0,0.12)`,
              fontFamily: "'Georgia', serif",
            }}
          >
            Coins That Move, Not Copy
          </h1>
          <p
            style={{
              fontSize: 13,
              color: "rgba(218,165,32,0.45)",
              marginTop: 8,
              fontStyle: "italic",
            }}
          >
            Tap a coin to select it, then send it.
          </p>
        </div>

        {/* Balances */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            marginBottom: 20,
            fontFamily: "monospace",
            fontSize: 13,
          }}
        >
          <div style={{ color: GOLD_ACCENT }}>
            You:{" "}
            <span style={{ color: GOLD_BRIGHT, fontWeight: 700 }}>
              {formatSats(totalMine)}
            </span>
          </div>
          <div style={{ color: GOLD_ACCENT }}>
            Friend:{" "}
            <span style={{ color: GOLD_BRIGHT, fontWeight: 700 }}>
              {formatSats(totalFriend)}
            </span>
          </div>
        </div>

        {/* My Wallet */}
        <CoinPouch
          title="Your Coin Pouch"
          coins={myCoins}
          onCoinClick={(i) => {
            setSelectedMy(selectedMy === i ? null : i);
            setSelectedFriend(null);
          }}
          selectedIdx={selectedMy}
          emptyMessage="All coins sent..."
          isNew={myNew}
        />

        {/* Send to Friend */}
        <div style={{ margin: "12px 0" }}>
          <SendButton
            onClick={sendToFriend}
            label={
              selectedMy !== null && myCoins[selectedMy] !== undefined
                ? `Send ${formatSats(myCoins[selectedMy])} to Friend`
                : "Select a coin above to send"
            }
            disabled={selectedMy === null || sending}
          />
        </div>

        {/* Friend's wallet */}
        <CoinPouch
          title="Friend's Coin Pouch"
          coins={friendCoins}
          onCoinClick={(i) => {
            setSelectedFriend(selectedFriend === i ? null : i);
            setSelectedMy(null);
          }}
          selectedIdx={selectedFriend}
          emptyMessage="Waiting for coins..."
          isNew={friendNew}
        />

        {/* Send back */}
        {friendCoins.length > 0 && (
          <div style={{ margin: "12px 0" }}>
            <SendButton
              onClick={sendToMe}
              label={
                selectedFriend !== null && friendCoins[selectedFriend] !== undefined
                  ? `Return ${formatSats(friendCoins[selectedFriend])} to You`
                  : "Select a friend's coin to return"
              }
              disabled={selectedFriend === null || sending}
            />
          </div>
        )}

        {/* Log */}
        <div style={{ marginTop: 18 }}>
          <TransactionLog log={log} />
        </div>

        {/* Reset */}
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button
            onClick={reset}
            style={{
              background: "none",
              border: `1px solid rgba(218,165,32,0.15)`,
              color: "rgba(218,165,32,0.35)",
              fontFamily: "monospace",
              fontSize: 11,
              padding: "8px 20px",
              borderRadius: 8,
              cursor: "pointer",
              letterSpacing: 1,
              textTransform: "uppercase",
              outline: "none",
            }}
          >
            Reset Wallet
          </button>
        </div>

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            marginTop: 36,
            paddingTop: 18,
            borderTop: `1px solid rgba(218,165,32,0.06)`,
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: "rgba(218,165,32,0.25)",
              fontFamily: "monospace",
            }}
          >
            Moved, not copied. Settled on Lightning.
          </div>
          <div
            style={{
              fontSize: 10,
              color: "rgba(218,165,32,0.15)",
              marginTop: 4,
            }}
          >
            Space Gold is for billionaires. Golden Bitcoin is for the rest of us.
          </div>
        </div>
      </div>
    </div>
  );
}
