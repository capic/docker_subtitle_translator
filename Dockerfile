FROM python:3

RUN apt-get update
RUN apt-get install curl gnupg mkvtoolnix python3-tk -y
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install nodejs -y
RUN node -v
RUN npm -v

# Set our working directory
WORKDIR /usr/src/app

# Copy requirements.txt first for better cache on later pushes
COPY requirements.txt requirements.txt

# pip install python deps from requirements.txt on the resin.io build server
RUN pip install -r requirements.txt

# This will copy all files in our root to the working  directory in the container
COPY . ./

# Enable udevd so that plugged dynamic hardware devices show up in our container.
ENV UDEV=1

WORKDIR /usr/src/app/subtitle-translator
RUN npm install

WORKDIR /usr/src/app
EXPOSE 4200
EXPOSE 3333

# main.py will run when container starts up on the device
CMD ./startup.sh
#CMD ["python","src/main.py","/data/input/","/data/output/"]