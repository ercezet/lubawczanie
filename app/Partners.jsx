const headings = { pl: 'Nasi partnerzy', cs: 'Naši partneři', de: 'Unsere Partner', en: 'Our partners' };

const partners = [
  ['gmina', 'Gmina Lubawka', 'https://lubawka.eu/'],
  ['mgok', 'Miejsko-Gminny Ośrodek Kultury w Lubawce', 'https://kierunekkultura.pl/'],
  ['zgm', 'Zakład Gospodarki Miejskiej w Lubawce', 'https://zgm.lubawka.eu/'],
  ['nadlesnictwo', 'Nadleśnictwo Kamienna Góra', 'https://www.gov.pl/web/nadlesnictwo-kamienna-gora'],
  ['zacler', 'Město Žacléř', 'https://www.zacler.cz/'],
];

export default function Partners({ lang }) {
  return (
    <section className="wrap footer-partners" aria-labelledby="partner-heading">
      <h2 id="partner-heading">{headings[lang] || headings.pl}</h2>
      <ul>{partners.map(([id, name, url]) => (
        <li key={id}><a href={url}><img src={`/images/partners/${id}.webp`} alt={name} loading="lazy" /></a></li>
      ))}</ul>
    </section>
  );
}
