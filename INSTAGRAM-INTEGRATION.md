# Instagram-galerij: eenmalige configuratie

De galerij downloadt foto's naar `images/instagram/` en publiceert de metadata in `instagram-feed.json`. GitHub Actions synchroniseert de galerij elke zes uur en kan ook handmatig worden gestart.

## Eenmalige stap: Instagram-toegang

1. Maak of gebruik een Meta Developer-app met de Instagram API voor Instagram Login.
2. Autoriseer het professionele account **@jeroenirene** en genereer een geldig Instagram User Access Token met de benodigde leesrechten voor media (Instagram API with Instagram Login, doorgaans `instagram_business_basic`).
3. Open de repository-instellingen op GitHub: **Settings → Secrets and variables → Actions → New repository secret**.
4. Maak de secret aan met exact deze naam: `INSTAGRAM_ACCESS_TOKEN`. Plak de token als waarde. Zet de token nooit in een HTML-, JavaScript- of JSON-bestand.

## Testen

1. Open **Actions → Update Instagram gallery**.
2. Kies **Run workflow**.
3. Controleer of de run slaagt en of `instagram-feed.json` en `images/instagram/` zijn bijgewerkt.
4. Open daarna de pagina **Foto & Video** op de website.

De token moet geldig blijven. Als Instagram de token laat verlopen of intrekken, moet deze in de GitHub Secret worden vervangen. Deze workflow publiceert alleen afbeeldingen en miniaturen; video's blijven aanklikbaar via het oorspronkelijke Instagram-bericht. Carousel-berichten tonen een badge als er meerdere afbeeldingen in het bericht staan.
