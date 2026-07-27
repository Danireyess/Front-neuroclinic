import { useState, useEffect } from "react";
export default function PruebaCitas() {
    const [citas, setCitas] = useState([]);

    useEffect(()  => {
        async function cargarCitas() {
            const respuesta = await fetch("/api/Appointment");
            const datos = await respuesta.json();
            setCitas (datos);
        }

        cargarCitas();
    }, []); // que fregados es? [] = corre esto una sola vez, cuando el componente aparece en pantalla,  "," = coma separa los dos argumentos que recibe useEffect
    return (
        <div>
            <h1>Citas: {citas.length}</h1>
            {citas.map((cita) =>(
                <div key = {cita.id}>
                    <p>Motivo: {cita.reason}</p>
                    <p>Paciente: {cita.patient.firstName} {cita.patient.lastName}</p>
                    <p>Fecha: {cita.start_date}</p>
                </div>
            ))}
        </div>
    );
}