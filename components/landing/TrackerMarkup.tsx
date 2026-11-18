type Props = {
  raised: number;
  goal: number;
  pct: number;
  stage: number;
  stageText: string;
  formatCOP: (value: number) => string;
};

export default function TrackerMarkup({
  raised,
  goal,
  pct,
  stage,
  stageText,
  formatCOP,
}: Props) {
  return (
    <>
<section className="supercasa-tracker" aria-label="Avance en vivo de La Supercasa">
      <div className="tracker-top-badge">
        Progreso en Vivo • Construcción de La Supercasa
      </div>

      <div className="tracker-grid">
        
        <div className="house-render-card">
          <div className="house-stage-pill" id="houseStageLabel">{stageText}</div>

          <svg className="house-svg" viewBox="0 0 420 310" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Render de La Supercasa">
            
            <circle cx="65" cy="52" r="24" fill="#FACC15" opacity="0.9"/>
            <g fill="#FFFFFF" opacity="0.85">
              <circle cx="310" cy="48" r="14"/><circle cx="326" cy="44" r="18"/><circle cx="344" cy="49" r="13"/>
              <circle cx="130" cy="36" r="10"/><circle cx="143" cy="33" r="13"/><circle cx="156" cy="37" r="10"/>
            </g>

            
            <rect x="0" y="255" width="420" height="55" rx="12" fill="#4ADE80"/>
            <path d="M175 255 L245 255 L268 310 L152 310 Z" fill="#FDE68A"/>

            
            <g id="layer-1" className={stage >= 1 ? "house-layer unlocked" : "house-layer locked"}>
              <rect x="78" y="242" width="264" height="16" rx="4" fill="#64748B" stroke="#0F2354" strokeWidth="2.5"/>
              <rect x="92" y="234" width="236" height="10" rx="3" fill="#94A3B8" stroke="#0F2354" strokeWidth="2"/>
            </g>

            
            <g id="layer-2" className={stage >= 2 ? "house-layer unlocked" : "house-layer locked"}>
              <rect x="95" y="168" width="230" height="68" fill="#FFFBEB" stroke="#0F2354" strokeWidth="3"/>
              
              <rect x="188" y="186" width="44" height="50" rx="22" fill="#FF6B2B" stroke="#0F2354" strokeWidth="2.5"/>
              <circle cx="222" cy="213" r="3.5" fill="#FFD21E"/>
              
              <rect x="116" y="186" width="46" height="34" rx="6" fill="#38BDF8" stroke="#0F2354" strokeWidth="2.5"/>
              <line x1="139" y1="186" x2="139" y2="220" stroke="#0F2354" strokeWidth="2"/>
              <line x1="116" y1="203" x2="162" y2="203" stroke="#0F2354" strokeWidth="2"/>

              <rect x="258" y="186" width="46" height="34" rx="6" fill="#38BDF8" stroke="#0F2354" strokeWidth="2.5"/>
              <line x1="281" y1="186" x2="281" y2="220" stroke="#0F2354" strokeWidth="2"/>
              <line x1="258" y1="203" x2="304" y2="203" stroke="#0F2354" strokeWidth="2"/>
            </g>

            
            <g id="layer-3" className={stage >= 3 ? "house-layer unlocked" : "house-layer locked"}>
              <rect x="108" y="106" width="204" height="62" fill="#FEF3C7" stroke="#0F2354" strokeWidth="3"/>
              
              <rect x="130" y="120" width="42" height="32" rx="6" fill="#38BDF8" stroke="#0F2354" strokeWidth="2.5"/>
              <line x1="151" y1="120" x2="151" y2="152" stroke="#0F2354" strokeWidth="2"/>
              <rect x="189" y="120" width="42" height="32" rx="6" fill="#38BDF8" stroke="#0F2354" strokeWidth="2.5"/>
              <line x1="210" y1="120" x2="210" y2="152" stroke="#0F2354" strokeWidth="2"/>
              <rect x="248" y="120" width="42" height="32" rx="6" fill="#38BDF8" stroke="#0F2354" strokeWidth="2.5"/>
              <line x1="269" y1="120" x2="269" y2="152" stroke="#0F2354" strokeWidth="2"/>
              
              <rect x="90" y="162" width="240" height="8" rx="4" fill="#B5F43D" stroke="#0F2354" strokeWidth="2"/>
            </g>

            
            <g id="layer-4" className={stage >= 4 ? "house-layer unlocked" : "house-layer locked"}>
              <polygon points="84,108 210,36 336,108" fill="#E6009E" stroke="#0F2354" strokeWidth="3" strokeLinejoin="round"/>
              
              <circle cx="210" cy="78" r="16" fill="#FFD21E" stroke="#0F2354" strokeWidth="2.5"/>
              
              <rect x="44" y="218" width="10" height="38" fill="#78350F"/>
              <circle cx="49" cy="202" r="24" fill="#22C55E" stroke="#0F2354" strokeWidth="2"/>
              <rect x="366" y="218" width="10" height="38" fill="#78350F"/>
              <circle cx="371" cy="202" r="24" fill="#22C55E" stroke="#0F2354" strokeWidth="2"/>
            </g>

            
            <g id="layer-5" className={stage >= 5 ? "house-layer unlocked" : "house-layer locked"}>
              
              <line x1="210" y1="36" x2="210" y2="8" stroke="#0F2354" strokeWidth="3"/>
              <polygon points="210,8 252,17 210,26" fill="#B5F43D" stroke="#0F2354" strokeWidth="2"/>
              
              <rect x="138" y="153" width="144" height="22" rx="11" fill="#0F2354"/>
              <text x="210" y="168" textAnchor="middle" fill="#FFD21E" fontFamily="Fredoka, sans-serif" fontSize="11.5" fontWeight="700">LA SUPERCASA</text>
              
              <text x="28" y="110" fontSize="22">⭐</text>
              <text x="368" y="115" fontSize="22">✨</text>
              <text x="198" y="294" fontSize="20">💚</text>
            </g>
          </svg>
        </div>

        
        <div className="tracker-stats">
          <h2>¡Juntos levantamos cada pared!</h2>
          <p className="tracker-subtitle">Mira en tiempo real cómo crece el aporte de la audiencia y avanza la construcción de <strong>La Supercasa</strong>.</p>

          <div className="amount-display-box">
            <span className="amount-label">Recaudado en Vivo Hasta Ahora</span>
            <div className="amount-value" id="currentAmountDisplay">{formatCOP(raised)}</div>
            <div className="goal-row">
              <span>Meta Total: <strong id="goalAmountDisplay">{formatCOP(goal)}</strong></span>
              <span>Falta: <strong id="remainingAmountDisplay">{formatCOP(Math.max(0, goal - raised))}</strong></span>
            </div>
          </div>

          <div className="progress-header">
            <span className="progress-title">Avance de La Supercasa</span>
            <span className="progress-percent" id="progressPercentDisplay">{pct.toLocaleString("es-CO", { maximumFractionDigits: 1 })}%</span>
          </div>

          <div className="progress-track">
            <div className="progress-fill" id="progressBarFill" style={{ width: `${Math.min(100, pct)}%` }}></div>
          </div>

          <div className="milestones-row">
            <div className={`milestone-chip${stage >= 1 ? " active" : ""}`} id="ms-1">20%<br />Cimientos</div>
            <div className={`milestone-chip${stage >= 2 ? " active" : ""}`} id="ms-2">40%<br />1er Piso</div>
            <div className={`milestone-chip${stage >= 3 ? " active" : ""}`} id="ms-3">60%<br />2do Piso</div>
            <div className={`milestone-chip${stage >= 4 ? " active" : ""}`} id="ms-4">80%<br />Techo</div>
            <div className={`milestone-chip${stage >= 5 ? " active" : ""}`} id="ms-5">100%<br />¡Lista!</div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
