require('dotenv').config({path:'./config.env'});

const app = require('./app');


const port = process.env.PORT || 5500;
const server = app.listen(port,()=>{
  console.log(`app is running on port ${port}`);
});

// Handel rejections outside express
process.on('unhandledRejection',(err)=>{
  console.error(`unhandledRejection Error: ${err.name} | ${err.message}`);
  server.close(()=>{
    console.log('shutting down ....');
    process.exit(1);
  })
});




