1. Answer the question with one line of code.

   - a) How to create a secure WebSocket without third party library?

     ```js
     var exampleSocket = new WebSocket(
       "wss://www.example.com/socketserver",
       "protocolOne"
     );
     ```

   - b) How to send data to the server?

     ```js
     exampleSocket.send(
       "Here's some text that the server is urgently awaiting!"
     );
     ```

   - c) How to receive data from the server?

     ```js
     exampleSocket.onmessage = function(event) {
       console.log(event.data);
     };
     ```

   - d) How to close a WebSocket connection?
     ```js
     exampleSocket.close();
     ```
