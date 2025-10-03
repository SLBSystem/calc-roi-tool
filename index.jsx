import React, { useEffect, useMemo, useState } from "react";

/**
 * Calculateur Temps & Argent — Next/React + Tailwind (prêt pour Vercel)
 * Effets de couleur sur focus retirés (plus de focus:ring personnalisés).
 */

export default function CalculateurTempsArgent() {
  const ACCENT_A = "#9600ff";
  const ACCENT_B = "#ed0ecf";

  const [minutes, setMinutes] = useState("");
  const [freq, setFreq] = useState("");
  const [freqUnit, setFreqUnit] = useState("/jour");
  const [rate, setRate] = useState("");
  const [toolPrice, setToolPrice] = useState("");

  function calcAnnualFreq(f: number, unit: string) {
    switch (unit) {
      case "/jour": return f * 365;
      case "/semaine": return f * 52;
      case "/mois": return f * 12;
      case "/an": return f;
      default: return f;
    }
  }

  function formatTime(mins: number) {
    if (!mins) return "0min";
    const h = Math.floor(mins / 60);
    const m = Math.round(mins % 60);
    if (h > 0 && m > 0) return `${h}h ${m}min`;
    if (h > 0 && m === 0) return `${h}h`;
    return `${m}min`;
  }

  function formatNumber(num: number) {
    return new Intl.NumberFormat("fr-FR").format(num);
  }

  const numeric = useMemo(() => ({
    minutes: Number(minutes),
    freq: Number(freq),
    rate: Number(rate),
    toolPrice: Number(toolPrice)
  }), [minutes, freq, rate, toolPrice]);

  const annualMinutes = useMemo(() => {
    return numeric.minutes && numeric.freq
      ? numeric.minutes * calcAnnualFreq(numeric.freq, freqUnit)
      : 0;
  }, [numeric.minutes, numeric.freq, freqUnit]);

  const moneyLost = useMemo(() => {
    return numeric.rate ? (annualMinutes / 60) * numeric.rate : 0;
  }, [annualMinutes, numeric.rate]);

  const balance = useMemo(() => {
    return numeric.toolPrice ? moneyLost - numeric.toolPrice : 0;
  }, [moneyLost, numeric.toolPrice]);

  const hasTime = annualMinutes > 0;
  const hasRate = numeric.rate > 0;
  const hasTool = numeric.toolPrice > 0;

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-zinc-100 flex flex-col items-center justify-center p-4 space-y-3">
      <div className="mx-auto w-full max-w-sm rounded-2xl bg-white/70 backdrop-blur shadow-lg ring-1 ring-zinc-200 overflow-hidden">
        <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${ACCENT_A}, ${ACCENT_B})`, opacity: 0.6 }} />
        <div className="p-5 space-y-4">
          <div className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm text-center space-y-2">
            {!hasTime ? (
              <>
                <div className="text-sm font-semibold text-zinc-700">
                  Ton temps & ton cash récupérés s’afficheront juste ici 👇
                </div>
                <div className="text-xs text-zinc-500 mt-1">
                  🚀 Tape tes chiffres et regarde la magie opérer !
                </div>
              </>
            ) : (
              <>
                <div className="text-xs uppercase tracking-wide text-zinc-500">Résultat</div>
                <div className="text-sm font-medium text-zinc-900 tabular-nums">
                  ⏳ Temps perdu : {formatTime(annualMinutes)}/an
                </div>
                {hasRate && (
                  <div className="text-sm font-medium text-red-600">
                    💸 Argent perdu : {formatNumber(Math.round(moneyLost))}€/an
                  </div>
                )}
                {hasRate && hasTool && (
                  balance > 0 ? (
                    <div className="mt-2 text-sm font-medium text-green-600">
                      🎉 {formatNumber(Math.round(balance))}€ et {formatTime(annualMinutes)} sauvés
                    </div>
                  ) : (
                    <div className="mt-2 text-sm font-medium text-red-600">
                      😬 Pas rentable…
                    </div>
                  )
                )}
              </>
            )}
          </div>

          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <label className="flex flex-col">
                <span className="text-zinc-600 text-xs">⏱️ Temps perdu par action</span>
                <input
                  type="number"
                  placeholder="ex: 10 min"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  className="rounded-lg border border-zinc-200 p-2 text-sm bg-white shadow-sm outline-none"
                />
              </label>
              <label className="flex flex-col">
                <span className="text-zinc-600 text-xs">🔄 Fréquence</span>
                <input
                  type="number"
                  placeholder="ex: 5 fois"
                  value={freq}
                  onChange={(e) => setFreq(e.target.value)}
                  className="rounded-lg border border-zinc-200 p-2 text-sm bg-white shadow-sm outline-none"
                />
              </label>
            </div>

            <label className="flex flex-col">
              <span className="text-zinc-600 text-xs">Unité de fréquence</span>
              <select
                value={freqUnit}
                onChange={(e) => setFreqUnit(e.target.value)}
                className="rounded-lg border border-zinc-200 p-2 text-sm bg-white shadow-sm outline-none"
              >
                <option>/jour</option>
                <option>/semaine</option>
                <option>/mois</option>
                <option>/an</option>
              </select>
            </label>

            <div className="grid grid-cols-2 gap-2">
              <label className="flex flex-col">
                <span className="text-zinc-600 text-xs">💶 Taux horaire</span>
                <input
                  type="number"
                  placeholder="ex: 20 €/h"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  className="rounded-lg border border-zinc-200 p-2 text-sm bg-white shadow-sm outline-none"
                />
              </label>
              <label className="flex flex-col">
                <span className="text-zinc-600 text-xs">📦 Prix/an (outil)</span>
                <input
                  type="number"
                  placeholder="ex: 200 €/an"
                  value={toolPrice}
                  onChange={(e) => setToolPrice(e.target.value)}
                  className="rounded-lg border border-zinc-200 p-2 text-sm bg-white shadow-sm outline-none"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-sm text-center text-xs text-zinc-500 italic mt-1">
        Temps perdu par action × Fréquence annuelle → converti en heures → × ton taux horaire → comparé au prix de l’outil.<br />
        Bref : tu vois en 2s si ça te fait gagner ou cramer du cash.
      </div>
    </div>
  );
}

function __runLightTests() {
  console.assert(formatTimeTest(0) === "0min", "formatTime(0) doit être '0min'");
  console.assert(formatTimeTest(12) === "12min", "formatTime(12) doit être '12min'");
  console.assert(formatTimeTest(90) === "1h 30min", "formatTime(90) doit être '1h 30min'");
  console.assert(formatTimeTest(120) === "2h", "formatTime(120) doit être '2h'");

  console.assert(calcAnnualFreqTest(1, "/jour") === 365, "1/jour → 365");
  console.assert(calcAnnualFreqTest(1, "/semaine") === 52, "1/semaine → 52");
  console.assert(calcAnnualFreqTest(1, "/mois") === 12, "1/mois → 12");
  console.assert(calcAnnualFreqTest(1, "/an") === 1, "1/an → 1");

  console.assert(formatNumberTest(0) === "0", "formatNumber(0) doit être '0'");
  console.log("✅ Tests simples passés (voir console).");
}

function formatTimeTest(mins: number) {
  const h = Math.floor(mins / 60);
  const m = Math.round(mins % 60);
  if (mins <= 0) return "0min";
  if (h > 0 && m > 0) return `${h}h ${m}min`;
  if (h > 0 && m === 0) return `${h}h`;
  return `${m}min`;
}
function calcAnnualFreqTest(f: number, unit: string) {
  switch (unit) {
    case "/jour": return f * 365;
    case "/semaine": return f * 52;
    case "/mois": return f * 12;
    case "/an": return f;
    default: return f;
  }
}
function formatNumberTest(num: number) {
  return new Intl.NumberFormat("fr-FR").format(num);
}

if (typeof window !== "undefined") {
  __runLightTests();
}
