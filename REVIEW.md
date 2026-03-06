# 📝 Code Review: Contact List App Using React & Context - David Martinez

## ✅ Aspectos Positivos

1. **CRUD principal implementado**: La app lista contactos, permite crear, editar y eliminar, y además contempla el estado vacío de la agenda.

2. **Uso real de React Router**: La ruta dinámica `edit/:id` está bien planteada y la edición soporta incluso un refresh porque intenta recuperar el contacto desde la API si no está en el store.

3. **Context API con reducer**: La lista global de contactos se comparte correctamente entre pantallas y la eliminación actualiza la UI de forma inmediata con `filter`, que además respeta la inmutabilidad.

4. **Interfaz clara y usable**: La vista principal es fácil de recorrer, el botón para crear contacto es visible y la confirmación nativa antes de borrar evita errores accidentales.

## 🔍 Áreas de Mejora

### 1. Reducer con código plantilla sobrante

El reducer original mezclaba la lógica real del proyecto con restos del template (`todos`, `message` y `add_task`). Eso hace más difícil entender qué estado importa de verdad en esta app.

**Código actual (`src/store.js`):**

```javascript
return {
  message: null,
  contacts: [],
  todos: [
    { id: 1, title: "Make the bed", background: null },
    { id: 2, title: "Do my homework", background: null }
  ]
};
```

**Código mejorado:**

```javascript
export const initialStore = () => {
  return {
    contacts: [],
  };
};
```

**¿Por qué es mejor?**

- El store queda enfocado en la responsabilidad real del ejercicio.
- Evita que futuros cambios toquen acciones o estados que no pertenecen al proyecto.
- Hace más simple depurar el flujo de contactos.

### 2. Add y Edit duplicaban casi todo el formulario

`AddContact.jsx` y `EditContact.jsx` repetían el JSX de inputs, labels, errores y botones. Esa duplicación vuelve costoso mantener el formulario, porque cualquier cambio hay que hacerlo dos veces.

**Código actual (`src/pages/AddContact.jsx` y `src/pages/EditContact.jsx`):**

```javascript
<div className="mb-3">
  <label className="form-label text-success fw-bold">Full Name</label>
  <input
    type="text"
    className="form-control"
    value={contact.name}
    onChange={e => setContact({ ...contact, name: e.target.value })}
    required
  />
</div>
```

**Código mejorado:**

```javascript
<ContactForm
  initialValues={contact}
  title="Update Contact Info"
  submitLabel="Update Contact"
  onSubmit={handleUpdate}
/>
```

**¿Por qué es mejor?**

- Se aplica el principio DRY.
- La validación y el estilo del formulario quedan centralizados.
- Agregar un campo nuevo ahora requiere un solo cambio.

### 3. Validación inconsistente entre crear y editar

En la versión original, el alta solo comprobaba `name` y `email`, mientras que la edición enviaba directamente el `PUT` sin una validación mínima unificada ni normalización consistente de espacios.

**Código actual (`src/pages/EditContact.jsx`):**

```javascript
const updated = {
  name: contact.name.trim(),
  email: contact.email.trim(),
  phone: contact.phone.trim(),
  address: contact.address.trim()
};

const res = await fetch(`${CONTACTS_ENDPOINT}/${id}`, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(updated)
});
```

**Código mejorado:**

```javascript
const normalizedContact = normalizeContact(formData);
const nextErrors = validateContact(normalizedContact);

if (Object.keys(nextErrors).length > 0) {
  setFieldErrors(nextErrors);
  return;
}
```

**¿Por qué es mejor?**

- La app valida igual en crear y editar.
- Se evitan envíos con campos vacíos llenos solo de espacios.
- El usuario recibe feedback visible dentro del formulario.

### 4. El proyecto no se podía verificar con `lint`

El repo original incluía `eslint.cjs`, pero ESLint 8 no lo detecta automáticamente con ese nombre en esta configuración. Además había reglas de verificación fallando por la organización del provider y por algunos detalles de JSX.

**Código actual:**

```javascript
// Archivo original
eslint.cjs
```

**Código mejorado:**

```javascript
// Archivo reconocido por ESLint
.eslintrc.cjs
```

**¿Por qué es mejor?**

- El proyecto vuelve a ser verificable con `npm run lint`.
- La revisión puede apoyarse en checks automáticos reales.
- Facilita mantener una base de código consistente.

## 🎯 Patrones y Anti-patrones Identificados

### Patrones Positivos Encontrados ✅

#### 1. Context API para estado compartido

**Tipo:** Patrón ✅

**Dónde aparece:**

- Archivo: `src/hooks/useGlobalReducer.jsx`

**Código:**

```javascript
const { store, dispatch } = useStore();
```

**¿Por qué es importante?**

- Evita prop drilling entre pantallas.
- Centraliza el estado de contactos.
- Encaja con el objetivo del ejercicio.

#### 2. Ruta dinámica para edición

