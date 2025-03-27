# FROM python:3.13
FROM brayand/fullstack-project-template-python-latex-html:1.0.0

ENV PIPENV_VENV_IN_PROJECT=1

COPY . /app

WORKDIR /app

RUN pipenv install --dev