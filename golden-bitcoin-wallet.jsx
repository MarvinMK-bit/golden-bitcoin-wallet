import { useState, useRef, useEffect } from "react";

const GOLD_DARK = "#8b6914";
const GOLD_MID = "#b8860b";
const GOLD_BRIGHT = "#ffd700";
const GOLD_ACCENT = "#daa520";
const BG_DARK = "#1a1408";
const BG_CARD = "#231c0e";

function formatSats(s) {
  if (s >= 100_000_000) return `${(s / 100_000_000).toFixed(2)} BTC`;
  if (s >= 100_000) return `${(s / 1_000).toFixed(0)}k sats`;
  if (s >= 1_000) return `${(s / 1_000).toFixed(1)}k`;
  return `${s} sats`;
}

function GoldenCoin({ sats, size = 72, onDragStart, isDragging, isNew, delay = 0 }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("application/x-btc-coin", JSON.stringify({ sats }));
        e.dataTransfer.effectAllowed = "move";
        onDragStart?.(sats);
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle at 32% 30%, ${GOLD_BRIGHT}, ${GOLD_MID} 55%, ${GOLD_DARK} 90%)`,
        boxShadow: hovered
          ? `0 0 24px rgba(255,215,0,0.5), 0 6px 20px rgba(0,0,0,0.5), inset 0 2px 6px rgba(255,255,255,0.35)`
          : `0 4px 14px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.25)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "grab",
        transform: isDragging ? "scale(0.8)" : hovered ? "scale(1.08) translateY(-2px)" : "scale(1)",
        opacity: isDragging ? 0.3 : 1,
        transition: "transform 0.25s cubic-bezier(.4,0,.2,1), box-shadow 0.25s, opacity 0.3s",
        border: `2.5px solid ${GOLD_ACCENT}`,
        userSelect: "none",
        position: "relative",
        flexShrink: 0,
        animation: isNew ? `materialize 0.7s ease-out ${delay}ms both` : "none",
      }}
    >
      <div style={{
        fontSize: size * 0.38,
        fontWeight: 900,
        fontFamily: "'Georgia', serif",
        color: GOLD_DARK,
        textShadow: `1px 1px 0 ${GOLD_BRIGHT}, -0.5px -0.5px 0 ${GOLD_DARK}`,
        lineHeight: 1,
      }}>₿</div>
      <div style={{
        fontSize: Math.max(9, size * 0.13),
        color: GOLD_DARK,
        fontFamily: "'SF Mono', 'Fira Code', monospace",
        fontWeight: 700,
        marginTop: 1,
        textShadow: `0.5px 0.5px 0 rgba(255,215,0,0.4)`,
      }}>{formatSats(sats)}</div>
      {/* Edge ridges */}
      <div style={{
        position: "absolute",
        inset: -1,
        borderRadius: "50%",
        border: `1px dashed rgba(139,105,20,0.3)`,
        pointerEvents: "none",
      }} />
    </div>
  );
}

function CoinPouch({ title, coins, onDragStart, draggingId, emptyMessage, isNew }) {
  return (
    <div style={{
      background: BG_CARD,
      borderRadius: 16,
      padding: "20px 24px",
      border: `1px solid rgba(218,165,32,0.15)`,
      minHeight: 140,
      flex: 1,
    }}>
      <div style={{
        fontSize: 13,
        fontFamily: "'SF Mono', 'Fira Code', monospace",
        color: GOLD_ACCENT,
        marginBottom: 14,
        textTransform: "uppercase",
        letterSpacing: 2,
        opacity: 0.8,
      }}>{title}</div>
      <div style={{
        display: "flex",
        gap: 14,
        flexWrap: "wrap",
        alignItems: "center",
        minHeight: 80,
      }}>
        {coins.length === 0 && (
          <div style={{
            color: "rgba(218,165,32,0.3)",
            fontFamily: "'Georgia', serif",
            fontStyle: "italic",
            fontSize: 14,
          }}>{emptyMessage}</div>
        )}
        {coins.map((sats, i) => (
          <GoldenCoin
            key={`${sats}-${i}-${coins.length}`}
            sats={sats}
            onDragStart={() => onDragStart?.(i)}
            isDragging={draggingId === i}
            isNew={isNew}
            delay={i * 80}
          />
        ))}
      </div>
    </div>
  );
}

function DropZone({ onDrop, isOver, setIsOver, children }) {
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsOver(false);
        const data = JSON.parse(e.dataTransfer.getData("application/x-btc-coin"));
        onDrop(data.sats);
      }}
      style={{
        border: `2.5px dashed ${isOver ? GOLD_BRIGHT : "rgba(218,165,32,0.25)"}`,
        borderRadius: 16,
        padding: 24,
        minHeight: 160,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: isOver
          ? "rgba(255,215,0,0.06)"
          : "rgba(255,215,0,0.015)",
        transition: "all 0.3s",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {isOver && (
        <div style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at center, rgba(255,215,0,0.1) 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />
      )}
      {children}
    </div>
  );
}

