const ALLIES = ["TerraFerme", "HivraTech", "ServImagenes", "Intesi"];

export default function AlliesStrip() {
  return (
    <div className="allies">
      <div className="wrap allies__inner">
        <p className="allies__label">Aliados y patrocinadores que se ponen la capa</p>
        <ul className="allies__list">
          {ALLIES.map((ally) => (
            <li key={ally}>{ally}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
