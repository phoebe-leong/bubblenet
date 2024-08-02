# anonymous-twitter docs

## messages.json
### formatting

```json
{
	"id": "", // A unique string to differentiate it from every other message
	"content": "Hello, World!", // The textual content of the message
	"hasMedia": false, // Whether the message contains media (video, photo, etc) or not
	"mediaLink": "", // The corresponding link to the media (defaults to an empty string if hasMedia is false)
	"unixTimestamp": 1721905916 // The UNIX time stamp corresponding to when the message was received by the server (in the server's local time)
}
```  
  
So when the client sends a new message to the server, the body would look something like this:
```json
{
	"content": "Today I saw a bird almost hit a window. It was the highlight of my day. I wonder what that says about me?",
	"hasMedia": true,
	"mediaLink": "https://images.pexels.com/photos/1435849/pexels-photo-1435849.jpeg?cs=srgb&dl=pexels-enginakyurt-1435849.jpg&fm=jpg"
}
```  
  
Then the server adds on the UNIX timestamp and the Id, and adds it to the ``messages.json`` file, and the *Messages* array.  
```json
{
	"Messages": [
		{
			"id": "xYA68aZ6s",
			"content": "Today I saw a bird almost hit a window. It was the highlight of my day. I wonder what that says about me?",
			"hasMedia": true,
			"mediaLink": "https://images.pexels.com/photos/1435849/pexels-photo-1435849.jpeg?cs=srgb&dl=pexels-enginakyurt-1435849.jpg&fm=jpg",
			"unixTimestamp": 1721907000
		}
	]
}
```

## server.js
### webpage structure

Everything related to posts will be accessed through the ``/post`` directory. To create a new posts, one will go to ``/post/new``, and existing posts can be accessed by appending the post id to ``/posts``, e.g., ``/posts/id`` where id is replaced with the actual post id one wishes to access.

### error response

When an error occurs during a GET request, the response from the server will be formatted as follows:
```json
{
	"errorCode": 40, // The error code
	"errorMessage": "Invalid post id" // The message corresponding to the code
}
```  
#### error codes
**40:** Invalid post id