import * as React from 'react';
import { Text, View, StyleSheet, FlatList } from 'react-native';
import Constants from 'expo-constants';

// or any pure javascript modules available in npm
import { Card, Button, Avatar, Badge } from 'react-native-paper';

const dummyAPI = {
  "app-id":"", // your app-id here. 
  "baseURL":"https://dummyapi.io/data/v1/"
}

export default function App() {
  const [posts,setPosts] = React.useState([])
  const [snackbarText, setSnackbarText] = React.useState("");

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

  React.useEffect(() => {
    getAllPosts();
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
      </Card.Content>
      <Card.Actions>
        {item.likes > 0 ? <Badge size={36} onPress={()=>likePost(item)}>{item.likes}</Badge> : <Button onPress={()=>likePost(item)}>Like</Button>}
        <Button>See Comments</Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList 
        data={posts}
        renderItem={renderPost}
        keyExtractor={item => item.id}
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
