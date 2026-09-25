#!/usr/bin/env python3
"""Build the bilingual LuvBlooms Phase 1 static page cluster."""

from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SITE = "https://luvblooms.us"
IMAGE = f"{SITE}/assets/images/pages/lb_home_01.jpg"

SOCIALS = [
    "https://www.instagram.com/luvblooms.us/",
    "https://www.tiktok.com/@luvblooms.us",
    "https://www.facebook.com/profile.php?id=61577783327957",
    "https://www.youtube.com/@luv.blooms",
    "https://www.linkedin.com/company/luvblooms/",
]


META = {
    ("home", "en"): ("/", "LuvBlooms | Floral Design for Events & Arrangements", "LuvBlooms creates thoughtful florals for brand activations, intimate events, custom arrangements, and design consultations. Explore services or inquire.", "Thoughtful floral design for meaningful moments."),
    ("home", "es"): ("/es/", "LuvBlooms | Diseño Floral para Eventos y Arreglos", "LuvBlooms crea flores para activaciones de marca, eventos íntimos, arreglos personalizados y consultorías de diseño. Explora o solicita información.", "Diseño floral pensado para momentos significativos."),
    ("services", "en"): ("/services/", "Floral Design Services | LuvBlooms", "Explore LuvBlooms services for brand activations, intimate events, custom arrangements, floral consultations, and curated at-home experiences.", "Floral design services, shaped around your moment."),
    ("services", "es"): ("/es/servicios/", "Servicios de Diseño Floral | LuvBlooms", "Explora los servicios de LuvBlooms para activaciones de marca, eventos íntimos, arreglos personalizados, consultorías y experiencias en casa.", "Servicios de diseño floral creados para tu momento."),
    ("brand-events", "en"): ("/services/brand-events-activations/", "Brand Event & Activation Florals | LuvBlooms", "Custom floral design for brand events and activations, from concept and palette development to on-site styling. Tell LuvBlooms about your project.", "Floral design for brand events and activations."),
    ("brand-events", "es"): ("/es/servicios/eventos-de-marca/", "Flores para Eventos de Marca | LuvBlooms", "Diseño floral personalizado para eventos y activaciones de marca, desde el concepto hasta el montaje. Cuéntale tu proyecto a LuvBlooms.", "Diseño floral para eventos de marca y activaciones."),
    ("intimate-events", "en"): ("/services/intimate-events/", "Florals for Intimate Events | LuvBlooms", "Considered florals for intimate dinners, private celebrations, and small gatherings. LuvBlooms designs arrangements that support the atmosphere.", "Florals that make intimate gatherings feel considered."),
    ("intimate-events", "es"): ("/es/servicios/eventos-intimos/", "Flores para Eventos Íntimos | LuvBlooms", "Flores cuidadas para cenas, celebraciones privadas y encuentros pequeños. LuvBlooms diseña arreglos que acompañan la atmósfera.", "Flores que hacen sentir especial cada encuentro íntimo."),
    ("arrangements", "en"): ("/services/custom-arrangements/", "Custom Floral Arrangements | LuvBlooms", "Request a custom LuvBlooms arrangement created for your recipient, setting, palette, and occasion. Share the date, location, budget, and feeling.", "A custom floral arrangement, made with intention."),
    ("arrangements", "es"): ("/es/servicios/arreglos-florales/", "Arreglos Florales Personalizados | LuvBlooms", "Solicita un arreglo LuvBlooms creado para la persona, el espacio, la paleta y la ocasión. Comparte fecha, ubicación, presupuesto e intención.", "Un arreglo floral personalizado, creado con intención."),
    ("consultations", "en"): ("/services/floral-design-consultations/", "Floral Design Consultations | LuvBlooms", "Book a focused floral design consultation for concept, palette, sourcing, styling, or spatial direction. Start with a short LuvBlooms inquiry.", "Clear floral direction, shaped with you."),
    ("consultations", "es"): ("/es/servicios/consultoria-diseno-floral/", "Consultoría de Diseño Floral | LuvBlooms", "Solicita una consultoría de diseño floral para concepto, paleta, selección, estilismo o dirección espacial. Comienza con una breve consulta.", "Dirección floral clara, creada contigo."),
    ("at-home", "en"): ("/curated-at-home/", "Curated At-Home Flowers—Coming Soon | LuvBlooms", "Curated LuvBlooms floral experiences for the home are coming soon. Learn what is planned and join the interest list for future availability.", "Curated floral experiences at home—coming soon."),
    ("at-home", "es"): ("/es/experiencias-florales-en-casa/", "Flores en Casa—Próximamente | LuvBlooms", "Las experiencias florales LuvBlooms para el hogar llegarán pronto. Conoce la propuesta y únete a la lista de interés para recibir novedades.", "Experiencias florales en casa—próximamente."),
    ("about", "en"): ("/about/", "Why LuvBlooms | Intentional Floral Design Studio", "Discover the LuvBlooms point of view: intentional floral design, thoughtful collaboration, and flowers created for brands, gatherings, and meaningful gestures.", "Floral design with feeling, restraint, and intention."),
    ("about", "es"): ("/es/nosotros/", "Por Qué LuvBlooms | Estudio de Diseño Floral", "Conoce la visión de LuvBlooms: diseño floral con intención, colaboración cuidadosa y flores para marcas, encuentros y gestos significativos.", "Diseño floral con emoción, equilibrio e intención."),
    ("inquiry", "en"): ("/inquire/", "Start a Floral Inquiry | LuvBlooms", "Tell LuvBlooms what you need. Choose a brand event or arrangement request, share the essentials, and we will follow up to arrange a conversation.", "Tell us what you have in mind."),
    ("inquiry", "es"): ("/es/consultas/", "Inicia una Consulta Floral | LuvBlooms", "Cuéntale a LuvBlooms qué necesitas. Elige evento de marca o solicitud de arreglo, comparte lo esencial y te contactaremos para conversar.", "Cuéntanos lo que tienes en mente."),
    ("privacy", "en"): ("/privacy/", "Privacy Policy | LuvBlooms", "Read how LuvBlooms collects, uses, protects, and retains information submitted through its website, inquiry forms, analytics, and communications.", "Privacy policy."),
    ("privacy", "es"): ("/es/privacidad/", "Política de Privacidad | LuvBlooms", "Conoce cómo LuvBlooms recopila, utiliza, protege y conserva la información enviada mediante el sitio, formularios, analítica y comunicaciones.", "Política de privacidad."),
}

PAIR_PATHS = {
    "home": ("/", "/es/"),
    "services": ("/services/", "/es/servicios/"),
    "brand-events": ("/services/brand-events-activations/", "/es/servicios/eventos-de-marca/"),
    "intimate-events": ("/services/intimate-events/", "/es/servicios/eventos-intimos/"),
    "arrangements": ("/services/custom-arrangements/", "/es/servicios/arreglos-florales/"),
    "consultations": ("/services/floral-design-consultations/", "/es/servicios/consultoria-diseno-floral/"),
    "at-home": ("/curated-at-home/", "/es/experiencias-florales-en-casa/"),
    "about": ("/about/", "/es/nosotros/"),
    "inquiry": ("/inquire/", "/es/consultas/"),
    "privacy": ("/privacy/", "/es/privacidad/"),
}


