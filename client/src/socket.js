
import io from 'socket.io-client'


const api = require('./path/api_url')
const path = api.API_URL
const socket = io(path)




export default socket;