# config
FROM ubuntu
ENV PYTHONUNBUFFERED 1
EXPOSE 8000/tcp
# deps
RUN apt-get update
RUN apt-get -y install software-properties-common
RUN apt-add-repository ppa:deadsnakes/ppa
RUN apt-get update
RUN apt-get -y install curl gnupg libpq-dev python3.7 python3.7-dev python3-pip
RUN pip3 install pipenv
RUN curl -sL https://deb.nodesource.com/setup_12.x  | bash -
RUN apt-get -y install nodejs
# build
RUN mkdir /code
WORKDIR /code
COPY Pipfile /code/
COPY Pipfile.lock /code/
RUN LC_ALL=C.UTF-8 LANG=C.UTF-8 PATH=/usr/lib/postgresql/10.11/bin/:$PATH pipenv --bare install
COPY . /code/
RUN npm install -s
RUN npm install -g -s yarn