SERVICES = {
    ("brand-events", "en"): {
        "kicker": "Brand events and activations",
        "lead": "Concept-led florals for launches, dinners, pop-ups, content moments, and branded experiences across Miami-Dade County.",
        "intro_h": "Built to support the brand, the room, and the camera.",
        "intro": "We translate your campaign, palette, venue, and guest experience into a floral direction that feels specific to the brand. The work may be quiet and refined or bold and sculptural, but it always begins with a clear purpose.",
        "includes_h": "What we can create",
        "includes": ["Floral concepts and palette development", "Entry, registration, bar, table, stage, or product moments", "On-site styling and placement when the project requires it", "Floral direction for content and photography"],
        "process": ["Share the date, location, audience, budget, and brand direction.", "We review the brief and arrange a focused conversation.", "Once scope is confirmed, we shape the floral concept and production plan."],
        "faqs": [("Can the florals follow brand colors?", "Yes. We can interpret an established palette while keeping the flowers dimensional and natural."), ("Do you provide on-site styling?", "On-site styling can be included when the event scope and venue require it."), ("How far ahead should we inquire?", "Earlier is better, especially for installations or specific sourcing. Send the date and scope even if some details are still developing.")],
        "message": "brand_event",
    },
    ("brand-events", "es"): {
        "kicker": "Eventos de marca y activaciones",
        "lead": "Flores basadas en un concepto para lanzamientos, cenas, pop-ups, contenido y experiencias de marca en todo Miami-Dade.",
        "intro_h": "Diseñado para apoyar la marca, el espacio y la imagen.",
        "intro": "Traducimos la campaña, la paleta, el lugar y la experiencia del invitado en una dirección floral propia de la marca. El resultado puede ser sereno y refinado o más escultórico, pero siempre parte de un propósito claro.",
        "includes_h": "Qué podemos crear",
        "includes": ["Concepto floral y desarrollo de paleta", "Momentos para entradas, registro, barra, mesas, escenario o producto", "Montaje y estilismo en el lugar cuando el proyecto lo requiera", "Dirección floral para contenido y fotografía"],
        "process": ["Comparte fecha, lugar, audiencia, presupuesto y dirección de marca.", "Revisamos el brief y coordinamos una conversación puntual.", "Al confirmar el alcance, desarrollamos el concepto y plan de producción."],
        "faqs": [("¿Las flores pueden seguir los colores de marca?", "Sí. Podemos interpretar una paleta establecida sin perder dimensión ni naturalidad."), ("¿Incluyen estilismo en el lugar?", "El estilismo puede incluirse cuando el alcance y el lugar lo requieran."), ("¿Con cuánto tiempo debemos consultar?", "Mientras antes, mejor, especialmente para instalaciones o flores específicas. Envíanos la fecha y el alcance aunque algunos detalles sigan en desarrollo.")],
        "message": "brand_event_es",
    },
    ("intimate-events", "en"): {
        "kicker": "Florals for intimate events",
        "lead": "Considered flowers for private dinners, milestone gatherings, showers, and small celebrations throughout Miami-Dade County.",
        "intro_h": "Atmosphere matters most when every detail is close.",
        "intro": "For smaller gatherings, the florals can shape the entire room. We design around the table, setting, guest experience, and emotional tone so the flowers feel connected to the occasion rather than simply added to it.",
        "includes_h": "Floral possibilities",
        "includes": ["Dining-table and cocktail arrangements", "Welcome, bar, buffet, or focal moments", "Host or guest-of-honor arrangements", "Delivery, placement, or styling according to scope"],
        "process": ["Tell us about the gathering, date, location, guest count, and feeling.", "We clarify the floral priorities and practical requirements.", "We confirm a focused design and the next production steps."],
        "faqs": [("What kinds of gatherings are a fit?", "Private dinners, birthdays, showers, milestone celebrations, and other intentionally sized gatherings are a strong fit."), ("Can you work with a color palette?", "Yes. A palette, room reference, invitation, or mood can all guide the direction."), ("Do you offer wedding floral design?", "No. LuvBlooms does not offer wedding floral design." )],
        "message": "intimate_event",
    },
    ("intimate-events", "es"): {
        "kicker": "Flores para eventos íntimos",
        "lead": "Flores cuidadas para cenas privadas, celebraciones especiales, showers y encuentros pequeños en todo Miami-Dade.",
        "intro_h": "La atmósfera importa aún más cuando cada detalle está cerca.",
        "intro": "En un encuentro pequeño, las flores pueden definir todo el ambiente. Diseñamos considerando la mesa, el espacio, la experiencia de los invitados y el tono emocional para que cada arreglo pertenezca al momento.",
        "includes_h": "Posibilidades florales",
        "includes": ["Arreglos para mesas y áreas de cóctel", "Momentos de bienvenida, barra, buffet o punto focal", "Arreglos para anfitriones o personas homenajeadas", "Entrega, colocación o estilismo según el alcance"],
        "process": ["Cuéntanos sobre el encuentro, fecha, lugar, número de invitados y ambiente.", "Aclaramos prioridades florales y requisitos prácticos.", "Confirmamos una dirección de diseño y los próximos pasos."],
        "faqs": [("¿Qué tipos de encuentros son ideales?", "Cenas privadas, cumpleaños, showers, celebraciones especiales y otros encuentros de escala intencional."), ("¿Pueden trabajar con una paleta de color?", "Sí. Una paleta, el espacio, una invitación o referencias visuales pueden guiar la dirección."), ("¿Ofrecen diseño floral para bodas?", "No. LuvBlooms no ofrece diseño floral para bodas.")],
        "message": "intimate_event_es",
    },
    ("arrangements", "en"): {
        "kicker": "Custom arrangements",
        "lead": "One-of-a-kind arrangements designed for a recipient, room, gesture, or occasion, with local requests considered across Miami-Dade County.",
        "intro_h": "Personal flowers begin with the reason behind them.",
        "intro": "Tell us who or what the arrangement is for, the feeling you want it to carry, the date, location, and budget. We use that direction to create something individual rather than repeat a fixed catalog design.",
        "includes_h": "What makes it custom",
        "includes": ["A composition guided by your message and setting", "Seasonal flower and foliage selection", "A considered palette, vessel, scale, and silhouette", "Delivery or pickup details confirmed with the request"],
        "process": ["Choose Arrangement Request in the inquiry form.", "Share the date, location, budget, palette, and meaning.", "We confirm availability and contact you to finalize the request."],
        "faqs": [("Can I request exact flowers?", "You may share favorites, but availability and quality vary. We use your preferences as direction and recommend the strongest seasonal choices."), ("Is delivery available?", "Local delivery may be available depending on date, address, and order scope."), ("How much notice is needed?", "More notice gives us better sourcing flexibility. Submit the request as soon as you know the date.")],
        "message": "arrangement",
    },
    ("arrangements", "es"): {
        "kicker": "Arreglos florales personalizados",
        "lead": "Arreglos únicos para una persona, un espacio, un gesto o una ocasión, con solicitudes locales en todo Miami-Dade.",
        "intro_h": "Las flores personales comienzan con el motivo.",
        "intro": "Cuéntanos para quién o para qué es el arreglo, la emoción que deseas transmitir, la fecha, la ubicación y el presupuesto. Usamos esa dirección para crear algo individual, no una copia de catálogo.",
        "includes_h": "Qué lo hace personalizado",
        "includes": ["Una composición guiada por tu mensaje y el espacio", "Selección estacional de flores y follaje", "Paleta, recipiente, escala y silueta cuidadosamente elegidos", "Detalles de entrega o recogida confirmados con la solicitud"],
        "process": ["Elige Solicitud de Arreglo en el formulario.", "Comparte fecha, ubicación, presupuesto, paleta e intención.", "Confirmamos disponibilidad y te contactamos para finalizar la solicitud."],
        "faqs": [("¿Puedo pedir flores específicas?", "Puedes compartir tus favoritas, pero la disponibilidad y calidad cambian. Usaremos tus preferencias como dirección y recomendaremos las mejores opciones de temporada."), ("¿Hay entrega?", "La entrega local puede estar disponible según la fecha, dirección y alcance."), ("¿Con cuánta anticipación debo solicitar?", "Más tiempo permite mejores opciones de selección. Envía la solicitud tan pronto sepas la fecha.")],
        "message": "arrangement_es",
    },
    ("consultations", "en"): {
        "kicker": "Floral design consultations",
        "lead": "Focused creative guidance for people, brands, hosts, and spaces that need a clear floral concept before moving forward.",
        "intro_h": "A useful direction before you invest in execution.",
        "intro": "A consultation creates clarity around palette, proportion, seasonal possibilities, sourcing, styling, and spatial impact. It is designed for clients who need an experienced floral point of view, whether or not LuvBlooms later produces the work.",
        "includes_h": "What we can explore",
        "includes": ["Concept, mood, and floral language", "Color, texture, flower, and foliage direction", "Scale and placement within a room or table plan", "Practical sourcing and styling considerations"],
        "process": ["Share the question, project, references, and decisions you need to make.", "We confirm the consultation scope and prepare for the conversation.", "You leave with focused recommendations and clear next steps."],
        "faqs": [("Who is a consultation for?", "It is useful for hosts, creative teams, brands, and anyone planning a floral direction before committing to production."), ("What should I prepare?", "Bring the date, location, approximate budget, images of the space, and any visual references."), ("Is implementation included?", "Implementation is separate and depends on scope and availability. We can discuss it after the consultation.")],
        "message": "consultation",
    },
    ("consultations", "es"): {
        "kicker": "Consultoría de diseño floral",
        "lead": "Guía creativa enfocada para personas, marcas, anfitriones y espacios que necesitan una dirección floral clara antes de avanzar.",
        "intro_h": "Una dirección útil antes de invertir en la ejecución.",
        "intro": "La consultoría aporta claridad sobre paleta, proporción, posibilidades estacionales, selección, estilismo e impacto espacial. Es para quienes necesitan una mirada floral experta, incluso si LuvBlooms no produce el proyecto después.",
        "includes_h": "Qué podemos explorar",
        "includes": ["Concepto, ambiente y lenguaje floral", "Dirección de color, textura, flores y follaje", "Escala y ubicación dentro de un espacio o mesa", "Consideraciones prácticas de selección y estilismo"],
        "process": ["Comparte la pregunta, proyecto, referencias y decisiones pendientes.", "Confirmamos el alcance y nos preparamos para la conversación.", "Recibes recomendaciones enfocadas y próximos pasos claros."],
        "faqs": [("¿Para quién es la consultoría?", "Es útil para anfitriones, equipos creativos, marcas y cualquier persona que quiera definir la dirección antes de producir."), ("¿Qué debo preparar?", "Trae fecha, lugar, presupuesto aproximado, imágenes del espacio y referencias visuales."), ("¿Incluye implementación?", "La implementación es separada y depende del alcance y disponibilidad. Podemos conversarlo después.")],
        "message": "consultation_es",
    },
}


