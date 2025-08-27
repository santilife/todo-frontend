import { useState } from "react";

const API_URL = "http://localhost:4000";

interface NuevaTarea {
  //   id: number;
  tarea: string;
  descripcion: string;
}

interface Errores {
  tarea?: string;
  general?: string;
}

const AgregarTarea = () => {
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

  const enviarDatos = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);

    // Validación antes de enviar
    if (!validarFormulario()) {
      setEnviando(false);
      return;
    }

    const datos: NuevaTarea = {
      tarea,
      descripcion,
    };

    try {
      const response = await fetch(`${API_URL}/api/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
      });
      const result = await response.json();

      if (response.ok) {
        // Limpiar formulario
        setTarea("");
        setDescripcion("");
        setErrores({});
        alert("Tarea agregada correctamente");

        // Opcional: recargar o actualizar lista
        window.location.reload();
      } else {
        // Manejar errores del backend
        if (result.field === "tarea") {
          setErrores({ tarea: result.error });
        } else {
          setErrores({ general: result.error || "Error al agregar la tarea" });
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setErrores({ general: "Error al conectar con el servidor" });
    } finally {
      setEnviando(false);
    }
  };

  // Manejar cambio en el campo tarea y limpiar error
  const handleTareaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTarea(e.target.value);
    // Limpiar error cuando el usuario empiece a escribir
    if (errores.tarea) {
      setErrores((prev) => ({ ...prev, tarea: undefined }));
    }
  };
  return (
    <section className="bg-gray-800 p-6 rounded-lg shadow-lg w-80">
      <h2 className="text-xl font-bold mb-4 text-white">Agregar Tarea</h2>
      <div className="space-y-4">
        <div className="flex flex-col">
          <label className="text-gray-300 mb-1">Tarea</label>
          <input
            type="text"
            value={tarea}
            onChange={handleTareaChange}
            required
            className="bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={enviando}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-300 mb-1">Descripción</label>
          <input
            type="text"
            onChange={(e) => setDescripcion(e.target.value)}
            className="bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={enviarDatos}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-200"
        >
          Agregar Tarea
        </button>
      </div>
    </section>
  );
};

export default AgregarTarea;
