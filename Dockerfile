# config
FROM python:3
ENV PYTHONUNBUFFERED 1
EXPOSE 8000/tcp
# deps
RUN pip install pipenv
RUN apt-get update
RUN apt-get -y install curl gnupg
RUN curl -sL https://deb.nodesource.com/setup_12.x  | bash -
RUN apt-get -y install nodejs
# build
RUN mkdir /code
WORKDIR /code
COPY Pipfile /code/
COPY Pipfile.lock /code/
RUN pipenv --bare install
COPY . /code/
RUN npm install -s
RUN npm install -g -s yarn