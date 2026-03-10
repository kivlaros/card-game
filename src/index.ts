import Elysia from "elysia";


const app = new Elysia();

app.ws('/ws',{
  message(ws,message){
    console.log('я вас не звал')
    ws.send(message)
  }
})

app.listen(3000)
console.log("Сервер запущен")