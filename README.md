# Frontend de Gestión de Tareas

Este es el frontend para una aplicación de gestión de tareas (Todo List) construida con React, TypeScript y Vite, utilizando Bun como runtime y gestor de paquetes.

## Características

- Interfaz moderna y responsive con Tailwind CSS
- Gestión completa de tareas (Crear, Leer, Actualizar, Eliminar)
- Estado de tareas (Pendiente/Completado)
- Componentes reutilizables
- TypeScript para tipo seguro
- Vite para desarrollo rápido
- Bun para mejor rendimiento

## Tecnologías Principales

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Bun (Runtime y Package Manager)

## Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/     # Componentes reutilizables
│   │   ├── agregarTarea.tsx
│   │   ├── actualizarTarea.tsx
│   │   └── tareas.tsx
│   ├── pages/         # Páginas de la aplicación
│   ├── assets/        # Recursos estáticos
│   └── main.tsx       # Punto de entrada
└── public/            # Archivos públicos
```

## Instalación

1. Clona el repositorio
2. Instala las dependencias:
```bash
bun install
```

3. Inicia el servidor de desarrollo:
```bash
bun dev
```

La aplicación estará disponible en `http://localhost:5173`

## Scripts Disponibles

- `bun dev`: Inicia el servidor de desarrollo
- `bun build`: Construye la aplicación para producción
- `bun preview`: Previsualiza la versión de producción localmente

## Conexión con el Backend

El frontend se comunica con el backend a través de `http://localhost:4000`. Asegúrate de que el servidor backend esté en ejecución.
