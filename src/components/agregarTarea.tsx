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

      {/* Mensaje de error general */}
      {errores.general && (
        <div className="mb-4 p-3 bg-red-900 border border-red-700 text-red-200 rounded-md">
          {errores.general}
        </div>
      )}

      <form onSubmit={enviarDatos} className="space-y-4">
        <div className="flex flex-col">
          <label className="text-gray-300 mb-1">
            Tarea <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={tarea}
            onChange={handleTareaChange}
            required
            className={`bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
              errores.tarea
                ? "border-2 border-red-500"
                : "border border-gray-600"
            } ${enviando ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={enviando}
            placeholder="Escribe tu tarea aquí..."
          />
          {errores.tarea && (
            <span className="text-red-400 text-sm mt-1">{errores.tarea}</span>
          )}
        </div>

        <div className="flex flex-col">
          <label className="text-gray-300 mb-1">Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className={`bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600 resize-none min-h-[100px] ${
              enviando ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={enviando}
            placeholder="Descripción opcional..."
          />
        </div>

        <button
          type="submit"
          disabled={enviando}
          className={`w-full font-semibold py-2 px-4 rounded transition duration-200 ${
            enviando
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white`}
        >
          {enviando ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Enviando...
            </div>
          ) : (
            "Agregar Tarea"
          )}
        </button>
      </form>

      {/* Información de campos obligatorios */}
      <div className="mt-4 text-xs text-gray-400">
        <p>
          Los campos marcados con <span className="text-red-400">*</span> son
          obligatorios
        </p>
      </div>
    </section>
  );
};

export default AgregarTarea;