**Tipo:** Patrón ✅

**Dónde aparece:**

- Archivo: `src/routes.jsx`

**Código:**

```javascript
<Route path="edit/:id" element={<EditContact />} />
```

**¿Por qué es importante?**

- Permite editar un recurso concreto por ID.
- Es un patrón muy común en apps CRUD.
- Mejora la navegación y la escalabilidad.

### Anti-patrones a Mejorar ❌

#### 1. Código plantilla no eliminado

**Tipo:** Anti-patrón ❌

**Dónde aparece:**

- Archivo: `src/store.js`

**Código:**

```javascript
todos: [
  { id: 1, title: "Make the bed", background: null },
  { id: 2, title: "Do my homework", background: null }
]
```

**Alternativa:**

```javascript
return {
  contacts: [],
};
```

**Conceptos relacionados:**

- Responsabilidad única
- Código muerto
- Mantenibilidad

#### 2. Duplicación de formulario

**Tipo:** Anti-patrón ❌

**Dónde aparece:**

- Archivo: `src/pages/AddContact.jsx`
- Archivo: `src/pages/EditContact.jsx`

**Código:**

```javascript
<div className="mb-3">
  <label className="form-label text-success fw-bold">Email</label>
  <input type="email" className="form-control" ... />
</div>
```

**Alternativa:**

```javascript
<ContactForm
  title="Add New Spring Contact"
  submitLabel="Save Contact"
  onSubmit={saveContact}
/>
```

**Conceptos relacionados:**

- DRY
- Reutilización de componentes
- Separación de responsabilidades

#### 3. Feedback incompleto ante errores de red

**Tipo:** Anti-patrón ❌

**Dónde aparece:**

- Archivo: `src/pages/Home.jsx`
- Archivo: `src/pages/EditContact.jsx`

**Código:**

```javascript
catch (error) {
  console.error("Error fetching contacts:", error);
}
```

**Alternativa:**

```javascript
setLoadError(
  error instanceof Error ? error.message : "The contact list could not be loaded."
);
```

**Conceptos relacionados:**

- UX defensiva
- Manejo de errores
- Feedback al usuario

## 📊 Evaluación Detallada

### Criterios de Evaluación (Total: 87/100)

| Criterio | Puntos | Obtenido | Comentario |
|----------|--------|----------|------------|
| **Funcionalidad Básica** | 30 | 30 | CRUD completo, rutas funcionando y estado vacío presente. |
| **Código Limpio** | 20 | 15 | El código era legible, pero había restos del template y el proyecto no quedaba verificable con lint. |
| **Estructura** | 15 | 12 | La separación por páginas estaba bien, pero el formulario estaba duplicado entre alta y edición. |
| **Buenas Prácticas** | 15 | 12 | Context y Router correctos, aunque la validación era inconsistente entre pantallas. |
| **HTML/CSS** | 10 | 9 | Interfaz clara y usable, con detalles menores de pulido técnico. |
| **UX/Animaciones** | 10 | 9 | Buen flujo general, pero faltaba feedback visible cuando la API fallaba. |
| **TOTAL** | **100** | **87** | **✅ APROBADO** |

### Desglose de Puntos Perdidos (-13 puntos)

1. **-5 puntos** - `src/store.js` conservaba estado y acciones del template (`todos`, `add_task`, `message`) que no pertenecen al proyecto y bajan la claridad del reducer.
2. **-3 puntos** - `src/pages/AddContact.jsx` y `src/pages/EditContact.jsx` repetían casi todo el formulario en lugar de reutilizar un componente común.
3. **-3 puntos** - La validación original no era consistente: crear validaba parcialmente y editar enviaba a la API sin un control uniforme de campos.
4. **-2 puntos** - La app no mostraba feedback visual útil ante fallos de carga/guardado y el repo no quedaba listo para verificación con `lint`.

### Cómo Llegar a 100/100

Aplicando las correcciones de este PR:

- ✅ +5 puntos - Reducer limpio y enfocado solo en contactos.
- ✅ +3 puntos - Formulario reutilizable para alta y edición.
- ✅ +3 puntos - Validación y normalización compartidas en ambos flujos.
- ✅ +2 puntos - Mejor feedback de errores y proyecto verificable con `npm run lint`.

**= 100/100** 🎉

## 📊 Resumen

| Aspecto | Estado |
|---------|--------|
| Funcionalidad | ✅ Excelente |
| Context API | ✅ Bien aplicado |
| Estructura | ⚠️ Mejorable |
| Validación | ⚠️ Inconsistente en la versión original |
| Verificación | ⚠️ Requería ajuste en ESLint |

**Nota final**: El proyecto cumple bien el objetivo del ejercicio y demuestra que entiendes el flujo CRUD con React Router y Context. Las mejoras de este PR no cambian la idea central de tu solución; la hacen más mantenible, más verificable y más consistente para futuros proyectos.
