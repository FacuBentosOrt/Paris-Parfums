import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { usePerfumeStore } from "../context/PerfumeStore";

function perfumeToForm(perfume) {
  return {
    slug: perfume.slug,
    name: perfume.name,
    family: perfume.family,
    shortDescription: perfume.shortDescription,
    heroDescription: perfume.heroDescription,
    detailedDescription: perfume.detailedDescription,
    narrative: perfume.narrative,
    volume: perfume.volume,
    concentration: perfume.concentration,
    badge: perfume.badge,
    notes: perfume.notes.join(", "),
    occasions: perfume.occasions.join(", "),
    intensity: perfume.intensity,
    duration: perfume.duration
  };
}

const emptyForm = {
  slug: "",
  name: "",
  family: "",
  shortDescription: "",
  heroDescription: "",
  detailedDescription: "",
  narrative: "",
  volume: "",
  concentration: "",
  badge: "",
  notes: "",
  occasions: "",
  intensity: "",
  duration: ""
};

export default function AdminPage() {
  const navigate = useNavigate();
  const {
    perfumes,
    addPerfume,
    updatePerfume,
    deletePerfume,
    logoutAdmin,
    resetPerfumes
  } = usePerfumeStore();
  const [selectedSlug, setSelectedSlug] = useState("");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState(emptyForm);

  const selectedPerfume = useMemo(
    () => perfumes.find((perfume) => perfume.slug === selectedSlug),
    [perfumes, selectedSlug]
  );

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleEdit(slug) {
    const perfume = perfumes.find((item) => item.slug === slug);
    if (!perfume) return;

    setSelectedSlug(slug);
    setForm(perfumeToForm(perfume));
    setMessage("Editando perfume seleccionado.");
  }

  function handleNew() {
    setSelectedSlug("");
    setForm(emptyForm);
    setMessage("Formulario listo para crear un perfume nuevo.");
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.name.trim()) {
      setMessage("El nombre es obligatorio.");
      return;
    }

    if (selectedPerfume) {
      const updated = updatePerfume(selectedPerfume.slug, form);
      setSelectedSlug(updated.slug);
      setForm(perfumeToForm(updated));
      setMessage("Perfume actualizado.");
      return;
    }

    const created = addPerfume(form);
    setSelectedSlug(created.slug);
    setForm(perfumeToForm(created));
    setMessage("Perfume creado.");
  }

  function handleDelete(slug) {
    deletePerfume(slug);
    if (selectedSlug === slug) {
      handleNew();
    }
    setMessage("Perfume eliminado.");
  }

  function handleLogout() {
    logoutAdmin();
    navigate("/");
  }

  return (
    <Layout>
      <section className="admin-section">
        <div className="admin-header reveal-on-scroll visible">
          <div>
            <p className="eyebrow">Panel privado</p>
            <h1>Gestion del catalogo</h1>
            <p className="summary">
              Desde aca el duenio puede agregar, editar o borrar perfumes. Los cambios se
              guardan en este navegador para probar el flujo completo sin backend.
            </p>
          </div>
          <div className="admin-actions">
            <button className="button" type="button" onClick={handleNew}>
              Nuevo perfume
            </button>
            <button className="button" type="button" onClick={resetPerfumes}>
              Restaurar base
            </button>
            <button className="button light" type="button" onClick={handleLogout}>
              Cerrar sesion
            </button>
          </div>
        </div>

        <div className="admin-layout">
          <aside className="admin-list">
            <h2>Perfumes</h2>
            <div className="admin-list-items">
              {perfumes.map((perfume) => (
                <div className="admin-list-card" key={perfume.slug}>
                  <div>
                    <strong>{perfume.name}</strong>
                    <span>{perfume.family}</span>
                  </div>
                  <div className="admin-list-buttons">
                    <button type="button" onClick={() => handleEdit(perfume.slug)}>
                      Editar
                    </button>
                    <button type="button" onClick={() => handleDelete(perfume.slug)}>
                      Borrar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </aside>

          <section className="admin-editor">
            <h2>{selectedPerfume ? "Editar perfume" : "Crear perfume"}</h2>
            {message ? <p className="admin-message">{message}</p> : null}
            <form className="admin-form-grid" onSubmit={handleSubmit}>
              <label className="field">
                <span>Nombre</span>
                <input name="name" value={form.name} onChange={handleChange} />
              </label>
              <label className="field">
                <span>Slug opcional</span>
                <input
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  placeholder="Se genera desde el nombre"
                />
              </label>
              <label className="field">
                <span>Familia</span>
                <input name="family" value={form.family} onChange={handleChange} />
              </label>
              <label className="field">
                <span>Presentacion</span>
                <input name="volume" value={form.volume} onChange={handleChange} />
              </label>
              <label className="field">
                <span>Concentracion</span>
                <input
                  name="concentration"
                  value={form.concentration}
                  onChange={handleChange}
                />
              </label>
              <label className="field">
                <span>Etiqueta</span>
                <input name="badge" value={form.badge} onChange={handleChange} />
              </label>
              <label className="field">
                <span>Intensidad</span>
                <input name="intensity" value={form.intensity} onChange={handleChange} />
              </label>
              <label className="field">
                <span>Duracion</span>
                <input name="duration" value={form.duration} onChange={handleChange} />
              </label>
              <label className="field field-full">
                <span>Descripcion corta</span>
                <textarea
                  name="shortDescription"
                  value={form.shortDescription}
                  onChange={handleChange}
                  rows="3"
                />
              </label>
              <label className="field field-full">
                <span>Texto de portada</span>
                <textarea
                  name="heroDescription"
                  value={form.heroDescription}
                  onChange={handleChange}
                  rows="3"
                />
              </label>
              <label className="field field-full">
                <span>Descripcion detallada</span>
                <textarea
                  name="detailedDescription"
                  value={form.detailedDescription}
                  onChange={handleChange}
                  rows="4"
                />
              </label>
              <label className="field field-full">
                <span>Narrativa</span>
                <textarea
                  name="narrative"
                  value={form.narrative}
                  onChange={handleChange}
                  rows="4"
                />
              </label>
              <label className="field field-full">
                <span>Notas separadas por coma</span>
                <input name="notes" value={form.notes} onChange={handleChange} />
              </label>
              <label className="field field-full">
                <span>Ocasiones separadas por coma</span>
                <input name="occasions" value={form.occasions} onChange={handleChange} />
              </label>
              <div className="field-full admin-submit-row">
                <button className="button light" type="submit">
                  {selectedPerfume ? "Guardar cambios" : "Crear perfume"}
                </button>
              </div>
            </form>
          </section>
        </div>
      </section>
    </Layout>
  );
}
