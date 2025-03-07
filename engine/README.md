## How to run (Docker)

1 - Install pyenv & pipenv on your system

-   [pyenv](https://github.com/pyenv/pyenv#installation)
-   [pipenv](https://pypi.org/project/pipenv/)

2 - Install python 3.13.2

```bash
pyenv install
```

3 - Setup python 3.13.2 as the local version

```bash
pyenv local
```

4 - Setup environment & dependencies

```bash
pipenv install --dev
```

3 - Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

4 - Create Docker Network:

```bash
docker network create multi-cv-local
```

5 - Start the container:

```bash
docker compose up -d
```

## How to build (Docker)

1 - Build the Docker image:

```bash
docker compose -f docker-compose.build.yml build --compress --force-rm --no-cache --parallel --pull
```

## Install dependencies

```bash
docker run --rm \
    -u "$(id -u):$(id -g)" \
    -v $(pwd):/app \
    -w /app \
    -e PIPENV_VENV_IN_PROJECT=1 \
    brayand/fullstack-project-template-python:1.0.0 \
    pipenv install [package-name]
```