function FlyingCoinAnimation({ sats, onComplete }) {
  useEffect(() => {
    const t = setTimeout(onComplete, 800);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <div style={{
      position: "fixed",
      top: "50%",
      left: "50%",
      zIndex: 1000,
      animation: "coinFly 0.8s ease-in forwards",
      pointerEvents: "none",
    }}>
      <GoldenCoin sats={sats} size={64} />
    </div>
  );
}

function TransactionLog({ log }) {
  if (log.length === 0) return null;
  return (
    <div style={{
      background: BG_CARD,
      borderRadius: 12,
      padding: "14px 18px",
      border: `1px solid rgba(218,165,32,0.1)`,
      maxHeight: 140,
      overflowY: "auto",
    }}>
      <div style={{
        fontSize: 11,
        fontFamily: "'SF Mono', 'Fira Code', monospace",
        color: "rgba(218,165,32,0.5)",
        marginBottom: 8,
        textTransform: "uppercase",
        letterSpacing: 2,
      }}>Transaction Log</div>
      {log.map((entry, i) => (
        <div key={i} style={{
          fontSize: 12,
          fontFamily: "'SF Mono', 'Fira Code', monospace",
          color: "rgba(218,165,32,0.7)",
          padding: "3px 0",
          borderBottom: i < log.length - 1 ? "1px solid rgba(218,165,32,0.06)" : "none",
        }}>
          <span style={{ color: GOLD_BRIGHT }}>⚡</span>{" "}
          {formatSats(entry.sats)} moved → {entry.to}{" "}
          <span style={{ opacity: 0.4 }}>{entry.time}</span>
        </div>
      ))}
    </div>
  );
}

const INITIAL_COINS = [50_000, 21_000, 100_000, 10_000, 250_000];

export default function GoldenBitcoinWallet() {
  const [myCoins, setMyCoins] = useState(INITIAL_COINS);
  const [friendCoins, setFriendCoins] = useState([]);
  const [draggingIdx, setDraggingIdx] = useState(null);
  const [isOverFriend, setIsOverFriend] = useState(false);
  const [isOverMe, setIsOverMe] = useState(false);
  const [flyingSats, setFlyingSats] = useState(null);
  const [log, setLog] = useState([]);
  const [friendNew, setFriendNew] = useState(false);
  const [myNew, setMyNew] = useState(false);

  const totalMine = myCoins.reduce((a, b) => a + b, 0);
  const totalFriend = friendCoins.reduce((a, b) => a + b, 0);

  const sendToFriend = (sats) => {
    const idx = myCoins.indexOf(sats);
    if (idx === -1) return;
    setFlyingSats(sats);
    setMyCoins((prev) => prev.filter((_, i) => i !== idx));
    setTimeout(() => {
      setFriendCoins((prev) => [...prev, sats]);
      setFriendNew(true);
      setTimeout(() => setFriendNew(false), 900);
      setFlyingSats(null);
      setLog((prev) => [{
        sats,
        to: "Friend",
        time: new Date().toLocaleTimeString(),
      }, ...prev].slice(0, 20));
    }, 500);
  };

  const sendToMe = (sats) => {
    const idx = friendCoins.indexOf(sats);
    if (idx === -1) return;
    setFlyingSats(sats);
    setFriendCoins((prev) => prev.filter((_, i) => i !== idx));
    setTimeout(() => {
      setMyCoins((prev) => [...prev, sats]);
      setMyNew(true);
      setTimeout(() => setMyNew(false), 900);
      setFlyingSats(null);
      setLog((prev) => [{
        sats,
        to: "You",
        time: new Date().toLocaleTimeString(),
      }, ...prev].slice(0, 20));
    }, 500);
  };

  const reset = () => {
    setMyCoins(INITIAL_COINS);
    setFriendCoins([]);
    setLog([]);
    setFlyingSats(null);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(170deg, ${BG_DARK} 0%, #0d0a04 50%, #1a1408 100%)`,
      color: "#fff",
      fontFamily: "'Georgia', 'Palatino', serif",
      padding: "32px 20px",
      position: "relative",
    }}>
      <style>{`
        @keyframes materialize {
          0% { transform: scale(2.2) rotate(20deg); opacity: 0; filter: blur(6px) brightness(2.5); }
          50% { filter: blur(0) brightness(1.6); }
          100% { transform: scale(1) rotate(0); opacity: 1; filter: blur(0) brightness(1); }
        }
        @keyframes coinFly {
          0% { transform: scale(1) translateY(0); opacity: 1; }
          50% { transform: scale(1.3) translateY(-60px); opacity: 0.8; }
          100% { transform: scale(0.2) translateY(-160px); opacity: 0; }
        }
        @keyframes shimmer {
          0%, 100% { opacity: 0.03; }
          50% { opacity: 0.07; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>

      {/* Ambient gold dust */}
      <div style={{
        position: "fixed",
        inset: 0,
        background: `radial-gradient(ellipse at 30% 20%, rgba(255,215,0,0.04) 0%, transparent 60%),
                     radial-gradient(ellipse at 70% 80%, rgba(184,134,11,0.03) 0%, transparent 50%)`,
        pointerEvents: "none",
        animation: "shimmer 4s ease-in-out infinite",
      }} />

      <div style={{ maxWidth: 680, margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{
            fontSize: 11,
            fontFamily: "'SF Mono', 'Fira Code', monospace",
            color: GOLD_ACCENT,
            letterSpacing: 4,
            textTransform: "uppercase",
            marginBottom: 8,
            opacity: 0.6,
          }}>Golden Bitcoin Wallet</div>
          <h1 style={{
            fontSize: 28,
            fontWeight: 400,
            color: GOLD_BRIGHT,
            margin: 0,
            textShadow: `0 0 40px rgba(255,215,0,0.15)`,
            fontFamily: "'Georgia', serif",
          }}>Coins That Move, Not Copy</h1>
          <p style={{
            fontSize: 14,
            color: "rgba(218,165,32,0.5)",
            marginTop: 8,
            fontStyle: "italic",
          }}>Drag a coin to airdrop it. Watch it leave your hand.</p>
        </div>

        {/* Balances */}
        <div style={{
          display: "flex",
          justifyContent: "space-around",
          marginBottom: 24,
          fontFamily: "'SF Mono', 'Fira Code', monospace",
          fontSize: 13,
        }}>
          <div style={{ color: GOLD_ACCENT }}>
            You: <span style={{ color: GOLD_BRIGHT }}>{formatSats(totalMine)}</span>
          </div>
          <div style={{ color: GOLD_ACCENT }}>
            Friend: <span style={{ color: GOLD_BRIGHT }}>{formatSats(totalFriend)}</span>
          </div>
        </div>

        {/* My Wallet */}
        <CoinPouch
          title="⛏ Your Coin Pouch"
          coins={myCoins}
          onDragStart={(i) => setDraggingIdx(i)}
          draggingId={draggingIdx}
          emptyMessage="All coins sent..."
          isNew={myNew}
        />

        {/* Airdrop zone to friend */}
        <div style={{ margin: "16px 0" }}>
          <DropZone onDrop={sendToFriend} isOver={isOverFriend} setIsOver={setIsOverFriend}>
            <div style={{
              fontSize: 28,
              marginBottom: 6,
              animation: isOverFriend ? "pulse 0.6s ease-in-out infinite" : "none",
            }}>
              {isOverFriend ? "✨" : "⚡"}
            </div>
            <div style={{
              fontSize: 13,
              fontFamily: "'SF Mono', 'Fira Code', monospace",
              color: isOverFriend ? GOLD_BRIGHT : "rgba(218,165,32,0.4)",
              transition: "color 0.3s",
              textAlign: "center",
            }}>
              {isOverFriend ? "Release to airdrop ₿" : "↓ Drop your coin here to send to Friend ↓"}
            </div>
          </DropZone>
        </div>

        {/* Friend's wallet */}
        <CoinPouch
          title="👤 Friend's Coin Pouch"
          coins={friendCoins}
          onDragStart={() => {}}
          emptyMessage="Waiting for coins..."
          isNew={friendNew}
        />

        {/* Send back zone */}
        {friendCoins.length > 0 && (
          <div style={{ margin: "16px 0" }}>
            <DropZone onDrop={sendToMe} isOver={isOverMe} setIsOver={setIsOverMe}>
              <div style={{
                fontSize: 13,
                fontFamily: "'SF Mono', 'Fira Code', monospace",
                color: isOverMe ? GOLD_BRIGHT : "rgba(218,165,32,0.4)",
                textAlign: "center",
              }}>
                {isOverMe ? "Release to return ₿" : "↑ Drag friend's coin here to send back ↑"}
              </div>
            </DropZone>
          </div>
        )}

        {/* Log */}
        <div style={{ marginTop: 20 }}>
          <TransactionLog log={log} />
        </div>

        {/* Reset */}
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <button
            onClick={reset}
            style={{
              background: "none",
              border: `1px solid rgba(218,165,32,0.2)`,
              color: "rgba(218,165,32,0.4)",
              fontFamily: "'SF Mono', 'Fira Code', monospace",
              fontSize: 11,
              padding: "8px 20px",
              borderRadius: 8,
              cursor: "pointer",
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            Reset Wallet
          </button>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: "center",
          marginTop: 40,
          paddingTop: 20,
          borderTop: `1px solid rgba(218,165,32,0.08)`,
        }}>
          <div style={{
            fontSize: 12,
            color: "rgba(218,165,32,0.3)",
            fontFamily: "'SF Mono', 'Fira Code', monospace",
          }}>
            Moved, not copied. Settled on Lightning. ⚡
          </div>
          <div style={{
            fontSize: 11,
            color: "rgba(218,165,32,0.2)",
            marginTop: 4,
          }}>
            Space Gold is for billionaires. Golden Bitcoin is for the rest of us.
          </div>
        </div>
      </div>

      {flyingSats && (
        <FlyingCoinAnimation sats={flyingSats} onComplete={() => setFlyingSats(null)} />
      )}
    </div>
  );
}
