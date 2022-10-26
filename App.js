import * as React from 'react';
import { Text, View, StyleSheet, FlatList } from 'react-native';
import Constants from 'expo-constants';

// or any pure javascript modules available in npm
import { TextInput, Card, Button, Avatar, Badge, Snackbar } from 'react-native-paper';

const dummyAPI = {
  "app-id":"", // your app-id here. 
  "baseURL":"https://dummyapi.io/data/v1/"
}
export default function App() {
  const [self,setSelf] = React.useState();
  const [posts,setPosts] = React.useState([]);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [comments,setComments] = React.useState([]);
  const [activePostID,setActivePostID] = React.useState();
  const [addingComment,setAddingComment] = React.useState(false);
  const [commentText,setCommentText] = React.useState("");

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

  const getAllPosts = () => {
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

  const getPostComments = (id) => {
    setActivePostID(id);
    setComments([]);
    fetch( dummyAPI.baseURL + "post/" + id + "/comment", {
      method: "GET",
      headers: {
        "app-id": dummyAPI["app-id"]
      }
    })
    .then( response => response.json() )
    .then( json => setComments( json.data ) )
    .catch( e => setSnackbarText(e) )    
  }

  const clearComments = () => {
    setActivePostID(undefined);
    setComments([]);
  }

  const addComment = (id) => {
    getPostComments(id);
    setAddingComment(true);
  }

  const submitComment = () => {
    if( commentText !== "" && self.id && activePostID ) {
      const newComment = {
        message: commentText,
        owner: self.id,
        post: activePostID
      }
      fetch( dummyAPI.baseURL + "comment/create", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',        
          "app-id": dummyAPI["app-id"]
        },
        body: JSON.stringify(newComment),      
      })
      .then( () => {
        getPostComments(activePostID)
        setCommentText("")
        setAddingComment(false)
      })
      .catch( (e) => { console.log(e) })
    }      
  }

  const setSelfAsRandomUser = () => {
    fetch( dummyAPI.baseURL + "user", {
      method: "GET",
      headers: {
        "app-id": dummyAPI["app-id"]
      }
    })
    .then( response => response.json() )
    .then( json => json.data )
    .then( users =>setSelf( users[Math.floor(Math.random() * users.length)]))
    .catch( e => setSnackbarText(e) )    
  }

  React.useEffect(() => {
    getAllPosts();
    setSelfAsRandomUser();
  },[])
  
  const renderPost = ({ item }) => (
    <Card mode="elevated" style={{margin:5}}>
      <Card.Cover source={{uri:item.image}}/>
      <Card.Title 
        title={`${item.owner.firstName} ${item.owner.lastName}`} 
        subtitle={item.publishDate} 
        left={(props) => <Avatar.Image {...props} size={48} source={{uri:item.owner.picture}}/>}
      />

      <Card.Content>
        <Text>{item.text}</Text>
        {item.id === activePostID ? 
          <FlatList
            data={comments}
            renderItem={renderComment}
            keyExtractor={item => item.id}
          />
          :
          <></>
        }
        { item.id === activePostID && addingComment ?
          <View>
            <TextInput 
              value={commentText}
              onChangeText={setCommentText}
            />
            <Button onPress={submitComment}>Submit Comment</Button>
          </View>
          :
          <></>
        }        
      </Card.Content>
      <Card.Actions>
        {item.likes > 0 ? <Badge size={36} onPress={()=>likePost(item)}>{item.likes}</Badge> : <Button onPress={()=>likePost(item)}>Like</Button>}
        {item.id === activePostID ?
          <Button onPress={clearComments}>Hide Comments</Button>
          :
          <Button onPress={()=>getPostComments(item.id)}>See Comments</Button>
        }
        <Button onPress={()=>addComment(item.id)}>Add Comment</Button>
      </Card.Actions>
    </Card>
  );

  const renderComment = ({item}) => (
    <Text>{item.owner.firstName} says: {item.message}</Text>
  )

  return (
    <View style={styles.container}>
      <FlatList 
        data={posts}
        renderItem={renderPost}
        keyExtractor={item => item.id}
        ListHeaderComponent={<Text>{self?.firstName}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  }
});