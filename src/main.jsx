import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { supabase } from './lib/supabase'
import './styles.css'

const formats = [
  { icon: '✦', name: 'Guion corto', detail: 'Ideal para Reels, TikTok y Shorts' },
  { icon: '▣', name: 'Carrusel', detail: 'Ideas claras, diapositiva por diapositiva' },
  { icon: '⌁', name: 'Newsletter', detail: 'Contenido que construye audiencia' },
]

function App() {
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState('')
  const [idea, setIdea] = useState('')
  const [selectedFormat, setSelectedFormat] = useState(formats[0].name)
  const [notice, setNotice] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!supabase) return undefined
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null))
    return () => subscription.unsubscribe()
  }, [])

  async function signIn(event) {
    event.preventDefault()
    if (!supabase) return setNotice('Configura Supabase para habilitar el acceso.')
    setIsSubmitting(true)
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.href } })
    setNotice(error ? error.message : 'Revisa tu correo para continuar.')
    setIsSubmitting(false)
  }

  async function saveIdea(event) {
    event.preventDefault()
    if (!idea.trim()) return
    if (!supabase || !user) return setNotice('Inicia sesión para guardar tu idea y continuar.')
    setIsSubmitting(true)
    const { error } = await supabase.from('content_projects').insert({ user_id: user.id, format: selectedFormat, idea: idea.trim() })
    setNotice(error ? error.message : 'Idea guardada. Tu primer contenido está en camino.')
    if (!error) setIdea('')
    setIsSubmitting(false)
  }

  async function signOut() {
    await supabase?.auth.signOut()
    setNotice('Sesión cerrada.')
  }

  return <main className="app-shell">
    <nav className="topbar"><a className="brand" href="#inicio"><span className="brand-mark">✦</span><span>Creador <b>IA</b> Hub</span></a><div className="nav-links"><a href="#como-funciona">Cómo funciona</a><a href="#planes">Planes</a>{user ? <button className="login-button" onClick={signOut}>Salir</button> : <a className="login-button" href="#acceso">Entrar</a>}</div></nav>
    <section className="hero" id="inicio"><p className="eyebrow">TU ESTUDIO DE CONTENIDO INTELIGENTE</p><h1>Convierte tus ideas en contenido que <em>vende.</em></h1><p className="hero-copy">Crea guiones, carruseles y campañas listos para publicar, sin perder tu voz ni horas frente a una pantalla vacía.</p><a className="primary-action" href="#creador">Crear mi contenido <span>→</span></a><div className="trust-row"><span>✦</span> Hecho para creadores que quieren crecer con intención</div></section>
    <section className="creator-card" id="creador"><div className="creator-heading"><div><p className="section-kicker">EMPIEZA AQUÍ</p><h2>¿Qué quieres crear hoy?</h2></div><span className="step">01 / 03</span></div><div className="format-grid">{formats.map((format) => <button className={`format-card ${selectedFormat === format.name ? 'selected' : ''}`} key={format.name} onClick={() => setSelectedFormat(format.name)}><span className="format-icon">{format.icon}</span><strong>{format.name}</strong><small>{format.detail}</small></button>)}</div><form onSubmit={saveIdea}><label htmlFor="idea">Cuéntame tu idea, producto o tema</label><textarea id="idea" value={idea} onChange={(event) => setIdea(event.target.value)} placeholder="Ej. Quiero explicar por qué una marca personal necesita una narrativa clara..." rows="4" /><div className="creator-footer"><span>Tu contenido conservará tu tono y perspectiva.</span><button className="generate-button" disabled={isSubmitting}>Continuar <span>→</span></button></div></form>{notice && <p className="notice" role="status">{notice}</p>}</section>
    <section className="access-panel" id="acceso"><div><p className="section-kicker">TU ESPACIO PERSONAL</p><h2>Guarda tus ideas y vuelve cuando quieras.</h2><p>{user ? `Sesión iniciada como ${user.email}.` : 'Entra con tu correo. Te enviaremos un enlace de acceso, sin contraseñas.'}</p></div>{!user && <form onSubmit={signIn}><label htmlFor="email">Tu correo</label><div className="email-row"><input id="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="tu@correo.com" required /><button disabled={isSubmitting}>Enviar enlace</button></div></form>}</section>
    <section className="how-it-works" id="como-funciona"><div><p className="section-kicker">SIMPLE, PERO ESTRATÉGICO</p><h2>De una idea a una publicación en minutos.</h2></div><ol><li><span>01</span><div><strong>Define tu objetivo</strong><p>Elige el formato y comparte lo que quieres comunicar.</p></div></li><li><span>02</span><div><strong>Afina tu voz</strong><p>La IA estructura la idea con claridad, intención y personalidad.</p></div></li><li><span>03</span><div><strong>Publica y aprende</strong><p>Itera sobre contenido que ayuda a tu audiencia a avanzar.</p></div></li></ol></section>
    <section className="plans" id="planes"><p className="section-kicker">CRECE A TU RITMO</p><h2>Empieza gratis. Escala cuando tengas tracción.</h2><div className="plan-grid"><article><p>Explorar</p><h3>Gratis</h3><span>Para probar tu primer flujo creativo.</span><button>Comenzar gratis</button></article><article className="featured"><p>Crear con foco</p><h3>Próximamente</h3><span>Más formatos, historial y tu guía de voz.</span><button>Unirme a la lista</button></article></div></section><footer>© 2026 Creador IA Hub <span>•</span> Crea con claridad.</footer>
  </main>
}

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>)
