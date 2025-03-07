## Install dependencies

```bash
docker run --rm \
    -u "$(id -u):$(id -g)" \
    -v $(pwd):/app \
    -w /app \
    brayand/fullstack-project-template-python:1.0.0 \
    pipenv install [package-name]
```
