import { useEffect } from 'react'
import TareasTabla from '../components/tareas';
import AgregarTarea  from '../components/agregarTarea';

const Index = () => {

useEffect(() => {
    document.title = "Prueba";
}, [])

    return(
        <section className="flex gap-8 p-8 min-h-screen bg-gray-900 items-start justify-center">
            {/* Tabla para mostrar tareas */}
            <TareasTabla />

            {/* Apartado para agreagar una nueva tarea */}
            <AgregarTarea />
        </section>
    )
}


export default Index;