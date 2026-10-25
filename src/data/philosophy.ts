/**
 * The history of philosophy section (/philosophy): its eras and traditions,
 * in the order the hub lists them. Each has an article in
 * content/articles/philosophy/{slug}.md; the hub's own introduction is
 * content/articles/philosophy/index.md. Philosophers are the person
 * articles that link to an era's page.
 */
export interface PhilosophyEra {
  slug: string;
  title: string;
  /** Roughly when, for the hub list. */
  period: string;
  /** One line for the hub list. */
  blurb: string;
}

export const PHILOSOPHY_ERAS: PhilosophyEra[] = [
  { slug: "ancient-greek-philosophy", title: "Ancient Greek Philosophy", period: "c. 600–322 BCE", blurb: "From Thales to Aristotle: the first attempts to explain the world by reason alone." },
  { slug: "indian-philosophy", title: "Indian Philosophy", period: "c. 1500 BCE – today", blurb: "The Upanishads, the Buddha, Jainism and the six classical schools." },
  { slug: "chinese-philosophy", title: "Chinese and East Asian Philosophy", period: "c. 500 BCE – today", blurb: "Confucius, Laozi and the Hundred Schools, Neo-Confucianism, Zen and the Kyoto School." },
  { slug: "hellenistic-and-roman-philosophy", title: "Hellenistic and Roman Philosophy", period: "322 BCE – 529 CE", blurb: "Stoics, Epicureans, Sceptics and Cynics: philosophy as a way of life." },
  { slug: "medieval-philosophy", title: "Medieval Christian Philosophy", period: "c. 400–1400", blurb: "Augustine to Ockham: faith and reason in the Latin West." },
  { slug: "islamic-philosophy", title: "Islamic and Jewish Philosophy", period: "c. 800–1600", blurb: "Al-Kindi, Avicenna, Averroes, Maimonides and Ibn Khaldun." },
  { slug: "renaissance-philosophy", title: "Renaissance Philosophy", period: "c. 1350–1600", blurb: "Humanism, Machiavelli, Erasmus and Montaigne." },
  { slug: "early-modern-philosophy", title: "Early Modern Philosophy", period: "c. 1600–1750", blurb: "Descartes, Spinoza, Leibniz, Locke and Hume: reason against experience." },
  { slug: "enlightenment-philosophy", title: "The Enlightenment", period: "c. 1680–1800", blurb: "Voltaire, Rousseau, Smith and Kant: reason applied to society." },
  { slug: "nineteenth-century-philosophy", title: "Nineteenth-Century Philosophy", period: "1800–1900", blurb: "Hegel, Schopenhauer, Kierkegaard, Marx, Mill and Nietzsche." },
  { slug: "analytic-philosophy", title: "Analytic Philosophy", period: "c. 1880 – today", blurb: "Frege, Russell, Wittgenstein, Popper and Rawls: logic, language and clarity." },
  { slug: "continental-philosophy", title: "Continental Philosophy", period: "c. 1900 – today", blurb: "Phenomenology, existentialism and their heirs: Heidegger, Sartre, Beauvoir, Arendt, Foucault." },
  { slug: "african-philosophy", title: "African and Africana Philosophy", period: "c. 2500 BCE – today", blurb: "From Egyptian wisdom texts and Ethiopian thinkers to ubuntu, négritude and Fanon." },
];

export function getPhilosophyEra(slug: string): PhilosophyEra | undefined {
  return PHILOSOPHY_ERAS.find((e) => e.slug === slug);
}
