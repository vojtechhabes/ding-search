# Ding Search

Vyhledávač napsaný v Node.js, který využívá data sesbíraná [web crawlerem](https://github.com/vojhab/web-crawler).

![Ding search screenshot](./ding-search-safari.png)

## Dokumentace

Dokumentace tohoto projektu je ještě v přípravě.

## Cíl projektu

Cílem projektu Ding Search je vytvořit vyhledávač, který bude schopen vyhledávat webové stránky a nabízet uživatelům relevantní výsledky vyhledávání na základě požadavků, které zadají. Vyhledávač je napsán v Node.js a využívá data sesbíraná [web crawlerem](https://github.com/vojhab/web-crawler).

## Použité technologie

- [Node.js](https://nodejs.org): open-source framework pro běh JavaScriptového kódu na straně serveru
- [PostgreSQL](https://www.postgresql.org): databáze, která nabízí široké spektrum funkcí pro správu a ukládání dat a umožňuje uživatelům efektivně ukládat a vyhledávat data
- [OpenAI API](https://openai.com/blog/openai-api): API pro přístup k pokročilým AI modelům

### npm balíčky

V tomto projektu jsou používány následující npm balíčky:

- [node-postgres](https://www.npmjs.com/package/pg): umožňuje přístup k PostgreSQL databázi
- [dotenv](https://www.npmjs.com/package/dotenv): načítá proměnné z .env souboru
- [ejs](https://www.npmjs.com/package/ejs): šablonovací systém pro generování HTML stránek
- [express](https://www.npmjs.com/package/express): Node.js framework pro tvorbu webových aplikací a API
- [openai](https://www.npmjs.com/package/openai): umožňuje jednoduchý přístup k OpenAI API
- [serve-favicon](https://www.npmjs.com/package/serve-favicon): poskytuje middleware pro favicony webových stránek
- [xss](https://www.npmjs.com/package/xss): ochrana proti XSS útokům, tedy proti vkládání škodlivého kódu do uživatelských vstupů, které se následně vykreslují na stránce

## Plánované změny a funkce

- [ ] dokončení našeptávání vyhledávání
- [ ] "nekonečný scroll" s výsledky vyhledávání
- [ ] about stránka
- [ ] chatbot pro odpovídání na dotazy na základě webových stránek
- [ ] relevantnější výsledky vyhledávání
- [ ] podpora pro více jazyků
- [ ] personalizované výsledky

## Licence

Tento projekt je pod licencí [MIT](LICENSE).

## Tvůrce

[Vojtěch Habeš](https://www.github.com/vojhab)

habes.vo.2022@ssps.cz
