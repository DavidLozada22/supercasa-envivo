const ALLIES = ["TerraFerme", "HivraTech", "ServImagenes", "Intesi"];

export default function SponsorsSection() {
  return (
    <section className="sponsors-section" aria-label="Aliados y patrocinadores">
      <h4>Aliados y Patrocinadores que se ponen la capa</h4>
      <div className="sponsor-list">
        {ALLIES.map((ally) => (
          <div className="sponsor-item" key={ally}>
            {ally}
          </div>
        ))}
      </div>
    </section>
  );
}