SERVICE_CARDS = {
    "en": [
        ("Brand events and activations", "/services/brand-events-activations/", "Concept-led florals for launches, dinners, pop-ups, and brand experiences."),
        ("Florals for intimate events", "/services/intimate-events/", "Atmospheric flowers for private dinners, milestones, and smaller gatherings."),
        ("Custom arrangements", "/services/custom-arrangements/", "Personal arrangements shaped around a recipient, room, palette, and occasion."),
        ("Floral design consultations", "/services/floral-design-consultations/", "Focused direction for concept, palette, sourcing, styling, and space."),
        ("Curated at-home experiences", "/curated-at-home/", "A future floral subscription experience for the home. Coming soon."),
    ],
    "es": [
        ("Eventos de marca y activaciones", "/es/servicios/eventos-de-marca/", "Flores basadas en un concepto para lanzamientos, cenas, pop-ups y experiencias de marca."),
        ("Flores para eventos íntimos", "/es/servicios/eventos-intimos/", "Flores con atmósfera para cenas privadas, celebraciones y encuentros pequeños."),
        ("Arreglos personalizados", "/es/servicios/arreglos-florales/", "Arreglos personales creados para una persona, espacio, paleta y ocasión."),
        ("Consultoría de diseño floral", "/es/servicios/consultoria-diseno-floral/", "Dirección enfocada para concepto, paleta, selección, estilismo y espacio."),
        ("Experiencias florales en casa", "/es/experiencias-florales-en-casa/", "Una futura experiencia de suscripción floral para el hogar. Próximamente."),
    ],
}


def cards(lang: str) -> str:
    label = "Explore service" if lang == "en" else "Explorar servicio"
    return '<div class="lb-service-grid">' + "".join(
        f'<article class="lb-service-card"><div><h3>{name}</h3><p>{copy}</p></div><a class="lb-card-link" href="{href}">{label}</a></article>'
        for name, href, copy in SERVICE_CARDS[lang]
    ) + "</div>"


def faq_markup(faqs: list[tuple[str, str]]) -> str:
    return '<div class="lb-faq-list">' + "".join(
        f'<details><summary>{question}</summary><p>{answer}</p></details>' for question, answer in faqs
    ) + "</div>"


