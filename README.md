# Dummy API + Fetch

This expo snack shows how to retrieve and update data using [DummyAPI](https://dummyapi.io/). In order to do this yourself, you'll need your own DummyAPI account, which is currently free. There is an object called `dummyAPI` declared at the top of `App.js` where you will add your `app-id` string. 

To get and update data, you will make HTTP requests using  using JavaScript's [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) API, the JSONBin documentation uses [`XMLHttpRequest`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest), and you could certainly use a third-party library like [Axios](https://axios-http.com/). Regardless, you are doing the same thing: making HTTP requests: `GET`, `POST`, `UPDATE`, and `DELETE`. You'll see how neatly these align with CRUD.

I've defined two arrow functions (idiomatic to React code) to wrap these requests. I've also setup state variables using the `React.useState` hook as well as a `React.useEffect` for the initial load of the data. 

```javascript
const getAllPosts = () => {
  setSnackbarText("retrieving posts");
  fetch( dummyAPI.baseURL + "post", {
    method: "GET",
    headers: {
      "app-id": dummyAPI["app-id"]
    }
  })
  .then( response => response.json() )
  .then( json => setPosts(json.data) )
  .catch( e => setSnackbarText(e) )
}
```

Here you can see the request address getting built, and then an object that is used to construct the rest of the request. I define which kind of request (`GET`) I'll use, and then send along a header containg the `app-id`. `fetch` works asynchronously and returns a `Promise`. There are a couple of ways to deal with this, but I like the [`then...catch...finally`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) pattern. It is also what is in the `fetch` documentation. After the response comes back, we transform it into JSON and then use the `useState` generated `setPosts` function. Now we can access posts using the `posts` state variable. All the changes, however are only on our local copy until we upload the changes. 

```javascript
const likePost = (post) => {
  const i = posts.findIndex( p => p.id = post.id );
  posts[i].likes++;
  fetch( dummyAPI.baseURL + "post/" + post.id, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',        
      "app-id": dummyAPI["app-id"]
    },
    body: JSON.stringify(posts[i]),      
  })
  .then( () => {
    setPosts([...posts]);
  })
  .catch( (e) => { console.log(e) })
}
```

The structure here is quite similar. Obviously, the HTTP request method is different (`PUT`), and it includes a `body` (which is a `stringify`'d version of our `posts` array). One other note is that in order to trigger a new render, I have to change posts (React doesn't notice the change in a property), so I copy the old posts array into a new one using the spread operator (again, this is idiomatic)

<!-- Footnotes -->
