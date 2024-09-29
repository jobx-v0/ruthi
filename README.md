# jobx

A platform for job-seekers to practice interviews and get evaluated

Please set env variables and install ffmpeg before proceeding.


To setup the project, please follow the below instructions:
- Fork and clone the project
- Copy the environment variables folder (env) to your templates directory
- Create a new python virtual environment
```
python3 -m venv venv
```
- Activate the virtual environment
```
source venv/bin/activate
```
- Install dependencies
```
pip3 install -r requirements.txt
```
- Generate a configuration
```
python3 generate_env.py --local (for local setup)
```
- Rename the env file in the server folder and client folder to .env
- Go to client folder, and run the client
```
cd client
npm install
npm start
```
- Go to server folder, and run the server (on another terminal)
```
cd server
npm install
npm start
```