primero se debe instalar 

visualcode
node.js
mongodb
medis para manejar reddis 
git bash
gitdesktop


seguido de eso se debe clonar el repositorio desde github
y abrir el repositorio en gitdesktop
, abrir el repo en visualcode
y con ctrl+ñ abrir la consola de VS
aplicar el comando 

npm install
esto para instalar las dependecias que no esten disponibles en git como node modules
ya que si subiesemos estas dependencias cada vez que hacemos un commit esta generaria que el proyecto
sea mucho mas pesado de subir sin embargo aqui solo subimos lo necesario

crear archivo en la raiz llamado .env
y copiar lo siguiente

DB_URI=mongodb+srv://adminDev:admin123@clusterone.gndnz.mongodb.net/pro1?retryWrites=true&w=majority
STATUS=dev
REDIS_HOST=138.121.170.184
REDIS_PASSWORD=10ca261d8cb38963e6679de1dbd6d0ae68c824763bd83ebf68788a97570c8890
SECRET_KEY=30153015301530153015301530153015

luego de eso aplicar el comando 

npm run dev 

para poder correr el proyecto