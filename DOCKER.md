# Uruchamianie Docusaurusa w Dockerze

Konfiguracja Docker uruchamia produkcyjny build strony `website` i serwuje wygenerowane pliki statyczne przez Nginx.

## Wymagania

- Docker z obsługą Compose (`docker compose version`)
- co najmniej kilka GB wolnego miejsca na obrazy i zależności workspace'a

## Uruchomienie

Z katalogu głównego repozytorium:

```bash
docker compose up --build
```

Strona będzie dostępna pod adresem <http://localhost:3000>.

Uruchomienie w tle:

```bash
docker compose up --build -d
```

Zatrzymanie kontenera:

```bash
docker compose down
```

## Szczegóły konfiguracji

- `Dockerfile` korzysta z Node.js `24.21` oraz pnpm `12.3.4`, zgodnie z wymaganiami repozytorium.
- Pierwszy etap obrazu instaluje zależności workspace'a i wykonuje `pnpm build:website`.
- Drugi etap używa lekkiego obrazu `nginx:1.29-alpine` i zawiera wyłącznie wynik `website/build`.
- `docker/nginx.conf` konfiguruje fallback dla tras Docusaurusa oraz długie cache'owanie assetów.
- `docker-compose.yml` mapuje port hosta `3000` na port HTTP kontenera `80`.
- Healthcheck sprawdza dostępność strony głównej.

## Czyszczenie obrazu

Aby wymusić pełny rebuild bez cache'a:

```bash
docker compose build --no-cache
docker compose up
```
