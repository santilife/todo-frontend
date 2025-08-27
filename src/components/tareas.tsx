import { useEffect, useState } from "react";
import ActualizarTarea from "./actualizarTarea";

const API_URL = "http://localhost:4000";

interface Tareas {
  id: number;
  tarea: string;
  descripcion: string;
  estado: string;
}

const TareasTabla = () => {
  useEffect(() => {
    document.title = "Prueba";
  }, []);

  const [tareas, setTareas] = useState<Tareas[]>([]);
  const [modalActualizar, setModal] = useState(false);
  const [tareaId, setTareaId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/todos`);
        const datos = await response.json();

        console.log(datos);
        setTareas(Array.isArray(datos) ? datos : []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setTareas([]);
      } 
    };

    fetchData();
  }, []);

  const modalOpen = (id: number) => {
    setTareaId(id);
    setModal(true);
  };

  const closeModal = () => {
    setModal(false)
  }

  const eliminarTarea = async (id: number) => {
    try {
      const responseDelete = await fetch(`${API_URL}/api/todos/${id}`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
        },
      });
      console.log("Se elimino el registro exitosamente: " + responseDelete)
      window.location.reload();
    } catch (error) {
      console.log("Error al eliminar los datos" + error);
    }
  };

  const actualizarEstado = async (id: number, currentEstado: string) => {
    const nuevoEstado = currentEstado === "Pendiente" ? "Completado" : "Pendiente";
    
    try {
      const response = await fetch(`${API_URL}/api/todos/${id}`, {
        method: "PUT", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      if (response.ok) {
        setTareas(tareas.map(tarea => 
          tarea.id === id ? { ...tarea, estado: nuevoEstado } : tarea
        ));
      }
    } catch (error) {
      console.error("Error al actualizar estado:", error);
    }
  };

  // Contador de tareas por estado
  const tareasCompletadas = tareas.filter(tarea => tarea.estado === "Completado").length;
  const tareasPendientes = tareas.filter(tarea => tarea.estado === "Pendiente").length;

  return (
    <section className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">Tareas</h1>
            <div className="flex gap-4 text-sm">
                <div className="bg-green-600 px-4 py-2 rounded">
                    <span className="text-white">Completadas: {tareasCompletadas}</span>
                </div>
                <div className="bg-yellow-600 px-4 py-2 rounded">
                    <span className="text-white">Pendientes: {tareasPendientes}</span>
                </div>
            </div>
        </div>
        <table className="min-w-full">
            <thead className="bg-gray-700">
                <tr>
                    <td className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Tarea</td>
                    <td className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Descripcion</td>
                    <td className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Estado</td>
                    <td className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Acciones</td>
                </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
                {tareas.map((tarea) => (
                    <tr key={tarea.id} className="hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{tarea.tarea}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{tarea.descripcion}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={tarea.estado === "Completado"}
                                    onChange={() => actualizarEstado(tarea.id, tarea.estado)}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                {tarea.estado}
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => modalOpen(tarea.id)}
                                    className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white transition duration-200"
                                >
                                    Actualizar
                                </button>
                                <button 
                                    onClick={() => eliminarTarea(tarea.id)}
                                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white transition duration-200"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        

        {/* Modal para actualizar datos */}
        {modalActualizar && tareaId && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
                    <div className="flex justify-between items-center mb-4">
                        <span 
                            className="close text-gray-400 hover:text-white cursor-pointer text-2xl" 
                            onClick={closeModal}
                        >
                            &times;
                        </span>
                    </div>

                    {/* Componente para actualizar tarea */}
                    <ActualizarTarea
                        id={tareaId}
                        onClose={closeModal}
                        onUpdate={() => {
                            closeModal();
                            window.location.reload();
                        }}
                    />
                </div>
            </div>
        )}
    </section>
  );
};

export default TareasTabla;
