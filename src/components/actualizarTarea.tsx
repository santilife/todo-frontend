import { useState } from "react";

const API_URL = "http://localhost:4000";

interface Actualizar {
  //   id: number;
  tarea: string;
  descripcion: string;
}

interface ActualizarTareaProps {
  id: number;
  onClose: () => void;
  onUpdate: () => void;
}

interface Errores {
  tarea?: string;
  general?: string;
}

const ActualizarTarea = ({ id, onClose, onUpdate }: ActualizarTareaProps) => {
  const [tarea, setTarea] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [errores, setErrores] = useState<Errores>({});
  const [enviando, setEnviando] = useState(false);

  // Validación del formulario
  const validarFormulario = (): boolean => {
    const nuevosErrores: Errores = {};

    // Validar campo tarea
    if (!tarea.trim()) {
      nuevosErrores.tarea = 'El campo "Tarea" es obligatorio';
    } else if (tarea.trim().length < 3) {
      nuevosErrores.tarea = "La tarea debe tener al menos 3 caracteres";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Manejar cambio en el campo tarea y limpiar error
  const handleTareaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTarea(e.target.value);
    // Limpiar error cuando el usuario empiece a escribir
    if (errores.tarea) {
      setErrores((prev) => ({ ...prev, tarea: undefined }));
    }
  };

  const actualizarTarea = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);

    // Validación antes de enviar
    if (!validarFormulario()) {
      setEnviando(false);
      return;
    }

    const datos: Actualizar = {
      tarea,
      descripcion,
    };

    try {
      const response = await fetch(`${API_URL}/api/todos/${id}`, {
        method: "PUT", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
      });
      
      const result = await response.json();

      if (response.ok) {
        // Limpiar errores y cerrar modal
        setErrores({});
        alert("Tarea actualizada correctamente");
        onUpdate();
      } else {
        // Manejar errores del backend
        if (result.field === "tarea") {
          setErrores({ tarea: result.error });
        } else {
          setErrores({ general: result.error || "Error al actualizar la tarea" });
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setErrores({ general: "Error al conectar con el servidor" });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="space-y-4">
        <h1 className="text-xl font-bold text-white">Actualizar Tarea</h1>
        <form onSubmit={actualizarTarea} className="space-y-4">
            <div className="flex flex-col">
                <label htmlFor="tarea" className="text-gray-300 mb-1">Tarea</label>
                <input
                    id="tarea"
                    type="text"
                    value={tarea}
                    onChange={handleTareaChange}
                    required
                    disabled={enviando}
                    className={`bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errores.tarea ? 'border-red-500 border-2' : ''
                    }`}
                />
                {errores.tarea && (
                    <span className="text-red-500 text-sm mt-1">{errores.tarea}</span>
                )}
            </div>
            <div className="flex flex-col">
                <label htmlFor="descripcion" className="text-gray-300 mb-1">Descripción</label>
                <input
                    id="descripcion"
                    type="text"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    disabled={enviando}
                    className="bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            {errores.general && (
                <div className="text-red-500 text-sm">{errores.general}</div>
            )}
            <div className="flex gap-2 justify-end">
                <button 
                    type="button"
                    onClick={onClose}
                    disabled={enviando}
                    className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-white transition duration-200 disabled:opacity-50"
                >
                    Cancelar
                </button>
                <button 
                    type="submit"
                    disabled={enviando}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white transition duration-200 disabled:opacity-50"
                >
                    {enviando ? 'Actualizando...' : 'Actualizar datos'}
                </button>
            </div>
        </form>
    </div>
  );
};

export default ActualizarTarea;