/* =====================================================================
   CONTENT.JS — EDIT THIS FILE TO CHANGE YOUR WEBSITE
   ---------------------------------------------------------------------
   Easiest way to edit: open admin.html. You can also edit this file by hand.

   The site has three main sections in the top menu:
     engineering   →  your civil engineering projects
     design        →  your graphic design work
     photography   →  your photos
   Everything about one section (its text, colour, work, tools and
   experience) sits together in one block below.

   Rules:
   • Text goes inside quotes:  "like this"
   • Every item in a list ends with a comma.
   • Leave a value empty ("") to hide it.
   • Photos: put the file in the /images folder, then write its path,
     e.g.  image: "images/my-photo.jpg"
   • Lines marked  CHECK  were in the old version. Make sure the numbers
     and claims are true before you share the site.
   ===================================================================== */

window.SITE = {

  /* ---------- YOU ---------- */
  profile: {
    firstName: "Jeyanthan",
    lastName: "Sivakesan",
    initials: "JS",
    location: "Sri Lanka",
    university: "University of Moratuwa",   // CHECK: your polo crest looks like a different university
    roles: ["Civil Engineer", "Graphic Designer", "Photographer"],
    tagline: "Designing structures. Creating visual experiences. Capturing stories.",
    heroImage: "images/me-on-site.jpg",
    heroImageAlt: "Jeyanthan on a construction site holding a hard hat",
    portrait: "images/me-portrait.jpg",
    portraitAlt: "Portrait of Jeyanthan",
    cvUrl: ""        // e.g. "files/Jeyanthan-CV.pdf"  (leave "" to hide the button)
  },

  /* ---------- LOOK & FEEL ---------- */
  theme: {
    accent: "#D9822B",      // colour used on the home page. Each section has its own colour below.
    defaultMode: "system"   // "system" follows the visitor's phone/computer; or force "light" / "dark"
  },

  /* ---------- CONTACT ---------- */
  contact: {
    email: "",              // your email, e.g. "name@gmail.com"  (shown on the page)
    phone: "",              // e.g. "+94 77 123 4567"
    whatsapp: "",           // number with country code, digits only, e.g. "94771234567"
    instagram: "",          // full link, e.g. "https://instagram.com/yourname"
    linkedin: "",
    behance: "",
    github: "",
    // Optional: make the contact form deliver to your inbox without opening an email app.
    // Create a free form at https://formspree.io and paste its URL here.
    formEndpoint: ""
  },

  /* ---------- ABOUT (home page) ---------- */
  about: {
    heading: "Engineer by training. Creative by passion.",
    paragraphs: [
      "I'm a Civil Engineering undergraduate with a deep interest in solving engineering problems and creating strong visual work.",
      "Alongside my studies I work as a freelance photographer and graphic designer, producing posters, branding, event coverage and social media content for clients across Sri Lanka."
    ],
    stats: [                                   // CHECK all four numbers
      { number: "50+",  label: "Engineering projects" },
      { number: "80+",  label: "Design projects" },
      { number: "200+", label: "Photo sessions" },
      { number: "3+",   label: "Years experience" }
    ]
  },

  /* ---------- TESTIMONIALS (home page) ----------
     Only add real quotes from real people. The section stays hidden while
     this list is empty.                                                  */
  testimonials: [
    // { quote: "Paste what the client said.", author: "Name, role", year: "2025" },
  ],

  /* =====================================================================
     SECTION 1: ENGINEERING
     Each project opens a detail page when clicked. Add  image: "images/xxx.jpg"
     to show a photo; without one, a drawing-sheet cover is generated.
     ===================================================================== */
  engineering: {
    navLabel: "Engineering",                  // name shown in the top menu
    accent: "#2F6BFF",                        // colour of this section
    heading: "Analysis, design and fieldwork in civil engineering.",
    intro: "University and research projects across structures, hydrology, environmental engineering and transportation. Each one opens as a full write-up: the problem, my role, the method and the result.",
    blurb: "Structural analysis, hydrology, environmental and transport studies, from the model to the drawing.",   // short text on the home page card
    homeImage: "",                            // optional photo for the home page card; empty = drawing
    focus: ["Structures", "Hydrology", "Environmental", "Transportation"],
    facts: [
      { label: "Field",  value: "Civil Engineering" },
      { label: "Focus",  value: "Structures · Hydrology · Environment · Transport" },
      { label: "Based",  value: "Sri Lanka" }
    ],
    listTitle: "Selected projects",
    skillsTitle: "Software & methods",
    skills: ["AutoCAD", "Civil 3D", "SAP2000", "HEC-HMS", "ArcGIS", "Excel", "Surveying", "Engineering design"],
    timelineTitle: "Education & experience",
    timeline: [
      { years: "2021 – Present", title: "Civil Engineering Undergraduate", text: "Structural analysis, hydrological modelling, environmental assessment and transportation studies." },
      { years: "2022 – 2024",    title: "Student Leadership & Volunteering", text: "University organisations, event coordination and community service." }
    ],
    ctaHeading: "Need engineering support?",
    ctaText: "Structural analysis, hydrology, environmental studies, transport planning, CAD drawings or research. Tell me what you're working on.",
    projects: [
      {
        slug: "yan-oya-hydrology",
        title: "Hydrological Analysis, Yan Oya Basin",
        discipline: "Hydrology",
        year: "2024",
        client: "University research project",
        summary: "Watershed modelling, flood frequency analysis and ecological impact assessment.",
        tags: ["HEC-HMS", "GIS", "Hydrology"],
        overview: "A hydrological study of the Yan Oya Basin in Sri Lanka covering watershed modelling, flood frequency analysis and ecological impact assessment.",
        role: "Lead researcher: data collection, model development, analysis and reporting.",
        challenge: "Seasonal monsoons and human intervention make the basin's behaviour complex. Accurate flood prediction needed several data sources combined.",
        process: "Collected rainfall and streamflow data, built the watershed model in HEC-HMS with GIS-derived parameters, and calibrated it against historical floods.",
        tools: ["HEC-HMS", "ArcGIS", "Excel", "AutoCAD Civil 3D"],
        deliverables: "Technical report, GIS maps, flood risk maps, presentation.",
        results: "Calibrated model and flood risk maps for the basin.",   // CHECK: add real accuracy figures if you have them
        stats: [],
        gallery: []
      },
      {
        slug: "structural-steel-analysis",
        title: "Structural Steel Analysis",
        discipline: "Structures",
        year: "2024",
        client: "University design project",
        summary: "Steel frame analysis to Eurocode using SAP2000.",
        tags: ["SAP2000", "Eurocode", "Steel"],
        overview: "Structural analysis of a multi-storey steel-framed commercial building using Eurocode standards and SAP2000.",
        role: "Structural analyst: modelling, load calculations, code checks and member optimisation.",
        challenge: "Irregular floor plates and a large atrium created complex load paths, while member sizes still had to meet Eurocode 3.",
        process: "Modelled the frame in SAP2000 from architectural drawings, applied loads per Eurocode 1, ran linear static analysis and iterated member sizes.",
        tools: ["SAP2000", "AutoCAD", "Excel", "Mathcad"],
        deliverables: "SAP2000 model, calculation report, design drawings, presentation.",
        results: "All members passed code checks after optimisation.",   // CHECK
        stats: [],
        gallery: []
      },
      {
        slug: "water-quality",
        title: "Water Quality Investigation",
        discipline: "Environmental",
        year: "2024",
        client: "Environmental Engineering Lab",
        summary: "Laboratory testing of water samples for potability.",
        tags: ["Lab testing", "Environmental"],
        overview: "Laboratory analysis of water samples from several sources, checked against WHO drinking-water guidelines.",
        role: "Lab researcher: sampling, testing, data analysis and report writing.",
        challenge: "Each location had a different contamination profile, so identifying pollutants needed careful testing.",
        process: "Tested pH, turbidity, hardness, chloride, fluoride and bacteriological quality, then compared results against WHO limits.",
        tools: ["Lab equipment", "Excel"],
        deliverables: "Lab report, results summary, treatment recommendations.",
        results: "",
        stats: [],
        gallery: []
      },
      {
        slug: "traffic-survey",
        title: "Traffic Survey & Road Safety",
        discipline: "Transportation",
        year: "2024",
        client: "Transportation engineering project",
        summary: "Classified traffic counts and safety assessment at urban intersections.",
        tags: ["Transportation", "Surveying"],
        overview: "Traffic volume surveys and road safety assessment at busy urban intersections.",
        role: "Field researcher and analyst: survey design, data collection, analysis and safety audit.",
        challenge: "Collecting accurate counts at busy junctions without disrupting traffic.",
        process: "Designed survey forms, collected classified counts over the survey period and analysed peak-hour flows and level of service.",
        tools: ["Excel", "AutoCAD", "Survey equipment"],
        deliverables: "Traffic survey report, safety audit checklist, improvement sketches.",
        results: "",
        stats: [],
        gallery: []
      },
      {
        slug: "rc-design",
        title: "Reinforced Concrete Design",
        discipline: "Structures",
        year: "2024",
        client: "Structural design project",
        summary: "Design calculations and reinforcement detailing to BS 8110.",
        tags: ["RCC", "AutoCAD", "Detailing"],
        overview: "Design calculations and reinforcement detailing for a residential structure to BS 8110.",
        role: "Structural designer: calculations, detailing and drawing production.",
        challenge: "Cantilevered balconies and an irregular column grid needed careful load-path analysis.",
        process: "Calculated loads per BS 6399, designed slabs, beams, columns and foundations in turn, and produced detailing drawings in AutoCAD.",
        tools: ["AutoCAD", "Excel", "BS 8110"],
        deliverables: "Design calculation report, reinforcement drawings, bar bending schedule.",
        results: "",
        stats: [],
        gallery: []
      }
    ]
  },

  /* =====================================================================
     SECTION 2: GRAPHIC DESIGN
     ===================================================================== */
  design: {
    navLabel: "Graphic Design",
    accent: "#FF4F6D",
    heading: "Posters, branding and visual stories.",
    intro: "Tournament graphics, social media campaigns, event branding and posters for clients across Sri Lanka. Open a project to see the idea, the process and the palette behind it.",
    blurb: "Posters, tournament branding, social media campaigns and brand identities.",
    homeImage: "images/ngcl-2-teams.jpg",
    focus: ["Posters", "Social media", "Event branding", "Logos & identity"],
    facts: [
      { label: "Work",    value: "Posters · Branding · Social media" },
      { label: "Tools",   value: "Photoshop · Illustrator · Figma" },
      { label: "Clients", value: "Sri Lanka" }
    ],
    listTitle: "Selected work",
    skillsTitle: "Tools",
    skills: ["Photoshop", "Illustrator", "Figma", "Canva", "After Effects"],
    timelineTitle: "Experience",
    timeline: [
      { years: "2022 – Present", title: "Freelance Graphic Designer", text: "Posters, branding, social media content, banners and visual identities." }
    ],
    ctaHeading: "Need a poster, a brand or a campaign?",
    ctaText: "Tell me what the event or business is about and I'll come back with ideas.",
    projects: [
      {
        slug: "ngcl-2",
        title: "NGCL 2.0",
        discipline: "Sports design",
        year: "2026",
        client: "Mighty Sharks Battalion",
        image: "images/ngcl-2-teams.jpg",
        summary: "Team line-up poster and tournament graphics for a seven-team cricket league.",
        tags: ["Photoshop", "Illustrator"],
        overview: "Tournament graphics for NGCL 2.0, a cricket league presented by Mighty Sharks Battalion. The team line-up poster introduces all seven teams: Kaithady Super Kings, Uduvil Style Boys, Chulipuram Rhinos, Jaffna Masters, Puttalai Garudas, CJ United Sports Club and Kokuvil Stars.",
        role: "Graphic designer: layout, typography and production of the tournament visuals.",
        challenge: "Seven team logos with very different styles had to sit together on one poster without clashing.",
        process: "Placed each logo on a matching white card with an orange name tab, set over a blue cricket-doodle background with the league name as the centrepiece and repeating type for texture.",
        palette: ["#1F4FB5", "#E89A1E", "#FFFFFF", "#111111", "#D7E84A"],
        tools: ["Adobe Photoshop", "Adobe Illustrator"],
        deliverables: "Team line-up poster, social media graphics.",
        results: "",
        stats: [{ number: "7", label: "Teams" }],
        gallery: ["images/ngcl-2-teams.jpg"]
      },
      {
        slug: "tla-campaign",
        title: "TLA Membership Campaign",
        discipline: "Social media",
        year: "2024",
        client: "",
        summary: "Multi-platform campaign with consistent visual storytelling.",
        tags: ["Figma", "After Effects"],
        overview: "A social media campaign to drive membership sign-ups.",          // CHECK: add real details
        role: "Creative lead: concept, visual direction and asset creation.",
        challenge: "",
        process: "",
        palette: [],
        tools: ["Figma", "After Effects", "Photoshop"],
        deliverables: "",
        results: "",
        stats: [],
        gallery: []
      },
      {
        slug: "university-event-branding",
        title: "University Event Branding",
        discipline: "Event branding",
        year: "2024",
        client: "",
        summary: "Visual identity for university events.",
        tags: ["Canva", "Photoshop"],
        overview: "Visual identity for a series of university events.",             // CHECK: add real details
        role: "Brand designer.",
        challenge: "",
        process: "",
        palette: [],
        tools: ["Canva", "Photoshop", "Figma"],
        deliverables: "",
        results: "",
        stats: [],
        gallery: []
      }
    ]
  },

  /* =====================================================================
     SECTION 3: PHOTOGRAPHY
     Click a photo to view it full screen. Add as many as you like.
     "category" creates the filter buttons (Graduation, Portrait, Events…).
     ===================================================================== */
  photography: {
    navLabel: "Photography",
    accent: "#F2A93B",
    heading: "Capturing stories through the lens.",
    intro: "Graduation shoots, portraits, event coverage and campus events. Tap any photo to view it full screen.",
    blurb: "Graduation shoots, portraits, event coverage and commercial work.",
    homeImage: "images/graduation-1.jpg",
    focus: ["Graduation", "Portraits", "Events", "Commercial"],
    facts: [
      { label: "Shoots", value: "Graduation · Events · Portraits" },
      { label: "Edit",   value: "Lightroom · Photoshop" },
      { label: "Based",  value: "Sri Lanka" }
    ],
    listTitle: "Gallery",
    skillsTitle: "Editing software",
    skills: ["Lightroom", "Photoshop", "Premiere Pro"],
    timelineTitle: "Experience",
    timeline: [
      { years: "2023 – Present", title: "Freelance Photographer", text: "Graduation shoots, event coverage, editing and album design for clients across Sri Lanka." }
    ],
    ctaHeading: "Need a photographer?",
    ctaText: "Graduations, events, portraits or product shots. Tell me the date and the place.",
    photos: [
      { image: "images/graduation-1.jpg", title: "Graduation day", category: "Graduation", year: "2026", alt: "Graduate in a teal saree and black gown in front of a white colonnaded university building" },
      { image: "images/graduation-2.jpg", title: "Graduation portrait", category: "Portrait", year: "2026", alt: "Graduate in a navy suit with a yellow garland leaning on a concrete ledge" }
      // { image: "images/event-1.jpg", title: "Campus event", category: "Events", year: "2025", alt: "Describe the photo" },
    ]
  }
};
