import LegalPage from "@/components/legal/LegalPage";

export const metadata = { title: "Política de tratamiento de datos · La SUPERCASA" };

export default function PoliticaDeDatos() {
  return (
    <LegalPage title="Política de tratamiento de datos">
      <p>
        En cumplimiento de la Ley 1581 de 2012 y el Decreto 1377 de 2013, Fundación Segundos de Vida (NIT 900.649.809-2) es la
        responsable del tratamiento de los datos personales recogidos en esta página.
      </p>
      <h2>Finalidades</h2>
      <ul>
        <li>Registrar y confirmar tu aporte, y emitir el certificado de donación.</li>
        <li>Contarte cómo avanza la obra de la SUPERCASA.</li>
        <li>Invitarte a futuras campañas de la fundación, si lo autorizas.</li>
      </ul>
      <h2>Tus derechos</h2>
      <p>
        Puedes conocer, actualizar, rectificar y suprimir tus datos, y revocar la autorización, escribiendo a{" "}
        <a href="mailto:admonsegundosdevida@hotmail.com">admonsegundosdevida@hotmail.com</a>.
      </p>
      <p>Los datos de tu tarjeta o cuenta bancaria nunca pasan por nuestros servidores: los procesa la pasarela de pago.</p>
    </LegalPage>
  );
}