def schema(pair: str, lang: str, title: str, description: str, faqs: list[tuple[str, str]] | None = None, page_type: str = "WebPage") -> str:
    path = META[(pair, lang)][0]
    crumbs = [("Home" if lang == "en" else "Inicio", "/" if lang == "en" else "/es/")]
    if path not in ("/", "/es/"):
        crumbs.append((title.split(" | ")[0], path))
    graph = [
        {
            "@type": "Florist",
            "@id": f"{SITE}/#organization",
            "name": "LuvBlooms",
            "url": f"{SITE}/",
            "logo": f"{SITE}/assets/images/lb_logo_transparent.png",
            "email": "luvblooms.us@gmail.com",
            "telephone": "+1-305-793-7727",
            "address": {"@type": "PostalAddress", "addressLocality": "Doral", "addressRegion": "FL", "addressCountry": "US"},
            "areaServed": {"@type": "AdministrativeArea", "name": "Miami-Dade County"},
            "sameAs": SOCIALS,
        },
        {
            "@type": page_type,
            "@id": f"{SITE}{path}#webpage",
            "url": f"{SITE}{path}",
            "name": title,
            "description": description,
            "inLanguage": lang,
            "isPartOf": {"@type": "WebSite", "@id": f"{SITE}/#website", "name": "LuvBlooms", "url": f"{SITE}/"},
            "about": {"@id": f"{SITE}/#organization"},
        },
        {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {"@type": "ListItem", "position": index, "name": name, "item": f"{SITE}{href}"}
                for index, (name, href) in enumerate(crumbs, 1)
            ],
        },
    ]
    if pair == "home":
        graph.append({"@type": "WebSite", "@id": f"{SITE}/#website", "name": "LuvBlooms", "url": f"{SITE}/", "inLanguage": ["en", "es"]})
    if faqs:
        graph.append({"@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faqs]})
    return json.dumps({"@context": "https://schema.org", "@graph": graph}, ensure_ascii=False, indent=2)


def breadcrumbs(pair: str, lang: str) -> str:
    if pair == "home":
        return ""
    home = "Home" if lang == "en" else "Inicio"
    home_path = "/" if lang == "en" else "/es/"
    current = META[(pair, lang)][1].split(" | ")[0]
    return f'<nav class="lb-breadcrumbs" aria-label="Breadcrumb"><a href="{home_path}">{home}</a><span aria-hidden="true">/</span><span aria-current="page">{current}</span></nav>'


def hero(pair: str, lang: str, kicker: str, lead: str, primary_label: str | None = None, primary_href: str | None = None, secondary_label: str | None = None, secondary_href: str | None = None) -> str:
    h1 = META[(pair, lang)][3]
    actions = ""
    if primary_label and primary_href:
        actions = f'<div class="hero-actions"><a class="btn btn-primary" href="{primary_href}" data-analytics-event="cta_click_inquire" data-analytics-label="{primary_label}" data-analytics-location="page_hero">{primary_label}</a>'
        if secondary_label and secondary_href:
            actions += f'<a class="btn btn-ghost" href="{secondary_href}" data-analytics-event="cta_click_services" data-analytics-label="{secondary_label}" data-analytics-location="page_hero">{secondary_label}</a>'
        actions += "</div>"
    local = "Based in Doral · Serving Miami-Dade County" if lang == "en" else "En Doral · Servicio en todo el condado de Miami-Dade"
    return f'''<section class="lb-page-hero">
      <div class="lb-page-hero-image" aria-hidden="true"></div>
      <div class="lb-page-hero-overlay" aria-hidden="true"></div>
      <div class="page"><div class="lb-page-hero-content">
        {breadcrumbs(pair, lang)}
        <p class="kicker">{kicker}</p>
        <h1>{h1}</h1>
        <p class="lead">{lead}</p>
        {actions}
        <p class="lb-local-line">{local}</p>
      </div></div>
    </section>'''


def cta(lang: str, heading: str, copy: str, label: str | None = None, href: str | None = None) -> str:
    label = label or ("Start an Inquiry" if lang == "en" else "Iniciar una Consulta")
    href = href or ("/inquire/" if lang == "en" else "/es/consultas/")
    return f'''<section class="lb-content-section"><div class="page"><div class="lb-cta-panel"><div><h2>{heading}</h2><p>{copy}</p></div><div class="hero-actions"><a class="btn btn-primary" href="{href}" data-analytics-event="cta_click_inquire" data-analytics-label="{label}" data-analytics-location="page_cta">{label}</a></div></div></div></section>'''


def home_body(lang: str) -> tuple[str, list[tuple[str, str]]]:
    if lang == "en":
        faqs = [("What floral design services does LuvBlooms offer?", "LuvBlooms creates florals for brand events and activations, intimate events, custom arrangements, and focused floral design consultations. Curated at-home experiences are coming soon."), ("Does LuvBlooms design weddings?", "No. LuvBlooms does not offer wedding floral design."), ("Where does LuvBlooms work?", "LuvBlooms is based in Doral and serves clients across Miami-Dade County."), ("How do I begin?", "Choose Brand Events and Activations or Arrangement Request on the inquiry form and share the essentials. We will contact you to arrange a conversation.")]
        body = hero("home", lang, "LuvBlooms floral design studio", "Editorial, personal florals for brands, intimate gatherings, meaningful gestures, and considered spaces.", "Start an Inquiry", "/inquire/", "Explore Services", "/services/")
        body += f'''<section class="lb-content-section"><div class="page"><div class="lb-section-intro"><p class="kicker">Floral services</p><h2>What can LuvBlooms create?</h2><p>LuvBlooms offers a focused set of floral services for people and brands who value atmosphere, proportion, texture, and a clear point of view.</p></div>{cards(lang)}</div></section>
        <section class="lb-content-section lb-soft-section"><div class="page"><div class="lb-two-column"><div class="lb-copy"><p class="kicker">Why LuvBlooms</p><h2>Personal enough to feel meaningful. Composed enough to feel effortless.</h2><p>We begin with the feeling the flowers should create, then shape the palette, scale, form, and placement around the setting. Each project is considered on its own terms rather than pulled from a fixed template.</p><p><a class="lb-card-link" href="/about/">Discover our approach</a></p></div><aside class="lb-note"><h3>Designed locally</h3><p>Based in Doral, LuvBlooms works throughout Miami-Dade County with an editorial eye and a practical, collaborative process.</p></aside></div></div></section>
        <section class="lb-content-section"><div class="page"><div class="lb-section-intro"><p class="kicker">How it works</p><h2>A clear path from idea to flowers.</h2></div><ol class="lb-process-list"><li>Choose the inquiry type that best fits your request.</li><li>Share the date, location, budget, and the feeling you want to create.</li><li>We review the details and contact you to arrange a conversation.</li></ol></div></section>
        <section class="lb-content-section lb-soft-section"><div class="page"><div class="lb-section-intro"><p class="kicker">Frequently asked questions</p><h2>Helpful details before you inquire.</h2></div>{faq_markup(faqs)}</div></section>'''
        body += cta(lang, "Have a floral moment in mind?", "Tell us what you need and we will guide the next step.")
    else:
        faqs = [("¿Qué servicios de diseño floral ofrece LuvBlooms?", "LuvBlooms crea flores para eventos y activaciones de marca, eventos íntimos, arreglos personalizados y consultorías de diseño floral. Las experiencias florales en casa llegarán pronto."), ("¿LuvBlooms diseña bodas?", "No. LuvBlooms no ofrece diseño floral para bodas."), ("¿En qué zona trabaja LuvBlooms?", "LuvBlooms está en Doral y ofrece servicio en todo el condado de Miami-Dade."), ("¿Cómo comienzo?", "Elige Evento de Marca y Activación o Solicitud de Arreglo en el formulario y comparte lo esencial. Te contactaremos para coordinar una conversación.")]
        body = hero("home", lang, "Estudio de diseño floral LuvBlooms", "Flores editoriales y personales para marcas, encuentros íntimos, gestos significativos y espacios cuidadosamente pensados.", "Iniciar una Consulta", "/es/consultas/", "Explorar Servicios", "/es/servicios/")
        body += f'''<section class="lb-content-section"><div class="page"><div class="lb-section-intro"><p class="kicker">Servicios florales</p><h2>¿Qué puede crear LuvBlooms?</h2><p>LuvBlooms ofrece servicios florales enfocados para personas y marcas que valoran la atmósfera, la proporción, la textura y una visión clara.</p></div>{cards(lang)}</div></section>
        <section class="lb-content-section lb-soft-section"><div class="page"><div class="lb-two-column"><div class="lb-copy"><p class="kicker">Por qué LuvBlooms</p><h2>Personal para sentirse significativo. Compuesto para sentirse natural.</h2><p>Comenzamos con la emoción que deben crear las flores y diseñamos la paleta, escala, forma y ubicación según el espacio. Cada proyecto se considera de manera individual.</p><p><a class="lb-card-link" href="/es/nosotros/">Conoce nuestro enfoque</a></p></div><aside class="lb-note"><h3>Diseñado localmente</h3><p>Desde Doral, LuvBlooms trabaja en todo Miami-Dade con una mirada editorial y un proceso práctico y colaborativo.</p></aside></div></div></section>
        <section class="lb-content-section"><div class="page"><div class="lb-section-intro"><p class="kicker">Cómo funciona</p><h2>Un camino claro de la idea a las flores.</h2></div><ol class="lb-process-list"><li>Elige el tipo de consulta que mejor corresponde a tu solicitud.</li><li>Comparte fecha, ubicación, presupuesto y el ambiente que deseas crear.</li><li>Revisamos los detalles y te contactamos para coordinar una conversación.</li></ol></div></section>
        <section class="lb-content-section lb-soft-section"><div class="page"><div class="lb-section-intro"><p class="kicker">Preguntas frecuentes</p><h2>Detalles útiles antes de consultar.</h2></div>{faq_markup(faqs)}</div></section>'''
        body += cta(lang, "¿Tienes un momento floral en mente?", "Cuéntanos qué necesitas y te orientaremos sobre el próximo paso.")
    return body, faqs


def services_body(lang: str) -> tuple[str, list[tuple[str, str]]]:
    if lang == "en":
        faqs = [("Which service should I choose?", "Choose Brand Events for a business-led experience. Choose Arrangement Request for a personal arrangement or intimate gathering. If you need direction first, select Arrangement Request and mention a consultation."), ("Does LuvBlooms offer wedding flowers?", "No. LuvBlooms does not offer wedding floral design."), ("How do inquiries work?", "Submit a concise inquiry. We review the date, location, scope, and budget, then contact you to arrange a conversation.")]
        body = hero("services", lang, "LuvBlooms services", "A focused floral offering for brands, intimate gatherings, personal arrangements, and people seeking clear design direction.", "Start an Inquiry", "/inquire/", "Why LuvBlooms", "/about/")
        body += f'''<section class="lb-content-section"><div class="page"><div class="lb-section-intro"><h2>What floral services can you book?</h2><p>Choose the service closest to your need. Each page explains the fit, what we can create, and how to begin.</p></div>{cards(lang)}</div></section>
        <section class="lb-content-section lb-soft-section"><div class="page"><div class="lb-two-column"><div class="lb-copy"><p class="kicker">Our scope</p><h2>Designed to stay focused.</h2><p>We specialize in brand events and activations, intimate events, custom arrangements, and floral design consultations. Curated at-home experiences are in development.</p></div><aside class="lb-note"><h3>Weddings</h3><p>LuvBlooms does not offer wedding floral design. This keeps our time and creative focus aligned with the services listed here.</p></aside></div></div></section>
        <section class="lb-content-section"><div class="page"><div class="lb-section-intro"><p class="kicker">Questions</p><h2>Choose the right next step.</h2></div>{faq_markup(faqs)}</div></section>'''
        body += cta(lang, "Ready to discuss the details?", "Use the short inquiry form and we will follow up to arrange a conversation.")
    else:
        faqs = [("¿Qué servicio debo elegir?", "Elige Eventos de Marca para una experiencia comercial. Elige Solicitud de Arreglo para un arreglo personal o un evento íntimo. Si primero necesitas dirección, elige Solicitud de Arreglo e indica que buscas una consultoría."), ("¿LuvBlooms ofrece flores para bodas?", "No. LuvBlooms no ofrece diseño floral para bodas."), ("¿Cómo funcionan las consultas?", "Envía una consulta breve. Revisamos fecha, ubicación, alcance y presupuesto, y luego te contactamos para conversar.")]
        body = hero("services", lang, "Servicios LuvBlooms", "Una propuesta floral enfocada para marcas, encuentros íntimos, arreglos personales y quienes buscan una dirección de diseño clara.", "Iniciar una Consulta", "/es/consultas/", "Por qué LuvBlooms", "/es/nosotros/")
        body += f'''<section class="lb-content-section"><div class="page"><div class="lb-section-intro"><h2>¿Qué servicios florales puedes contratar?</h2><p>Elige el servicio más cercano a tu necesidad. Cada página explica para quién es, qué podemos crear y cómo comenzar.</p></div>{cards(lang)}</div></section>
        <section class="lb-content-section lb-soft-section"><div class="page"><div class="lb-two-column"><div class="lb-copy"><p class="kicker">Nuestro alcance</p><h2>Diseñado para mantener el enfoque.</h2><p>Nos especializamos en eventos y activaciones de marca, eventos íntimos, arreglos personalizados y consultorías de diseño floral. Las experiencias en casa están en desarrollo.</p></div><aside class="lb-note"><h3>Bodas</h3><p>LuvBlooms no ofrece diseño floral para bodas. Así mantenemos nuestro tiempo y enfoque creativo en los servicios presentados aquí.</p></aside></div></div></section>
        <section class="lb-content-section"><div class="page"><div class="lb-section-intro"><p class="kicker">Preguntas</p><h2>Elige el próximo paso adecuado.</h2></div>{faq_markup(faqs)}</div></section>'''
        body += cta(lang, "¿Lista para conversar sobre los detalles?", "Usa el formulario breve y te contactaremos para coordinar una conversación.")
    return body, faqs


def service_body(pair: str, lang: str) -> tuple[str, list[tuple[str, str]]]:
    d = SERVICES[(pair, lang)]
    is_en = lang == "en"
    inquiry = "/inquire/" if is_en else "/es/consultas/"
    services = "/services/" if is_en else "/es/servicios/"
    body = hero(pair, lang, d["kicker"], d["lead"], "Start an Inquiry" if is_en else "Iniciar una Consulta", inquiry, "All Services" if is_en else "Todos los Servicios", services)
    process_h = "A simple, collaborative process." if is_en else "Un proceso sencillo y colaborativo."
    faq_h = "Questions about this service." if is_en else "Preguntas sobre este servicio."
    cta_h = "Let’s shape the right floral direction." if is_en else "Definamos la dirección floral adecuada."
    cta_p = "Share the essentials and we will contact you to discuss fit, scope, and timing." if is_en else "Comparte lo esencial y te contactaremos para conversar sobre alcance y tiempos."
    body += f'''<section class="lb-content-section"><div class="page"><div class="lb-two-column"><div class="lb-copy"><h2>{d["intro_h"]}</h2><p>{d["intro"]}</p></div><aside><p class="kicker">{d["includes_h"]}</p><ul class="lb-feature-list">{''.join(f'<li>{item}</li>' for item in d["includes"])}</ul></aside></div></div></section>
    <section class="lb-content-section lb-soft-section"><div class="page"><div class="lb-section-intro"><p class="kicker">{'Process' if is_en else 'Proceso'}</p><h2>{process_h}</h2></div><ol class="lb-process-list">{''.join(f'<li>{step}</li>' for step in d["process"])}</ol></div></section>
    <section class="lb-content-section"><div class="page"><div class="lb-section-intro"><p class="kicker">FAQ</p><h2>{faq_h}</h2></div>{faq_markup(d["faqs"])}</div></section>'''
    body += cta(lang, cta_h, cta_p)
    return body, d["faqs"]


def about_body(lang: str) -> tuple[str, list[tuple[str, str]]]:
    if lang == "en":
        faqs = [("What makes LuvBlooms different?", "LuvBlooms approaches flowers as design: beginning with atmosphere, meaning, proportion, and place rather than a fixed catalog."), ("Where is LuvBlooms based?", "LuvBlooms is based in Doral and serves Miami-Dade County."), ("What does LuvBlooms create?", "The studio focuses on brand events and activations, intimate events, custom arrangements, and floral design consultations."), ("Are weddings offered?", "No. LuvBlooms does not offer wedding floral design.")]
        body = hero("about", lang, "Why LuvBlooms", "A floral design studio grounded in thoughtful collaboration, emotional clarity, and flowers that belong to their setting.", "Start an Inquiry", "/inquire/", "Explore Services", "/services/")
        body += f'''<section class="lb-content-section"><div class="page"><div class="lb-two-column"><div class="lb-copy"><h2>Flowers can change how a space feels.</h2><p>LuvBlooms began with a simple belief: floral design should carry meaning, not just decoration. A thoughtful composition can make a room warmer, a gesture more personal, or a brand experience more human.</p><p>We work from the feeling first, then consider color, shape, scale, movement, season, and placement. The result is intentional without feeling rigid.</p></div><aside class="lb-note"><h3>Our point of view</h3><p>Editorial restraint, natural movement, purposeful color, and enough space for every stem to matter.</p></aside></div></div></section>
        <section class="lb-content-section lb-soft-section"><div class="page"><div class="lb-section-intro"><p class="kicker">How we collaborate</p><h2>Clear questions. Honest scope. Thoughtful execution.</h2></div><ol class="lb-process-list"><li>We listen for the purpose, audience, setting, and emotional tone.</li><li>We clarify budget, timing, logistics, and the floral priorities.</li><li>We shape a direction that feels specific to the project.</li></ol></div></section>
        <section class="lb-content-section"><div class="page"><div class="lb-section-intro"><p class="kicker">Frequently asked questions</p><h2>About the studio.</h2></div>{faq_markup(faqs)}</div></section>'''
        body += cta(lang, "Begin with a conversation.", "Tell us what you are planning and what you want the flowers to make people feel.")
    else:
        faqs = [("¿Qué diferencia a LuvBlooms?", "LuvBlooms aborda las flores como diseño: comienza con la atmósfera, el significado, la proporción y el lugar, no con un catálogo fijo."), ("¿Dónde está LuvBlooms?", "LuvBlooms está en Doral y ofrece servicio en el condado de Miami-Dade."), ("¿Qué crea LuvBlooms?", "El estudio se enfoca en eventos y activaciones de marca, eventos íntimos, arreglos personalizados y consultorías."), ("¿Ofrecen bodas?", "No. LuvBlooms no ofrece diseño floral para bodas.")]
        body = hero("about", lang, "Por qué LuvBlooms", "Un estudio floral basado en colaboración cuidadosa, claridad emocional y flores que pertenecen a su espacio.", "Iniciar una Consulta", "/es/consultas/", "Explorar Servicios", "/es/servicios/")
        body += f'''<section class="lb-content-section"><div class="page"><div class="lb-two-column"><div class="lb-copy"><h2>Las flores pueden cambiar cómo se siente un espacio.</h2><p>LuvBlooms nació de una idea sencilla: el diseño floral debe llevar significado, no solo decoración. Una composición pensada puede hacer un espacio más cálido, un gesto más personal o una experiencia de marca más humana.</p><p>Comenzamos con la emoción y luego consideramos color, forma, escala, movimiento, temporada y ubicación. El resultado es intencional sin sentirse rígido.</p></div><aside class="lb-note"><h3>Nuestra mirada</h3><p>Equilibrio editorial, movimiento natural, color con propósito y espacio suficiente para que cada flor importe.</p></aside></div></div></section>
        <section class="lb-content-section lb-soft-section"><div class="page"><div class="lb-section-intro"><p class="kicker">Cómo colaboramos</p><h2>Preguntas claras. Alcance honesto. Ejecución cuidadosa.</h2></div><ol class="lb-process-list"><li>Escuchamos el propósito, la audiencia, el espacio y el tono emocional.</li><li>Aclaramos presupuesto, tiempos, logística y prioridades florales.</li><li>Creamos una dirección específica para el proyecto.</li></ol></div></section>
        <section class="lb-content-section"><div class="page"><div class="lb-section-intro"><p class="kicker">Preguntas frecuentes</p><h2>Sobre el estudio.</h2></div>{faq_markup(faqs)}</div></section>'''
        body += cta(lang, "Comienza con una conversación.", "Cuéntanos qué estás planeando y qué quieres que las flores hagan sentir.")
    return body, faqs


def at_home_body(lang: str) -> tuple[str, list[tuple[str, str]]]:
    if lang == "en":
        faqs = [("What are curated at-home experiences?", "A planned recurring floral offering designed to bring a considered LuvBlooms composition into the home."), ("When will subscriptions open?", "A launch date has not been announced. The service is still in development."), ("Where will delivery be available?", "The initial service area is expected to focus on Doral and Miami-Dade County, subject to final delivery details."), ("How can I express interest?", "Use the inquiry form and choose Arrangement Request. Mention curated at-home experiences in your brief.")]
        body = hero("at-home", lang, "Coming soon", "A recurring floral experience planned for homes that value season, atmosphere, and a beautifully considered point of view.", "Join the Interest List", "/inquire/?type=arrangement", "Explore Services", "/services/")
        body += f'''<section class="lb-content-section"><div class="page"><div class="lb-two-column"><div class="lb-copy"><h2>Designed to make flowers part of the rhythm of home.</h2><p>We are developing a curated service built around seasonal compositions rather than a standard bouquet catalog. Each release will reflect what is beautiful, available, and right for the moment.</p><p>Final formats, frequency, pricing, and delivery details are still being shaped.</p></div><aside class="lb-note"><h3>Not available yet</h3><p>Curated at-home experiences are coming soon. Join the interest list and we will share details when enrollment opens.</p></aside></div></div></section>
        <section class="lb-content-section lb-soft-section"><div class="page"><div class="lb-section-intro"><p class="kicker">Questions</p><h2>What we can share today.</h2></div>{faq_markup(faqs)}</div></section>'''
        body += cta(lang, "Interested in future availability?", "Send a short arrangement inquiry and mention curated at-home experiences.", "Join the Interest List", "/inquire/?type=arrangement")
    else:
        faqs = [("¿Qué son las experiencias florales en casa?", "Una futura propuesta floral recurrente para llevar una composición LuvBlooms cuidadosamente diseñada al hogar."), ("¿Cuándo abrirán las suscripciones?", "Todavía no se ha anunciado una fecha. El servicio está en desarrollo."), ("¿Dónde habrá entrega?", "Se espera que el área inicial se enfoque en Doral y Miami-Dade, sujeto a los detalles finales de entrega."), ("¿Cómo expreso interés?", "Usa el formulario y elige Solicitud de Arreglo. Menciona experiencias florales en casa en tu mensaje.")]
        body = hero("at-home", lang, "Próximamente", "Una experiencia floral recurrente para hogares que valoran la temporada, la atmósfera y una mirada cuidadosamente diseñada.", "Unirme a la Lista", "/es/consultas/?type=arrangement", "Explorar Servicios", "/es/servicios/")
        body += f'''<section class="lb-content-section"><div class="page"><div class="lb-two-column"><div class="lb-copy"><h2>Diseñado para hacer de las flores parte del ritmo del hogar.</h2><p>Estamos desarrollando un servicio basado en composiciones de temporada, no en un catálogo estándar. Cada entrega reflejará lo más bello, disponible y apropiado para el momento.</p><p>Los formatos, frecuencia, precios y detalles de entrega todavía están en desarrollo.</p></div><aside class="lb-note"><h3>Aún no disponible</h3><p>Las experiencias florales en casa llegarán pronto. Únete a la lista y compartiremos detalles cuando se abra la inscripción.</p></aside></div></div></section>
        <section class="lb-content-section lb-soft-section"><div class="page"><div class="lb-section-intro"><p class="kicker">Preguntas</p><h2>Lo que podemos compartir hoy.</h2></div>{faq_markup(faqs)}</div></section>'''
        body += cta(lang, "¿Te interesa la disponibilidad futura?", "Envía una solicitud breve e indica que te interesan las experiencias florales en casa.", "Unirme a la Lista", "/es/consultas/?type=arrangement")
    return body, faqs


def inquiry_body(lang: str) -> tuple[str, list[tuple[str, str]]]:
    is_en = lang == "en"
    if is_en:
        lead = "Choose the request that fits best, share the essentials, and we will follow up to arrange a conversation. The form is intentionally brief."
        faqs = [("Which inquiry type should I choose?", "Choose Brand Events and Activations for company-led work. Choose Arrangement Request for a custom arrangement, intimate event, consultation, or at-home interest."), ("What happens after I submit?", "We review your details and contact you to arrange a conversation if the request is a potential fit."), ("Does submitting confirm availability?", "No. Your date and scope are confirmed only after LuvBlooms reviews the request and follows up.")]
    else:
        lead = "Elige la solicitud que mejor corresponde, comparte lo esencial y te contactaremos para coordinar una conversación. El formulario es intencionalmente breve."
        faqs = [("¿Qué tipo de consulta debo elegir?", "Elige Eventos de Marca y Activaciones para proyectos de empresas. Elige Solicitud de Arreglo para un arreglo, evento íntimo, consultoría o interés en experiencias en casa."), ("¿Qué sucede después de enviar?", "Revisamos los detalles y te contactamos para coordinar una conversación si la solicitud puede ser adecuada."), ("¿Enviar confirma disponibilidad?", "No. La fecha y el alcance se confirman solo después de revisar la solicitud y comunicarnos contigo.")]
    body = hero("inquiry", lang, "LuvBlooms inquiry" if is_en else "Consulta LuvBlooms", lead)
    labels = {
        "intro": "Two ways to begin" if is_en else "Dos maneras de comenzar",
        "intro_copy": "Choose Brand Events and Activations for company-led work. Choose Arrangement Request for personal arrangements, intimate events, consultations, or at-home interest." if is_en else "Elige Eventos de Marca y Activaciones para proyectos de empresas. Elige Solicitud de Arreglo para arreglos personales, eventos íntimos, consultorías o interés en experiencias en casa.",
        "type": "Inquiry Type *" if is_en else "Tipo de Consulta *",
        "select": "Select one" if is_en else "Selecciona una opción",
        "brand": "Brand Events and Activations" if is_en else "Eventos de Marca y Activaciones",
        "arrangement": "Arrangement Request" if is_en else "Solicitud de Arreglo",
        "name": "Name *" if is_en else "Nombre *",
        "email": "Email *" if is_en else "Correo Electrónico *",
        "phone": "Phone" if is_en else "Teléfono",
        "date": "Preferred Date" if is_en else "Fecha Preferida",
        "location": "City or Location *" if is_en else "Ciudad o Ubicación *",
        "budget": "Budget Range" if is_en else "Rango de Presupuesto",
        "budget_select": "Select if known" if is_en else "Selecciona si lo sabes",
        "brief": "Tell us what you need *" if is_en else "Cuéntanos qué necesitas *",
        "placeholder": "Share the occasion or project, desired feeling, approximate scope, and anything important for us to know." if is_en else "Comparte la ocasión o proyecto, el ambiente deseado, el alcance aproximado y cualquier detalle importante.",
        "consent": "I agree to be contacted by LuvBlooms about this inquiry. *" if is_en else "Acepto que LuvBlooms me contacte sobre esta consulta. *",
        "submit": "Send Inquiry" if is_en else "Enviar Consulta",
        "privacy": "By submitting, you agree to our privacy policy." if is_en else "Al enviar, aceptas nuestra política de privacidad.",
        "privacy_href": "/privacy/" if is_en else "/es/privacidad/",
        "privacy_label": "privacy policy" if is_en else "política de privacidad",
    }
    page_slug = "/inquire/" if is_en else "/es/consultas/"
    body += f'''<section class="lb-content-section"><div class="page"><div class="lb-compact-form"><div class="lb-section-intro"><p class="kicker">{labels["intro"]}</p><h2>{labels["intro_copy"]}</h2></div>
      <form id="lbInquiryForm" class="card form-card inquiry-form" data-analytics-form="luvblooms_inquiry" data-analytics-section="inquire_page" novalidate>
        <input type="hidden" name="lead_source" value="website"><input type="hidden" name="page_slug" value="{page_slug}"><input type="hidden" name="page_url" value=""><input type="hidden" name="submission_timestamp" value=""><input type="hidden" name="user_agent" value=""><input type="hidden" name="turnstile_token" id="turnstile_token" value="">
        <div class="screen-reader-field"><label for="website">Leave this field empty</label><input id="website" name="website" type="text" tabindex="-1" autocomplete="off"></div>
        <p class="lb-form-note">{lead}</p>
        <div class="field"><label for="service_type">{labels["type"]}</label><select id="service_type" name="service_type" required><option value="">{labels["select"]}</option><option value="brand_events">{labels["brand"]}</option><option value="custom_order">{labels["arrangement"]}</option></select></div>
        <div class="form-grid form-grid-2 form-grid-align"><div class="field"><label for="first_name">{labels["name"]}</label><input id="first_name" name="first_name" type="text" required autocomplete="name" data-auto-capitalize="words"></div><div class="field"><label for="email">{labels["email"]}</label><input id="email" name="email" type="email" required autocomplete="email"></div></div>
        <div class="form-grid form-grid-2 form-grid-align"><div class="field"><label for="phone">{labels["phone"]}</label><input id="phone" name="phone" type="tel" autocomplete="tel" inputmode="tel"></div><div class="field"><label for="event_date">{labels["date"]}</label><input id="event_date" name="event_date" type="date"></div></div>
        <div class="form-grid form-grid-2 form-grid-align"><div class="field"><label for="event_city">{labels["location"]}</label><input id="event_city" name="event_city" type="text" required autocomplete="address-level2"></div><div class="field"><label for="budget_range">{labels["budget"]}</label><select id="budget_range" name="budget_range"><option value="">{labels["budget_select"]}</option><option value="under_500">Under $500</option><option value="500_1499">$500–$1,499</option><option value="1500_4999">$1,500–$4,999</option><option value="5000_9999">$5,000–$9,999</option><option value="10000_plus">$10,000+</option></select></div></div>
        <div class="field"><label for="event_details">{labels["brief"]}</label><textarea id="event_details" name="additional_notes" rows="7" required placeholder="{labels["placeholder"]}"></textarea></div>
        <label class="checkbox-item checkbox-item-consent"><input type="checkbox" name="consent_to_contact" value="yes" required><span>{labels["consent"]}</span></label>
        <div class="turnstile-wrap"><div class="cf-turnstile" data-turnstile-widget data-action="inquiry"></div></div>
        <div class="button-row form-actions"><button type="submit" class="btn btn-primary" data-analytics-event="cta_click_inquire_submit" data-analytics-label="{labels["submit"]}" data-analytics-location="inquire_form">{labels["submit"]}</button></div>
        <p class="subhead">{labels["privacy"].replace(labels["privacy_label"], f'<a href="{labels["privacy_href"]}">{labels["privacy_label"]}</a>')}</p>
        <p id="formStatus" class="form-status" aria-live="polite"></p><p class="form-success" hidden></p><p class="form-error" hidden></p>
      </form></div></div></section>
      <section class="lb-content-section lb-soft-section"><div class="page"><div class="lb-section-intro"><p class="kicker">FAQ</p><h2>{'What happens next.' if is_en else 'Qué sucede después.'}</h2></div>{faq_markup(faqs)}</div></section>'''
    return body, faqs


def privacy_body(lang: str) -> tuple[str, None]:
    is_en = lang == "en"
    if is_en:
        body = hero("privacy", lang, "Last updated September 25, 2026", "How LuvBlooms handles information submitted through this website.")
        copy = '''<h2>Information we collect</h2><p>We collect information you choose to provide through inquiry forms or direct communications, such as your name, email, phone number, event or arrangement details, preferred date, location, budget range, and message.</p><h2>How we use information</h2><p>We use submitted information to review requests, respond to inquiries, arrange conversations, provide requested services, maintain business records, prevent misuse, and improve the website.</p><h2>Analytics and attribution</h2><p>On the production website, Google Tag Manager and Google Analytics may collect technical and interaction information such as pages viewed, referral source, campaign parameters, device information, and approximate location. Staging is configured without production analytics.</p><h2>Turnstile and service providers</h2><p>Cloudflare Turnstile helps protect forms from automated abuse. Form submissions are processed through Google Apps Script. WhatsApp, email, and social links are governed by the privacy practices of those services.</p><h2>Retention and security</h2><p>We retain inquiry information only as long as reasonably needed for communication, service delivery, recordkeeping, and legitimate business needs. No internet transmission or storage system can be guaranteed completely secure.</p><h2>Your choices</h2><p>You may ask to access, correct, or delete information you submitted by emailing <a href="mailto:luvblooms.us@gmail.com" data-luvblooms-email>luvblooms.us@gmail.com</a>. We may need to retain limited records when required for legal or legitimate business purposes.</p><h2>Contact</h2><p>Questions about this policy may be sent to <a href="mailto:luvblooms.us@gmail.com" data-luvblooms-email>luvblooms.us@gmail.com</a>.</p>'''
    else:
        body = hero("privacy", lang, "Última actualización: 25 de septiembre de 2026", "Cómo LuvBlooms maneja la información enviada mediante este sitio.")
        copy = '''<h2>Información que recopilamos</h2><p>Recopilamos la información que decides enviar mediante formularios o comunicaciones directas, como nombre, correo, teléfono, detalles del evento o arreglo, fecha, ubicación, presupuesto y mensaje.</p><h2>Cómo utilizamos la información</h2><p>Usamos la información para revisar solicitudes, responder consultas, coordinar conversaciones, prestar servicios, mantener registros, prevenir abuso y mejorar el sitio.</p><h2>Analítica y atribución</h2><p>En el sitio de producción, Google Tag Manager y Google Analytics pueden recopilar información técnica y de interacción como páginas vistas, fuente de referencia, parámetros de campaña, dispositivo y ubicación aproximada. Staging está configurado sin analítica de producción.</p><h2>Turnstile y proveedores</h2><p>Cloudflare Turnstile protege los formularios contra abuso automatizado. Los envíos se procesan mediante Google Apps Script. WhatsApp, correo y redes sociales se rigen por las prácticas de privacidad de esos servicios.</p><h2>Conservación y seguridad</h2><p>Conservamos la información solo durante el tiempo razonablemente necesario para comunicación, prestación del servicio, registros y necesidades legítimas del negocio. Ningún sistema de transmisión o almacenamiento puede garantizar seguridad absoluta.</p><h2>Tus opciones</h2><p>Puedes solicitar acceso, corrección o eliminación de la información enviada escribiendo a <a href="mailto:luvblooms.us@gmail.com" data-luvblooms-email>luvblooms.us@gmail.com</a>. Es posible que debamos conservar registros limitados por motivos legales o comerciales legítimos.</p><h2>Contacto</h2><p>Envía preguntas sobre esta política a <a href="mailto:luvblooms.us@gmail.com" data-luvblooms-email>luvblooms.us@gmail.com</a>.</p>'''
    body += f'<section class="lb-content-section"><div class="page"><div class="lb-privacy-copy">{copy}</div></div></section>'
    return body, None


def html_page(pair: str, lang: str, body: str, faqs: list[tuple[str, str]] | None = None) -> str:
    path, title, description, _ = META[(pair, lang)]
    en_path, es_path = PAIR_PATHS[pair]
    robots = "noindex,follow" if pair == "privacy" else "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"
    page_type = "CollectionPage" if pair == "services" else "AboutPage" if pair == "about" else "WebPage"
    turnstile = '<script src="/assets/js/turnstile.js"></script>' if pair == "inquiry" else ""
    inquiry_scripts = '<script src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=luvBloomsTurnstileReady&amp;render=explicit" async defer></script>\n<script src="/assets/js/inquiry.js" defer></script>' if pair == "inquiry" else ""
    skip = "Skip to content" if lang == "en" else "Saltar al contenido"
    return f'''<!doctype html>
<html lang="{lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title}</title>
  <meta name="description" content="{description}">
  <meta name="robots" content="{robots}">
  <meta name="theme-color" content="#364449">
  <link rel="canonical" href="{SITE}{path}">
  <link rel="alternate" hreflang="en" href="{SITE}{en_path}">
  <link rel="alternate" hreflang="es" href="{SITE}{es_path}">
  <link rel="alternate" hreflang="x-default" href="{SITE}{en_path}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{description}">
  <meta property="og:url" content="{SITE}{path}">
  <meta property="og:image" content="{IMAGE}">
  <meta property="og:locale" content="{'en_US' if lang == 'en' else 'es_US'}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{title}">
  <meta name="twitter:description" content="{description}">
  <meta name="twitter:image" content="{IMAGE}">
  <link rel="stylesheet" href="/assets/css/site.css">
  <link rel="stylesheet" href="/assets/css/header.css">
  <script src="/assets/js/site-config.js"></script>
  <script src="/assets/js/attribution.js"></script>
  <script src="/assets/js/head.js"></script>
  {turnstile}
  <script type="application/ld+json">{schema(pair, lang, title, description, faqs, page_type)}</script>
</head>
<body data-page-type="{pair}" data-primary-goal="inquiry_submit">
  <a class="skip-link" href="#main">{skip}</a>
  <div id="siteHeader"></div>
  <main id="main" class="site-main">{body}</main>
  <div id="siteFooter"></div>
  <script src="/assets/js/site.js"></script>
  {inquiry_scripts}
</body>
</html>
'''


def write_page(path: str, content: str) -> None:
    if path == "/":
        target = ROOT / "index.html"
    else:
        target = ROOT / path.strip("/") / "index.html"
    target.parent.mkdir(parents=True, exist_ok=True)
    content = "\n".join(line.rstrip() for line in content.splitlines()) + "\n"
    target.write_text(content, encoding="utf-8")


def build() -> None:
    for lang in ("en", "es"):
        body, faqs = home_body(lang)
        write_page(META[("home", lang)][0], html_page("home", lang, body, faqs))

        body, faqs = services_body(lang)
        write_page(META[("services", lang)][0], html_page("services", lang, body, faqs))

        for pair in ("brand-events", "intimate-events", "arrangements", "consultations"):
            body, faqs = service_body(pair, lang)
            write_page(META[(pair, lang)][0], html_page(pair, lang, body, faqs))

        body, faqs = at_home_body(lang)
        write_page(META[("at-home", lang)][0], html_page("at-home", lang, body, faqs))

        body, faqs = about_body(lang)
        write_page(META[("about", lang)][0], html_page("about", lang, body, faqs))

        body, faqs = inquiry_body(lang)
        write_page(META[("inquiry", lang)][0], html_page("inquiry", lang, body, faqs))

        body, faqs = privacy_body(lang)
        write_page(META[("privacy", lang)][0], html_page("privacy", lang, body, faqs))


if __name__ == "__main__":
    build()
